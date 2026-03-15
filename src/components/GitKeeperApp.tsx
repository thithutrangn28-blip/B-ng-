import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Share2, 
  Menu, 
  Star, 
  GitFork, 
  Eye, 
  List, 
  CircleDot, 
  GitPullRequest, 
  MessageSquare, 
  PlayCircle, 
  Tag, 
  MoreHorizontal,
  Folder,
  FileText,
  ChevronRight,
  Search,
  BookOpen,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2
} from 'lucide-react';

// --- Types ---

type ScreenType = 
  | 'HOME' 
  | 'REPO_DETAIL' 
  | 'ISSUE_LIST' 
  | 'ISSUE_DETAIL' 
  | 'PR_LIST' 
  | 'PR_DETAIL'
  | 'DISCUSSION_LIST'
  | 'ACTION_LIST'
  | 'RELEASE_LIST'
  | 'FILE_BROWSER' 
  | 'FILE_CONTENT';

interface Screen {
  id: string;
  type: ScreenType;
  data?: any;
}

interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  watching: number;
  language: string;
  updatedAt: string;
  avatarUrl: string;
  color: string;
}

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  color?: string;
}

// --- Mock Data ---

const MOCK_REPOS: Repository[] = [
  {
    id: '1',
    name: 'react',
    owner: 'facebook',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    stars: 203000,
    forks: 42000,
    watching: 6700,
    language: 'JavaScript',
    updatedAt: 'Updated 2 hours ago',
    avatarUrl: 'https://github.com/facebook.png',
    color: '#f9ebe7'
  },
  {
    id: '2',
    name: 'tailwindcss',
    owner: 'tailwindlabs',
    description: 'A utility-first CSS framework for rapid UI development.',
    stars: 65000,
    forks: 3200,
    watching: 1200,
    language: 'CSS',
    updatedAt: 'Updated 5 hours ago',
    avatarUrl: 'https://github.com/tailwindlabs.png',
    color: '#f9e5df'
  },
  {
    id: '3',
    name: 'next.js',
    owner: 'vercel',
    description: 'The React Framework for the Web.',
    stars: 101000,
    forks: 22000,
    watching: 3400,
    language: 'TypeScript',
    updatedAt: 'Updated yesterday',
    avatarUrl: 'https://github.com/vercel.png',
    color: '#faf0f2'
  },
  {
    id: '4',
    name: 'vite',
    owner: 'vitejs',
    description: 'Next generation frontend tooling. It\'s fast!',
    stars: 55000,
    forks: 4500,
    watching: 800,
    language: 'TypeScript',
    updatedAt: 'Updated 3 days ago',
    avatarUrl: 'https://github.com/vitejs.png',
    color: '#f9e7eb'
  }
];

const PASTEL_COLORS = [
  '#faf2f0', '#f9ebe7', '#f9e5df', '#faf0f0', '#f9e7e7', 
  '#f9dfdf', '#faf0f2', '#f9e7eb', '#f9dfe5'
];

const MOCK_FILE_SYSTEM: FileNode[] = [
  {
    name: '.github',
    type: 'folder',
    color: '#faf2f0',
    children: [
      { name: 'workflows', type: 'folder', color: '#f9ebe7', children: [
        { name: 'ci.yml', type: 'file', color: '#f9e5df', content: 'name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest' }
      ]}
    ]
  },
  {
    name: 'src',
    type: 'folder',
    color: '#faf0f0',
    children: [
      { name: 'components', type: 'folder', color: '#f9e7e7', children: [
        { name: 'Button.tsx', type: 'file', color: '#f9dfdf', content: 'export const Button = () => <button>Click me</button>;' },
        { name: 'Header.tsx', type: 'file', color: '#faf0f2', content: 'export const Header = () => <header>Logo</header>;' }
      ]},
      { name: 'App.tsx', type: 'file', color: '#f9e7eb', content: 'export default function App() {\n  return <div>Hello World</div>;\n}' },
      { name: 'index.css', type: 'file', color: '#f9dfe5', content: 'body { background: #faf0f0; }' }
    ]
  },
  { name: 'package.json', type: 'file', color: '#faf2f0', content: '{\n  "name": "demo-app",\n  "version": "1.0.0"\n}' },
  { name: 'README.md', type: 'file', color: '#f9ebe7', content: '# Demo App\n\nThis is a demo repository.' }
];

