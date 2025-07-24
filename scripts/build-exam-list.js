import fs from 'fs';
import path from 'path';
import TOML from '@iarna/toml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 源目录和输出目录
const EXAM_DIR = path.join(__dirname, '../src/assets/exam');
const OUTPUT_DIR = path.join(__dirname, '../src/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'exam-list.json');

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

// 生成考试列表项
function generateExamListItem(tomlData, fileInfo) {
  const examInfo = tomlData.exam || {};
  const title = `${fileInfo.province}${fileInfo.city}${fileInfo.examName}（${fileInfo.year}年）`;
  const description = examInfo.description || `${fileInfo.province}${fileInfo.city}${fileInfo.year}年${fileInfo.examName}数据分析`;
  
  return {
    id: 'exam', // 统一跳转到exam页面
    title: title,
    description: description,
    type: '数据分析',
    province: fileInfo.province,
    city: fileInfo.city,
    examName: fileInfo.examName,
    year: fileInfo.year,
    fileId: fileInfo.id
  };
}

function buildExamList() {
  console.log('开始构建考试列表数据...');
  console.log('源目录:', EXAM_DIR);
  console.log('输出目录:', OUTPUT_DIR);
  
  const examList = [];
  
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
      const examItem = generateExamListItem(tomlData, fileInfo);
      examList.push(examItem);
      console.log(`✓ 成功处理: ${examItem.title}`);
    } else {
      console.log(`✗ 处理失败: ${filename}`);
    }
  });
  
  // 按年份和地区排序
  examList.sort((a, b) => {
    if (a.year !== b.year) {
      return b.year.localeCompare(a.year); // 年份降序
    }
    return a.province.localeCompare(b.province); // 省份升序
  });
  
  // 写入JSON文件
  const outputData = {
    generated: new Date().toISOString(),
    count: examList.length,
    exams: examList
  };
  
  console.log('写入JSON文件:', OUTPUT_FILE);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf8');
  
  console.log(`\n构建完成!`);
  console.log(`- 处理了 ${examList.length} 个考试列表项`);
  console.log(`- 输出文件: ${OUTPUT_FILE}`);
  console.log(`- 文件大小: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
}

// 如果直接运行此脚本
if (process.argv[1] && process.argv[1].includes('build-exam-list.js')) {
  buildExamList();
}

export { buildExamList };