import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVenue } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Users, DollarSign, ExternalLink, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

const VenueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVenue(id)
      .then(r => setVenue(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToplan = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    try {
      await api.post('/plans/venue', { venue_id: parseInt(id) });
      toast.success('Venue added to your plan!');
      navigate('/my-plan');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add venue');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-amber-200 rounded-full"></div>
          <p className="text-slate-500 font-nunito">Loading venue...</p>
        </div>
      </div>
    );
  }

  if (!venue) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/venues')}
          className="flex items-center gap-2 text-slate-600 hover:text-amber-500 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-nunito font-semibold">Back to Venues</span>
        </button>

        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          {/* Venue Image Placeholder */}
          <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <MapPin size={80} className="text-blue-300" />
          </div>

          <div className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-fredoka text-3xl sm:text-4xl text-slate-900 mb-2">
                  {venue.name}
                </h1>
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin size={18} className="text-blue-500" />
                  <span className="font-nunito">{venue.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 px-6 py-3 rounded-2xl">
                <DollarSign size={24} className="text-amber-500" />
                <span className="font-fredoka text-2xl text-slate-900">
                  ${parseFloat(venue.price_per_day).toFixed(2)}
                </span>
                <span className="font-nunito text-slate-500">/day</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users size={24} className="text-purple-500" />
                  <span className="font-fredoka text-lg text-slate-900">Capacity</span>
                </div>
                <p className="font-nunito text-3xl font-bold text-slate-900">
                  {venue.capacity}
                  <span className="text-lg font-normal text-slate-500 ml-2">guests</span>
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign size={24} className="text-amber-500" />
                  <span className="font-fredoka text-lg text-slate-900">Price Per Day</span>
                </div>
                <p className="font-nunito text-3xl font-bold text-slate-900">
                  ${parseFloat(venue.price_per_day).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToplan}
                className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2"
              >
                Add to My Plan
              </button>

              {venue.vendor_link && (
  <a
    href={venue.vendor_link}
    target="_blank"
    rel="noopener noreferrer"
    className="btn-secondary px-8 py-4 text-lg flex items-center justify-center gap-2"
  >
    Visit Website
    <ExternalLink size={18} />
  </a>
)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailPage;