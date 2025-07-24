import { useState } from 'react'
import ExamPage from './pages/exam'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, FileText, Info } from 'lucide-react'
import { StagewiseToolbar } from '@stagewise/toolbar-react'
import ReactPlugin from '@stagewise-plugins/react'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'exam'>('home')

  if (currentPage === 'exam') {
    return (
      <>
        <ExamPage onBack={() => setCurrentPage('home')} />
        <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <GraduationCap className="h-12 w-12 text-blue-600" />
            CED 考试数据展示系统
          </h1>
          <p className="text-xl text-gray-600">
            基于 Vite + React + shadcn/ui 构建的考试数据可视化平台
          </p>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentPage('exam')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                考试数据展示
              </CardTitle>
              <CardDescription>
                查看广东肇庆2020年中考详细信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                进入考试页面
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-green-600" />
                数据格式
              </CardTitle>
              <CardDescription>
                基于 TOML 格式的考试数据结构
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• 考试基本信息</div>
                <div>• 科目时间安排</div>
                <div>• 分数线数据</div>
                <div>• 特殊招生政策</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                技术栈
              </CardTitle>
              <CardDescription>
                现代化前端技术栈
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Vite + React 19</div>
                <div>• TypeScript</div>
                <div>• shadcn/ui + Tailwind CSS</div>
                <div>• Lucide React Icons</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 返回按钮 */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage('home')}
            className="mt-4"
          >
            返回首页
          </Button>
        </div>
      </div>
      <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
    </div>
  )
}

export default App
