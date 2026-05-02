import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Home, User } from 'lucide-react';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={56} className="text-green-500" />
            </div>
          </div>

          <h1 className="font-fredoka text-4xl text-slate-900 mb-4">
            Payment Successful! 🎉
          </h1>

          <p className="font-nunito text-slate-600 mb-2">
            Your celebration is booked!
          </p>

          {orderId && (
            <p className="font-nunito text-slate-400 text-sm mb-6">
              Order #{orderId}
            </p>
          )}

          {/* Pending Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 text-left">
            <p className="font-fredoka text-lg text-amber-700 mb-2">
              ⏳ Pending Admin Approval
            </p>
            <p className="font-nunito text-amber-600 text-sm leading-relaxed">
              Your order has been submitted and is currently awaiting admin approval.
              You can track the status of your order on your profile page.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              <User size={18} />
              View Order Status
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 border-2 border-slate-200 rounded-full font-nunito font-semibold text-slate-600 hover:border-amber-400 hover:text-amber-600 transition-all flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;