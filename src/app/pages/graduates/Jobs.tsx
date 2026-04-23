import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

export function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/jobs`);
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

  const applyToJob = async (jobId) => {
    const graduateId = localStorage.getItem('user_id') || 1;
    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, graduate_id: graduateId })
      });
      const data = await response.json();
      if (data.success) {
        alert('تم تقديم طلبك بنجاح!');
      }
    } catch (error) {
      console.error('Error applying:', error);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الوظائف المتاحة</h1>
        <p className="text-gray-600 mt-2">تصفح الوظائف المتاحة وقدم طلبك</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث عن وظيفة، شركة، أو موقع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button>بحث</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <p className="text-sm text-gray-600">عرض {filteredJobs.length} وظيفة</p>
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedJob === job.id ? 'border-blue-500 shadow-md' : ''
              }`}
              onClick={() => setSelectedJob(job.id)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <CardDescription>{job.company_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  {job.job_type === 'fulltime' ? 'دوام كامل' : job.job_type}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {new Date(job.posted_at).toLocaleDateString('ar')}
                </div>
                <Badge variant="secondary" className="mt-2">{job.salary_range}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedJob ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {jobs.find(j => j.id === selectedJob)?.title}
                    </CardTitle>
                    <CardDescription className="text-lg mt-1">
                      {jobs.find(j => j.id === selectedJob)?.company_name}
                    </CardDescription>
                  </div>
                  <Button onClick={() => applyToJob(selectedJob)}>قدم الآن</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">الموقع</p>
                      <p className="font-semibold">{jobs.find(j => j.id === selectedJob)?.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">نوع الوظيفة</p>
                      <p className="font-semibold">{jobs.find(j => j.id === selectedJob)?.job_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">الراتب</p>
                      <p className="font-semibold">{jobs.find(j => j.id === selectedJob)?.salary_range}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">الوصف الوظيفي</h3>
                  <p className="text-gray-700">{jobs.find(j => j.id === selectedJob)?.description}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">اختر وظيفة لعرض التفاصيل</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
