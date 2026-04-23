import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Mail, Phone, Calendar, Edit, Camera, Save, X, Shield } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

interface ProfileData {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  user_type: string;
  avatar_url?: string;
  joined_date?: string;
}

export function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ProfileData>>({});
  const [uploading, setUploading] = useState(false);

  const userId = localStorage.getItem('user_id') || '1';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/profile?user_id=${userId}&user_type=admin`);
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
        body: JSON.stringify({ ...editForm, user_id: userId, user_type: 'admin' })
      });
      const data = await response.json();
      if (data.success) {
        setProfile(editForm as ProfileData);
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
        setProfile(prev => prev ? { ...prev, avatar_url: data.avatar_url } : null);
        alert('تم تحديث الصورة بنجاح');
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
        <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
        <p className="text-gray-600 mt-2">إدارة معلومات حساب الأدمن</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url ? `http://localhost:8000${profile.avatar_url}` : ''} />
                <AvatarFallback className="text-2xl bg-purple-100 text-purple-600">
                  {profile.full_name?.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 p-1 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
              {uploading && <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"><div className="text-white text-xs">جاري...</div></div>}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">{profile.full_name}</h2>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      أدمن
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">مدير النظام</p>
                </div>
                <Button variant="outline" className="gap-2" onClick={() => setEditing(!editing)}>
                  <Edit className="w-4 h-4" />
                  {editing ? 'إلغاء' : 'تعديل'}
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  {profile.phone || 'رقم الهاتف غير مضاف'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  عضو منذ {profile.joined_date}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {editing && (
        <Card>
          <CardHeader>
            <CardTitle>تحديث المعلومات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم الكامل</Label>
                <Input value={editForm.full_name || ''} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input value={editForm.email || ''} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>رقم الهاتف</Label>
              <Input value={editForm.phone || ''} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
            </div>
            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave} className="gap-2 bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4" />
                حفظ التغييرات
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)} className="gap-2">
                <X className="w-4 h-4" />
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
