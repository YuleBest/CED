import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText } from 'lucide-react';
import docListData from '@/data/doc-list.json';

interface DocListProps {
  onNavigate: (page: string) => void;
}

const DocList: React.FC<DocListProps> = ({ onNavigate }) => {
  const documents = docListData.documents.map(doc => ({
    ...doc,
    icon: <BookOpen className="h-6 w-6" />
  }));

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">文档中心</h1>
        <p className="text-muted-foreground">
          浏览所有可用的文档和说明材料
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate('doc')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {doc.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {doc.description}
              </CardDescription>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('doc');
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                查看文档
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">暂无文档</h3>
          <p className="text-muted-foreground">
            目前还没有可用的文档，请稍后再来查看。
          </p>
        </div>
      )}
    </div>
  );
};

export default DocList;