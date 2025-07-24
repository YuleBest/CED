import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { GraduationCap, Home, FileText, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo 和标题 */}
        <div className="mr-4 hidden md:flex">
          <Button
            variant="ghost"
            className="mr-6 flex items-center space-x-2"
            onClick={() => onNavigate('home')}
          >
            <GraduationCap className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              CED
            </span>
          </Button>
        </div>

        {/* 导航菜单 */}
        <nav className="flex items-center space-x-1 ml-6">
          <Button
            variant={currentPage === 'home' ? 'default' : 'ghost'}
            size="sm"
            className="flex items-center gap-2"
            onClick={() => onNavigate('home')}
          >
            <Home className="h-4 w-4" />
            首页
          </Button>
          <Button
            variant={currentPage === 'exam' || currentPage === 'exam-list' ? 'default' : 'ghost'}
            size="sm"
            className="flex items-center gap-2"
            onClick={() => onNavigate('exam-list')}
          >
            <FileText className="h-4 w-4" />
            考试
          </Button>
          <Button
            variant={currentPage === 'doc' || currentPage === 'doc-list' || currentPage === 'doc-初中学业水平考试' ? 'default' : 'ghost'}
            size="sm"
            className="flex items-center gap-2"
            onClick={() => onNavigate('doc-list')}
          >
            <BookOpen className="h-4 w-4" />
            文档
          </Button>
        </nav>

        {/* 右侧区域 */}
        <div className="ml-auto flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;