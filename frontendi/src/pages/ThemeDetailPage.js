import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTheme, getPackages, getVenues } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Users, DollarSign, Calendar, MapPin } from 'lucide-react';
import { Calendar as CalendarUI } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { createPlan, addPackageToPlan } from '../services/api';

const ThemeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [theme, setTheme] = useState(null);
  const [packages, setPackages] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [guestCount, setGuestCount] = useState(20);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [themeRes, packagesRes, venuesRes] = await Promise.all([
          getTheme(id),
          getPackages(),
          getVenues()
        ]);
        setTheme(themeRes.data);
        setPackages(packagesRes.data.filter(p => p.theme_id === parseInt(id)));
        setVenues(venuesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStartPlan = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to create a plan');
      navigate('/login');
      return;
    }
    if (!selectedVenue) {
      toast.error('Please select a venue');
      return;
    }
    if (!eventDate) {
      toast.error('Please select an event date');
      return;
    }
    setCreating(true);
    try {
      console.log('Sending to backend:', { theme_id: parseInt(id), venue_id: selectedVenue.venue_id, event_date: format(eventDate, 'yyyy-MM-dd'), guest_count: guestCount });
      const planResponse = await createPlan({
        theme_id: parseInt(id),
        venue_id: selectedVenue.venue_id,
        event_date: format(eventDate, 'yyyy-MM-dd'),
        guest_count: guestCount
      });

      const planId = planResponse.data.plan_id;

      if (selectedPackage) {
        await addPackageToPlan(planId, {
          package_id: selectedPackage.package_id,
          quantity: 1
        });
      }

      toast.success('Plan created successfully!');
      navigate('/my-plan');
    } catch (error) {
      toast.error('Failed to create plan');
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-amber-200 rounded-full"></div>
          <p className="text-slate-500 font-nunito">Loading theme...</p>
        </div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-nunito">Theme not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8" data-testid="theme-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/themes')}
          className="flex items-center gap-2 text-slate-600 hover:text-amber-500 transition-colors mb-8"
          data-testid="back-btn"
        >
          <ArrowLeft size={20} />
          <span className="font-nunito font-semibold">Back to Themes</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="relative">
            <img
              src={theme.image_url}
              alt={theme.name}
              className="w-full h-[400px] lg:h-[500px] object-cover rounded-3xl shadow-lg"
            />
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h1 className="font-fredoka text-3xl sm:text-4xl text-slate-900 mb-4">
              {theme.name}
            </h1>
            <p className="font-nunito text-lg text-slate-600 mb-8">
              {theme.description}
            </p>

            <div className="mb-6">
              <label className="block font-nunito font-semibold text-slate-700 mb-3">
                <MapPin className="inline mr-2" size={18} />
                Select Venue
              </label>
              <div className="grid gap-3 max-h-48 overflow-y-auto">
                {venues.map((venue) => (
                  <button
                    key={venue.venue_id}
                    onClick={() => setSelectedVenue(venue)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${
                      selectedVenue?.venue_id === venue.venue_id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-slate-200 hover:border-amber-300'
                    }`}
                    data-testid={`venue-option-${venue.venue_id}`}
                  >
                    <div className="font-nunito font-semibold text-slate-900">{venue.name}</div>
                    <div className="text-sm text-slate-500">{venue.location}</div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-amber-600 font-semibold">
                        ${parseFloat(venue.price_per_day).toFixed(2)}/day
                      </span>
                      <span className="text-slate-500">
                        <Users size={14} className="inline mr-1" />{venue.capacity} guests
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-nunito font-semibold text-slate-700 mb-3">
                <Calendar className="inline mr-2" size={18} />
                Event Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-nunito rounded-2xl h-12"
                    data-testid="date-picker-btn"
                  >
                    {eventDate ? format(eventDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarUI
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="mb-6">
              <label className="block font-nunito font-semibold text-slate-700 mb-3">
                <Users className="inline mr-2" size={18} />
                Number of Guests
              </label>
              <input
                type="number"
                min="1"
                max={selectedVenue?.capacity || 500}
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-nunito"
                data-testid="guest-count-input"
              />
            </div>

            <button
              onClick={handleStartPlan}
              disabled={creating || !selectedVenue || !eventDate}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="start-plan-btn"
            >
              {creating ? 'Creating Plan...' : 'Start Planning'}
            </button>
          </div>
        </div>

        {packages.length > 0 && (
          <div className="mt-12">
            <h2 className="font-fredoka text-2xl sm:text-3xl text-slate-900 mb-6">
              Available Packages for This Theme
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <button
                  key={pkg.package_id}
                  onClick={() => setSelectedPackage(selectedPackage?.package_id === pkg.package_id ? null : pkg)}
                  className={`text-left bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 transition-all card-hover ${
                    selectedPackage?.package_id === pkg.package_id
                      ? 'border-amber-500 ring-2 ring-amber-200'
                      : 'border-transparent'
                  }`}
                  data-testid={`package-card-${pkg.package_id}`}
                >
                  <h3 className="font-fredoka text-xl text-slate-900 mb-2">{pkg.name}</h3>
                  <p className="font-nunito text-sm text-slate-500 mb-3">{pkg.description}</p>
                  <div className="flex items-center gap-2 text-amber-600 font-bold font-nunito text-lg">
                    <DollarSign size={20} />
                    {parseFloat(pkg.price).toFixed(2)}
                  </div>
                  {selectedPackage?.package_id === pkg.package_id && (
                    <span className="inline-block mt-3 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">
                      Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeDetailPage;