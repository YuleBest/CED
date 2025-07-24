import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import docDataJson from '@/data/doc-data.json';

interface DocData {
  id: string;
  filename: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  lastModified: string;
}

interface DocDataFile {
  generated: string;
  count: number;
  docs: DocData[];
}

interface DocPageProps {
  onBack?: () => void;
}

const DocPage: React.FC<DocPageProps> = ({ onBack }) => {
  const [docData, setDocData] = useState<DocData | null>(null);
  const [allDocs, setAllDocs] = useState<DocData[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = docDataJson as unknown as DocDataFile;
      setAllDocs(data.docs);
      if (data.docs.length > 0) {
        setSelectedDocId(data.docs[0].id);
        setDocData(data.docs[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('加载文档数据失败:', error);
      setLoading(false);
    }
  }, []);

  const handleDocChange = (docId: string) => {
    const doc = allDocs.find(d => d.id === docId);
    if (doc) {
      setSelectedDocId(docId);
      setDocData(doc);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-lg">加载文档数据中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!docData) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">暂无文档数据</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">请检查数据文件是否存在</p>
              <Button onClick={onBack} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 文档选择器 */}
        {allDocs.length > 1 && (
          <div className="flex justify-end">
            <div className="w-64">
              <Select value={selectedDocId} onValueChange={handleDocChange}>
                <SelectTrigger>
                  <SelectValue placeholder="选择文档" />
                </SelectTrigger>
                <SelectContent>
                  {allDocs.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* 文档内容 */}
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6">
            <div className="prose prose-lg max-w-none text-left prose-headings:text-foreground prose-h1:text-center prose-p:text-foreground prose-strong:text-foreground prose-blockquote:border-none prose-blockquote:bg-transparent prose-blockquote:text-center prose-blockquote:text-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {docData.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
};

export default DocPage;