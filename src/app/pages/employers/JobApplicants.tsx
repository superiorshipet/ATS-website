import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Briefcase, MapPin, Calendar, ArrowRight, Mail, Phone, FileText } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

interface Applicant {
  id: number;
  graduate_id: number;
  full_name: string;
  email: string;
  phone: string;
  skills: string;
  cv_url: string;
  cover_letter: string;
  status: string;
  score: number;
  applied_at: string;
}

interface Job {
  id: number;
  title: string;
  location: string;
  job_type: string;
}

export function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      // Fetch job details
      const jobRes = await fetch(`${API_URL}/jobs/${jobId}`);
      const jobData = await jobRes.json();
      if (jobData.success) {
        setJob(jobData.data);
      }

      // Fetch applicants
      const appsRes = await fetch(`${API_URL}/applications/job/${jobId}`);
      const appsData = await appsRes.json();
      if (appsData.success) {
        setApplicants(appsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        setApplicants(applicants.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        ));
        alert('تم تحديث الحالة بنجاح');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('حدث خطأ في تحديث الحالة');
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
    return <Badge className={colors[status] || colors.pending}>{texts[status] || texts.pending}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/home/employers/manage-jobs')} className="gap-2">
          <ArrowRight className="w-4 h-4" />
          رجوع
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المتقدمين للوظيفة</h1>
          {job && (
            <p className="text-gray-600 mt-2">
              {job.title} - {job.location}
            </p>
          )}
        </div>
      </div>

      {applicants.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا يوجد متقدمين لهذه الوظيفة حتى الآن</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <Card key={applicant.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {applicant.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{applicant.full_name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{applicant.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{applicant.phone || 'غير متوفر'}</span>
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(applicant.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">المهارات</p>
                    <div className="flex flex-wrap gap-1">
                      {applicant.skills ? applicant.skills.replace(/[{}]/g, '').split(',').map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{skill.trim()}</Badge>
                      )) : <span className="text-gray-400 text-sm">لا توجد مهارات مضافة</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">تاريخ التقديم</p>
                    <p className="text-sm text-gray-700">{new Date(applicant.applied_at).toLocaleDateString('ar')}</p>
                  </div>
                </div>

                {applicant.cover_letter && (
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">رسالة التقديم</p>
                    <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">{applicant.cover_letter}</p>
                  </div>
                )}

                {applicant.cv_url && (
                  <div>
                    <a 
                      href={`http://localhost:8000${applicant.cv_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      عرض السيرة الذاتية
                    </a>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    size="sm" 
                    variant={applicant.status === 'accepted' ? 'default' : 'outline'}
                    onClick={() => updateStatus(applicant.id, 'accepted')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    قبول
                  </Button>
                  <Button 
                    size="sm" 
                    variant={applicant.status === 'rejected' ? 'destructive' : 'outline'}
                    onClick={() => updateStatus(applicant.id, 'rejected')}
                    className="text-red-600 hover:text-red-700"
                  >
                    رفض
                  </Button>
                  <Button 
                    size="sm" 
                    variant={applicant.status === 'reviewing' ? 'default' : 'outline'}
                    onClick={() => updateStatus(applicant.id, 'reviewing')}
                  >
                    قيد المراجعة
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
