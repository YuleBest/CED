import fs from 'fs';
import path from 'path';
import TOML from '@iarna/toml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 源目录和输出目录
const EXAM_DIR = path.join(__dirname, '../src/assets/exam');
const OUTPUT_DIR = path.join(__dirname, '../src/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'exam-data.json');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 解析TOML文件的函数
function parseTomlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return TOML.parse(content);
  } catch (error) {
    console.error(`Error parsing TOML file ${filePath}:`, error);
    return null;
  }
}

// 从文件名提取考试信息
function extractExamInfoFromFilename(filename) {
  // 文件名格式: 省份-城市-考试名称-年份.toml
  const nameWithoutExt = path.basename(filename, '.toml');
  const parts = nameWithoutExt.split('-');
  
  if (parts.length >= 4) {
    return {
      province: parts[0],
      city: parts[1],
      examName: parts[2],
      year: parts[3],
      id: nameWithoutExt.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')
    };
  }
  
  return {
    province: '未知',
    city: '未知',
    examName: '未知',
    year: '未知',
    id: nameWithoutExt.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')
  };
}

// 转换TOML数据为前端友好的格式
function transformExamData(tomlData, fileInfo) {
  const transformed = {
    id: fileInfo.id,
    filename: `${fileInfo.province}-${fileInfo.city}-${fileInfo.examName}-${fileInfo.year}`,
    info: {
      province: tomlData.info?.province?.split('|')[0] || fileInfo.province,
      provinceCode: tomlData.info?.province?.split('|')[1] || '',
      city: tomlData.info?.city?.split('|')[0] || fileInfo.city,
      cityCode: tomlData.info?.['city-code'] || 0,
      name: tomlData.info?.name?.split('|')[0] || fileInfo.examName,
      shortName: tomlData.info?.name?.split('|')[1] || '',
      year: fileInfo.year,
      date: tomlData.info?.date || {},
      localEnrollment: tomlData.info?.['local-enrollment'] || false,
      scoreConversion: tomlData.info?.['score-conversion'] || false,
      time: tomlData.info?.time || {},
      score: {
        total: tomlData.info?.score?.total || 0,
        subjects: {},
        paper: tomlData.info?.score?.paper || {}
      }
    },
    cutoff: {}
  };

  // 处理科目分数
  if (tomlData.info?.score) {
    Object.keys(tomlData.info.score).forEach(key => {
      if (key !== 'total' && key !== 'paper' && typeof tomlData.info.score[key] === 'number') {
        transformed.info.score.subjects[key] = tomlData.info.score[key];
      }
    });
  }

  // 处理分数线数据
  if (tomlData.cutoff) {
    Object.keys(tomlData.cutoff).forEach(districtKey => {
      const districtName = districtKey.split('|')[0];
      const districtData = tomlData.cutoff[districtKey];
      
      transformed.cutoff[districtName] = {
        schools: {},
        sbd: {},
        qbs: {},
        notes: districtData.notes || []
      };

      // 处理普通学校分数线
      Object.keys(districtData).forEach(key => {
        if (key !== 'sbd' && key !== 'qbs' && key !== 'notes' && typeof districtData[key] === 'number') {
          const schoolName = key.split('|')[0];
          transformed.cutoff[districtName].schools[schoolName] = districtData[key];
        }
      });

      // 处理分区县计线 (score-by-district)
      if (districtData.sbd) {
        Object.keys(districtData.sbd).forEach(schoolKey => {
          const schoolName = schoolKey.split('|')[0];
          transformed.cutoff[districtName].sbd[schoolName] = districtData.sbd[schoolKey];
        });
      }

      // 处理指标到校 (quota-based-school)
      if (districtData.qbs) {
        Object.keys(districtData.qbs).forEach(schoolKey => {
          if (schoolKey !== 'notes' && typeof districtData.qbs[schoolKey] === 'number') {
            const schoolName = schoolKey.split('|')[0];
            transformed.cutoff[districtName].qbs[schoolName] = districtData.qbs[schoolKey];
          }
        });
        
        // 添加指标到校的备注
        if (districtData.qbs.notes) {
          transformed.cutoff[districtName].qbsNotes = districtData.qbs.notes;
        }
      }
    });
  }

  return transformed;
}

// 主函数
function buildExamData() {
  console.log('开始构建考试数据...');
  console.log('源目录:', EXAM_DIR);
  console.log('输出目录:', OUTPUT_DIR);
  
  const examData = [];
  
  // 读取exam目录中的所有TOML文件
  console.log('读取源目录文件...');
  const files = fs.readdirSync(EXAM_DIR);
  console.log('目录中的所有文件:', files);
  
  const tomlFiles = files.filter(file => file.endsWith('.toml'));
  console.log('找到的TOML文件:', tomlFiles);
  
  console.log(`找到 ${tomlFiles.length} 个TOML文件`);
  
  tomlFiles.forEach(filename => {
    const filePath = path.join(EXAM_DIR, filename);
    console.log(`处理文件: ${filename}`);
    
    const fileInfo = extractExamInfoFromFilename(filename);
    const tomlData = parseTomlFile(filePath);
    
    if (tomlData) {
      const transformedData = transformExamData(tomlData, fileInfo);
      examData.push(transformedData);
      console.log(`✓ 成功处理: ${transformedData.info.province} ${transformedData.info.city} ${transformedData.info.name} (${transformedData.info.year})`);
    } else {
      console.log(`✗ 处理失败: ${filename}`);
    }
  });
  
  // 按年份和地区排序
  examData.sort((a, b) => {
    if (a.info.year !== b.info.year) {
      return b.info.year.localeCompare(a.info.year); // 年份降序
    }
    return a.info.province.localeCompare(b.info.province); // 省份升序
  });
  
  // 写入JSON文件
  const outputData = {
    generated: new Date().toISOString(),
    count: examData.length,
    exams: examData
  };
  
  console.log('写入JSON文件:', OUTPUT_FILE);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf8');
  
  console.log(`\n构建完成!`);
  console.log(`- 处理了 ${examData.length} 个考试数据`);
  console.log(`- 输出文件: ${OUTPUT_FILE}`);
  console.log(`- 文件大小: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
}

// 如果直接运行此脚本
if (process.argv[1] && process.argv[1].includes('build-exam-data.js')) {
  buildExamData();
}

export { buildExamData };