
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api, DonationItem } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Package, Clock, User, Phone, Truck, Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const DonationDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [donation, setDonation] = useState<DonationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchDonation();
    }
  }, [id]);

  const fetchDonation = async () => {
    try {
      setLoading(true);
      const data = await api.getDonationById(id!);
      
      if (!data) {
        toast({
          title: 'Error',
          description: 'Donation not found',
          variant: 'destructive',
        });
        navigate('/donations');
        return;
      }
      
      setDonation(data);
    } catch (error) {
      console.error('Error fetching donation:', error);
      toast({
        title: 'Error',
        description: 'Failed to load donation details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: DonationItem['status']) => {
    if (!id) return;
    
    try {
      await api.updateDonationStatus(id, status);
      fetchDonation();
      toast({
        title: 'Success',
        description: `Donation status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating donation status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update donation status',
        variant: 'destructive',
      });
    }
  };

  const requestPickup = () => {
    toast({
      title: 'Pickup Requested',
      description: 'Pickup request has been sent to volunteers.',
    });
  };

  const registerForPickup = () => {
    toast({
      title: 'Pickup Registered',
      description: 'You have registered for this pickup.',
    });
  };

  const getStatusBadgeStyle = (status: DonationItem['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Loading donation details...</p>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Donation Not Found</h1>
        <p className="text-gray-500 mb-6">
          The donation you are looking for does not exist
        </p>
        <Button
          onClick={() => navigate('/donations')}
          variant="outline"
        >
          Return to Donations
        </Button>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isNGO = user?.role === 'ngo';
  const isVolunteer = user?.role === 'volunteer';
  const isDonor = user?.id === donation.donorId || user?.role === 'user';

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/donations')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Donations
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Donation Details</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={donation.imageUrl}
                alt={donation.foodName}
                className="object-cover w-full h-72"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{donation.foodName}</h2>
                  <p className="text-gray-500">
                    {donation.quantity} {donation.quantityUnit}
                  </p>
                </div>
                <Badge className={`ml-2 ${getStatusBadgeStyle(donation.status)}`}>
                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                </Badge>
              </div>
              
              {donation.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{donation.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium">Expiry Date</p>
                      <p className="text-gray-600">{formatDate(donation.expiryDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium">Pickup Location</p>
                      <p className="text-gray-600">{donation.pickupLocation}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Package className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium">Quantity</p>
                      <p className="text-gray-600">
                        {donation.quantity} {donation.quantityUnit}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium">Donation Date</p>
                      <p className="text-gray-600">{formatDate(donation.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Donor Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium">Donor Name</p>
                  <p className="text-gray-600">{donation.donorName}</p>
                </div>
              </div>
              
              {(isAdmin || isNGO) && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-gray-600">+1 123-456-7890</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              {isAdmin && donation.status === 'pending' && (
                <Button 
                  className="w-full"
                  onClick={() => handleStatusChange('accepted')}
                >
                  Accept Donation
                </Button>
              )}
              
              {isAdmin && donation.status === 'accepted' && (
                <Button 
                  className="w-full"
                  onClick={() => handleStatusChange('delivered')}
                >
                  Mark as Delivered
                </Button>
              )}
              
              {isNGO && donation.status === 'pending' && (
                <Button 
                  className="w-full"
                  onClick={() => requestPickup()}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Request Pickup
                </Button>
              )}
              
              {isVolunteer && donation.status === 'accepted' && (
                <Button 
                  className="w-full"
                  onClick={() => registerForPickup()}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Register for Pickup
                </Button>
              )}
              
              {isDonor && donation.status === 'pending' && (
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleStatusChange('cancelled')}
                >
                  Cancel Donation
                </Button>
              )}
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/donations/${donation.id}/track`)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Track Donation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationDetailsPage;
