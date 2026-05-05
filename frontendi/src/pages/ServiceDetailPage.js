import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { DollarSign, ExternalLink, ArrowLeft, Tag, Plus } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getService(id)
      .then(r => setService(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const getCategoryColor = (category) => {
    const colors = {
      'Custom Cakes': 'bg-pink-100 text-pink-700',
      'Dessert Tables': 'bg-rose-100 text-rose-700',
      'Catering': 'bg-orange-100 text-orange-700',
      'Clown Entertainment': 'bg-yellow-100 text-yellow-700',
      'Magician': 'bg-purple-100 text-purple-700',
      'Face Painting': 'bg-cyan-100 text-cyan-700',
      'Photography': 'bg-blue-100 text-blue-700',
      'Balloon Decor': 'bg-red-100 text-red-700',
      'Birthday Decor': 'bg-amber-100 text-amber-700',
      'Party Supplies': 'bg-green-100 text-green-700',
      'Food Truck Catering': 'bg-lime-100 text-lime-700',
      'Pizza Catering': 'bg-orange-100 text-orange-700',
      'Bounce House Rental': 'bg-indigo-100 text-indigo-700',
    };
    return colors[category] || 'bg-slate-100 text-slate-700';
  };

  const handleAddToplan = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    try {
      await api.post('/plans/services', { service_id: parseInt(id), quantity: 1 });
      toast.success('Service added to your plan!');
      navigate('/my-plan');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add service');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-amber-200 rounded-full"></div>
          <p className="text-slate-500 font-nunito">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-slate-600 hover:text-amber-500 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-nunito font-semibold">Back to Services</span>
        </button>

        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          {/* Service Image Placeholder */}
          <div className="h-85 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
            {service.image_url ? (
              <img
                src={service.image_url}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl">🎉</span>
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${getCategoryColor(service.category)}`}>
                  {service.category}
                </span>
                <h1 className="font-fredoka text-3xl sm:text-4xl text-slate-900">
                  {service.name}
                </h1>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 px-6 py-3 rounded-2xl">
                <DollarSign size={24} className="text-amber-500" />
                <span className="font-fredoka text-2xl text-slate-900">
                  ${parseFloat(service.estimated_price).toFixed(2)}
                </span>
                <span className="font-nunito text-slate-500">est.</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Tag size={24} className="text-purple-500" />
                  <span className="font-fredoka text-lg text-slate-900">Category</span>
                </div>
                <p className="font-nunito text-xl font-bold text-slate-900">
                  {service.category}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign size={24} className="text-amber-500" />
                  <span className="font-fredoka text-lg text-slate-900">Estimated Price</span>
                </div>
                <p className="font-nunito text-3xl font-bold text-slate-900">
                  ${parseFloat(service.estimated_price).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToplan}
                className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add to My Plan
              </button>

              {service.vendor_link && (
                <a
                  href={service.vendor_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary px-8 py-4 text-lg flex items-center justify-center gap-2"
                >
                  Visit Vendor
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

export default ServiceDetailPage;