// --- Components ---

const TopBar = ({ title, onBack, showBack = false, onAdd, onHelp }: { title: string, onBack?: () => void, showBack?: boolean, onAdd?: () => void, onHelp?: () => void }) => (
  <div className="h-[56px] flex items-center justify-between px-4 bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-stone-200/50">
    <div className="flex items-center gap-4">
      {showBack && (
        <button onClick={onBack} className="p-1 hover:bg-black/5 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-stone-800" />
        </button>
      )}
      <h1 className="text-lg font-bold text-stone-800 truncate max-w-[200px]">{title}</h1>
    </div>
    <div className="flex items-center gap-4">
      {onHelp && (
        <button onClick={onHelp} className="p-1 hover:bg-black/5 rounded-full transition-colors text-blue-600">
          <BookOpen className="w-6 h-6" />
        </button>
      )}
      {onAdd && (
        <button onClick={onAdd} className="p-1 hover:bg-black/5 rounded-full transition-colors">
          <Plus className="w-6 h-6 text-stone-800" />
        </button>
      )}
      <button className="p-1 hover:bg-black/5 rounded-full transition-colors">
        <Share2 className="w-6 h-6 text-stone-800" />
      </button>
      <button className="p-1 hover:bg-black/5 rounded-full transition-colors">
        <Menu className="w-6 h-6 text-stone-800" />
      </button>
    </div>
  </div>
);

