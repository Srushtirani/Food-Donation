
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Edit, Save, User, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import DonorProfile from '@/components/profile/DonorProfile';
import NGOProfile from '@/components/profile/NGOProfile';
import VolunteerProfile from '@/components/profile/VolunteerProfile';
import ExtendedDonorProfile from '@/components/profile/ExtendedDonorProfile';

const ProfilePage = () => {
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
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-500">
          Manage your personal information and preferences
        </p>
      </div>
      
      {(user?.role === 'user' || !user?.role) && <ExtendedDonorProfile user={user || {id: '', name: '', email: '', role: ''}} />}
      {user?.role === 'admin' && <NGOProfile user={user} />}
      {user?.role === 'ngo' && <NGOProfile user={user} />}
      {user?.role === 'volunteer' && <VolunteerProfile user={user} />}
    </div>
  );
};

export default ProfilePage;
