
import { useNavigate } from 'react-router-dom';
import DonationForm from '@/components/donations/DonationForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DonationFormPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-4"
          onClick={() => {
            navigate('/donations');
            toast({
              title: "Navigation",
              description: "Returned to donations list",
            });
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Donations
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Donate Food</h1>
          <p className="text-gray-500">
            Fill out the form below to donate food
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <DonationForm />
      </div>
    </div>
  );
};

export default DonationFormPage;
