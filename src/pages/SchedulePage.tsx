
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Package, ArrowRight, AlertCircle, Calendar as CalendarIcon, User, Truck } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { api, DonationItem } from '@/services/api';
import EnhancedLocationTracker from '@/components/map/EnhancedLocationTracker';

const SchedulePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDonation, setSelectedDonation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState<{
    upcoming: DonationItem[];
    completed: DonationItem[];
    cancelled: DonationItem[];
  }>({
    upcoming: [],
    completed: [],
    cancelled: []
  });
  
  // Check authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch schedule data
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        // Here we would fetch real data from the API
        // For demonstration, using mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Mock data based on user role
        let mockData;
        
        if (user.role === 'admin') {
          mockData = {
            upcoming: [
              { id: '1', foodName: 'Fresh Vegetables', donorName: 'John Doe', quantity: 10, quantityUnit: 'kg', pickupLocation: '123 Main St, City', status: 'pending', expiryDate: '2025-04-25' },
              { id: '2', foodName: 'Rice Packets', donorName: 'Jane Smith', quantity: 20, quantityUnit: 'packs', pickupLocation: '456 Oak St, Town', status: 'accepted', expiryDate: '2025-05-10' },
              { id: '3', foodName: 'Canned Food', donorName: 'Mike Johnson', quantity: 30, quantityUnit: 'cans', pickupLocation: '789 Pine St, Village', status: 'pending', expiryDate: '2025-05-15' },
            ],
            completed: [
              { id: '4', foodName: 'Bread Loaves', donorName: 'Sarah Brown', quantity: 15, quantityUnit: 'loaves', pickupLocation: '321 Elm St, City', status: 'delivered', expiryDate: '2025-04-01' },
              { id: '5', foodName: 'Fruit Baskets', donorName: 'Tom Wilson', quantity: 5, quantityUnit: 'baskets', pickupLocation: '654 Maple St, Town', status: 'delivered', expiryDate: '2025-04-05' },
            ],
            cancelled: [
              { id: '6', foodName: 'Dairy Products', donorName: 'Lisa Davis', quantity: 8, quantityUnit: 'boxes', pickupLocation: '987 Cedar St, Village', status: 'cancelled', expiryDate: '2025-03-20' },
            ]
          };
        } else if (user.role === 'ngo') {
          mockData = {
            upcoming: [
              { id: '1', foodName: 'Fresh Vegetables', donorName: 'John Doe', quantity: 10, quantityUnit: 'kg', pickupLocation: '123 Main St, City', status: 'accepted', expiryDate: '2025-04-25' },
              { id: '2', foodName: 'Rice Packets', donorName: 'Jane Smith', quantity: 20, quantityUnit: 'packs', pickupLocation: '456 Oak St, Town', status: 'accepted', expiryDate: '2025-05-10' },
            ],
            completed: [
              { id: '4', foodName: 'Bread Loaves', donorName: 'Sarah Brown', quantity: 15, quantityUnit: 'loaves', pickupLocation: '321 Elm St, City', status: 'delivered', expiryDate: '2025-04-01' },
            ],
            cancelled: [
              { id: '6', foodName: 'Dairy Products', donorName: 'Lisa Davis', quantity: 8, quantityUnit: 'boxes', pickupLocation: '987 Cedar St, Village', status: 'cancelled', expiryDate: '2025-03-20' },
            ]
          };
        } else if (user.role === 'volunteer') {
          mockData = {
            upcoming: [
              { id: '2', foodName: 'Rice Packets', donorName: 'Jane Smith', quantity: 20, quantityUnit: 'packs', pickupLocation: '456 Oak St, Town', status: 'accepted', expiryDate: '2025-05-10' },
              { id: '3', foodName: 'Canned Food', donorName: 'Mike Johnson', quantity: 30, quantityUnit: 'cans', pickupLocation: '789 Pine St, Village', status: 'pending', expiryDate: '2025-05-15' },
            ],
            completed: [
              { id: '5', foodName: 'Fruit Baskets', donorName: 'Tom Wilson', quantity: 5, quantityUnit: 'baskets', pickupLocation: '654 Maple St, Town', status: 'delivered', expiryDate: '2025-04-05' },
            ],
            cancelled: []
          };
        } else { // donor / user
          mockData = {
            upcoming: [
              { id: '1', foodName: 'Fresh Vegetables', donorName: 'You', quantity: 10, quantityUnit: 'kg', pickupLocation: '123 Main St, City', status: 'pending', expiryDate: '2025-04-25' },
              { id: '3', foodName: 'Canned Food', donorName: 'You', quantity: 30, quantityUnit: 'cans', pickupLocation: '789 Pine St, Village', status: 'accepted', expiryDate: '2025-05-15' },
            ],
            completed: [
              { id: '4', foodName: 'Bread Loaves', donorName: 'You', quantity: 15, quantityUnit: 'loaves', pickupLocation: '321 Elm St, City', status: 'delivered', expiryDate: '2025-04-01' },
            ],
            cancelled: [
              { id: '6', foodName: 'Dairy Products', donorName: 'You', quantity: 8, quantityUnit: 'boxes', pickupLocation: '987 Cedar St, Village', status: 'cancelled', expiryDate: '2025-03-20' },
            ]
          };
        }
        
        setScheduleData(mockData);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        toast({
          title: 'Error',
          description: 'Failed to load schedule data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchSchedule();
    }
  }, [user?.id, user?.role]);

  const handleViewDetails = (donationId: string) => {
    navigate(`/donations/${donationId}`);
  };

  const handleTrackDonation = (donationId: string) => {
    navigate(`/donations/${donationId}/track`);
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Schedule</h1>
        <p className="text-gray-500">
          {user?.role === 'volunteer' ? 'Your pickup schedule and assignments' : 
           user?.role === 'ngo' ? 'Upcoming and past donation deliveries' : 
           user?.role === 'admin' ? 'Overall donation and pickup schedule' : 
           'Your donation schedule and pickup times'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="upcoming" className="flex-1">
                Upcoming 
                <Badge variant="outline" className="ml-2">{scheduleData.upcoming.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">
                Completed
                <Badge variant="outline" className="ml-2">{scheduleData.completed.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex-1">
                Cancelled
                <Badge variant="outline" className="ml-2">{scheduleData.cancelled.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {scheduleData.upcoming.length > 0 ? (
                scheduleData.upcoming.map((donation) => (
                  <Card key={donation.id} className={`${selectedDonation === donation.id ? 'border-primary' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{donation.foodName}</CardTitle>
                        <Badge 
                          className={`${
                            donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                            donation.status === 'accepted' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                            'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>{donation.quantity} {donation.quantityUnit}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-1" />
                            <span>{donation.donorName}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Expires: {new Date(donation.expiryDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{donation.pickupLocation}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="outline" onClick={() => handleViewDetails(donation.id)}>
                        View Details
                      </Button>
                      <Button onClick={() => {
                        setSelectedDonation(donation.id);
                        if (window.innerWidth < 1024) { // On mobile, scroll to the map
                          document.getElementById('tracking-section')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}>
                        Track <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 border rounded-lg">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No upcoming donations scheduled</p>
                  {user?.role === 'user' || !user?.role ? (
                    <Button className="mt-4" onClick={() => navigate('/donations/new')}>
                      Create New Donation
                    </Button>
                  ) : null}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {scheduleData.completed.length > 0 ? (
                scheduleData.completed.map((donation) => (
                  <Card key={donation.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{donation.foodName}</CardTitle>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Delivered</Badge>
                      </div>
                      <CardDescription>{donation.quantity} {donation.quantityUnit}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-1" />
                            <span>{donation.donorName}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Expired: {new Date(donation.expiryDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{donation.pickupLocation}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline" onClick={() => handleViewDetails(donation.id)}>
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 border rounded-lg">
                  <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No completed donations</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {scheduleData.cancelled.length > 0 ? (
                scheduleData.cancelled.map((donation) => (
                  <Card key={donation.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{donation.foodName}</CardTitle>
                        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>
                      </div>
                      <CardDescription>{donation.quantity} {donation.quantityUnit}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-1" />
                            <span>{donation.donorName}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Expired: {new Date(donation.expiryDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{donation.pickupLocation}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline" onClick={() => handleViewDetails(donation.id)}>
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 border rounded-lg">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No cancelled donations</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Your donation schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-lg"
              />
              
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium">Scheduled for {selectedDate?.toLocaleDateString()}</h3>
                {scheduleData.upcoming.filter(d => new Date(d.expiryDate).toDateString() === selectedDate?.toDateString()).length > 0 ? (
                  scheduleData.upcoming
                    .filter(d => new Date(d.expiryDate).toDateString() === selectedDate?.toDateString())
                    .map(donation => (
                      <div key={donation.id} className="p-2 text-sm border rounded-lg">
                        <div className="font-medium">{donation.foodName}</div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Before expiry</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500">No donations scheduled for this date</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div id="tracking-section">
            {selectedDonation ? (
              <EnhancedLocationTracker 
                donationAddress={scheduleData.upcoming.find(d => d.id === selectedDonation)?.pickupLocation}
                donationId={selectedDonation}
                allowLocationSharing={true}
                showRecipientLocation={user?.role === 'ngo' || user?.role === 'admin'}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Live Tracking</CardTitle>
                  <CardDescription>Select a donation to track it live</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Truck className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Select an upcoming donation from the list to track its location</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
