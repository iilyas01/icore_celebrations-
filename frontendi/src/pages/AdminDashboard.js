import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckCircle, XCircle, Trash2, Package, MapPin, Wrench, Sparkles, Pencil, X, ExternalLink, Image as ImageIcon
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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', image_url: '', location: '',
    price_per_day: '', capacity: '', category: '', estimated_price: '', price: '',
    vendor_link: '',
    theme_id: '' // Added theme_id to state
  });

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    fetchAll();
  }, [isAdmin, navigate]);

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
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, action) => {
    try {
      await api.post(`/admin/orders/${id}/${action}`);
      toast.success(`Order ${action}ed!`);
      fetchAll();
    } catch (err) { toast.error('Status update failed'); }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    try {
      await api.delete(`/admin/${type}s/${id}`);
      toast.success('Deleted successfully');
      fetchAll();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleEditClick = (type, item) => {
    setIsEditMode(true);
    setCurrentId(item[`${type}_id`] || item.id);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      image_url: item.image_url || '',
      location: item.location || '',
      price_per_day: item.price_per_day || '',
      capacity: item.capacity || '',
      category: item.category || '',
      estimated_price: item.estimated_price || '',
      price: item.price || '',
      vendor_link: item.vendor_link || '',
      theme_id: item.theme_id || '' // Added theme_id for editing
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value === '' ? null : value])
    );

    try {
      if (isEditMode) {
        await api.put(`/admin/${activeTab}/${currentId}`, sanitizedData);
        toast.success('Updated successfully');
      } else {
        await api.post(`/admin/${activeTab}`, sanitizedData); 
        toast.success('Added successfully');
      }
      closeModal();
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentId(null);
    setFormData({ 
        name: '', description: '', image_url: '', location: '', 
        price_per_day: '', capacity: '', category: '', estimated_price: '', 
        price: '', vendor_link: '', theme_id: '' // Reset theme_id
    });
  };

  const renderMedia = (url, name) => {
    if (!url || url.trim() === "") {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
          <ImageIcon size={40} strokeWidth={1.5} />
          <span className="text-[10px] font-bold uppercase mt-2">No Image</span>
        </div>
      );
    }
    return (
      <img 
        src={url} 
        alt={name} 
        className="w-full h-full object-cover"
        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Invalid+URL'; }}
      />
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-nunito">Loading Admin...</div>;

  const tabs = [
    { id: 'orders', label: 'Orders', icon: <Package size={18} />, count: orders.length },
    { id: 'themes', label: 'Themes', icon: <Sparkles size={18} />, count: themes.length },
    { id: 'venues', label: 'Venues', icon: <MapPin size={18} />, count: venues.length },
    { id: 'services', label: 'Services', icon: <Wrench size={18} />, count: services.length },
    { id: 'packages', label: 'Packages', icon: <Package size={18} />, count: packages.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-nunito">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-t-3xl shadow-sm border-b overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
                className={`px-6 py-4 flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === tab.id ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
                {tab.icon} {tab.label} <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-b-3xl p-8 shadow-sm min-h-[500px]">
          {activeTab !== 'orders' && (
            <div className="flex justify-end mb-8">
              <button onClick={() => { setIsEditMode(false); setIsModalOpen(true); }} className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-600 shadow-lg transition-all">
                <Sparkles size={18}/> Add New {activeTab.slice(0, -1)}
              </button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.order_id} className="border-2 border-slate-50 rounded-3xl p-6 hover:border-amber-100 transition-all bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID: #{order.order_id}</span>
                      <h3 className="font-fredoka text-xl text-slate-800">{order.customer_name}</h3>
                      <p className="text-sm text-slate-500">{order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${order.status?.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {order.status || 'Pending'}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 py-4 border-y border-slate-50">
                    <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">Theme</p><p className="font-bold">{order.theme_name || 'Custom'}</p></div>
                    <p className="text-amber-600 font-bold text-lg">${parseFloat(order.total_estimate || order.total_price || 0).toFixed(2)}</p>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleUpdateStatus(order.order_id, 'approve')} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"><CheckCircle /></button>
                      <button onClick={() => handleUpdateStatus(order.order_id, 'reject')} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><XCircle /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTab === 'themes' && themes.map(t => (
              <div key={t.theme_id} className="border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-amber-200 transition-all bg-white flex flex-col shadow-sm">
                <div className="h-48 bg-slate-100">{renderMedia(t.image_url, t.name)}</div>
                <div className="p-6">
                  <h4 className="font-fredoka text-2xl mb-2">{t.name}</h4>
                  <p className="text-slate-500 text-sm line-clamp-2">{t.description}</p>
                  <div className="flex gap-2 mt-6">
                    <button onClick={() => handleEditClick('theme', t)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Pencil size={18}/></button>
                    <button onClick={() => handleDelete('theme', t.theme_id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><Trash2 size={18}/></button>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'venues' && venues.map(v => (
              <div key={v.venue_id} className="border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-amber-200 transition-all bg-white flex flex-col shadow-sm">
                <div className="h-48 bg-slate-100">{renderMedia(v.image_url, v.name)}</div>
                <div className="p-6 flex flex-col h-full">
                  <h4 className="font-fredoka text-2xl mb-2">{v.name}</h4>
                  <p className="text-amber-600 text-sm font-bold flex items-center gap-1 mb-2"><MapPin size={14}/> {v.location}</p>
                  <p className="text-slate-600 text-sm mb-2">Capacity: {v.capacity} | ${v.price_per_day}/day</p>
                  {v.vendor_link && (
                    <a href={v.vendor_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs font-bold flex items-center gap-1 mb-4 hover:underline">
                      <ExternalLink size={14}/> Visit Vendor
                    </a>
                  )}
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => handleEditClick('venue', v)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Pencil size={18}/></button>
                    <button onClick={() => handleDelete('venue', v.venue_id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><Trash2 size={18}/></button>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'services' && services.map(s => (
              <div key={s.service_id} className="border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-amber-200 transition-all bg-white flex flex-col shadow-sm">
                <div className="h-48 bg-slate-100">{renderMedia(s.image_url, s.name)}</div>
                <div className="p-6 flex flex-col h-full">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">{s.category}</span>
                  <h4 className="font-fredoka text-2xl mt-1 mb-2">{s.name}</h4>
                  <p className="text-slate-900 font-bold text-lg mb-2">${parseFloat(s.estimated_price).toFixed(2)}</p>
                  {s.vendor_link && (
                    <a href={s.vendor_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs font-bold flex items-center gap-1 mb-4 hover:underline">
                      <ExternalLink size={14}/> Visit Vendor
                    </a>
                  )}
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => handleEditClick('service', s)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Pencil size={18}/></button>
                    <button onClick={() => handleDelete('service', s.service_id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><Trash2 size={18}/></button>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'packages' && packages.map(p => (
              <div key={p.package_id} className="border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-amber-200 transition-all bg-white flex flex-col shadow-sm">
                <div className="h-48 bg-slate-100">{renderMedia(p.image_url, p.name)}</div>
                <div className="p-6 flex flex-col h-full">
                  <h4 className="font-fredoka text-2xl mb-1">{p.name}</h4>
                  <p className="text-amber-600 font-bold text-xl mb-2">${parseFloat(p.price).toFixed(2)}</p>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">{p.description}</p>
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => handleEditClick('package', p)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Pencil size={18}/></button>
                    <button onClick={() => handleDelete('package', p.package_id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><Trash2 size={18}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50 rounded-t-[2.5rem]">
              <div>
                <h2 className="font-fredoka text-3xl text-slate-800">{isEditMode ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}</h2>
                <p className="text-slate-500 text-sm mt-1">Complete your {activeTab.slice(0, -1)} details</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Name</label>
                  <input className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Image URL</label>
                  <input className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
                </div>
              </div>
              
              {/* Package-specific Theme Selector */}
              {activeTab === 'packages' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Assign Theme</label>
                  <select 
                    className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none bg-white cursor-pointer"
                    value={formData.theme_id} 
                    onChange={e => setFormData({...formData, theme_id: e.target.value})}
                    required
                  >
                    <option value="">Select a Theme...</option>
                    {themes.map(theme => (
                      <option key={theme.theme_id} value={theme.theme_id}>
                        {theme.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(activeTab === 'venues' || activeTab === 'services') && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Vendor Website URL</label>
                  <input 
                    placeholder="https://vendor-site.com"
                    className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
                    value={formData.vendor_link} 
                    onChange={e => setFormData({...formData, vendor_link: e.target.value})} 
                  />
                </div>
              )}

              {(activeTab === 'themes' || activeTab === 'packages') && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Description</label>
                  <textarea className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
              )}

              {activeTab === 'venues' && (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Location</label>
                    <input className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-amber-500" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Capacity</label>
                    <input type="number" className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-amber-500" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {(activeTab === 'venues' || activeTab === 'services' || activeTab === 'packages') && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Price</label>
                    <input type="number" className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-amber-500" 
                      value={activeTab === 'venues' ? formData.price_per_day : activeTab === 'services' ? formData.estimated_price : formData.price} 
                      onChange={e => {
                        const val = e.target.value;
                        if(activeTab === 'venues') setFormData({...formData, price_per_day: val});
                        else if(activeTab === 'services') setFormData({...formData, estimated_price: val});
                        else setFormData({...formData, price: val});
                      }} 
                    />
                  </div>
                )}
                {activeTab === 'services' && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Category</label>
                    <input className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-amber-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                )}
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] mt-4">
                {isEditMode ? 'Update' : 'Add New'} {activeTab.slice(0, -1)}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
