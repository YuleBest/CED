# 构建脚本说明

本目录包含用于构建项目数据和页面的脚本。

## 脚本列表

### build-exam-data.js
用于构建考试数据，将 `src/assets/exam` 目录中的 TOML 文件转换为 JSON 数据文件。

### build-doc-pages.js
用于构建文档页面，将 `src/assets/doc` 目录中的 Markdown 文件转换为 React 组件和数据文件。使用 `marked` 库解析 Markdown，使用 `react-markdown` 组件渲染内容，支持 GitHub Flavored Markdown (GFM)。

## 依赖库

文档构建脚本使用了以下专业的 Markdown 处理库：

- **marked**: 用于在构建时解析 Markdown 文件
- **react-markdown**: 用于在 React 组件中渲染 Markdown 内容
- **remark-gfm**: 提供 GitHub Flavored Markdown 支持（表格、删除线、任务列表等）
- **@tailwindcss/typography**: 提供专业的排版样式

## 使用方法

### 构建文档页面

```bash
# 仅构建文档页面
npm run build:docs

# 构建所有数据（包括考试数据和文档页面）
npm run build:data
```

### 添加新文档

1. 在 `src/assets/doc` 目录中添加新的 Markdown 文件
2. Markdown 文件格式要求：
   - 第一行应该是 `# 标题`
   - 第二行可以是 `> 描述` （可选）
   - 后续内容为正文，支持完整的 Markdown 语法

示例文档格式：
```markdown
# 文档标题

> 文档的简短描述

这里是文档的正文内容...

## 二级标题

更多内容...

### 三级标题

详细说明...

- 支持列表
- 支持**粗体**和*斜体*
- 支持`代码`

| 表格 | 支持 |
|------|------|
| 数据 | 内容 |

> 引用块也完全支持

```代码块
console.log('Hello World');
```
```

3. 运行构建脚本：
```bash
npm run build:docs
```

4. 构建完成后会生成：
   - `src/pages/doc-{文档名}.tsx` - 对应的 React 组件
   - `src/data/doc-data.json` - 文档数据文件

### 生成的文件

- **组件文件**: 每个 Markdown 文件会生成对应的 React 组件，文件名格式为 `doc-{文档名}.tsx`
- **数据文件**: 所有文档的元数据会汇总到 `src/data/doc-data.json` 文件中
- **通用页面**: `src/pages/doc.tsx` 是一个通用的文档页面组件，可以显示所有文档

### 页面风格

生成的文档页面与 `src/pages/exam.tsx` 保持一致的设计风格：
- 使用相同的 UI 组件库
- 保持一致的布局和样式
- 支持深色/浅色主题
- 响应式设计
- 专业的排版样式（通过 @tailwindcss/typography）

### Markdown 功能支持

通过使用专业的 Markdown 库，支持以下功能：

- **基础语法**: 标题、段落、列表、链接、图片
- **扩展语法**: 表格、删除线、任务列表
- **代码高亮**: 代码块和行内代码
- **引用块**: 支持多级引用
- **HTML**: 支持内嵌 HTML 标签
- **自动链接**: 自动识别 URL 和邮箱

### 注意事项

1. Markdown 文件名应该使用有意义的名称，避免特殊字符
2. 构建脚本会自动处理中文文件名
3. 每次添加新文档后都需要重新运行构建脚本
4. 生成的组件文件可以进一步手动编辑以添加特殊功能
5. 使用专业的 Markdown 库确保了更好的兼容性和功能支持