import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVenues } from '../services/api';
import { MapPin, Users, DollarSign, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/venues');
        const data = await res.json();
        setVenues(data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchVenues();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-amber-200 rounded-full"></div>
          <p className="text-slate-500 font-nunito">Loading venues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12" data-testid="venues-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            <MapPin size={16} />
            Event Venues
          </div>
          <h1 className="font-fredoka text-4xl sm:text-5xl text-slate-900 mb-4">
            Amazing{' '}
            <span className="gradient-text">Venues</span>
          </h1>
          <p className="font-nunito text-lg text-slate-600 max-w-2xl mx-auto">
            Discover fantastic party venues across Long Island. 
            From intimate spaces to grand halls, find the perfect location.
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => (
           <div
            key={venue.venue_id}
            className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 card-hover cursor-pointer"
            data-testid={`venue-card-${venue.venue_id}`}
            onClick={() => navigate(`/venues/${venue.venue_id}`)}
          >
              {/* Placeholder image for venue */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                {venue.IMAGE_URL ? (
                  <img
                    src={venue.IMAGE_URL}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <MapPin size={48} className="text-blue-300" />
                )}
              </div>
              
              <div className="p-6">
                <h3 className="font-fredoka text-xl text-slate-900 mb-2">
                  {venue.name}
                </h3>
                
                <div className="flex items-center gap-2 text-slate-500 mb-4">
                  <MapPin size={16} />
                  <span className="font-nunito text-sm">{venue.location}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} className="text-amber-500" />
                    <span className="font-nunito font-bold text-slate-900">
                      ${parseFloat(venue.price_per_day).toFixed(2)}/day
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Users size={18} />
                    <span className="font-nunito text-sm">{venue.capacity} guests</span>
                  </div>
                </div>
                
                {venue.vendor_link && (
                  <a
                    href={venue.vendor_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-nunito font-semibold text-sm"
                  >
                    Visit Website
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenuesPage;
