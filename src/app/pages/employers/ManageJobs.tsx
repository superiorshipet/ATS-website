import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Calendar,
  MapPin,
  Search,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  job_type: string;
  status: string;
  applicants_count: number;
  posted_at: string;
  deadline: string;
}

export function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const employerId = localStorage.getItem('user_id') || '3';

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/jobs?employer_id=${employerId}`);
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id: number, title: string) => {
    if (confirm(`هل أنت متأكد من حذف الوظيفة "${title}"؟`)) {
      try {
        const response = await fetch(`${API_URL}/jobs/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          setJobs(jobs.filter(job => job.id !== id));
          alert('تم حذف الوظيفة بنجاح');
        } else {
          alert('فشل حذف الوظيفة');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('حدث خطأ في حذف الوظيفة');
      }
    }
  };

  const handleViewDetails = (job: Job) => {
    // عرض تفاصيل الوظيفة
    alert(`📋 تفاصيل الوظيفة:\n\nالعنوان: ${job.title}\nالقسم: ${job.department || '-'}\nالموقع: ${job.location || '-'}\nالنوع: ${job.job_type === 'fulltime' ? 'دوام كامل' : 'دوام جزئي'}\nالحالة: ${job.status === 'active' ? 'نشط' : job.status === 'draft' ? 'مسودة' : 'مغلق'}`);
  };

  const handleViewApplicants = (jobId: number) => {
    navigate(`/home/employers/job-applicants/${jobId}`);
  };

  const handleEditJob = (jobId: number) => {
    navigate(`/home/employers/edit-job/${jobId}`);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'draft': 'bg-gray-100 text-gray-800',
      'closed': 'bg-red-100 text-red-800',
    };
    const texts: Record<string, string> = {
      'active': 'نشط',
      'draft': 'مسودة',
      'closed': 'مغلق',
    };
    return <Badge className={variants[status] || variants.draft}>{texts[status] || status}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الوظائف</h1>
          <p className="text-gray-600 mt-2">عرض وتعديل الإعلانات الوظيفية</p>
        </div>
        <Link to="/home/employers/post-job">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            وظيفة جديدة
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الوظائف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">الوظائف النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{jobs.filter(j => j.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">المسودات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{jobs.filter(j => j.status === 'draft').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">المغلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{jobs.filter(j => j.status === 'closed').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <Input placeholder="ابحث عن وظيفة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" />
            </div>
            <div className="flex gap-2">
              <Button variant={filterStatus === 'all' ? 'default' : 'outline'} onClick={() => setFilterStatus('all')}>الكل</Button>
              <Button variant={filterStatus === 'active' ? 'default' : 'outline'} onClick={() => setFilterStatus('active')}>نشط</Button>
              <Button variant={filterStatus === 'draft' ? 'default' : 'outline'} onClick={() => setFilterStatus('draft')}>مسودة</Button>
              <Button variant={filterStatus === 'closed' ? 'default' : 'outline'} onClick={() => setFilterStatus('closed')}>مغلق</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الوظائف ({filteredJobs.length})</CardTitle>
          <CardDescription>إدارة جميع الإعلانات الوظيفية</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المسمى الوظيفي</TableHead>
                <TableHead className="text-right">القسم</TableHead>
                <TableHead className="text-right">الموقع</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">المتقدمون</TableHead>
                <TableHead className="text-right">تاريخ النشر</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-semibold">{job.title}</TableCell>
                  <TableCell>{job.department || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {job.location || '-'}
                    </div>
                  </TableCell>
                  <TableCell>{job.job_type === 'fulltime' ? 'دوام كامل' : job.job_type === 'parttime' ? 'دوام جزئي' : job.job_type || '-'}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      {job.applicants_count || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {job.posted_at ? new Date(job.posted_at).toLocaleDateString('ar') : '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(job)}
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewApplicants(job.id)}
                        title="عرض المتقدمين"
                      >
                        <Users className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditJob(job.id)}
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteJob(job.id, job.title)}
                        title="حذف"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
