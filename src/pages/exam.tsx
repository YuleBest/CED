import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, GraduationCap, Trophy, Users, ArrowLeft, Loader2, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import examDataJson from '@/data/exam-data.json';

interface ExamData {
  id: string;
  filename: string;
  info: {
    province: string;
    city: string;
    name: string;
    year: string;
    date: {
      start: string;
      end: string;
      duration_days: number;
    };
    localEnrollment: boolean;
    scoreConversion: boolean;
    time: Record<string, {
      start: string;
      end: string;
      duration: number;
    }>;
    score: {
      total: number;
      subjects: Record<string, number>;
      paper?: Record<string, number>;
    };
  };
  cutoff: Record<string, {
    schools: Record<string, {
      score: number;
      notes?: string;
    }>;
    qbsEnabled?: boolean;
    qbsNotes?: string;
  }>;
}

interface ExamDataFile {
  generated: string;
  count: number;
  exams: ExamData[];
}

interface ExamPageProps {
  onBack?: () => void;
}

const ExamPage: React.FC<ExamPageProps> = ({ onBack }) => {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [allExams, setAllExams] = useState<ExamData[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = examDataJson as ExamDataFile;
      setAllExams(data.exams);
      if (data.exams.length > 0) {
        setSelectedExamId(data.exams[0].id);
        setExamData(data.exams[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('加载考试数据失败:', error);
      setLoading(false);
    }
  }, []);

  const handleExamChange = (examId: string) => {
    const exam = allExams.find(e => e.id === examId);
    if (exam) {
      setSelectedExamId(examId);
      setExamData(exam);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-lg">加载考试数据中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">暂无考试数据</h2>
              <p className="text-gray-600 mb-4">请检查数据文件是否存在</p>
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
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
  };

  const getScoreColor = (score: number) => {
    if (score >= 600) return 'bg-red-100 text-red-800';
    if (score >= 500) return 'bg-orange-100 text-orange-800';
    if (score >= 400) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 返回按钮和页面标题 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {onBack && (
              <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                返回首页
              </Button>
            )}
            {allExams.length > 1 && (
              <div className="w-64">
                <Select value={selectedExamId} onValueChange={handleExamChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择考试" />
                  </SelectTrigger>
                  <SelectContent>
                    {allExams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.info.province} {exam.info.city} {exam.info.name} ({exam.info.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <GraduationCap className="h-10 w-10 text-blue-600" />
              {examData.info.name}
            </h1>
            <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5" />
              {examData.info.province} · {examData.info.city}
            </p>
          </div>
        </div>

        {/* 考试基本信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <CardTitle className="ml-2 text-lg">考试时间</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDate(examData.info.date.start)}</div>
              <p className="text-sm text-gray-600">至 {formatDate(examData.info.date.end)}</p>
              <p className="text-sm text-gray-600">共 {examData.info.date.duration_days} 天</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <CardTitle className="ml-2 text-lg">总分</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{examData.info.score.total}</div>
              <p className="text-sm text-gray-600">满分</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Users className="h-5 w-5 text-green-600" />
              <CardTitle className="ml-2 text-lg">考试特点</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <Badge variant={examData.info.scoreConversion ? "default" : "secondary"}>
                  {examData.info.scoreConversion ? "有" : "无"}卷面分折算
                </Badge>
                <Badge variant={examData.info.localEnrollment ? "default" : "secondary"}>
                  {examData.info.localEnrollment ? "有" : "无"}属地招生
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 详细信息标签页 */}
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schedule">考试安排</TabsTrigger>
            <TabsTrigger value="scores">分数设置</TabsTrigger>
            <TabsTrigger value="cutoff">录取分数线</TabsTrigger>
            <TabsTrigger value="special">特殊政策</TabsTrigger>
          </TabsList>

          {/* 考试安排 */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  考试时间安排
                </CardTitle>
                <CardDescription>
                  各科目具体考试时间和时长
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>科目</TableHead>
                      <TableHead>考试日期</TableHead>
                      <TableHead>开始时间</TableHead>
                      <TableHead>结束时间</TableHead>
                      <TableHead>时长(分钟)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(examData.info.time).map(([subject, time]) => (
                      <TableRow key={subject}>
                        <TableCell className="font-medium">{subject}</TableCell>
                        <TableCell>{formatDate(time.start)}</TableCell>
                        <TableCell>{formatTime(time.start)}</TableCell>
                        <TableCell>{formatTime(time.end)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{time.duration}分钟</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 分数设置 */}
          <TabsContent value="scores">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>各科分数</CardTitle>
                  <CardDescription>各科目实际计入总分的分数</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(examData.info.score.subjects).map(([subject, score]) => (
                      <div key={subject} className="flex justify-between items-center">
                        <span className="font-medium">{subject}</span>
                        <Badge variant="outline">{score}分</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>卷面分设置</CardTitle>
                  <CardDescription>需要进行分数折算的科目</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {examData.info.score.paper && Object.entries(examData.info.score.paper).map(([subject, paperScore]) => (
                      <div key={subject} className="flex justify-between items-center">
                        <span className="font-medium">{subject}</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">卷面{paperScore}分</Badge>
                          <Badge>计入{examData.info.score.subjects[subject]}分</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 录取分数线 */}
          <TabsContent value="cutoff">
            <div className="space-y-6">
              {Object.entries(examData.cutoff).map(([district, data]) => (
                <Card key={district}>
                  <CardHeader>
                    <CardTitle>{district}录取分数线</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>学校名称</TableHead>
                          <TableHead>录取分数线</TableHead>
                          <TableHead>分数等级</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(data.schools).map(([school, schoolData]) => (
                          <TableRow key={school}>
                            <TableCell className="font-medium">{school}</TableCell>
                            <TableCell className="text-lg font-bold">{schoolData.score}</TableCell>
                            <TableCell>
                              <Badge className={getScoreColor(schoolData.score)}>
                                {schoolData.score >= 600 ? '顶尖' : schoolData.score >= 500 ? '优秀' : schoolData.score >= 400 ? '良好' : '一般'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 特殊政策 */}
          <TabsContent value="special">
            <div className="space-y-6">
              {/* 分区县计线 */}
              <Card>
                <CardHeader>
                  <CardTitle>分区县计线政策</CardTitle>
                  <CardDescription>部分学校按不同地区设置不同录取分数线</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-500 py-8">
                    <p>当前数据中暂无分区县计线信息</p>
                  </div>
                </CardContent>
              </Card>

              {/* 指标到校 */}
              <Card>
                <CardHeader>
                  <CardTitle>指标到校政策</CardTitle>
                  <CardDescription>部分学校实行指标到校招生政策</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(examData.cutoff).map(([district, data]) => {
                      if (data.qbsEnabled) {
                        return (
                          <div key={district}>
                            <h4 className="font-semibold mb-3">{district}指标到校政策</h4>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="text-green-800">{data.qbsNotes}</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExamPage;