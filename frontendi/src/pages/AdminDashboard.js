import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, CheckCircle, XCircle, Clock, 
  Trash2, Users, Package, MapPin, Wrench, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';


const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [themes, setThemes] = useState([]);
  const [venues, setVenues] = useState([]);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchAll();
  }, [isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ordersRes, themesRes, venuesRes, servicesRes, packagesRes] = await Promise.all([
        api.get('/admin/orders'),
        api.get('/themes'),
        api.get('/venues'),
        api.get('/services'),
        api.get('/packages')
      ]);
      setOrders(ordersRes.data);
      setThemes(themesRes.data);
      setVenues(venuesRes.data);
      setServices(servicesRes.data);
      setPackages(packagesRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      await api.post(`/admin/orders/${orderId}/approve`);
      toast.success('Order approved!');
      fetchAll();
    } catch (err) {
      toast.error('Failed to approve order');
    }
  };

  const handleReject = async (orderId) => {
    try {
      await api.post(`/admin/orders/${orderId}/reject`);
      toast.success('Order rejected');
      fetchAll();
    } catch (err) {
      toast.error('Failed to reject order');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      await api.delete(`/admin/${type}s/${id}`);
      toast.success(`${type} deleted successfully`);
      fetchAll();
    } catch (err) {
      toast.error(`Failed to delete ${type}`);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const tabs = [
    { id: 'orders', label: 'Orders', icon: <Package size={18} />, count: orders.length },
    { id: 'themes', label: 'Themes', icon: <Sparkles size={18} />, count: themes.length },
    { id: 'venues', label: 'Venues', icon: <MapPin size={18} />, count: venues.length },
    { id: 'services', label: 'Services', icon: <Wrench size={18} />, count: services.length },
    { id: 'packages', label: 'Packages', icon: <Package size={18} />, count: packages.length },
  ];

  const pendingOrders = orders.filter(o => o.order_status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-amber-200 rounded-full"></div>
          <p className="text-slate-500 font-nunito">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            <LayoutDashboard size={16} />
            Admin Dashboard
          </div>
          <h1 className="font-fredoka text-4xl sm:text-5xl text-slate-900 mb-4">
            Manage <span className="gradient-text">iCore</span>
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <p className="font-nunito text-slate-500 text-sm mb-1">Total Orders</p>
            <p className="font-fredoka text-3xl text-slate-900">{orders.length}</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <p className="font-nunito text-amber-600 text-sm mb-1">Pending Approval</p>
            <p className="font-fredoka text-3xl text-amber-600">{pendingOrders}</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <p className="font-nunito text-green-600 text-sm mb-1">Confirmed</p>
            <p className="font-fredoka text-3xl text-green-600">
              {orders.filter(o => o.order_status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <p className="font-nunito text-blue-600 text-sm mb-1">Total Themes</p>
            <p className="font-fredoka text-3xl text-blue-600">{themes.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-100">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-nunito font-semibold text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? 'bg-amber-200 text-amber-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-8">

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="font-nunito text-slate-500 text-center py-8">No orders yet</p>
                ) : (
                  orders.map(order => (
                    <div key={order.order_id} className="border border-slate-100 rounded-2xl p-6 hover:border-amber-200 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-fredoka text-xl text-slate-900">
                              {order.theme_name}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(order.order_status)}`}>
                              {getStatusIcon(order.order_status)}
                              {order.order_status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-nunito">
                            <span>👤 {order.customer_name}</span>
                            <span>✉️ {order.email}</span>
                            <span>📍 {order.venue_name}</span>
                            <span>📅 {new Date(order.event_date).toLocaleDateString()}</span>
                            <span>👥 {order.guest_count} guests</span>
                            <span>🔖 Order #{order.order_id}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <p className="font-fredoka text-2xl text-amber-500">
                            ${parseFloat(order.total_estimate || 0).toFixed(2)}
                          </p>
                          {order.order_status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(order.order_id)}
                                className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-nunito font-semibold text-sm hover:bg-green-200 transition-colors"
                              >
                                <CheckCircle size={16} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(order.order_id)}
                                className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-nunito font-semibold text-sm hover:bg-red-200 transition-colors"
                              >
                                <XCircle size={16} />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* THEMES TAB */}
            {activeTab === 'themes' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map(theme => (
                  <div key={theme.theme_id} className="border border-slate-100 rounded-2xl overflow-hidden hover:border-red-200 transition-colors">
                    <img
                      src={theme.image_url}
                      alt={theme.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-fredoka text-lg text-slate-900">{theme.name}</p>
                        <p className="font-nunito text-xs text-slate-500 line-clamp-1">{theme.description}</p>
                      </div>
                      <button
                        onClick={() => handleDelete('theme', theme.theme_id)}
                        className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0 ml-3"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VENUES TAB */}
            {activeTab === 'venues' && (
              <div className="space-y-3">
                {venues.map(venue => (
                  <div key={venue.venue_id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-red-200 transition-colors">
                    <div>
                      <p className="font-fredoka text-lg text-slate-900">{venue.name}</p>
                      <div className="flex gap-4 text-sm text-slate-500 font-nunito">
                        <span>📍 {venue.location}</span>
                        <span>👥 {venue.capacity} guests</span>
                        <span>💰 ${parseFloat(venue.price_per_day).toFixed(2)}/day</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete('venue', venue.venue_id)}
                      className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* SERVICES TAB */}
            {activeTab === 'services' && (
              <div className="grid md:grid-cols-2 gap-3">
                {services.map(service => (
                  <div key={service.service_id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-red-200 transition-colors">
                    <div>
                      <p className="font-fredoka text-lg text-slate-900">{service.name}</p>
                      <div className="flex gap-3 text-sm text-slate-500 font-nunito">
                        <span>{service.category}</span>
                        <span>💰 ${parseFloat(service.estimated_price).toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete('service', service.service_id)}
                      className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* PACKAGES TAB */}
            {activeTab === 'packages' && (
              <div className="grid md:grid-cols-2 gap-3">
                {packages.map(pkg => (
                  <div key={pkg.package_id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-red-200 transition-colors">
                    <div>
                      <p className="font-fredoka text-lg text-slate-900">{pkg.name}</p>
                      <div className="flex gap-3 text-sm text-slate-500 font-nunito">
                        <span>{pkg.theme_name}</span>
                        <span>💰 ${parseFloat(pkg.price).toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete('package', pkg.package_id)}
                      className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;