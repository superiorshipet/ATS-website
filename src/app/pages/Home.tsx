import { Link } from 'react-router-dom';
import { Building2, GraduationCap, CheckCircle, Users, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export function Home() {
  const [stats, setStats] = useState({
    total_graduates: 0,
    active_jobs: 0,
    total_applications: 0
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    setIsLoggedIn(!!token);
    console.log('isLoggedIn:', !!token);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="space-y-12" dir="rtl">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
سيرتي الذكية        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          منصة متكاملة لإدارة السير الذاتية ومتابعة طلبات التوظيف بكفاءة عالية
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Graduates Card */}
        <Card className="border-2 hover:border-blue-500 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">الخريجين</CardTitle>
            <CardDescription>قدم سيرتك الذاتية ابحث عن الوظائف المناسبة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>بناء سيرة ذاتية احترافية</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>البحث عن الوظائف المتاحة</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>متابعة حالة طلباتك</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Employers Card */}
        <Card className="border-2 hover:border-green-500 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">جهات التوظيف</CardTitle>
            <CardDescription>نشر الوظائف واستعراض السير الذاتية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>نشر إعلانات وظيفية</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>استعراض وتصفية المتقدمين</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>إدارة عملية التوظيف</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              السير الذاتية المسجلة
            </CardTitle>
            <Users className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_graduates || 0}</div>
            <p className="text-xs text-gray-600">خريج مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              الوظائف المتاحة
            </CardTitle>
            <FileText className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_jobs || 0}</div>
            <p className="text-xs text-gray-600">وظيفة نشطة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              إجمالي التقديمات
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_applications || 0}</div>
            <p className="text-xs text-gray-600">طلب توظيف</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
