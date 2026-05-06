import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, MapPin, Calendar, Users, Trash2, Plus, DollarSign, Package, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

const MyPlanPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [plan, setPlan] = useState(null);
  const [planServices, setPlanServices] = useState([]);
  const [planPackages, setPlanPackages] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const fetchPlan = async () => {
    try {
      const response = await api.get('/plans/my');
      const data = response.data;
      setPlan(data.plan);
      setPlanServices(data.services || []);
      setPlanPackages(data.packages || []);
    } catch (error) {
      console.error('Error fetching plan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchPlan();
    api.get('/services').then(r => setAllServices(r.data)).catch(console.error);
    api.get('/packages').then(r => setAllPackages(r.data)).catch(console.error);
  }, [isAuthenticated]);

  const handleAddService = async (service_id) => {
    try {
      await api.post('/plans/services', { service_id, quantity: 1 });
      toast.success('Service added!');
      fetchPlan();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add service');
    }
  };

  const handleRemoveService = async (service_id) => {
    try {
      await api.delete(`/plans/services/${service_id}`);
      toast.success('Service removed');
      fetchPlan();
    } catch (error) {
      toast.error('Failed to remove service');
    }
  };

  const handleAddPackage = async (package_id) => {
    try {
      await api.post('/plans/packages', { package_id, quantity: 1 });
      toast.success('Package added!');
      fetchPlan();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add package');
    }
  };

  const handleRemovePackage = async (package_id) => {
    try {
      await api.delete(`/plans/packages/${package_id}`);
      toast.success('Package removed');
      fetchPlan();
    } catch (error) {
      toast.error('Failed to remove package');
    }
  };

  const handleDeletePlan = async () => {
    try {
      await api.delete('/plans/my');
      toast.success('Plan deleted');
      setPlan(null);
      setPlanServices([]);
      setPlanPackages([]);
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  };

  const handleUpdateGuests = async (e) => {
    const guest_count = parseInt(e.target.value);
    if (!guest_count || guest_count < 1) return;
    try {
      await api.put('/plans/guests', { guest_count });
      fetchPlan();
    } catch (error) {
      console.error('Failed to update guests');
    }
  };

  const handleCheckout = async () => {
    setCreatingOrder(true);
    try {
      const response = await api.post('/orders', { plan_id: plan.plan_id });
      const order_id = response.data.order_id;
      toast.success('Order created! Proceeding to checkout...');
      navigate(`/checkout/${order_id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create order');
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-amber-200 rounded-full"></div>
          <p className="text-slate-500 font-nunito">Loading your plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="text-slate-300 mx-auto mb-4" />
          <h2 className="font-fredoka text-3xl text-slate-900 mb-2">No Plan Yet</h2>
          <p className="font-nunito text-slate-500 mb-6">
            Start by choosing a theme for your celebration!
          </p>
          <button
            onClick={() => navigate('/themes')}
            className="btn-primary px-8 py-3"
          >
            Browse Themes
          </button>
        </div>
      </div>
    );
  }

  const addedServiceIds = planServices.map(s => s.service_id);
  const addedPackageIds = planPackages.map(p => p.package_id);
  const themePackages = allPackages.filter(p => p.theme_id === plan.theme_id);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            <ShoppingBag size={16} />
            My Plan
          </div>
          <h1 className="font-fredoka text-4xl sm:text-5xl text-slate-900 mb-4">
            Your Party <span className="gradient-text">Plan</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-6">

            {/* Event Details */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="font-fredoka text-2xl text-slate-900 mb-6">Event Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
              <Link to={`/themes/${plan.theme_id}`} className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl hover:bg-amber-100 transition-colors">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🎨</span>
                </div>
                <div>
                  <p className="font-nunito text-xs text-slate-500 uppercase tracking-wider">Theme</p>
                  <p className="font-fredoka text-lg text-slate-900 hover:text-amber-600">{plan.theme_name}</p>
                </div>
              </Link>

                <Link to={`/venues/${plan.venue_id}`} className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MapPin size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-nunito text-xs text-slate-500 uppercase tracking-wider">Venue</p>
                    <p className="font-fredoka text-lg text-slate-900 hover:text-blue-600">{plan.venue_name}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Calendar size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-nunito text-xs text-slate-500 uppercase tracking-wider">Date</p>
                    <input
                      type="date"
                      defaultValue={plan.event_date ? plan.event_date.split('T')[0] : ''}
                      min={new Date().toISOString().split('T')[0]}
                      onBlur={async (e) => {
                        try {
                          await api.put('/plans/guests', { guest_count: plan.guest_count });
                          await api.post('/plans/theme', {
                            theme_id: plan.theme_id,
                            venue_id: plan.venue_id,
                            event_date: e.target.value,
                            guest_count: plan.guest_count
                          });
                          fetchPlan();
                        } catch (err) {
                          console.error('Failed to update date');
                        }
                      }}
                      className="font-fredoka text-lg text-slate-900 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg px-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-nunito text-xs text-slate-500 uppercase tracking-wider">Guests</p>
                    <input
                      type="number"
                      min="1"
                      defaultValue={plan.guest_count || 0}
                      onBlur={handleUpdateGuests}
                      className="font-fredoka text-lg text-slate-900 bg-transparent w-24 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Packages */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="font-fredoka text-2xl text-slate-900 mb-6 flex items-center gap-2">
                <Package size={24} className="text-amber-500" />
                Packages
              </h2>

              {/* Added packages */}
              {planPackages.length > 0 && (
                <div className="space-y-3 mb-6">
                  {planPackages.map(pkg => (
                    <div key={pkg.package_id} className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl">
                      <div onClick={() => navigate(`/packages/${pkg.package_id}`)} className="cursor-pointer hover:opacity-75 transition-opacity">
                        <p className="font-nunito font-semibold text-slate-900 hover:text-amber-600">{pkg.name}</p>
                        <p className="font-nunito text-sm text-slate-500">Qty: {pkg.quantity}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-fredoka text-lg text-amber-600">
                          ${parseFloat(pkg.price).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemovePackage(pkg.package_id)}
                          className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Available packages for this theme */}
              {themePackages.filter(p => !addedPackageIds.includes(p.package_id)).length > 0 && (
                <div>
                  <p className="font-nunito text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Available Packages for This Theme
                  </p>
                  <div className="space-y-2">
                    {themePackages
                      .filter(p => !addedPackageIds.includes(p.package_id))
                      .map(pkg => (
                        <div key={pkg.package_id} className="flex items-center justify-between p-3 border border-slate-200 rounded-2xl hover:border-amber-300 transition-colors">
                          <div>
                            <p className="font-nunito font-semibold text-slate-900">{pkg.name}</p>
                            <p className="font-nunito text-sm text-amber-600">
                              ${parseFloat(pkg.price).toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleAddPackage(pkg.package_id)}
                            className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors"
                          >
                            <Plus size={14} className="text-amber-600" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Services */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="font-fredoka text-2xl text-slate-900 mb-6 flex items-center gap-2">
                <Wrench size={24} className="text-purple-500" />
                Services
              </h2>

              {/* Added services */}
              {planServices.length > 0 && (
                <div className="space-y-3 mb-6">
                  {planServices.map(svc => (
                    <div key={svc.service_id} className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                      <div onClick={() => navigate(`/services/${svc.service_id}`)} className="cursor-pointer hover:opacity-75 transition-opacity">
                        <p className="font-nunito font-semibold text-slate-900 hover:text-purple-600">{svc.name}</p>
                        <p className="font-nunito text-sm text-slate-500">{svc.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-fredoka text-lg text-purple-600">
                          ${parseFloat(svc.estimated_price).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveService(svc.service_id)}
                          className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add services */}
              <div>
                <p className="font-nunito text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Add Services
                </p>
                <div className="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {allServices
                    .filter(s => !addedServiceIds.includes(s.service_id))
                    .map(svc => (
                      <div key={svc.service_id} className="flex items-center justify-between p-3 border border-slate-200 rounded-2xl hover:border-purple-300 transition-colors">
                        <div>
                          <p className="font-nunito font-semibold text-slate-900 text-sm">{svc.name}</p>
                          <p className="font-nunito text-xs text-purple-600">
                            ${parseFloat(svc.estimated_price).toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddService(svc.service_id)}
                          className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors flex-shrink-0"
                        >
                          <Plus size={14} className="text-purple-600" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgb(0,0,0,0.08)] sticky top-24">
              <h2 className="font-fredoka text-2xl text-slate-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="font-nunito text-slate-600">Theme</span>
                  <span className="font-nunito font-semibold text-sm text-right max-w-[140px]">
                    {plan.theme_name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="font-nunito text-slate-600">Venue</span>
                  <span className="font-nunito font-semibold text-sm text-right max-w-[140px]">
                    {plan.venue_name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="font-nunito text-slate-600">Packages</span>
                  <span className="font-nunito font-semibold">{planPackages.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="font-nunito text-slate-600">Services</span>
                  <span className="font-nunito font-semibold">{planServices.length}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-fredoka text-lg text-slate-900">Total Estimate</span>
                  <span className="font-fredoka text-2xl text-amber-500">
                    ${parseFloat(plan.total_estimate || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={creatingOrder}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 mb-3"
              >
                {creatingOrder ? 'Processing...' : '🎉 Proceed to Checkout'}
              </button>

              <button
                onClick={handleDeletePlan}
                className="w-full py-3 border-2 border-red-200 rounded-full font-nunito font-semibold text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPlanPage;