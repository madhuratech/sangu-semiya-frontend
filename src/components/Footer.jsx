import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import logo from '../assets/Sangu-Brand-Semiya-Logo.png';
import { FiMapPin, FiPhone, FiMail, FiMessageCircle } from 'react-icons/fi';

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories for footer', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: '#C8342A' }}
    >
      {/* Decorative floral SVG background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="floral" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Petal group */}
              <circle cx="60" cy="60" r="22" fill="none" stroke="white" strokeWidth="1.5"/>
              <ellipse cx="60" cy="38" rx="8" ry="16" fill="white" opacity="0.5" transform="rotate(0 60 60)"/>
              <ellipse cx="60" cy="38" rx="8" ry="16" fill="white" opacity="0.5" transform="rotate(45 60 60)"/>
              <ellipse cx="60" cy="38" rx="8" ry="16" fill="white" opacity="0.5" transform="rotate(90 60 60)"/>
              <ellipse cx="60" cy="38" rx="8" ry="16" fill="white" opacity="0.5" transform="rotate(135 60 60)"/>
              <ellipse cx="60" cy="38" rx="8" ry="16" fill="white" opacity="0.5" transform="rotate(180 60 60)"/>
              <ellipse cx="60" cy="38" rx="8" ry="16" fill="white" opacity="0.5" transform="rotate(225 60 60)"/>
              <ellipse cx="60" cy="38" rx="8" ry="16" fill="white" opacity="0.5" transform="rotate(270 60 60)"/>
              <ellipse cx="60" cy="38" rx="8" ry="16" fill="white" opacity="0.5" transform="rotate(315 60 60)"/>
              <circle cx="60" cy="60" r="6" fill="white" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#floral)"/>
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="mb-4">
              <img
                src={logo}
                alt="Sangu Brand Logo"
                className="h-28 w-28 object-contain rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <h2 className="text-lg font-medium tracking-wide mb-1">Sangu Brand Semiya™</h2>
            <p className="text-sm text-red-100 font-medium">GSTIN : 33ABKPC7067J1ZK</p>
          </div>

          {/* Column 2 — Categories */}
          <div>
            <h3 className="text-base font-medium mb-4 border-b border-red-400 pb-2">Categories</h3>
            <ul className="space-y-2">
              {categories.length > 0 ? (
                categories.slice(0, 6).map((cat) => (
                  <li key={cat._id || cat.id}>
                    <Link
                      to="/products"
                      className="text-sm text-red-100 hover:text-white transition-colors duration-200"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-red-300 italic">Exploring collections...</li>
              )}
            </ul>
          </div>

          {/* Column 3 — Quick Links */}
          <div>
            <h3 className="text-base font-medium mb-4 border-b border-red-400 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-red-100 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-sm text-red-100 hover:text-white transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
        
              <li>
                <Link to="/blog" className="text-sm text-red-100 hover:text-white transition-colors duration-200">
                  Blog & Recipe
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-red-100 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Get In Touch */}
          <div>
            <h3 className="text-base font-medium mb-4 border-b border-red-400 pb-2">Get In Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-red-100">
                <FiMapPin size={16} className="mt-0.5 shrink-0 text-white" />
                <a
  href="https://www.google.com/maps/place/VANMATHI+SEMIYA+WORKS/@11.0449269,76.8835042,14z/data=!4m10!1m2!2m1!1s344+Periyannan+Nagar,+Thadagam+Road,+Tvs+Nagar,+Coimbatore+641025!3m6!1s0x3ba859e99e65332d:0x4a10bd96a1f192ab!8m2!3d11.0449269!4d76.9195531!15sCkEzNDQgUGVyaXlhbm5hbiBOYWdhciwgVGhhZGFnYW0gUm9hZCwgVHZzIE5hZ2FyLCBDb2ltYmF0b3JlIDY0MTAyNZIBEWZvb2RfbWFudWZhY3R1cmVy4AEA!16s%2Fg%2F11z0v6vr34?entry=ttu"
  target="_blank"
  rel="noopener noreferrer"
  className="text-red-100 hover:text-yellow-400 no-underline hover:no-underline transition-colors duration-300"
>
                   Vanmathi Semiya Works
                   <br />344 / 3, Periyannan Nagar, Thadagam Road, Tvs Nagar, Coimbatore-641 025
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-red-100">
                <FiPhone size={15} className="shrink-0 text-white" />
                <a href="tel:04222395630" className="hover:text-white transition-colors">0422 239 5630</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-red-100">
                <FiPhone size={15} className="shrink-0 text-white" />
                <a href="tel:+919677707416" className="hover:text-white transition-colors">96777 07416</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-red-100">
                <FiPhone size={15} className="shrink-0 text-white" />
                <a href="tel:+919443655877" className="hover:text-white transition-colors">94436 55877</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-red-100">
                <FiMail size={15} className="shrink-0 text-white" />
                <a href="mailto:info@sangubrandsemiya.com" className="hover:text-white transition-colors break-all">
                  info@sangubrandsemiya.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-red-100">
                <FiMail size={15} className="shrink-0 text-white" />
                <a href="mailto:info.sangubrandsemiya@gmail.com" className="hover:text-white transition-colors break-all">
                  info.sangubrandsemiya@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>



        {/* Bottom Bar */}
       <div className="relative mt-10 pt-5 border-t border-red-500 flex flex-col sm:flex-row items-center justify-center text-center gap-2">
  
  <p className="text-sm text-red-100">
    2026 © All Rights Reserved By Sangu Brand Semiya
  </p>

  <p className="text-sm text-red-100">
    Developed by{" "}
    <a
      href="https://madhuratech.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white hover:text-yellow-400 transition-colors duration-300"
    >
      Madhura Technologies
    </a>
  </p>

</div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919677707416"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 text-white"
        style={{ backgroundColor: '#25D366' }}
        aria-label="Chat on WhatsApp"
      >
        <FiMessageCircle size={32} />
      </a>
    </footer>
  );
};

export default Footer;
