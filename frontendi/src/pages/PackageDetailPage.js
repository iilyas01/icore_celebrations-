import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { DollarSign, ArrowLeft, Gift, Sparkles, Plus } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPackage(id)
      .then(r => setPkg(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const isDeluxe = (name) => {
    return name.toLowerCase().includes('deluxe') ||
      name.toLowerCase().includes('mega') ||
      name.toLowerCase().includes('premium') ||
      name.toLowerCase().includes('ultimate') ||
      name.toLowerCase().includes('pro') ||
      name.toLowerCase().includes('full') ||
      name.toLowerCase().includes('luxury');
  };

  const handleAddToplan = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    try {
      await api.post('/plans/packages', { package_id: parseInt(id), quantity: 1 });
      toast.success('Package added to your plan!');
      navigate('/my-plan');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add package');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-amber-200 rounded-full"></div>
          <p className="text-slate-500 font-nunito">Loading package...</p>
        </div>
      </div>
    );
  }

  if (!pkg) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/packages')}
          className="flex items-center gap-2 text-slate-600 hover:text-amber-500 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-nunito font-semibold">Back to Packages</span>
        </button>

        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          {/* Package Image Placeholder */}
          <div className={`h-64 flex items-center justify-center ${isDeluxe(pkg.name) ? 'bg-gradient-to-br from-amber-100 to-orange-100' : 'bg-gradient-to-br from-pink-100 to-purple-100'}`}>
            <Gift size={80} className={isDeluxe(pkg.name) ? 'text-amber-400' : 'text-pink-400'} />
          </div>

          <div className="p-8">
            {isDeluxe(pkg.name) && (
              <div className="inline-block bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg mb-4">
                Premium Package
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div>
                <span className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  {pkg.theme_name}
                </span>
                <h1 className="font-fredoka text-3xl sm:text-4xl text-slate-900">
                  {pkg.name}
                </h1>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 px-6 py-3 rounded-2xl">
                <DollarSign size={24} className="text-amber-500" />
                <span className="font-fredoka text-2xl text-slate-900">
                  ${parseFloat(pkg.price).toFixed(2)}
                </span>
              </div>
            </div>

            {pkg.description && (
              <div className="bg-slate-50 rounded-2xl p-6 mb-8">
                <p className="font-nunito text-slate-600 leading-relaxed">
                  {pkg.description}
                </p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles size={24} className="text-amber-500" />
                  <span className="font-fredoka text-lg text-slate-900">Theme</span>
                </div>
                <p className="font-nunito text-xl font-bold text-slate-900">
                  {pkg.theme_name}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign size={24} className="text-amber-500" />
                  <span className="font-fredoka text-lg text-slate-900">Price</span>
                </div>
                <p className="font-nunito text-3xl font-bold text-slate-900">
                  ${parseFloat(pkg.price).toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={handleAddToplan}
              className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add to My Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;