import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  TrendingUp,
  Search,
  MoreVertical,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Edit,
  Plus,
  UserPlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

const API_URL = 'http://localhost:8000/api';

interface Stats {
  total_users: number;
  total_graduates: number;
  total_employers: number;
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
}

interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  user_type: string;
  is_active: boolean;
  created_at: string;
}

interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  status: string;
  applicants_count: number;
}

interface Company {
  id: number;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  sector: string;
  employee_count: string;
  is_verified: boolean;
  is_active: boolean;
}

interface Graduate {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  major: string;
  graduation_year: number;
  gpa: number;
  location: string;
  is_active: boolean;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    total_users: 0, total_graduates: 0, total_employers: 0,
    total_jobs: 0, active_jobs: 0, total_applications: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ full_name: '', email: '', phone: '', password: '' });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, usersRes, jobsRes, companiesRes, graduatesRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`),
        fetch(`${API_URL}/admin/users`),
        fetch(`${API_URL}/admin/jobs`),
        fetch(`${API_URL}/admin/companies`),
        fetch(`${API_URL}/admin/graduates`)
      ]);
      
      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const jobsData = await jobsRes.json();
      const companiesData = await companiesRes.json();
      const graduatesData = await graduatesRes.json();
      
      if (statsData.success) setStats(statsData.data);
      if (usersData.success) setUsers(usersData.data);
      if (jobsData.success) setJobs(jobsData.data);
      if (companiesData.success) setCompanies(companiesData.data);
      if (graduatesData.success) setGraduates(graduatesData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      });
      const data = await response.json();
      if (data.success) {
        alert('تم إضافة الأدمن بنجاح');
        setShowAddAdmin(false);
        setNewAdmin({ full_name: '', email: '', phone: '', password: '' });
        fetchAllData();
      } else {
        alert(data.error || 'حدث خطأ');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('حدث خطأ في إضافة الأدمن');
    }
  };

  const updateJobStatus = async (jobId: number, status: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setJobs(jobs.map(j => j.id === jobId ? { ...j, status } : j));
        alert('تم تحديث حالة الوظيفة');
      }
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const deleteJob = async (jobId: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) {
      try {
        const response = await fetch(`${API_URL}/admin/jobs/${jobId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
          setJobs(jobs.filter(j => j.id !== jobId));
          alert('تم حذف الوظيفة');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const updateUserStatus = async (userId: number, isActive: boolean) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive })
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, is_active: isActive } : u));
        alert(`تم ${isActive ? 'تفعيل' : 'تعطيل'} المستخدم`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        const response = await fetch(`${API_URL}/admin/users/${userId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
          setUsers(users.filter(u => u.id !== userId));
          alert('تم حذف المستخدم');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(u => u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredJobs = jobs.filter(j => j.title?.toLowerCase().includes(searchTerm.toLowerCase()) || j.company_name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCompanies = companies.filter(c => c.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.email?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredGraduates = graduates.filter(g => g.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || g.email?.toLowerCase().includes(searchTerm.toLowerCase()));

  const getRoleBadge = (role: string) => {
    const variants: Record<string, string> = { 'admin': 'bg-purple-100 text-purple-800', 'employer': 'bg-blue-100 text-blue-800', 'graduate': 'bg-green-100 text-green-800' };
    const texts: Record<string, string> = { 'admin': 'مدير', 'employer': 'جهة توظيف', 'graduate': 'خريج' };
    return <Badge className={variants[role] || 'bg-gray-100'}>{texts[role] || role}</Badge>;
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center"><Shield className="w-7 h-7 text-white" /></div>
          <div><h1 className="text-3xl font-bold text-gray-900">لوحة التحكم الإدارية</h1><p className="text-gray-600">إدارة شاملة للمنصة</p></div>
        </div>
        <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
          <DialogTrigger asChild><Button className="gap-2"><UserPlus className="w-4 h-4" />إضافة أدمن جديد</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>إضافة أدمن جديد</DialogTitle></DialogHeader>
            <div className="space-y-4"><div><Label>الاسم الكامل</Label><Input value={newAdmin.full_name} onChange={(e) => setNewAdmin({...newAdmin, full_name: e.target.value})} /></div>
            <div><Label>البريد الإلكتروني</Label><Input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} /></div>
            <div><Label>رقم الهاتف</Label><Input value={newAdmin.phone} onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})} /></div>
            <div><Label>كلمة المرور</Label><Input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})} /></div>
            <Button onClick={createAdmin} className="w-full">إضافة</Button></div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{stats.total_users}</div><p className="text-xs">مستخدم</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{stats.total_graduates}</div><p className="text-xs">خريج</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{stats.total_employers}</div><p className="text-xs">شركة</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{stats.total_jobs}</div><p className="text-xs">وظيفة</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{stats.active_jobs}</div><p className="text-xs">نشطة</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{stats.total_applications}</div><p className="text-xs">تقديم</p></CardContent></Card>
      </div>

      <div className="relative"><Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><Input placeholder="بحث..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" /></div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5"><TabsTrigger value="users">المستخدمين</TabsTrigger><TabsTrigger value="jobs">الوظائف</TabsTrigger><TabsTrigger value="companies">الشركات</TabsTrigger><TabsTrigger value="graduates">الخريجين</TabsTrigger><TabsTrigger value="stats">إحصائيات</TabsTrigger></TabsList>

        <TabsContent value="users"><Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>الاسم</TableHead><TableHead>البريد</TableHead><TableHead>النوع</TableHead><TableHead>الحالة</TableHead><TableHead>الإجراءات</TableHead></TableRow></TableHeader><TableBody>{filteredUsers.map(u => <TableRow key={u.id}><TableCell>{u.full_name}</TableCell><TableCell>{u.email}</TableCell><TableCell>{getRoleBadge(u.user_type)}</TableCell><TableCell><Badge className={u.is_active ? 'bg-green-100' : 'bg-red-100'}>{u.is_active ? 'نشط' : 'غير نشط'}</Badge></TableCell><TableCell><div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => updateUserStatus(u.id, !u.is_active)}>{u.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}</Button><Button variant="ghost" size="sm" className="text-red-600" onClick={() => deleteUser(u.id)}><Trash2 className="w-4 h-4" /></Button></div></TableCell></TableRow>)}</TableBody></Table></CardContent></Card></TabsContent>

        <TabsContent value="jobs"><Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>العنوان</TableHead><TableHead>الشركة</TableHead><TableHead>الموقع</TableHead><TableHead>الحالة</TableHead><TableHead>الإجراءات</TableHead></TableRow></TableHeader><TableBody>{filteredJobs.map(j => <TableRow key={j.id}><TableCell>{j.title}</TableCell><TableCell>{j.company_name}</TableCell><TableCell>{j.location}</TableCell><TableCell><Badge className={j.status === 'active' ? 'bg-green-100' : 'bg-red-100'}>{j.status === 'active' ? 'نشط' : 'مغلق'}</Badge></TableCell><TableCell><div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => updateJobStatus(j.id, j.status === 'active' ? 'closed' : 'active')}>{j.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}</Button><Button variant="ghost" size="sm" className="text-red-600" onClick={() => deleteJob(j.id)}><Trash2 className="w-4 h-4" /></Button></div></TableCell></TableRow>)}</TableBody></Table></CardContent></Card></TabsContent>

        <TabsContent value="companies"><Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>اسم الشركة</TableHead><TableHead>البريد</TableHead><TableHead>القطاع</TableHead><TableHead>الموظفين</TableHead><TableHead>الحالة</TableHead></TableRow></TableHeader><TableBody>{filteredCompanies.map(c => <TableRow key={c.id}><TableCell>{c.company_name}</TableCell><TableCell>{c.email}</TableCell><TableCell>{c.sector || '-'}</TableCell><TableCell>{c.employee_count || '-'}</TableCell><TableCell><Badge className={c.is_active ? 'bg-green-100' : 'bg-red-100'}>{c.is_active ? 'نشط' : 'غير نشط'}</Badge></TableCell></TableRow>)}</TableBody></Table></CardContent></Card></TabsContent>

        <TabsContent value="graduates"><Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>الاسم</TableHead><TableHead>البريد</TableHead><TableHead>التخصص</TableHead><TableHead>سنة التخرج</TableHead><TableHead>المعدل</TableHead></TableRow></TableHeader><TableBody>{filteredGraduates.map(g => <TableRow key={g.id}><TableCell>{g.full_name}</TableCell><TableCell>{g.email}</TableCell><TableCell>{g.major || '-'}</TableCell><TableCell>{g.graduation_year || '-'}</TableCell><TableCell>{g.gpa || '-'}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card></TabsContent>

        <TabsContent value="stats"><Card><CardContent className="pt-6"><div className="space-y-4"><div className="flex justify-between p-3 bg-gray-50 rounded"><span>إجمالي المستخدمين</span><span className="font-bold">{stats.total_users}</span></div><div className="flex justify-between p-3 bg-gray-50 rounded"><span>الخريجين</span><span className="font-bold">{stats.total_graduates}</span></div><div className="flex justify-between p-3 bg-gray-50 rounded"><span>الشركات</span><span className="font-bold">{stats.total_employers}</span></div><div className="flex justify-between p-3 bg-gray-50 rounded"><span>الوظائف</span><span className="font-bold">{stats.total_jobs}</span></div><div className="flex justify-between p-3 bg-gray-50 rounded"><span>الوظائف النشطة</span><span className="font-bold">{stats.active_jobs}</span></div><div className="flex justify-between p-3 bg-gray-50 rounded"><span>إجمالي التقديمات</span><span className="font-bold">{stats.total_applications}</span></div></div></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}
