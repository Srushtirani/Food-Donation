
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DonationList from '@/components/donations/DonationList';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DonationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Donations</h1>
          <p className="text-gray-500">
            Browse and manage food donations
          </p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => navigate('/donations/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Donation
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Donations</TabsTrigger>
          <TabsTrigger value="mine">My Donations</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <DonationList filter="all" />
        </TabsContent>
        <TabsContent value="mine" className="mt-6">
          <DonationList filter="mine" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DonationsPage;
