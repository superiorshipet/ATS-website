import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { GraduationCap, Building2, Mail, Lock, User, Phone } from 'lucide-react';
import { API_URL } from '../../lib/api';

export function Auth() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('graduate');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      console.log('📡 Login API URL:', `${API_URL}/auth/login`);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password')
        })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user_id', data.data.id);
        localStorage.setItem('user_type', data.data.user_type);
        localStorage.setItem('user_name', data.data.name);
        navigate('/home');
      } else {
        alert('فشل تسجيل الدخول: ' + (data.error || 'بيانات غير صحيحة'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      console.log('📡 Register API URL:', `${API_URL}/auth/register`);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.get('full_name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          password: formData.get('password'),
          user_type: userType
        })
      });
      const data = await response.json();
      
      if (data.success) {
        alert('تم إنشاء الحساب بنجاح! الرجاء تسجيل الدخول');
      } else {
        alert('فشل إنشاء الحساب: ' + (data.error || 'حدث خطأ'));
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ATS-websit</h1>
          <p className="text-gray-600 mt-2">نظام تتبع المتقدمين المتطور</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">مرحباً بك</CardTitle>
            <CardDescription className="text-center">
              سجل الدخول أو أنشئ حساب جديد للبدء
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="login-email" name="email" type="email" placeholder="example@email.com" className="pr-10" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="login-password" name="password" type="password" placeholder="••••••••" className="pr-10" required />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label>نوع الحساب</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button type="button" variant={userType === 'graduate' ? 'default' : 'outline'} className="w-full h-auto py-4 flex flex-col gap-2" onClick={() => setUserType('graduate')}>
                        <GraduationCap className="w-6 h-6" />
                        <span>خريج</span>
                      </Button>
                      <Button type="button" variant={userType === 'employer' ? 'default' : 'outline'} className="w-full h-auto py-4 flex flex-col gap-2" onClick={() => setUserType('employer')}>
                        <Building2 className="w-6 h-6" />
                        <span>جهة توظيف</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-name">{userType === 'graduate' ? 'الاسم الكامل' : 'اسم الشركة'}</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="register-name" name="full_name" type="text" className="pr-10" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="register-email" name="email" type="email" className="pr-10" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="register-phone" name="phone" type="tel" className="pr-10" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="register-password" name="password" type="password" className="pr-10" required />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
