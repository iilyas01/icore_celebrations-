import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import api from '../services/api';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(r => setOrders(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={14} className="text-green-500" />;
      case 'cancelled': return <XCircle size={14} className="text-red-500" />;
      default: return <Clock size={14} className="text-amber-500" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  const getPaymentStyle = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'refunded': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const activeOrders = orders.filter(o => o.order_status === 'pending' || o.order_status === 'confirmed');
  const pastOrders = orders.filter(o => o.order_status === 'cancelled');

  const OrderCard = ({ order, faded = false }) => (
    <div className={`border border-slate-100 rounded-2xl p-6 hover:border-amber-200 transition-colors ${faded ? 'opacity-70' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-fredoka text-xl text-slate-900">{order.theme_name}</h3>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(order.order_status)}`}>
              {getStatusIcon(order.order_status)}
              {order.order_status}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-nunito">
            <span>📍 {order.venue_name}</span>
            <span>📅 {new Date(order.event_date).toLocaleDateString()}</span>
            <span>👥 {order.guest_count} guests</span>
            <span>🔖 Order #{order.order_id}</span>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-fredoka text-2xl ${faded ? 'text-slate-400' : 'text-amber-500'}`}>
            ${parseFloat(order.total_estimate || 0).toFixed(2)}
          </p>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-1 ${getPaymentStyle(order.payment_status)}`}>
            {order.payment_status}
          </span>
        </div>
      </div>

      {order.order_status === 'pending' && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="font-nunito text-amber-700 text-sm">
            ⏳ Your order is pending admin approval. You'll be notified once it's confirmed.
          </p>
        </div>
      )}
      {order.order_status === 'confirmed' && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="font-nunito text-green-700 text-sm">
            ✅ Your order has been confirmed! Get ready to celebrate!
          </p>
        </div>
      )}
      {order.order_status === 'cancelled' && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="font-nunito text-red-700 text-sm">
            ❌ This order was cancelled. Please contact us for more information.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            <User size={16} />
            My Profile
          </div>
          <h1 className="font-fredoka text-4xl sm:text-5xl text-slate-900 mb-4">
            My <span className="gradient-text">Account</span>
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="font-fredoka text-2xl text-white">
                  {user?.name ? user.name[0].toUpperCase() : user?.email[0].toUpperCase()}
                </span>
              </div>
              <div>
                {user?.name && (
                  <h2 className="font-fredoka text-2xl text-slate-900">{user.name}</h2>
                )}
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail size={16} />
                  <span className="font-nunito">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Shield size={16} className="text-amber-500" />
                  <span className="font-nunito text-sm text-amber-600 font-semibold capitalize">
                    {user?.role || 'Customer'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="py-2 px-6 border-2 border-red-200 rounded-full font-nunito font-semibold text-red-500 hover:bg-red-50 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="font-fredoka text-2xl text-slate-900 mb-6 flex items-center gap-2">
            <Package size={24} className="text-amber-500" />
            My Orders
          </h2>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="font-nunito text-slate-500 mb-4">No orders yet</p>
              <button onClick={() => navigate('/themes')} className="btn-primary px-8 py-3">
                Start Planning
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Active Orders */}
              {activeOrders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 bg-amber-400 rounded-full inline-block"></span>
                    <h3 className="font-fredoka text-xl text-slate-900">Active Orders</h3>
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold">
                      {activeOrders.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {activeOrders.map(order => (
                      <OrderCard key={order.order_id} order={order} />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Orders */}
              {pastOrders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 bg-slate-300 rounded-full inline-block"></span>
                    <h3 className="font-fredoka text-xl text-slate-500">Past Orders</h3>
                    <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs font-bold">
                      {pastOrders.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {pastOrders.map(order => (
                      <OrderCard key={order.order_id} order={order} faded={true} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;