import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart3, Calendar } from 'lucide-react';
import examListData from '@/data/exam-list.json';

interface ExamListProps {
  onNavigate: (page: string) => void;
}

const ExamList: React.FC<ExamListProps> = ({ onNavigate }) => {
  const exams = examListData.exams.map(exam => ({
    ...exam,
    icon: <BarChart3 className="h-6 w-6" />
  }));

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">考试中心</h1>
        <p className="text-muted-foreground">
          查看所有考试数据和相关分析工具
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate(exam.id)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {exam.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{exam.title}</CardTitle>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{exam.type}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {exam.description}
              </CardDescription>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(exam.id);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                查看详情
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">暂无考试数据</h3>
          <p className="text-muted-foreground">
            目前还没有可用的考试数据，请稍后再来查看。
          </p>
        </div>
      )}
    </div>
  );
};

export default ExamList;