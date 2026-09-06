import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AlertCircle, Briefcase, CheckCircle2, DollarSign, Loader2, MapPin, Save } from 'lucide-react';
import { API_URL } from '../../../lib/api';
import { trackEvent } from '../../../lib/gtm';

export function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'active' | 'draft' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    job_type: 'fulltime',
    salary_range: '',
    description: '',
    requirements: '',
    skills: '',
  });

  const employerId = localStorage.getItem('user_id') || '3';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const status = submitter?.value === 'draft' ? 'draft' : 'active';

    setSubmitStatus(status);
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.title || !formData.location || !formData.description) {
      setError('الرجاء ملء جميع الحقول المطلوبة');
      setLoading(false);
      return;
    }

    const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];

    const payload = {
      employer_id: parseInt(employerId),
      title: formData.title,
      department: formData.department,
      location: formData.location,
      job_type: formData.job_type,
      salary_range: formData.salary_range,
      description: formData.description,
      requirements: formData.requirements,
      skills: skillsArray,
      status
    };

    try {
      const response = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        trackEvent(status === 'active' ? 'job_published' : 'job_draft_saved', {
          employer_id: parseInt(employerId),
          job_type: formData.job_type,
        });
        setSuccess(status === 'active' ? 'تم نشر الوظيفة بنجاح' : 'تم حفظ الوظيفة كمسودة');
        window.setTimeout(() => navigate('/home/employers/manage-jobs'), 700);
      } else {
        setError(data.error || 'فشل نشر الوظيفة');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
      setSubmitStatus(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">نشر وظيفة جديدة</h1>
          <p className="mt-2 text-slate-600">أضف إعلان وظيفي واضح وسهل التقديم</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-950">المعلومات الأساسية</CardTitle>
            <CardDescription>تفاصيل الوظيفة التي تظهر للمرشحين</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>المسمى الوظيفي *</Label>
              <div className="relative">
                <Briefcase className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input 
                  required
                  placeholder="مثال: مطور Full Stack" 
                  className="h-11 pr-10"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>القسم</Label>
                <Input 
                  placeholder="مثال: تقنية المعلومات"
                  className="h-11"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>نوع الوظيفة</Label>
                <Select value={formData.job_type} onValueChange={(v) => setFormData({...formData, job_type: v})}>
                  <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fulltime">دوام كامل</SelectItem>
                    <SelectItem value="parttime">دوام جزئي</SelectItem>
                    <SelectItem value="contract">عقد</SelectItem>
                    <SelectItem value="remote">عن بعد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الموقع *</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input 
                    required
                    placeholder="مثال: الرياض" 
                    className="h-11 pr-10"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>نطاق الراتب</Label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input 
                    placeholder="مثال: 8,000 - 12,000 ريال"
                    className="h-11 pr-10"
                    value={formData.salary_range}
                    onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>الوصف الوظيفي *</Label>
              <Textarea 
                required
                placeholder="اكتب وصفاً تفصيلياً للوظيفة والمهام المطلوبة..."
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>المتطلبات</Label>
              <Textarea 
                placeholder="اذكر المتطلبات الأساسية للوظيفة..."
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>المهارات المطلوبة (افصل بينها بفاصلة)</Label>
              <Input 
                placeholder="مثال: JavaScript, React, Node.js, SQL"
                className="h-11"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <Button type="button" variant="outline" className="h-11 flex-1" size="lg" onClick={() => navigate('/home/employers/manage-jobs')} disabled={loading}>
            إلغاء
          </Button>
          <Button type="submit" name="status" value="draft" variant="outline" className="h-11 flex-1 gap-2" size="lg" disabled={loading}>
            {loading && submitStatus === 'draft' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {loading && submitStatus === 'draft' ? 'جاري الحفظ...' : 'حفظ كمسودة'}
          </Button>
          <Button type="submit" name="status" value="active" className="h-11 flex-1 gap-2 bg-slate-950 hover:bg-slate-800" size="lg" disabled={loading}>
            {loading && submitStatus === 'active' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {loading && submitStatus === 'active' ? 'جاري النشر...' : 'نشر الوظيفة'}
          </Button>
        </div>
      </form>
    </div>
  );
}
