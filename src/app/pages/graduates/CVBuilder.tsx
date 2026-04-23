import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Plus, Trash2, Save } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

interface Experience {
  id: number;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  id: number;
  degree: string;
  institution: string;
  year: string;
}

export function CVBuilder() {
  const [personalInfo, setPersonalInfo] = useState({
    location: '',
    bio: '',
    skills: '',
    major: '',
    graduation_year: '',
    gpa: ''
  });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const userId = localStorage.getItem('user_id') || '1';

  useEffect(() => {
    fetchCV();
  }, []);

  const fetchCV = async () => {
    try {
      const response = await fetch(`${API_URL}/cv?graduate_id=${userId}`);
      const data = await response.json();
      if (data.success && data.data) {
        setPersonalInfo({
          location: data.data.location || '',
          bio: data.data.bio || '',
          skills: data.data.skills || '',
          major: data.data.major || '',
          graduation_year: data.data.graduation_year || '',
          gpa: data.data.gpa || ''
        });
        setExperiences(data.data.experiences || []);
        setEducation(data.data.education || []);
      }
    } catch (error) {
      console.error('Error fetching CV:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCV = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/cv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          graduate_id: userId,
          location: personalInfo.location,
          bio: personalInfo.bio,
          skills: personalInfo.skills,
          major: personalInfo.major,
          graduation_year: personalInfo.graduation_year,
          gpa: personalInfo.gpa,
          experiences: experiences,
          education: education
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('تم حفظ السيرة الذاتية بنجاح!');
      } else {
        alert('حدث خطأ في حفظ السيرة الذاتية: ' + (data.error || ''));
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      alert('حدث خطأ في الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now(), title: '', company: '', duration: '', description: '' }]);
  };

  const updateExperience = (id: number, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const removeExperience = (id: number) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    setEducation([...education, { id: Date.now(), degree: '', institution: '', year: '' }]);
  };

  const updateEducation = (id: number, field: keyof Education, value: string) => {
    setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  const removeEducation = (id: number) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">بناء السيرة الذاتية</h1>
          <p className="text-gray-600 mt-2">أنشئ سيرة ذاتية احترافية متوافقة مع نظام ATS</p>
        </div>
        <Button onClick={saveCV} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ السيرة الذاتية'}
        </Button>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الشخصية</CardTitle>
          <CardDescription>أدخل بياناتك الأساسية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>الموقع</Label>
            <Input 
              placeholder="مثال: الرياض، المملكة العربية السعودية"
              value={personalInfo.location}
              onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>نبذة مختصرة</Label>
            <Textarea 
              placeholder="اكتب نبذة مختصرة عن نفسك..."
              rows={4}
              value={personalInfo.bio}
              onChange={(e) => setPersonalInfo({...personalInfo, bio: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>المهارات (افصل بينها بفاصلة)</Label>
            <Input 
              placeholder="مثال: JavaScript, React, Node.js, SQL"
              value={personalInfo.skills}
              onChange={(e) => setPersonalInfo({...personalInfo, skills: e.target.value})}
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>التخصص</Label>
              <Input 
                placeholder="مثال: علوم حاسب"
                value={personalInfo.major}
                onChange={(e) => setPersonalInfo({...personalInfo, major: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>سنة التخرج</Label>
              <Input 
                type="number"
                placeholder="مثال: 2023"
                value={personalInfo.graduation_year}
                onChange={(e) => setPersonalInfo({...personalInfo, graduation_year: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>المعدل التراكمي</Label>
              <Input 
                type="number"
                step="0.01"
                placeholder="مثال: 4.5"
                value={personalInfo.gpa}
                onChange={(e) => setPersonalInfo({...personalInfo, gpa: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>الخبرات العملية</CardTitle>
              <CardDescription>أضف خبراتك المهنية</CardDescription>
            </div>
            <Button onClick={addExperience} variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة خبرة
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {experiences.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد خبرات مضافة. اضغط "إضافة خبرة" للبدء.</p>
          ) : (
            experiences.map((exp, index) => (
              <div key={exp.id} className="border rounded-lg p-4 space-y-4 relative">
                <div className="absolute top-2 left-2">
                  <Button
                    onClick={() => removeExperience(exp.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <h4 className="font-semibold text-lg mb-2">خبرة {index + 1}</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>المسمى الوظيفي</Label>
                    <Input 
                      placeholder="مثال: مطور برمجيات"
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم الشركة</Label>
                    <Input 
                      placeholder="مثال: شركة التقنية"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>الفترة الزمنية</Label>
                  <Input 
                    placeholder="مثال: يناير 2020 - ديسمبر 2022"
                    value={exp.duration}
                    onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الوصف</Label>
                  <Textarea 
                    placeholder="اذكر مهامك وإنجازاتك..."
                    rows={3}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>التعليم</CardTitle>
              <CardDescription>أضف مؤهلاتك العلمية</CardDescription>
            </div>
            <Button onClick={addEducation} variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة مؤهل
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {education.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد مؤهلات مضافة. اضغط "إضافة مؤهل" للبدء.</p>
          ) : (
            education.map((edu, index) => (
              <div key={edu.id} className="border rounded-lg p-4 space-y-4 relative">
                <div className="absolute top-2 left-2">
                  <Button
                    onClick={() => removeEducation(edu.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <h4 className="font-semibold text-lg mb-2">مؤهل {index + 1}</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الدرجة العلمية</Label>
                    <Input 
                      placeholder="مثال: بكالوريوس علوم حاسب"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>المؤسسة التعليمية</Label>
                    <Input 
                      placeholder="مثال: جامعة الملك سعود"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>سنة التخرج</Label>
                  <Input 
                    placeholder="مثال: 2023"
                    value={edu.year}
                    onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={saveCV} disabled={saving} className="flex-1" size="lg">
          {saving ? 'جاري الحفظ...' : 'حفظ السيرة الذاتية'}
        </Button>
      </div>
    </div>
  );
}
