import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_doc-database-hub/artifacts/kq2cvlzy_image.png";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <img src={LOGO_URL} alt="iCore Celebrations" className="h-16 w-auto mb-4" />
            <p className="font-nunito text-slate-300 text-base leading-relaxed max-w-md">
              Making birthday party planning simple and magical. Browse themes, venues, 
              services, and packages to create the perfect celebration.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-fredoka text-lg font-semibold mb-4 text-amber-400">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/themes" className="font-nunito text-slate-300 hover:text-amber-400 transition-colors">
                Themes
              </Link>
              <Link to="/venues" className="font-nunito text-slate-300 hover:text-amber-400 transition-colors">
                Venues
              </Link>
              <Link to="/services" className="font-nunito text-slate-300 hover:text-amber-400 transition-colors">
                Services
              </Link>
              <Link to="/packages" className="font-nunito text-slate-300 hover:text-amber-400 transition-colors">
                Packages
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-fredoka text-lg font-semibold mb-4 text-amber-400">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin size={18} className="text-amber-400" />
                <span className="font-nunito">Long Island, NY</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone size={18} className="text-amber-400" />
                <span className="font-nunito">(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail size={18} className="text-amber-400" />
                <span className="font-nunito">hello@icorecelebrations.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 text-center">
          <p className="font-nunito text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} iCore Celebrations. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
