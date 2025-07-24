import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, GraduationCap, Trophy, Users, ArrowLeft, Loader2 } from 'lucide-react';
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
    schools: Record<string, number>;
    sbd?: Record<string, Record<string, number>>;
    qbs?: Record<string, number>;
    notes?: string[];
    qbsNotes?: string[];
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
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    try {
      const data = examDataJson as unknown as ExamDataFile;
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
      <div className="min-h-screen p-6">
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
      <div className="min-h-screen p-6">
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
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };



  return (
    <div className="min-h-screen p-6">
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
              <GraduationCap className="h-10 w-10 text-gray-700" />
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
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <CardTitle className="ml-2 text-lg text-gray-800">考试时间</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDate(examData.info.date.start)}</div>
              <p className="text-sm text-gray-600">至 {formatDate(examData.info.date.end)}</p>
              <p className="text-sm text-gray-600">共 {examData.info.date.duration_days} 天</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Trophy className="h-5 w-5 text-gray-600" />
              <CardTitle className="ml-2 text-lg text-gray-800">总分</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{examData.info.score.total}</div>
              <p className="text-sm text-gray-500">满分</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Users className="h-5 w-5 text-gray-600" />
              <CardTitle className="ml-2 text-lg text-gray-800">考试特点</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${examData.info.scoreConversion ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="font-medium text-sm">卷面分折算</span>
                  </div>
                  <Badge variant={examData.info.scoreConversion ? "default" : "secondary"} 
                         className={examData.info.scoreConversion ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-600 border-gray-300"}>
                    {examData.info.scoreConversion ? "有" : "无"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${examData.info.localEnrollment ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                    <span className="font-medium text-sm">属地招生</span>
                  </div>
                  <Badge variant={examData.info.localEnrollment ? "default" : "secondary"} 
                         className={examData.info.localEnrollment ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-gray-100 text-gray-600 border-gray-300"}>
                    {examData.info.localEnrollment ? "有" : "无"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 详细信息标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 border-gray-200">
            <TabsTrigger value="schedule" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600">考试安排</TabsTrigger>
            <TabsTrigger value="scores" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600">分数设置</TabsTrigger>
            <TabsTrigger value="cutoff" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600">录取分数线</TabsTrigger>
            <TabsTrigger value="special" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600">特殊政策</TabsTrigger>
          </TabsList>

          {/* 考试安排 */}
          <TabsContent value="schedule">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Clock className="h-5 w-5 text-gray-600" />
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
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">{time.duration}分钟</Badge>
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
            <div className="space-y-6">
              {/* 总分概览 */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-800 flex items-center justify-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                    考试总分
                  </CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mt-2">{examData.info.score.total}分</div>
                  <CardDescription className="text-gray-600">各科目分数详细设置</CardDescription>
                </CardHeader>
              </Card>

              {/* 分数详情表格 */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800">各科目分数设置</CardTitle>
                  <CardDescription className="text-gray-600">包含卷面分、计入分数和折算说明</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold w-1/4">科目</TableHead>
                        <TableHead className="font-semibold w-1/4">卷面分数</TableHead>
                        <TableHead className="font-semibold w-1/4">计入分数</TableHead>
                        <TableHead className="font-semibold w-1/4">分数说明</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(examData.info.score.subjects).map(([subject, score]) => {
                        const paperScore = examData.info.score.paper?.[subject];
                        const hasConversion = paperScore && paperScore !== score;
                        
                        return (
                          <TableRow key={subject}>
                            <TableCell className="font-medium w-1/4">{subject}</TableCell>
                            <TableCell className="w-1/4">
                              {paperScore ? (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {paperScore}分
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                                  {score}分
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="w-1/4">
                              <Badge className={hasConversion ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
                                {score}分
                              </Badge>
                            </TableCell>
                            <TableCell className="w-1/4">
                              {hasConversion ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <span className="text-sm text-orange-700">需要折算</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm text-green-700">直接计入</span>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  
                  {/* 分数统计 */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{Object.keys(examData.info.score.subjects).length}</div>
                        <div className="text-sm text-gray-600">考试科目</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {examData.info.score.paper ? Object.keys(examData.info.score.paper).length : 0}
                        </div>
                        <div className="text-sm text-gray-600">需要折算</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {Object.keys(examData.info.score.subjects).length - (examData.info.score.paper ? Object.keys(examData.info.score.paper).length : 0)}
                        </div>
                        <div className="text-sm text-gray-600">直接计入</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 录取分数线 */}
          <TabsContent value="cutoff">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(examData.cutoff).map(([district, data]) => {
                // 获取所有学校（包括只有sbd数据的学校）
                const allSchools = new Set([...Object.keys(data.schools)]);
                if (data.sbd) {
                  Object.keys(data.sbd).forEach(school => allSchools.add(school));
                }
                
                // 计算每个学校的百分比并排序
                const schoolsWithPercentage = Array.from(allSchools)
                  .map((school) => {
                    // 检查是否有分区县计线数据
                    const hasSbd = data.sbd && data.sbd[school] && Object.keys(data.sbd[school]).length > 0;
                    const schoolScore = data.schools[school];
                    let displayScore = schoolScore;
                    let isAverage = false;
                    
                    if (hasSbd) {
                      // 计算平均分
                      const sbdScores = data.sbd?.[school] ? Object.values(data.sbd[school]) : [];
                      displayScore = Math.round(sbdScores.reduce((sum, s) => sum + s, 0) / sbdScores.length);
                      isAverage = true;
                    }
                    
                    // 如果没有普通分数线且没有sbd数据，跳过
                    if (!schoolScore && !hasSbd) {
                      return null;
                    }
                    
                    return {
                      school,
                      score: displayScore,
                      originalScore: schoolScore,
                      percentage: ((displayScore / examData.info.score.total) * 100).toFixed(1),
                      hasSbd,
                      isAverage
                    };
                  })
                  .filter(item => item !== null)
                  .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
                
                
                return (
                  <Card key={district} className="border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-800">{district}录取分数线</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {schoolsWithPercentage.map(({ school, score, percentage, hasSbd, isAverage }) => {
                          return (
                            <div key={school} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">{school}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-gray-900">{score}分</span>
                                  {isAverage && (
                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                                      平均
                                    </Badge>
                                  )}
                                  <span className="text-sm text-gray-600">({percentage}%)</span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                  className="bg-gradient-to-r from-blue-200 to-blue-300 h-3 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              {hasSbd && (
                                <div className="mt-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-xs h-7 px-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                    onClick={() => {
                                      // 切换到特殊政策标签页
                                      setActiveTab('special');
                                    }}
                                  >
                                    查看分区县计线详情
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* 特殊政策 */}
          <TabsContent value="special">
            <div className="space-y-6">
              {/* 分区县计线 */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800">分区县计线政策</CardTitle>
                  <CardDescription className="text-gray-600">部分学校按不同地区设置不同录取分数线</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    interface SbdDataItem {
                      district: string;
                      school: string;
                      scores: Record<string, number>;
                    }
                    const sbdData: SbdDataItem[] = [];
                    Object.entries(examData.cutoff).forEach(([district, data]) => {
                      if (data.sbd && Object.keys(data.sbd).length > 0) {
                        Object.entries(data.sbd).forEach(([school, scores]) => {
                          sbdData.push({ district, school, scores });
                        });
                      }
                    });
                    
                    if (sbdData.length === 0) {
                      return (
                        <div className="text-center text-gray-500 py-8">
                          <p>当前数据中暂无分区县计线信息</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-6">
                        {sbdData.map(({ district, school, scores }) => (
                          <div key={`${district}-${school}`}>
                            <h4 className="font-semibold mb-3 text-gray-800">{school} - {district}地区分区县计线</h4>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(scores).map(([area, score]) => {
                                  const areaName = area.split('|')[0];
                                  return (
                                    <div key={area} className="flex justify-between items-center p-3 bg-white rounded border">
                                      <span className="font-medium text-gray-700">{areaName}</span>
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {score}分
                                      </Badge>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* 指标到校 */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800">指标到校政策</CardTitle>
                  <CardDescription className="text-gray-600">部分学校实行指标到校招生政策</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    interface QbsDataItem {
                      district: string;
                      data: {
                        qbs?: Record<string, number>;
                        qbsNotes?: string[];
                      };
                    }
                    const qbsData: QbsDataItem[] = [];
                    Object.entries(examData.cutoff).forEach(([district, data]) => {
                      if ((data.qbs && Object.keys(data.qbs).length > 0) || (data.qbsNotes && data.qbsNotes.length > 0)) {
                        qbsData.push({ district, data });
                      }
                    });
                    
                    if (qbsData.length === 0) {
                      return (
                        <div className="text-center text-gray-500 py-8">
                          <p>当前数据中暂无指标到校信息</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-6">
                        {qbsData.map(({ district, data }) => (
                          <div key={district}>
                            <h4 className="font-semibold mb-3 text-gray-800">{district}指标到校政策</h4>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                              {/* 指标到校分数线 */}
                              {data.qbs && Object.keys(data.qbs).length > 0 && (
                                <div>
                                  <h5 className="font-medium text-gray-700 mb-2">指标到校分数线</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {Object.entries(data.qbs).map(([school, score]) => (
                                      <div key={school} className="flex justify-between items-center p-3 bg-white rounded border">
                                        <span className="font-medium text-gray-700">{school}</span>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                          {score}分
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* 指标到校说明 */}
                              {data.qbsNotes && data.qbsNotes.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-gray-700 mb-2">政策说明</h5>
                                  <div className="space-y-2">
                                    {data.qbsNotes.map((note, index) => (
                                      <p key={index} className="text-gray-600 text-sm leading-relaxed">
                                        {note}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
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