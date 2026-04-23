import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Briefcase, MapPin, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api';

interface Application {
  id: number;
  job_id: number;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  salary_range: string;
  status: string;
  status_ar: string;
  applied_at: string;
  cover_letter: string;
}

export function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('user_id') || '1';

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_URL}/applications?graduate_id=${userId}`);
      const data = await response.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
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
    return <Badge className={`${colors[status] || colors.pending} border`}>{texts[status] || texts.pending}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">طلبات التوظيف</h1>
        <p className="text-gray-600 mt-2">جميع طلباتك المقدمة</p>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لم تقم بتقديم أي طلبات بعد</p>
            <Link to="/home/graduates/jobs">
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                تصفح الوظائف
              </button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{app.title}</CardTitle>
                    <CardDescription className="text-lg mt-1">{app.company_name}</CardDescription>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{app.location || 'غير محدد'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{app.job_type === 'fulltime' ? 'دوام كامل' : app.job_type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(app.applied_at).toLocaleDateString('ar')}</span>
                  </div>
                </div>
                {app.salary_range && (
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">الراتب: </span>
                    {app.salary_range}
                  </div>
                )}
                {app.cover_letter && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-semibold mb-1">رسالة التقديم:</p>
                    <p className="text-sm text-gray-600">{app.cover_letter}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
