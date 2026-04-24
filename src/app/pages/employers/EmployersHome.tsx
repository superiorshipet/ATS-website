import { Link } from 'react-router-dom';
import { FileText, Briefcase, Users, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { useState, useEffect } from 'react';

import { API_URL } from "../../../lib/api";

interface Application {
  id: number;
  job_id: number;
  title: string;
  graduate_name: string;
  status: string;
  score: number;
  applied_at: string;
}

interface Stats {
  total_applications: number;
  active_jobs: number;
  pending_applications: number;
  avg_score: number;
}

export function EmployersHome() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_applications: 0,
    active_jobs: 0,
    pending_applications: 0,
    avg_score: 0
  });
  const [loading, setLoading] = useState(true);
  const employerId = localStorage.getItem('user_id') || '3';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get employer's jobs
      const jobsRes = await fetch(`${API_URL}/jobs?employer_id=${employerId}`);
      const jobsData = await jobsRes.json();
      
      // Get applications for employer's jobs
      const appsRes = await fetch(`${API_URL}/applications/employer?employer_id=${employerId}`);
      const appsData = await appsRes.json();
      
      if (appsData.success) {
        setApplications(appsData.data.slice(0, 5));
        const total = appsData.data.length;
        const pending = appsData.data.filter((a: any) => a.status === 'pending').length;
        const avgScore = appsData.data.reduce((sum: number, a: any) => sum + (a.score || 0), 0) / (total || 1);
        
        setStats({
          total_applications: total,
          active_jobs: jobsData.data?.filter((j: any) => j.status === 'active').length || 0,
          pending_applications: pending,
          avg_score: Math.round(avgScore)
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'reviewing': 'bg-blue-100 text-blue-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
    };
    const texts: Record<string, string> = {
      'pending': 'قيد المراجعة',
      'reviewing': 'جاري المراجعة',
      'accepted': 'مقبول',
      'rejected': 'مرفوض',
    };
    return <Badge className={variants[status] || variants.pending}>{texts[status] || texts.pending}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة جهات التوظيف</h1>
          <p className="text-gray-600 mt-2">إدارة إعلانات الوظائف ومتابعة المتقدمين</p>
        </div>
        <Link to="/home/employers/post-job">
          <Button size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            نشر وظيفة جديدة
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي المتقدمين</CardTitle>
            <Users className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_applications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">الوظائف النشطة</CardTitle>
            <Briefcase className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_jobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">قيد المراجعة</CardTitle>
            <FileText className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending_applications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">متوسط التوافق</CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avg_score}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/home/employers/post-job">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>نشر وظيفة جديدة</CardTitle>
              <CardDescription>أضف إعلان وظيفي جديد للمنصة</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link to="/home/employers/manage-jobs">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>إدارة الوظائف</CardTitle>
              <CardDescription>عرض وتعديل الإعلانات الحالية</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>المتقدمون الجدد</CardTitle>
              <CardDescription>أحدث السير الذاتية المقدمة</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>لا يوجد متقدمين حتى الآن</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((applicant) => (
                <div key={applicant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {applicant.graduate_name?.split(' ').map(n => n[0]).join('') || 'م'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{applicant.graduate_name}</h3>
                      <p className="text-sm text-gray-600">{applicant.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(applicant.applied_at).toLocaleDateString('ar')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <p className="text-sm text-gray-600">درجة التطابق</p>
                      <p className="text-lg font-bold text-blue-600">{applicant.score || 75}%</p>
                    </div>
                    {getStatusBadge(applicant.status)}
                    <Link to={`/home/employers/job-applicants/${applicant.job_id}`}>
                      <Button variant="outline" size="sm">عرض السيرة</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
