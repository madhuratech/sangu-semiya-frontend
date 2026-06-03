import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrendingUp, FiSmile, FiTarget, FiZap, FiCheckCircle, FiChevronDown } from 'react-icons/fi';

const EnquirySection = ({ trustCards }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', product: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://sangu-semiya-backend-bq1f.onrender.com/api';
    axios.get(`${apiUrl}/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!/^\d{10,}$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number (at least 10 digits)";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const enquiryData = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        product: form.product || 'General Enquiry',
        message: 'Sent from Instant Enquiry form'
      };
      const apiUrl = import.meta.env.VITE_API_URL || 'https://sangu-semiya-backend-bq1f.onrender.com/api';
      await axios.post(`${apiUrl}/enquiry`, enquiryData);

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setForm({ name: '', phone: '', email: '', product: '' });
      setErrors({});
    } catch (err) {
      console.error("Enquiry submission error:", err);
      alert("Something went wrong. Please try again or call us.");
    }
  };

  return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="space-y-10">
            <div className="space-y-2">
              <span className="inline-block py-1 px-3 rounded-full bg-red-50 border border-red-100 text-primary font-medium text-[12px] tracking-widest uppercase">Partnership Trust</span>
              <h2 className="text-2xl md:text-3xl font-medium text-slate-900 tracking-tight leading-none">Built for Business</h2>
            </div>
            
            <div className="space-y-6">
              {trustCards.map((card, i) => (
                <div key={i} className={`flex gap-6 group reveal reveal-left delay-${(i + 1) * 100}`}>
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0 border border-slate-100">
                    {i === 0 && <FiTrendingUp size={20} />}
                    {i === 1 && <FiSmile size={20} />}
                    {i === 2 && <FiTarget size={20} />}
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-sm font-medium text-slate-900 leading-tight uppercase tracking-tight transition-colors duration-300 group-hover:text-secondary">{card.title}</h3>
                     <p className="text-slate-400 font-normal text-xs leading-relaxed opacity-80">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50/50 p-8 lg:p-12 rounded-3xl border border-slate-100 shadow-sm relative">
            <div className="absolute -top-4 -right-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-base shadow-lg text-white font-medium animate-bounce"><FiZap /></div>
            <h3 className="text-xl font-medium text-slate-900 mb-1 tracking-tight leading-none italic">Instant Enquiry</h3>
            <p className="text-slate-400 font-normal mb-8 text-xs opacity-70">Quick response guaranteed within 2 hours.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-[12px] uppercase font-medium tracking-widest text-slate-400 pl-1">Your Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-200 focus:border-primary rounded-lg p-3 font-medium text-xs text-slate-900 shadow-sm transition-all outline-none" 
                  placeholder="Enter name"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[12px] uppercase font-medium tracking-widest text-slate-400 pl-1">Email Address *</label>
                <input 
                  type="email" 
                  className={`w-full bg-white border ${errors.email ? 'border-[#d32f2f]' : 'border-slate-200'} focus:border-primary rounded-lg p-3 font-medium text-xs text-slate-900 shadow-sm transition-all outline-none`} 
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => {
                    setForm({...form, email: e.target.value});
                    if (errors.email) setErrors({...errors, email: null});
                  }}
                  onBlur={(e) => {
                    if (e.target.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
                      setErrors(prev => ({...prev, email: "Please enter a valid email address"}));
                    }
                  }}
                  required
                />
                {errors.email && <p className="text-[#d32f2f] text-[13px] font-medium mt-1 pl-1">{errors.email}</p>}
              </div>
              {/* Product Dropdown */}
              <div className="space-y-1">
                <label className="block text-[12px] uppercase font-medium tracking-widest text-slate-400 pl-1">Product Interest</label>
                <div className="relative">
                  <select
                    value={form.product}
                    onChange={(e) => setForm({ ...form, product: e.target.value })}
                    className="w-full appearance-none bg-white border-2 border-yellow-400 focus:border-yellow-500 rounded-lg px-3 py-3 pr-10 font-medium text-xs text-slate-900 shadow-sm transition-all outline-none cursor-pointer"
                    required
                  >
                    <option value="">Select a product</option>
                    {products.map((p) => (
                      <option key={p.id || p._id} value={p.name}>{p.name}</option>
                    ))}
                    <option value="All Products">Combination / All Products</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                    <FiChevronDown size={15} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[12px] uppercase font-medium tracking-widest text-slate-400 pl-1">Phone Number *</label>
                <input 
                  type="tel" 
                  className={`w-full bg-white border ${errors.phone ? 'border-[#d32f2f] text-[#d32f2f]' : 'border-slate-200'} focus:border-primary rounded-lg p-3 font-medium text-xs text-slate-900 shadow-sm transition-all outline-none`} 
                  placeholder="+91..."
                  value={form.phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^[0-9]+$/.test(val)) {
                      setForm({...form, phone: val});
                      if (errors.phone) setErrors({...errors, phone: null});
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value && !/^\d{10,}$/.test(e.target.value)) {
                      setErrors(prev => ({...prev, phone: "Please enter a valid phone number (at least 10 digits)"}));
                    }
                  }}
                  required
                />
                {errors.phone && <p className="text-[#d32f2f] text-[13px] font-medium mt-1 pl-1">{errors.phone}</p>}
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-primary text-white py-3 rounded-lg font-medium text-[14px] uppercase tracking-widest shadow-md transition-all duration-300 mt-2">
                 Submit Enquiry
              </button>
            </form>
          </div>
        </div>

        {/* Custom Success Popup */}
        {submitted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-emerald-500" size={32} />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-2">Successfully Sent!</h3>
              <p className="text-slate-500 text-sm mb-6">Thank you for your enquiry. We will get back to you shortly.</p>
              <button onClick={() => setSubmitted(false)} className="bg-slate-900 text-white w-full py-3 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-primary transition-colors">
                Close
              </button>
            </div>
          </div>
        )}

      </div>
  );
};

export default EnquirySection;