const RepoCard = ({ repo, onClick }: { repo: Repository, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="p-4 rounded-2xl mb-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow border border-white/50"
    style={{ backgroundColor: repo.color }}
  >
    <div className="flex items-start gap-3">
      <img src={repo.avatarUrl} alt={repo.owner} className="w-10 h-10 rounded-lg bg-white" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 text-stone-500 text-xs mb-0.5">
          <span>{repo.owner}</span>
        </div>
        <h3 className="text-lg font-bold text-stone-900 leading-tight mb-1">{repo.name}</h3>
        <p className="text-sm text-stone-600 line-clamp-2 mb-3">{repo.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            {repo.language}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {repo.stars.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            {repo.forks.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ActionButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="flex-1 h-[44px] bg-white/60 hover:bg-white/80 rounded-[10px] flex items-center justify-center gap-2 text-stone-700 text-sm font-medium transition-colors border border-stone-100 shadow-sm"
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

const MenuItem = ({ icon: Icon, label, count, color, onClick, bgColor }: { icon: any, label: string, count?: number, color?: string, onClick?: () => void, bgColor?: string }) => (
  <div 
    onClick={onClick}
    className="h-[56px] flex items-center px-4 hover:bg-black/5 cursor-pointer transition-colors border-b border-stone-100 last:border-0"
  >
    <div 
      className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 ${color || 'text-stone-600'}`}
      style={{ backgroundColor: bgColor || '#f5f5f4' }}
    >
      <Icon className="w-5 h-5" />
    </div>
    <span className="flex-1 text-base font-medium text-stone-800">{label}</span>
    {count !== undefined && (
      <span className="text-stone-400 text-sm bg-stone-100 px-2 py-0.5 rounded-full">{count}</span>
    )}
    <ChevronRight className="w-5 h-5 text-stone-300 ml-2" />
  </div>
);

const GuideModal = ({ isOpen, onClose, title, content }: { isOpen: boolean, onClose: () => void, title: string, content: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          onClick={e => e.stopPropagation()}
          className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-[#faf0f0]">
            <h3 className="font-bold text-stone-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Hướng dẫn sử dụng
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full">
              <X className="w-5 h-5 text-stone-500" />
            </button>
          </div>
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <h4 className="font-bold text-lg mb-2 text-stone-900">{title}</h4>
            <div className="text-sm text-stone-600 space-y-3 leading-relaxed">
              {content}
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Main App Component ---

export function GitKeeperApp({ onBack }: { onBack: () => void }) {
  const [navigationStack, setNavigationStack] = useState<Screen[]>([{ id: 'home', type: 'HOME' }]);
  const [repos, setRepos] = useState<Repository[]>(MOCK_REPOS);
  const [showGuide, setShowGuide] = useState(false);

  const currentScreen = navigationStack[navigationStack.length - 1];

  const pushScreen = (screen: Screen) => {
    setNavigationStack(prev => [...prev, screen]);
  };

  const popScreen = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(prev => prev.slice(0, -1));
    } else {
      onBack();
    }
  };

  const handleAddRepo = () => {
    const newRepo: Repository = {
      id: Date.now().toString(),
      name: 'new-project',
      owner: 'me',
      description: 'A new awesome project created just now.',
      stars: 0,
      forks: 0,
      watching: 0,
      language: 'TypeScript',
      updatedAt: 'Just now',
      avatarUrl: 'https://github.com/github.png',
      color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)]
    };
    setRepos([newRepo, ...repos]);
  };

  // --- Renderers ---

  const renderHome = () => (
    <div className="flex flex-col h-full">
      <TopBar 
        title="Home" 
        onAdd={handleAddRepo} 
        onHelp={() => setShowGuide(true)}
      />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-stone-800 mb-4 px-1">My Repositories</h2>
          {repos.map(repo => (
            <RepoCard 
              key={repo.id} 
              repo={repo} 
              onClick={() => pushScreen({ id: repo.id, type: 'REPO_DETAIL', data: repo })} 
            />
          ))}
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold text-stone-800 mb-4 px-1">Recent Activity</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <GitPullRequest className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">Merged PR #42 in <span className="font-bold">react</span></p>
                <p className="text-xs text-stone-500">2 hours ago</p>
              </div>
            </div>
            <div className="h-px bg-stone-100 my-2" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">Starred <span className="font-bold">tailwindcss</span></p>
                <p className="text-xs text-stone-500">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)}
        title="Trang chủ (Home)"
        content={
          <>
            <p>Chào mừng bạn đến với GitKeeper! Đây là màn hình chính nơi bạn có thể quản lý tất cả các kho mã nguồn (repository) của mình.</p>
            <ul className="list-disc pl-4 space-y-2 mt-2">
              <li><b>My Repositories:</b> Danh sách các dự án của bạn. Nhấn vào một thẻ để xem chi tiết.</li>
              <li><b>Recent Activity:</b> Xem các hoạt động gần đây như merge PR, star repo.</li>
              <li><b>Nút (+):</b> Nhấn vào nút cộng ở góc trên bên phải để tạo nhanh một repository mới.</li>
              <li><b>Menu:</b> Truy cập cài đặt và các tùy chọn khác.</li>
            </ul>
          </>
        }
      />
    </div>
  );

  const renderRepoDetail = (repo: Repository) => (
    <div className="flex flex-col h-full bg-[#faf0f0]">
      <TopBar 
        title={repo.name} 
        onBack={popScreen} 
        showBack 
        onHelp={() => setShowGuide(true)}
      />
      <div className="flex-1 overflow-y-auto">
        {/* Repo Info Block */}
        <div className="p-4 bg-white mb-2 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <img src={repo.avatarUrl} alt={repo.owner} className="w-[40px] h-[40px] rounded-[8px] bg-stone-100" />
            <div>
              <h2 className="text-[20px] font-bold text-stone-900 leading-tight">{repo.name}</h2>
              <p className="text-[14px] text-stone-500">{repo.owner}</p>
            </div>
          </div>
          <p className="text-[14px] text-stone-800 mb-2 leading-relaxed">{repo.description}</p>
          <div className="flex items-center gap-2 text-[13px] text-blue-600 mb-4">
            <Search className="w-3 h-3" />
            github.com/{repo.owner}/{repo.name}
          </div>
          
          <div className="flex items-center gap-6 text-stone-600 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" /> 
              <span className="font-bold text-stone-900">{repo.stars.toLocaleString()}</span> stars
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4" /> 
              <span className="font-bold text-stone-900">{repo.forks.toLocaleString()}</span> forks
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-3 bg-white mb-2 shadow-sm">
          <div className="flex gap-2">
            <ActionButton icon={Star} label="Star" />
            <ActionButton icon={List} label="Add to List" />
            <ActionButton icon={GitFork} label="Fork" />
            <ActionButton icon={Eye} label="Watch" />
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-white shadow-sm mb-6">
          <MenuItem 
            icon={CircleDot} 
            label="Issues" 
            count={12} 
            color="text-green-600" 
            bgColor="#f0fdf4"
            onClick={() => pushScreen({ id: 'issues', type: 'ISSUE_LIST', data: repo })}
          />
          <MenuItem 
            icon={GitPullRequest} 
            label="Pull Requests" 
            count={5} 
            color="text-blue-600" 
            bgColor="#eff6ff"
            onClick={() => pushScreen({ id: 'prs', type: 'PR_LIST', data: repo })}
          />
          <MenuItem 
            icon={MessageSquare} 
            label="Discussions" 
            color="text-purple-600" 
            bgColor="#faf5ff"
            onClick={() => pushScreen({ id: 'discussions', type: 'DISCUSSION_LIST', data: repo })}
          />
          <MenuItem 
            icon={PlayCircle} 
            label="Actions" 
            color="text-stone-600" 
            bgColor="#f5f5f4"
            onClick={() => pushScreen({ id: 'actions', type: 'ACTION_LIST', data: repo })}
          />
          <MenuItem 
            icon={Tag} 
            label="Releases" 
            color="text-orange-600" 
            bgColor="#fff7ed"
            onClick={() => pushScreen({ id: 'releases', type: 'RELEASE_LIST', data: repo })}
          />
          <MenuItem 
            icon={Folder} 
            label="Browse Code" 
            color="text-yellow-600" 
            bgColor="#fefce8"
            onClick={() => pushScreen({ id: 'files', type: 'FILE_BROWSER', data: { repo, files: MOCK_FILE_SYSTEM } })}
          />
        </div>
        
        {/* Readme Preview */}
        <div className="bg-white p-4 shadow-sm mb-8">
          <h3 className="font-bold text-stone-800 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> README.md
          </h3>
          <div className="text-sm text-stone-600 leading-relaxed font-mono bg-stone-50 p-3 rounded-lg border border-stone-100">
            # {repo.name}<br/><br/>
            {repo.description}<br/><br/>
            ## Installation<br/>
            npm install {repo.name}<br/><br/>
            ## Usage<br/>
            import {`{ thing }`} from '{repo.name}';
          </div>
        </div>
      </div>

      <GuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)}
        title={`Chi tiết Repository: ${repo.name}`}
        content={
          <>
            <p>Đây là trang chi tiết của dự án. Tại đây bạn có thể nắm bắt toàn bộ thông tin và thực hiện các thao tác quản lý.</p>
            <ul className="list-disc pl-4 space-y-2 mt-2">
              <li><b>Thông tin chung:</b> Xem mô tả, số sao (stars), số lượt fork và ngôn ngữ chính.</li>
              <li><b>Thao tác nhanh:</b> Star (yêu thích), Fork (tạo bản sao), Watch (theo dõi thông báo).</li>
              <li><b>Issues:</b> Xem và quản lý các vấn đề/lỗi được báo cáo.</li>
              <li><b>Pull Requests:</b> Xem các yêu cầu gộp mã từ cộng đồng hoặc thành viên khác.</li>
              <li><b>Browse Code:</b> Duyệt xem toàn bộ mã nguồn của dự án.</li>
            </ul>
          </>
        }
      />
    </div>
  );

  const renderIssueList = (repo: Repository) => (
    <div className="flex flex-col h-full bg-[#faf0f0]">
      <TopBar title={`Issues · ${repo.name}`} onBack={popScreen} showBack onAdd={() => {}} onHelp={() => setShowGuide(true)} />
      <div className="flex-1 overflow-y-auto p-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i} 
            onClick={() => pushScreen({ id: `issue-${i}`, type: 'ISSUE_DETAIL', data: { id: i, repo } })}
            className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-stone-100 flex gap-3 cursor-pointer hover:bg-stone-50 transition-colors"
          >
            <CircleDot className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-stone-800 text-sm mb-1">Bug: Application crashes when clicking the button #{100 + i}</h3>
              <p className="text-xs text-stone-500">Opened 2 days ago by user123</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full font-medium">bug</span>
                <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] rounded-full font-medium">high priority</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <GuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)}
        title="Danh sách Issues"
        content={
          <>
            <p>Issues là nơi theo dõi các lỗi, tính năng mới hoặc các công việc cần làm.</p>
            <ul className="list-disc pl-4 space-y-2 mt-2">
              <li><b>Danh sách:</b> Hiển thị tất cả các issue đang mở. Biểu tượng màu xanh lá cây nghĩa là issue đang mở (Open).</li>
              <li><b>Chi tiết:</b> Nhấn vào một issue để xem nội dung chi tiết và bình luận.</li>
              <li><b>Tạo mới:</b> Nhấn nút (+) để báo cáo một lỗi mới.</li>
            </ul>
          </>
        }
      />
    </div>
  );

  const renderIssueDetail = (data: { id: number, repo: Repository }) => (
    <div className="flex flex-col h-full bg-[#faf0f0]">
      <TopBar title={`Issue #${100 + data.id}`} onBack={popScreen} showBack onHelp={() => setShowGuide(true)} />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
              <CircleDot className="w-3 h-3" /> Open
            </span>
            <span className="text-stone-500 text-xs">opened 2 days ago by <b>user123</b></span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-4">Bug: Application crashes when clicking the button</h2>
          <div className="text-stone-700 text-sm leading-relaxed space-y-2">
            <p>Steps to reproduce:</p>
            <ol className="list-decimal pl-5">
              <li>Open the app</li>
              <li>Go to settings</li>
              <li>Click 'Save'</li>
            </ol>
            <p>Expected behavior: Settings should be saved.</p>
            <p>Actual behavior: App crashes immediately.</p>
          </div>
        </div>
        
        <h3 className="font-bold text-stone-800 mb-3 ml-1">Comments</h3>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">D</div>
            <span className="font-bold text-sm text-stone-800">dev_team</span>
            <span className="text-xs text-stone-400">1 day ago</span>
          </div>
          <p className="text-sm text-stone-600">Thanks for the report! We are looking into this.</p>
        </div>
      </div>
      <GuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)}
        title="Chi tiết Issue"
        content={
          <>
            <p>Xem chi tiết nội dung trao đổi về một vấn đề cụ thể.</p>
            <ul className="list-disc pl-4 space-y-2 mt-2">
              <li><b>Trạng thái:</b> Open (Mở) hoặc Closed (Đóng).</li>
              <li><b>Nội dung:</b> Mô tả chi tiết về lỗi hoặc yêu cầu.</li>
              <li><b>Bình luận:</b> Các thảo luận giữa người dùng và lập trình viên.</li>
            </ul>
          </>
        }
      />
    </div>
  );

  const renderPRList = (repo: Repository) => (
    <div className="flex flex-col h-full bg-[#faf0f0]">
      <TopBar title={`Pull Requests · ${repo.name}`} onBack={popScreen} showBack onHelp={() => setShowGuide(true)} />
      <div className="flex-1 overflow-y-auto p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-stone-100 flex gap-3">
            <GitPullRequest className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-stone-800 text-sm mb-1">Feat: Add new authentication flow #{200 + i}</h3>
              <p className="text-xs text-stone-500">Opened 5 hours ago by dev_pro</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] rounded-full font-medium">✓ 2 checks passed</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <GuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)}
        title="Pull Requests (PR)"
        content={
          <>
            <p>Pull Requests là nơi các thay đổi mã nguồn được đề xuất để gộp vào dự án chính.</p>
            <ul className="list-disc pl-4 space-y-2 mt-2">
              <li><b>Màu xanh dương:</b> PR đang mở và chờ review.</li>
              <li><b>Màu tím:</b> PR đã được gộp (Merged).</li>
              <li><b>Màu đỏ:</b> PR đã bị đóng (Closed).</li>
            </ul>
          </>
        }
      />
    </div>
  );

  const renderFileBrowser = (data: { repo: Repository, files: FileNode[], path?: string }) => {
    const currentFiles = data.files;
    const currentPath = data.path || '/';

    return (
      <div className="flex flex-col h-full bg-[#faf0f0]">
        <TopBar title={currentPath === '/' ? 'Files' : currentPath.split('/').pop() || 'Files'} onBack={popScreen} showBack onHelp={() => setShowGuide(true)} />
        <div className="flex-1 overflow-y-auto bg-white mt-2">
          {currentFiles.map((node, index) => (
            <MenuItem 
              key={index}
              icon={node.type === 'folder' ? Folder : FileText} 
              label={node.name} 
              color={node.type === 'folder' ? 'text-blue-500' : 'text-stone-500'}
              bgColor={node.color || '#f5f5f4'}
              onClick={() => {
                if (node.type === 'folder') {
                  pushScreen({ 
                    id: `folder-${node.name}`, 
                    type: 'FILE_BROWSER', 
                    data: { repo: data.repo, files: node.children || [], path: `${currentPath}${node.name}/` } 
                  });
                } else {
                  pushScreen({
                    id: `file-${node.name}`,
                    type: 'FILE_CONTENT',
                    data: { repo: data.repo, file: node }
                  });
                }
              }}
            />
          ))}
        </div>
        <GuideModal 
          isOpen={showGuide} 
          onClose={() => setShowGuide(false)}
          title="Trình duyệt tập tin (File Browser)"
          content={
            <>
              <p>Duyệt qua cấu trúc thư mục và tập tin của dự án.</p>
              <ul className="list-disc pl-4 space-y-2 mt-2">
                <li><b>Thư mục (Folder):</b> Nhấn vào để mở và xem các tập tin bên trong.</li>
                <li><b>Tập tin (File):</b> Nhấn vào để xem nội dung mã nguồn của tập tin đó.</li>
                <li><b>Màu sắc:</b> Các biểu tượng được mã hóa màu pastel để dễ phân biệt.</li>
              </ul>
            </>
          }
        />
      </div>
    );
  };

  const renderFileContent = (data: { repo: Repository, file: FileNode }) => (
    <div className="flex flex-col h-full bg-[#faf0f0]">
      <TopBar title={data.file.name} onBack={popScreen} showBack onHelp={() => setShowGuide(true)} />
      <div className="flex-1 overflow-y-auto p-0 bg-white">
        <div className="flex items-center justify-between px-4 py-2 bg-stone-50 border-b border-stone-200 text-xs text-stone-500 font-mono">
          <span>15 lines</span>
          <span>456 bytes</span>
        </div>
        <pre className="p-4 text-sm font-mono text-stone-800 overflow-x-auto leading-relaxed">
          <code>{data.file.content || '// No content preview available'}</code>
        </pre>
      </div>
      <GuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)}
        title="Xem nội dung tập tin"
        content={
          <>
            <p>Xem chi tiết mã nguồn của tập tin.</p>
            <ul className="list-disc pl-4 space-y-2 mt-2">
              <li><b>Nội dung:</b> Hiển thị mã nguồn với phông chữ monospace.</li>
              <li><b>Thông tin:</b> Thanh trên cùng hiển thị số dòng và kích thước tập tin.</li>
              <li><b>Sao chép:</b> Bạn có thể chọn và sao chép văn bản trực tiếp.</li>
            </ul>
          </>
        }
      />
    </div>
  );

  const renderPlaceholder = (title: string, repo: Repository) => (
    <div className="flex flex-col h-full bg-[#faf0f0]">
      <TopBar title={`${title} · ${repo.name}`} onBack={popScreen} showBack onHelp={() => setShowGuide(true)} />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mb-4 text-stone-400">
          <Code2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-stone-800 mb-2">Chưa có dữ liệu</h3>
        <p className="text-stone-500">Mục này hiện đang trống hoặc chưa được cập nhật trong bản demo này.</p>
      </div>
      <GuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)}
        title={`Hướng dẫn: ${title}`}
        content={
          <>
            <p>Đây là màn hình quản lý {title}.</p>
            <p className="mt-2">Trong phiên bản đầy đủ, bạn sẽ thấy danh sách các mục tương ứng tại đây.</p>
          </>
        }
      />
    </div>
  );

  return (
    <div className="h-full w-full bg-[#faf0f0] text-stone-800 font-sans overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentScreen.id}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-20%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="h-full w-full absolute inset-0 bg-[#faf0f0]"
        >
          {currentScreen.type === 'HOME' && renderHome()}
          {currentScreen.type === 'REPO_DETAIL' && renderRepoDetail(currentScreen.data)}
          {currentScreen.type === 'ISSUE_LIST' && renderIssueList(currentScreen.data)}
          {currentScreen.type === 'ISSUE_DETAIL' && renderIssueDetail(currentScreen.data)}
          {currentScreen.type === 'PR_LIST' && renderPRList(currentScreen.data)}
          {currentScreen.type === 'DISCUSSION_LIST' && renderPlaceholder('Discussions', currentScreen.data)}
          {currentScreen.type === 'ACTION_LIST' && renderPlaceholder('Actions', currentScreen.data)}
          {currentScreen.type === 'RELEASE_LIST' && renderPlaceholder('Releases', currentScreen.data)}
          {currentScreen.type === 'FILE_BROWSER' && renderFileBrowser(currentScreen.data)}
          {currentScreen.type === 'FILE_CONTENT' && renderFileContent(currentScreen.data)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}