import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Briefcase, MapPin, DollarSign, Save, ArrowRight } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

export function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    job_type: 'fulltime',
    salary_range: '',
    description: '',
    requirements: '',
    skills: '',
    status: 'active'
  });

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`${API_URL}/jobs/${jobId}`);
      const data = await response.json();
      if (data.success) {
        const job = data.data;
        setFormData({
          title: job.title || '',
          department: job.department || '',
          location: job.location || '',
          job_type: job.job_type || 'fulltime',
          salary_range: job.salary_range || '',
          description: job.description || '',
          requirements: job.requirements || '',
          skills: job.skills ? job.skills.replace(/[{}]/g, '').replace(/"/g, '') : '',
          status: job.status || 'active'
        });
      } else {
        setError('لم يتم العثور على الوظيفة');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('حدث خطأ في تحميل بيانات الوظيفة');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];

    try {
      const response = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          skills: skillsArray
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('تم تحديث الوظيفة بنجاح');
        navigate('/home/employers/manage-jobs');
      } else {
        setError(data.error || 'حدث خطأ في تحديث الوظيفة');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">تعديل الوظيفة</h1>
          <p className="text-gray-600 mt-2">تحديث بيانات الإعلان الوظيفي</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
            <CardDescription>تفاصيل الوظيفة الرئيسية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>المسمى الوظيفي *</Label>
              <div className="relative">
                <Briefcase className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <Input 
                  required
                  className="pr-10" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>القسم</Label>
                <Input 
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>الحالة</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="closed">مغلق</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الموقع *</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  <Input 
                    required
                    className="pr-10" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>نوع الوظيفة</Label>
                <Select value={formData.job_type} onValueChange={(v) => setFormData({...formData, job_type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fulltime">دوام كامل</SelectItem>
                    <SelectItem value="parttime">دوام جزئي</SelectItem>
                    <SelectItem value="contract">عقد</SelectItem>
                    <SelectItem value="remote">عن بعد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>نطاق الراتب</Label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <Input 
                  className="pr-10" 
                  value={formData.salary_range}
                  onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>الوصف *</Label>
              <Textarea 
                required 
                rows={6} 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>المتطلبات</Label>
              <Textarea 
                rows={4} 
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>المهارات المطلوبة (افصل بينها بفاصلة)</Label>
              <Input 
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                placeholder="مثال: PHP, JavaScript, React, SQL"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button type="submit" className="flex-1" size="lg" disabled={saving}>
            <Save className="w-4 h-4 ml-2" />
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
          <Button type="button" variant="outline" className="flex-1" size="lg" onClick={() => navigate('/home/employers/manage-jobs')}>
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  );
}
