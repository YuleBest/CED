import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 源目录和输出目录
const DOC_DIR = path.join(__dirname, '../src/assets/doc');
const DATA_DIR = path.join(__dirname, '../src/data');
const DOC_DATA_FILE = path.join(DATA_DIR, 'doc-data.json');

// 确保输出目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
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
      
      // 提取描述（引用块）
      if (line.startsWith('> ') && !description) {
        description = line.substring(2).trim();
        continue;
      }
    }
    
    // 使用 marked 解析 HTML
    const htmlContent = marked.parse(content);
    
    return {
      title: title || path.basename(filePath, '.md'),
      description: description || '',
      content: content, // 保留原始 Markdown 内容
      htmlContent: htmlContent, // 解析后的 HTML 内容
      rawContent: content
    };
  } catch (error) {
    console.error(`Error parsing Markdown file ${filePath}:`, error);
    return null;
  }
}

// 从文件名提取文档信息
function extractDocInfoFromFilename(filename) {
  const nameWithoutExt = path.basename(filename, '.md');
  const id = nameWithoutExt.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
  
  return {
    id,
    filename: nameWithoutExt,
    slug: nameWithoutExt.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
  };
}

// 注意：不再生成React组件文件，因为src/pages应该只包含手写的模板文件
// 所有文档内容通过doc.tsx页面动态处理

// 构建文档数据
function buildDocData() {
  console.log('开始构建文档数据...');
  
  if (!fs.existsSync(DOC_DIR)) {
    console.error(`文档目录不存在: ${DOC_DIR}`);
    return;
  }
  
  const files = fs.readdirSync(DOC_DIR).filter(file => file.endsWith('.md'));
  
  if (files.length === 0) {
    console.log('没有找到 Markdown 文件');
    return;
  }
  
  const docs = [];
  
  files.forEach(file => {
    const filePath = path.join(DOC_DIR, file);
    const fileInfo = extractDocInfoFromFilename(file);
    const docData = parseMarkdownFile(filePath);
    
    if (docData) {
      const doc = {
        id: fileInfo.id,
        filename: fileInfo.filename,
        slug: fileInfo.slug,
        title: docData.title,
        description: docData.description,
        content: docData.content,
        lastModified: fs.statSync(filePath).mtime.toISOString()
      };
      
      docs.push(doc);
      
      console.log(`处理文档: ${docData.title}`);
    }
  });
  
  // 生成文档数据文件
  const docDataFile = {
    generated: new Date().toISOString(),
    count: docs.length,
    docs: docs
  };
  
  fs.writeFileSync(DOC_DATA_FILE, JSON.stringify(docDataFile, null, 2), 'utf8');
  console.log(`生成数据文件: ${DOC_DATA_FILE}`);
  
  console.log(`构建完成! 处理了 ${docs.length} 个文档数据`);
}

// 如果直接运行此脚本
if (process.argv[1] && process.argv[1].includes('build-doc-data.js')) {
  buildDocData();
}

export { buildDocData };