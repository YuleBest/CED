import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 源目录和输出目录
const DOC_DIR = path.join(__dirname, '../src/assets/doc');
const OUTPUT_DIR = path.join(__dirname, '../src/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'doc-list.json');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 解析 Markdown 文件的函数
function parseMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let title = '';
    let description = '';
    
    // 提取标题和描述
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 提取标题（第一个 # 标题）
      if (line.startsWith('# ') && !title) {
        title = line.substring(2).trim();
        continue;
      }
      
      // 提取描述（引用块或第一个段落）
      if (line.startsWith('> ') && !description) {
        description = line.substring(2).trim();
        continue;
      }
      
      // 如果没有引用块，使用第一个非空段落作为描述
      if (!description && line.trim() && !line.startsWith('#') && !line.startsWith('```')) {
        description = line.trim();
        continue;
      }
    }
    
    return {
      title: title || path.basename(filePath, '.md'),
      description: description || '暂无描述',
      content
    };
  } catch (error) {
    console.error(`Error parsing Markdown file ${filePath}:`, error);
    return null;
  }
}

// 从文件名提取文档信息
function extractDocInfoFromFilename(filename) {
  const nameWithoutExt = path.basename(filename, '.md');
  return {
    name: nameWithoutExt,
    id: nameWithoutExt,
    filename: nameWithoutExt
  };
}

// 生成文档列表项
function generateDocListItem(markdownData, fileInfo) {
  return {
    id: fileInfo.id,
    title: markdownData.title,
    description: markdownData.description,
    filename: fileInfo.filename
  };
}

function buildDocList() {
  console.log('开始构建文档列表数据...');
  console.log('源目录:', DOC_DIR);
  console.log('输出目录:', OUTPUT_DIR);
  
  const docList = [];
  
  // 读取doc目录中的所有Markdown文件
  console.log('读取源目录文件...');
  const files = fs.readdirSync(DOC_DIR);
  console.log('目录中的所有文件:', files);
  
  const mdFiles = files.filter(file => file.endsWith('.md'));
  console.log('找到的Markdown文件:', mdFiles);
  
  console.log(`找到 ${mdFiles.length} 个Markdown文件`);
  
  mdFiles.forEach(filename => {
    const filePath = path.join(DOC_DIR, filename);
    console.log(`处理文件: ${filename}`);
    
    const fileInfo = extractDocInfoFromFilename(filename);
    const markdownData = parseMarkdownFile(filePath);
    
    if (markdownData) {
      const docItem = generateDocListItem(markdownData, fileInfo);
      docList.push(docItem);
      console.log(`✓ 成功处理: ${docItem.title}`);
    } else {
      console.log(`✗ 处理失败: ${filename}`);
    }
  });
  
  // 按标题排序
  docList.sort((a, b) => a.title.localeCompare(b.title));
  
  // 写入JSON文件
  const outputData = {
    generated: new Date().toISOString(),
    count: docList.length,
    documents: docList
  };
  
  console.log('写入JSON文件:', OUTPUT_FILE);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf8');
  
  console.log(`\n构建完成!`);
  console.log(`- 处理了 ${docList.length} 个文档列表项`);
  console.log(`- 输出文件: ${OUTPUT_FILE}`);
  console.log(`- 文件大小: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
}

// 如果直接运行此脚本
if (process.argv[1] && process.argv[1].includes('build-doc-list.js')) {
  buildDocList();
}

export { buildDocList };