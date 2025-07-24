import { useState } from 'react'
import ExamPage from './pages/exam'
import DocPage from './pages/doc'
import ExamList from './pages/exam-list'
import DocList from './pages/doc-list'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, FileText, Info } from 'lucide-react'
import { StagewiseToolbar } from '@stagewise/toolbar-react'
import ReactPlugin from '@stagewise-plugins/react'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'exam' | 'doc' | 'exam-list' | 'doc-list'>('home')

  const handleNavigate = (page: string) => {
    setCurrentPage(page as 'home' | 'exam' | 'doc' | 'exam-list' | 'doc-list')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'exam':
        return <ExamPage onBack={() => setCurrentPage('exam-list')} />
      case 'doc':
        return <DocPage onBack={() => setCurrentPage('doc-list')} />
      case 'exam-list':
        return <ExamList onNavigate={handleNavigate} />
      case 'doc-list':
        return <DocList onNavigate={handleNavigate} />

      default:
        return renderHomePage()
    }
  }

  const renderHomePage = () => (
    <div className="flex flex-col justify-center p-6" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="max-w-4xl mx-auto space-y-8 w-full">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-foreground flex items-center justify-center gap-3">
            <GraduationCap className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            中国考试数据库
          </h1>
          <p className="text-xl text-muted-foreground">
            CED 旨在收集和可视化中国各类考试的数据信息
          </p>
        </div>

        {/* 功能卡片 */}
        <div className="flex flex-wrap justify-center gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer w-full sm:w-80" onClick={() => handleNavigate('exam-list')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                考试数据展示
              </CardTitle>
              <CardDescription>
                查看 CED 已收录的考试数据
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                进入列表
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer w-full sm:w-80" onClick={() => handleNavigate('doc-list')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
                文档中心
              </CardTitle>
              <CardDescription>
                查看相关说明文档
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                查看文档
              </Button>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  )

  return (
    <>
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      {renderPage()}
      <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
    </>
  )
}

export default App
