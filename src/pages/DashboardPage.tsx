
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentDonations from '@/components/dashboard/RecentDonations';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, User, Calendar, Settings } from 'lucide-react';

const DashboardPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {user?.name}!
          </p>
        </div>
        <Button onClick={() => navigate('/donations/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Donation
        </Button>
      </div>
      
      <DashboardStats showUserStats={true} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentDonations showUserDonations={true} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/donations/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Donate Food
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/schedule')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Schedule
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/profile')}
              >
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Button>
              {user?.role === 'admin' && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/volunteers')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Volunteer
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Active Donations</h3>
            <p className="text-sm text-gray-500 mb-2">Track your active donations in real-time:</p>
            <Button 
              variant="default" 
              className="w-full mt-2"
              onClick={() => navigate('/donations')}
            >
              <MapPin className="mr-2 h-4 w-4" />
              View Donations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
