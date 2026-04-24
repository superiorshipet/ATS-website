import { Link } from 'react-router-dom';
import { FileText, Briefcase, User, Upload, CloudUpload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useState, useEffect, useRef } from 'react';

import { API_URL } from "../../../lib/api";

interface Application {
  id: number;
  job_id: number;
  title: string;
  company_name: string;
  status: string;
  status_ar: string;
  applied_at: string;
}

export function GraduatesHome() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const userId = localStorage.getItem('user_id') || '1';

  useEffect(() => {
    fetchApplications();
    fetchCV();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_URL}/applications?graduate_id=${userId}`);
      const data = await response.json();
      if (data.success) {
        setApplications(data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCV = async () => {
    try {
      const response = await fetch(`${API_URL}/cv?graduate_id=${userId}`);
      const data = await response.json();
      if (data.success && data.data) {
        setCvUrl(data.data.cv_url);
      }
    } catch (error) {
      console.error('Error fetching CV:', error);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && !['pdf', 'doc', 'docx'].includes(fileExtension || '')) {
      alert('الرجاء رفع ملف PDF أو Word فقط');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('الحد الأقصى لحجم الملف هو 5 ميجابايت');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('cv_file', file);
    formData.append('user_id', userId);

    try {
      const response = await fetch(`${API_URL}/cv/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCvUrl(data.cv_url);
        alert('تم رفع السيرة الذاتية بنجاح!');
      } else {
        alert('فشل رفع الملف: ' + (data.error || 'حدث خطأ غير معروف'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('حدث خطأ في الاتصال بالخادم');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة الخريجين</h1>
          <p className="text-gray-600 mt-2">مرحباً بك في منصة البحث عن الوظائف</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/home/graduates/cv-builder">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>بناء السيرة الذاتية</CardTitle>
              <CardDescription>أنشئ سيرتك الذاتية بشكل احترافي</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/home/graduates/jobs">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>الوظائف المتاحة</CardTitle>
              <CardDescription>تصفح واختر الوظيفة المناسبة</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/home/graduates/profile">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>الملف الشخصي</CardTitle>
              <CardDescription>إدارة معلوماتك الشخصية</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* CV Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>رفع السيرة الذاتية</CardTitle>
          <CardDescription>قم برفع سيرتك الذاتية بصيغة PDF أو Word</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${uploading ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
            onClick={handleFileSelect}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              disabled={uploading}
            />
            
            {uploading ? (
              <div className="flex flex-col items-center">
                <CloudUpload className="w-12 h-12 text-blue-500 animate-pulse mb-4" />
                <p className="text-gray-600">جاري رفع الملف...</p>
              </div>
            ) : cvUrl ? (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-green-500 mb-4" />
                <p className="text-green-600 mb-2">✓ تم رفع السيرة الذاتية</p>
                <a 
                  href={`http://localhost:8000${cvUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  عرض الملف المرفوع
                </a>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileSelect();
                  }}
                >
                  استبدال الملف
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">انقر هنا لاختيار ملف</p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX (الحد الأقصى 5MB)</p>
                <Button variant="outline" className="mt-4" disabled={uploading}>
                  اختر ملف
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>طلبات التوظيف الأخيرة</CardTitle>
              <CardDescription>تتبع حالة طلباتك المقدمة</CardDescription>
            </div>
            <Link to="/home/graduates/applications">
              <Button variant="outline" size="sm">عرض الكل</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>لا توجد طلبات تقديم حتى الآن</p>
              <Link to="/home/graduates/jobs">
                <Button className="mt-4" variant="outline">تصفح الوظائف</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{app.title}</h3>
                    <p className="text-sm text-gray-600">{app.company_name}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(app.applied_at).toLocaleDateString('ar')}</p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
