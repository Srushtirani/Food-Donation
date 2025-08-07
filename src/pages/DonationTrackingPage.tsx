
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Truck, User, AlertCircle, Clock, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EnhancedLocationTracker from '@/components/map/EnhancedLocationTracker';
import RazorpayPayment from '@/components/payments/RazorpayPayment';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { DonationItem } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NotificationService } from '@/components/notifications/NotificationService';

const DonationTrackingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [donation, setDonation] = useState<DonationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDonation = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const donationData = await api.getDonationById(id);
        if (donationData) {
          setDonation(donationData);
        } else {
          toast({
            title: "Not Found",
            description: "Donation not found",
            variant: "destructive",
          });
          navigate('/donations');
        }
      } catch (error) {
        console.error("Error fetching donation:", error);
        toast({
          title: "Error",
          description: "Failed to load donation details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id, navigate]);

  const handlePaymentSuccess = async (paymentId: string) => {
    toast({
      title: "Payment Successful",
      description: "Your logistics payment was successful",
    });
    
    // In a real application, you would update the donation status on your backend
    if (donation && donation.id) {
      try {
        await api.updateDonationStatus(donation.id, 'accepted');
        setDonation(prev => prev ? { ...prev, status: 'accepted' } : null);
        
        // Send notification
        if (user?.id) {
          NotificationService.notifyDonationStatusChange(donation.id, 'accepted');
        }
        
        toast({
          title: "Donation Updated",
          description: "Donation status updated to accepted",
        });
      } catch (error) {
        console.error("Error updating donation status:", error);
      }
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!donation || !donation.id) return;
    
    try {
      setStatusUpdating(true);
      await api.updateDonationStatus(donation.id, newStatus);
      setDonation(prev => prev ? { ...prev, status: newStatus } : null);
      
      // Send notification
      if (user?.id) {
        NotificationService.notifyDonationStatusChange(donation.id, newStatus);
      }
      
      toast({
        title: "Status Updated",
        description: `Donation status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating donation status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update donation status",
        variant: "destructive",
      });
    } finally {
      setStatusUpdating(false);
    }
  };

  const getUserRole = () => {
    if (!user) return 'donor';
    return user.role || 'donor';
  };

  const getStatusActions = () => {
    if (!donation) return null;
    
    const role = getUserRole();
    
    // Different actions based on current status and user role
    switch (donation.status) {
      case 'pending':
        if (role === 'ngo' || role === 'admin') {
          return (
            <Button 
              onClick={() => handleStatusUpdate('accepted')}
              disabled={statusUpdating}
              className="w-full"
            >
              Accept Donation
            </Button>
          );
        }
        break;
        
      case 'accepted':
        if (role === 'volunteer' || role === 'admin') {
          return (
            <Button 
              onClick={() => handleStatusUpdate('picked_up')}
              disabled={statusUpdating}
              className="w-full"
            >
              Mark as Picked Up
            </Button>
          );
        }
        break;
        
      case 'picked_up':
        if (role === 'ngo' || role === 'volunteer' || role === 'admin') {
          return (
            <Button 
              onClick={() => handleStatusUpdate('delivered')}
              disabled={statusUpdating}
              className="w-full"
            >
              Mark as Delivered
            </Button>
          );
        }
        break;
        
      case 'delivered':
        return (
          <div className="flex items-center justify-center space-x-2 text-green-600 p-2 bg-green-50 rounded-md">
            <CheckCircle className="h-5 w-5" />
            <span>Donation successfully delivered</span>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Donation Tracking</h1>
          <p className="text-gray-500">
            Track your donation and pay for logistics
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : donation ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-primary" />
                    Donation Details
                  </CardTitle>
                  <Badge 
                    className={`${
                      donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      donation.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                      donation.status === 'picked_up' ? 'bg-blue-100 text-blue-800' :
                      donation.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1).replace('_', ' ')}
                  </Badge>
                </div>
                <CardDescription>
                  Details and status of your donation
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Food Item</span>
                  <span className="font-medium">{donation.foodName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{donation.quantity} {donation.quantityUnit}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Expiry Date</span>
                  <span className="font-medium">{new Date(donation.expiryDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Pickup Location</span>
                  <span className="font-medium">{donation.pickupLocation}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Donor</span>
                  <span className="font-medium">{donation.donorName}</span>
                </div>
                
                {/* Conditional action based on status */}
                <div className="pt-2">
                  {getStatusActions()}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  Logistics Payment
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {donation.status === 'pending' && getUserRole() === 'donor' ? (
                  <RazorpayPayment 
                    amount={100} 
                    description={`Logistics payment for ${donation.foodName}`}
                    onSuccess={handlePaymentSuccess}
                  />
                ) : donation.status === 'pending' ? (
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <p className="text-yellow-700">
                      Waiting for donor to make the logistics payment.
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-md">
                    <p className="text-green-700">
                      Payment has been processed for this donation.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Timeline
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-4 relative">
                      <div className={`w-4 h-4 rounded-full ${donation.status ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className="w-0.5 h-full absolute top-4 left-1.5 bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="font-medium">Donation Created</p>
                      <p className="text-sm text-gray-600">Donor has listed a food item for donation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 relative">
                      <div className={`w-4 h-4 rounded-full ${donation.status === 'accepted' || donation.status === 'picked_up' || donation.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className="w-0.5 h-full absolute top-4 left-1.5 bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="font-medium">Donation Accepted</p>
                      <p className="text-sm text-gray-600">NGO has accepted the donation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 relative">
                      <div className={`w-4 h-4 rounded-full ${donation.status === 'picked_up' || donation.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className="w-0.5 h-full absolute top-4 left-1.5 bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="font-medium">Picked Up</p>
                      <p className="text-sm text-gray-600">Volunteer has picked up the donation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4">
                      <div className={`w-4 h-4 rounded-full ${donation.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                    <div>
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-gray-600">Donation has been delivered to the NGO</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <EnhancedLocationTracker 
              donationAddress={donation.pickupLocation} 
              donationId={donation.id}
              allowLocationSharing={true}
              showRecipientLocation={getUserRole() === 'ngo' || getUserRole() === 'admin'}
            />
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-6 rounded-lg text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-3" />
          <p className="text-yellow-700">Donation not found or has been removed.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/donations')}
          >
            View All Donations
          </Button>
        </div>
      )}
    </div>
  );
};

export default DonationTrackingPage;
