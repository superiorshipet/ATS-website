import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AlertCircle, ArrowLeft, Building2, CheckCircle2, Eye, EyeOff, GraduationCap, Loader2, Lock, Mail, Phone, User } from 'lucide-react';
import logo from '/src/assets/images/logo.png';
import { API_URL } from '../../lib/api';
import { trackEvent, trackPageView } from '../../lib/gtm';

export function Auth() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('graduate');
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    trackPageView('/');
  }, []);

  const redirectToHome = (type: string) => {
    const routes: Record<string, string> = {
      admin: '/home/admin',
      employer: '/home/employers',
      graduate: '/home/graduates',
    };

    navigate(routes[type] || '/home');
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const formData = new FormData(e.currentTarget);
    
    try {
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
        trackEvent('login_success', { user_type: data.data.user_type });
        redirectToHome(data.data.user_type);
      } else {
        setError(data.error || 'بيانات غير صحيحة');
      }
    } catch {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const formData = new FormData(e.currentTarget);
    const password = String(formData.get('password') || '');

    if (password.length < 6) {
      setError('كلمة المرور يجب ألا تقل عن 6 أحرف');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.get('full_name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          password,
          user_type: userType
        })
      });

      const data = await response.json();

      if (data.success) {
        trackEvent('register_success', { user_type: userType });
        setSuccess('تم إنشاء الحساب بنجاح. يمكنك تسجيل الدخول الآن');
        setActiveTab('login');
        e.currentTarget.reset();
      } else {
        setError(data.error || 'حدث خطأ');
      }
    } catch {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3fb] text-slate-950" dir="rtl">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-4 py-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden lg:block">
          <div className="space-y-7">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 shadow-lg">
              <img
                src={logo}
                alt="توظيف"
                className="h-11 w-11 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-emerald-700">منصة توظيف</p>
              <h1 className="max-w-xl text-5xl font-bold leading-tight text-slate-950">
                دخول أسرع وتجربة أوضح لكل مستخدم
              </h1>
              <p className="max-w-lg text-lg leading-8 text-slate-600">
                تابع الوظائف، الطلبات، والسير الذاتية من مكان واحد حسب نوع حسابك.
              </p>
            </div>
            <div className="grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm">
                <GraduationCap className="mb-3 h-6 w-6 text-emerald-700" />
                <p className="text-sm font-semibold">خريجين</p>
              </div>
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm">
                <Building2 className="mb-3 h-6 w-6 text-sky-700" />
                <p className="text-sm font-semibold">شركات</p>
              </div>
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm">
                <CheckCircle2 className="mb-3 h-6 w-6 text-violet-700" />
                <p className="text-sm font-semibold">إدارة</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-7 text-center lg:hidden">
              <div className="mb-4 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950 shadow-lg">
                  <img
                    src={logo}
                    alt="توظيف"
                    className="h-14 w-14 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-950">توظيف</h1>
              <p className="mt-2 text-slate-600">فرص عمل بلا حدود</p>
            </div>

            <Card className="overflow-hidden border-slate-200/80 bg-white/90 shadow-2xl backdrop-blur">
              <CardHeader className="space-y-2 pb-5 text-center">
                <div className="hidden justify-center lg:flex">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-950">
                    <img
                      src={logo}
                      alt="توظيف"
                      className="h-10 w-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                <CardTitle className="text-2xl text-slate-950">مرحباً بك</CardTitle>
                <CardDescription>
                  سجل الدخول أو أنشئ حساب جديد للبدء
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <Tabs value={activeTab} onValueChange={(value) => {
                  setActiveTab(value);
                  setError('');
                  setSuccess('');
                }} className="w-full">
                  <TabsList className="mb-6 grid h-11 w-full grid-cols-2 rounded-md bg-slate-100 p-1">
                    <TabsTrigger value="login" className="rounded-sm">تسجيل الدخول</TabsTrigger>
                    <TabsTrigger value="register" className="rounded-sm">إنشاء حساب</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">البريد الإلكتروني</Label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input id="login-email" name="email" type="email" placeholder="example@email.com" className="h-11 pr-10" autoComplete="email" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">كلمة المرور</Label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input id="login-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="h-11 px-10" autoComplete="current-password" required />
                          <button
                            type="button"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button type="submit" className="h-11 w-full gap-2 bg-slate-950 hover:bg-slate-800" size="lg" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4" />}
                        {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label>نوع الحساب</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            className={`rounded-lg border p-4 text-right transition ${userType === 'graduate' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                            onClick={() => setUserType('graduate')}
                          >
                            <GraduationCap className="mb-2 h-6 w-6" />
                            <span className="block text-sm font-semibold">باحث عن عمل</span>
                          </button>
                          <button
                            type="button"
                            className={`rounded-lg border p-4 text-right transition ${userType === 'employer' ? 'border-sky-500 bg-sky-50 text-sky-900' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                            onClick={() => setUserType('employer')}
                          >
                            <Building2 className="mb-2 h-6 w-6" />
                            <span className="block text-sm font-semibold">شريك أعمال</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-name">{userType === 'graduate' ? 'الاسم الكامل' : 'اسم الشركة'}</Label>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input id="register-name" name="full_name" type="text" className="h-11 pr-10" autoComplete="name" required />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="register-email">البريد الإلكتروني</Label>
                          <div className="relative">
                            <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input id="register-email" name="email" type="email" className="h-11 pr-10" autoComplete="email" required />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="register-phone">رقم الهاتف</Label>
                          <div className="relative">
                            <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input id="register-phone" name="phone" type="tel" className="h-11 pr-10" autoComplete="tel" required />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">كلمة المرور</Label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input id="register-password" name="password" type={showPassword ? 'text' : 'password'} className="h-11 px-10" autoComplete="new-password" required />
                          <button
                            type="button"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button type="submit" className="h-11 w-full gap-2 bg-slate-950 hover:bg-slate-800" size="lg" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
