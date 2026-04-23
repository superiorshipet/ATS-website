import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Mail, Phone, Calendar, Edit, Camera, Save, X, Building2, Globe, Users } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

export function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  const userId = localStorage.getItem('user_id') || '3';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/profile?user_id=${userId}&user_type=employer`);
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
        setEditForm(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editForm, user_id: userId, user_type: 'employer' })
      });
      const data = await response.json();
      if (data.success) {
        setProfile(editForm);
        setEditing(false);
        alert('تم حفظ التغييرات بنجاح');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('حدث خطأ في حفظ التغييرات');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('user_id', userId);

    try {
      const response = await fetch(`${API_URL}/profile/avatar`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setProfile((prev: any) => ({ ...prev, avatar_url: data.avatar_url }));
        alert('تم تحديث الشعار بنجاح');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('حدث خطأ في رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8">لم يتم العثور على الملف الشخصي</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي للشركة</h1>
        <p className="text-gray-600 mt-2">إدارة معلومات الشركة</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url ? `http://localhost:8000${profile.avatar_url}` : ''} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                  {profile.company_name?.substring(0, 2) || profile.full_name?.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
              {uploading && <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"><div className="text-white text-xs">جاري...</div></div>}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile.company_name || profile.full_name}</h2>
                  <p className="text-gray-600 mt-1">{profile.bio || 'لا توجد نبذة تعريفية'}</p>
                  {profile.is_verified && (
                    <Badge className="mt-2 bg-green-100 text-green-800">موثق</Badge>
                  )}
                </div>
                <Button variant="outline" className="gap-2" onClick={() => setEditing(!editing)}>
                  <Edit className="w-4 h-4" />
                  {editing ? 'إلغاء' : 'تعديل'}
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4" />{profile.email}</div>
                <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" />{profile.phone || 'رقم الهاتف غير مضاف'}</div>
                {profile.sector && <div className="flex items-center gap-2 text-gray-600"><Building2 className="w-4 h-4" />{profile.sector}</div>}
                {profile.employee_count && <div className="flex items-center gap-2 text-gray-600"><Users className="w-4 h-4" />{profile.employee_count} موظف</div>}
                {profile.website && <div className="flex items-center gap-2 text-gray-600"><Globe className="w-4 h-4" /><a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.website}</a></div>}
                <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4" />عضو منذ {profile.joined_date}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {editing && (
        <Card>
          <CardHeader>
            <CardTitle>تحديث معلومات الشركة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>اسم الشركة</Label><Input value={editForm.company_name || editForm.full_name || ''} onChange={(e) => setEditForm({...editForm, company_name: e.target.value, full_name: e.target.value})} /></div>
              <div className="space-y-2"><Label>البريد الإلكتروني</Label><Input value={editForm.email || ''} onChange={(e) => setEditForm({...editForm, email: e.target.value})} /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>رقم الهاتف</Label><Input value={editForm.phone || ''} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} /></div>
              <div className="space-y-2"><Label>القطاع</Label><Input value={editForm.sector || ''} onChange={(e) => setEditForm({...editForm, sector: e.target.value})} /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>عدد الموظفين</Label><Input value={editForm.employee_count || ''} onChange={(e) => setEditForm({...editForm, employee_count: e.target.value})} /></div>
              <div className="space-y-2"><Label>الموقع الإلكتروني</Label><Input value={editForm.website || ''} onChange={(e) => setEditForm({...editForm, website: e.target.value})} /></div>
            </div>
            <div className="space-y-2"><Label>نبذة عن الشركة</Label><Textarea rows={4} value={editForm.bio || ''} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} /></div>
            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" />حفظ التغييرات</Button>
              <Button variant="outline" onClick={() => setEditing(false)} className="gap-2"><X className="w-4 h-4" />إلغاء</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
