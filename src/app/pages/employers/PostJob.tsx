import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Briefcase, MapPin, DollarSign, Save } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

export function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
  });

  const employerId = localStorage.getItem('user_id') || '3';

  const handleSubmit = async (e: React.FormEvent, status: 'active' | 'draft' = 'active') => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      status: status
    };

    try {
      const response = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(status === 'active' ? 'تم نشر الوظيفة بنجاح!' : 'تم حفظ الوظيفة كمسودة');
        navigate('/home/employers/manage-jobs');
      } else {
        setError(data.error || 'فشل نشر الوظيفة');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">نشر وظيفة جديدة</h1>
          <p className="text-gray-600 mt-2">أضف إعلان وظيفي للعثور على أفضل المرشحين</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={(e) => handleSubmit(e, 'draft')} disabled={loading}>
          <Save className="w-4 h-4" />
          {loading ? 'جاري الحفظ...' : 'حفظ كمسودة'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, 'active')}>
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
                  placeholder="مثال: مطور Full Stack" 
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
                  placeholder="مثال: تقنية المعلومات"
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
                  <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  <Input 
                    required
                    placeholder="مثال: الرياض" 
                    className="pr-10"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>نطاق الراتب</Label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  <Input 
                    placeholder="مثال: 8,000 - 12,000 ريال"
                    className="pr-10"
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
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button type="submit" className="flex-1" size="lg" disabled={loading}>
            {loading ? 'جاري النشر...' : 'نشر الوظيفة'}
          </Button>
          <Button type="button" variant="outline" className="flex-1" size="lg" onClick={() => navigate('/home/employers/manage-jobs')}>
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  );
}
