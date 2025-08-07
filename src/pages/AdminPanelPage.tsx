
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DonationList from '@/components/donations/DonationList';
import NGOList from '@/components/admin/NGOList';
import VolunteerManagement from '@/components/admin/VolunteerManagement';

const AdminPanelPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (user?.role !== 'admin') {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, navigate, user?.role]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-500 mb-6">
          You do not have permission to access the admin panel
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-primary hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-gray-500">
          Manage donations, NGOs, and volunteers
        </p>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="ngos">NGO Partners</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-8">
          <DashboardStats showUserStats={false} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DonationList />
            <NGOList />
          </div>
        </TabsContent>
        
        <TabsContent value="donations">
          <DonationList />
        </TabsContent>
        
        <TabsContent value="ngos">
          <NGOList />
        </TabsContent>
        
        <TabsContent value="volunteers">
          <VolunteerManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanelPage;
