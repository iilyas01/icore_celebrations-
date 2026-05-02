import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, PartyPopper, Gift, ArrowRight } from 'lucide-react';

const HERO_IMAGE = "https://static.prod-images.emergentagent.com/jobs/9c461df2-909a-4d6a-96a9-f33fb4dff5c7/images/4c3b5486614e08b4b1c831f4d8b41d6b9f0f1e5f2494f709178ed0bad39118b8.png";
const CAKE_IMAGE = "https://static.prod-images.emergentagent.com/jobs/9c461df2-909a-4d6a-96a9-f33fb4dff5c7/images/7a9731b15e13d4e5e0fa68395f71769c7b24dd2240945800ac46c6b1bb14629d.png";
const DECOR_IMAGE = "https://static.prod-images.emergentagent.com/jobs/9c461df2-909a-4d6a-96a9-f33fb4dff5c7/images/ba62ee8e10e97ca4c58a0e49410306b447511c827eb19b8ad7e7d1c9a784dee7.png";


const HomePage = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      title: "Magical Themes",
      description: "From superheroes to princesses, find the perfect theme for your celebration.",
      link: "/themes"
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-500" />,
      title: "Amazing Venues",
      description: "Discover fantastic venues across Long Island for your special day.",
      link: "/venues"
    },
    {
      icon: <PartyPopper className="w-8 h-8 text-purple-500" />,
      title: "Top Services",
      description: "Cakes, entertainment, photography, and more from trusted vendors.",
      link: "/services"
    },
    {
      icon: <Gift className="w-8 h-8 text-pink-500" />,
      title: "Complete Packages",
      description: "All-inclusive packages to make planning a breeze.",
      link: "/packages"
    }
  ];

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left animate-slide-up">
              <h1 className="font-fredoka text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 mb-6">
                Plan the{' '}
                <span className="gradient-text">Perfect Party</span>{' '}
                for Your Little One
              </h1>
              <p className="font-nunito text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 max-w-xl">
                Discover themes, venues, services, and packages all in one place. 
                Create magical birthday celebrations with iCore Celebrations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/themes"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
                  data-testid="explore-themes-btn"
                >
                  Explore Themes
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
                  data-testid="get-started-btn"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <img
                src={HERO_IMAGE}
                alt="Birthday celebration"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-fredoka text-3xl sm:text-4xl text-slate-900 mb-4">
              Everything You Need for the{' '}
              <span className="text-amber-500">Perfect Celebration</span>
            </h2>
            <p className="font-nunito text-lg text-slate-600 max-w-2xl mx-auto">
              Browse our curated selection of themes, venues, services, and packages to create 
              an unforgettable birthday experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={feature.title}
                to={feature.link}
                className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`feature-${feature.title.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="bg-slate-50 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="font-fredoka text-xl text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="font-nunito text-slate-600">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                Premium Services
              </span>
              <h2 className="font-fredoka text-3xl sm:text-4xl text-slate-900 mb-6">
                From Cakes to Entertainment
              </h2>
              <p className="font-nunito text-lg text-slate-600 leading-relaxed mb-8">
                Partner with Long Island's finest vendors for custom cakes, professional 
                photography, entertainment, catering, and more. Every detail matters 
                when creating magical memories.
              </p>
              <Link
                to="/services"
                className="btn-primary inline-flex items-center gap-2"
                data-testid="browse-services-btn"
              >
                Browse Services
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
              <img
                src={CAKE_IMAGE}
                alt="Birthday cake"
                className="w-full h-64 object-cover rounded-3xl shadow-lg"
              />
              <img
                src={DECOR_IMAGE}
                alt="Party decorations"
                className="w-full h-64 object-cover rounded-3xl shadow-lg mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-fredoka text-3xl sm:text-4xl text-white mb-6">
            Ready to Plan Your Celebration?
          </h2>
          <p className="font-nunito text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Sign up today and start building your dream party. It's free to get started!
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-amber-600 rounded-full px-8 py-4 font-bold font-nunito shadow-lg hover:shadow-xl transition-all hover:scale-105"
            data-testid="cta-signup-btn"
          >
            Create Free Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
