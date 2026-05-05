import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, GraduationCap, Home, Shield, LogOut, User, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
// استيراد الصورة من المسار الصحيح
import logo from '/src/assets/images/logo.png';

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const type = localStorage.getItem('user_type');
    const name = localStorage.getItem('user_name') || 'المستخدم';
    setUserType(type);
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_name');
    navigate('/');
  };

  const navItems = [
    { path: '/home', label: 'الرئيسية', icon: Home, showFor: ['graduate', 'employer', 'admin'] },
    { path: '/home/graduates', label: 'الخريجين', icon: GraduationCap, showFor: ['graduate'] },
    { path: '/home/employers', label: 'جهات التوظيف', icon: Building2, showFor: ['employer'] },
    { path: '/home/admin', label: 'لوحة الإدارة', icon: Shield, showFor: ['admin'] },
  ];

  const getProfilePath = () => {
    if (userType === 'graduate') return '/home/graduates/profile';
    if (userType === 'employer') return '/home/employers/profile';
    return '/home/admin/profile';
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between py-3 md:py-0 md:h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="ATS-websit logo" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-lg"
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-bold text-gray-900">توظيف</h1>
                <span className="text-xs text-gray-500 hidden md:block">فرص عمل بلا حدود</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <nav className="flex gap-4">
                {navItems.map((item) => {
                  if (item.showFor.includes(userType || '')) {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                          location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  }
                  return null;
                })}
                <Link
                  to={getProfilePath()}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    location.pathname.includes('profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>الملف الشخصي</span>
                </Link>
              </nav>

              <div className="flex items-center gap-3 border-r pr-3">
                <span className="text-sm text-gray-600">مرحباً، {userName}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>خروج</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  if (item.showFor.includes(userType || '')) {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                          location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  }
                  return null;
                })}
                <Link
                  to={getProfilePath()}
                  className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-gray-600 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>الملف الشخصي</span>
                </Link>
                <div className="pt-2 mt-2 border-t">
                  <div className="px-3 py-2 text-sm text-gray-600">مرحباً، {userName}</div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل خروج</span>
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t mt-8 md:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src={logo} 
                alt="logo" 
                className="w-6 h-6 object-contain"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
              <p className="text-center text-sm text-gray-600">© 2026 ATS-websit - جميع الحقوق محفوظة</p>
            </div>
            <div className="text-sm text-gray-500">
              نظام تتبع المتقدمين المتطور
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
