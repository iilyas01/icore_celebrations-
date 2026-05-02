import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Users, MapPin, ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then(r => setOrder(r.data))
      .catch(err => {
        console.error(err);
        toast.error('Order not found');
        navigate('/my-plan');
      })
      .finally(() => setLoading(false));
  }, [orderId, navigate]);

  const handlePayment = async () => {
    if (!cardName || !cardNumber || !expiry || !cvv) {
      toast.error('Please fill in all payment fields');
      return;
    }
    setProcessing(true);
    try {
      await api.post('/checkout/create-session', {
        order_id: orderId,
        origin_url: window.location.origin
      });
      toast.success('Payment successful!');
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      console.error(err);
      toast.error('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-amber-200 rounded-full"></div>
          <p className="text-slate-500 font-nunito">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/my-plan')}
          className="flex items-center gap-2 text-slate-600 hover:text-amber-500 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-nunito font-semibold">Back to My Plan</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h1 className="font-fredoka text-3xl text-slate-900 mb-6">
                Order Summary
              </h1>

              {/* Event Info */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                  <MapPin size={20} className="text-blue-500" />
                  <div>
                    <p className="font-nunito text-xs text-slate-500">Venue</p>
                    <p className="font-nunito font-semibold text-slate-900 text-sm">
                      {order.venue_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
                  <Calendar size={20} className="text-purple-500" />
                  <div>
                    <p className="font-nunito text-xs text-slate-500">Date</p>
                    <p className="font-nunito font-semibold text-slate-900 text-sm">
                      {new Date(order.event_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
                  <Users size={20} className="text-green-500" />
                  <div>
                    <p className="font-nunito text-xs text-slate-500">Guests</p>
                    <p className="font-nunito font-semibold text-slate-900 text-sm">
                      {order.guest_count}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-nunito text-slate-600">Theme</span>
                  <span className="font-nunito font-semibold">{order.theme_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-nunito text-slate-600">Venue</span>
                  <span className="font-nunito font-semibold">{order.venue_name}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                  <span className="font-fredoka text-xl text-slate-900">Total Estimate</span>
                  <span className="font-fredoka text-3xl text-amber-500">
                    ${parseFloat(order.total_estimate || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Pending Notice */}
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="font-nunito text-amber-700 text-sm">
                  ⏳ After payment your order will be <strong>pending admin approval</strong>.
                  You can track the status on your profile page.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgb(0,0,0,0.08)] sticky top-24">
              <h2 className="font-fredoka text-2xl text-slate-900 mb-6">
                Payment Details
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block font-nunito text-sm font-semibold text-slate-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-nunito text-sm font-semibold text-slate-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-nunito text-sm font-semibold text-slate-700 mb-2">
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-nunito text-sm font-semibold text-slate-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                      className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? 'Processing...' : (
                  <>
                    <CreditCard size={20} />
                    Pay Now
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
                <Lock size={14} />
                <span className="font-nunito">Secured Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;