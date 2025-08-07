
import { useNavigate } from 'react-router-dom';
import VolunteerForm from '@/components/volunteers/VolunteerForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Heart, Calendar, MapPin } from 'lucide-react';

const VolunteerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-8"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Become a Volunteer</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our network of volunteers and help us reduce food waste while supporting those in need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Flexible Schedule</h3>
              </div>
              <p className="text-gray-600">
                Choose when you're available to volunteer, whether it's weekdays, weekends, or specific days.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-orange-500/10 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold">Local Impact</h3>
              </div>
              <p className="text-gray-600">
                Make a difference in your local community by helping distribute food to those who need it most.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-600/10 p-3 rounded-full mr-4">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Meaningful Work</h3>
              </div>
              <p className="text-gray-600">
                Contribute to a cause that matters while gaining valuable experience and making connections.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500/10 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">Join a Community</h3>
              </div>
              <p className="text-gray-600">
                Be part of a network of like-minded individuals dedicated to fighting hunger and food waste.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Volunteer Registration</h2>
            <VolunteerForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerPage;
