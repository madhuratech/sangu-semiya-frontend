import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMapPin, FiPhone, FiMail, FiMessageCircle, FiSend, FiClock, FiCheckCircle, FiChevronDown } from 'react-icons/fi';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', product: '', message: '' });
  const [errors, setErrors] = useState({ name: '', phone: '', email: '' });
  const [touched, setTouched] = useState({ name: false, phone: false, email: false });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://sangu-semiya-backend-bq1f.onrender.com/api';
    axios.get(`${apiUrl}/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const validateField = (fieldName, value) => {
    let error = '';
    if (fieldName === 'name') {
      if (!value.trim()) {
        error = 'Name is required';
      }
    } else if (fieldName === 'phone') {
      if (!value.trim()) {
        error = 'Phone number is required';
      } else if (!/^\d{10,}$/.test(value)) {
        error = 'Please enter a valid phone number (at least 10 digits)';
      }
    } else if (fieldName === 'email') {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address';
      }
    }
    return error;
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, form[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleChange = (fieldName, value) => {
    setForm(prev => ({ ...prev, [fieldName]: value }));
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched and run full validation
    setTouched({ name: true, phone: true, email: true });
    const nameError = validateField('name', form.name);
    const phoneError = validateField('phone', form.phone);
    const emailError = validateField('email', form.email);

    const newErrors = { name: nameError, phone: phoneError, email: emailError };
    setErrors(newErrors);

    if (nameError || phoneError || emailError) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save to Database
      const apiUrl = import.meta.env.VITE_API_URL || 'https://sangu-semiya-backend-bq1f.onrender.com/api';
      await axios.post(`${apiUrl}/enquiry`, { ...form });

      // Email sending is now handled by the backend directly in the /api/enquiry endpoint.

      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', product: '', message: '' });
      setErrors({ name: '', phone: '', email: '' });
      setTouched({ name: false, phone: false, email: false });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Enquiry submission error:', err);
      alert('Something went wrong. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white font-sans">

      {/* Hero Banner */}
      <section className="relative bg-slate-900 py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-primary border border-white/10 font-medium text-[13px] tracking-widest uppercase mb-2">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-slate-400 font-normal max-w-xl mx-auto">
            {"Ready to partner with us? Have questions about our products? We'd love to hear from you."}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              {
                icon: <FiMapPin size={24} />,
                title: 'Visit Us',
                lines: ['Vanmathi Semiya Works', '344 / 3, Periyannan Nagar,', 'Thadagam Road, Tvs Nagar,', 'Coimbatore - 641 025'],
                color: 'from-secondary to-red-700',
              },
              {
                icon: <FiPhone size={24} />,
                title: 'Call Us',
                lines: ['0422 239 5630', '96777 07416', '94436 55877'],
                links: ['tel:04222395630', 'tel:+919677707416', 'tel:+919443655877'],
                color: 'from-primary to-yellow-600',
              },
              {
                icon: <FiMail size={24} />,
                title: 'Email Us',
                lines: ['info@sangubrandsemiya.com', 'info.sangubrandsemiya@gmail.com'],
                links: ['mailto:info@sangubrandsemiya.com', 'mailto:info.sangubrandsemiya@gmail.com'],
                color: 'from-emerald-500 to-emerald-700',
                textClass: 'break-all text-[13px]',
              },
              {
                icon: <FiClock size={24} />,
                title: 'Business Hours',
                lines: ['Monday – Saturday', '9:00 AM – 6:00 PM', 'Sunday – Closed'],
                color: 'from-violet-500 to-violet-700',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300 group text-center"
                onClick={card.mapLink ? () => window.open(card.mapLink, '_blank', 'noopener,noreferrer') : undefined}
                style={card.mapLink ? { cursor: 'pointer' } : {}}
              >
                <div className={`w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg transition-transform duration-300`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-3 uppercase tracking-tight">{card.title}</h3>
                <div className="space-y-1">
                  {card.lines.map((line, j) => (
                    card.links ? (
                      <a key={j} href={card.links[j]} className={`block ${card.textClass || 'text-[17px]'} text-slate-500 font-normal hover:text-secondary transition-colors`}>
                        {line}
                      </a>
                    ) : (
                      <p key={j} className="text-[17px] text-slate-500 font-normal">{line}</p>
                    )
                  ))}
                </div>
                {card.mapLink && (
                  <p className="mt-3 text-xs text-secondary font-medium opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">Open in Maps ↗</p>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form + WhatsApp */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            
            {/* Form - takes 3 columns */}
            <div className="lg:col-span-3 bg-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-100 shadow-sm">
              <h2 className="text-3xl font-medium text-slate-900 mb-2 tracking-tight italic">Send Us a Message</h2>
              <p className="text-slate-500 font-normal mb-8 text-sm">Quick response guaranteed within 2 hours.</p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] uppercase font-medium tracking-widest text-slate-400 mb-2">Your Name *</label>
                    <input type="text" value={form.name} 
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      className={`w-full bg-white border ${errors.name ? 'border-secondary focus:border-secondary' : 'border-slate-200 focus:border-primary'} rounded-xl p-4 font-medium text-sm text-slate-900 shadow-sm transition-all outline-none`}
                      placeholder="Enter your name" />
                    {errors.name && <p className="text-secondary text-xs mt-1 font-medium">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-[13px] uppercase font-medium tracking-widest text-slate-400 mb-2">Email Address</label>
                    <input type="email" value={form.email} 
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`w-full bg-white border ${errors.email ? 'border-secondary focus:border-secondary' : 'border-slate-200 focus:border-primary'} rounded-xl p-4 font-medium text-sm text-slate-900 shadow-sm transition-all outline-none`}
                      placeholder="your@email.com" />
                    {errors.email && <p className="text-secondary text-xs mt-1 font-medium">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] uppercase font-medium tracking-widest text-slate-400 mb-2">Phone Number *</label>
                    <input type="tel" value={form.phone} 
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^[0-9]+$/.test(val)) {
                        handleChange('phone', val);
                      }
                    }}
                      onBlur={() => handleBlur('phone')}
                      className={`w-full bg-white border ${errors.phone ? 'border-secondary focus:border-secondary' : 'border-slate-200 focus:border-primary'} rounded-xl p-4 font-medium text-sm text-slate-900 shadow-sm transition-all outline-none`}
                      placeholder="+91..." />
                    {errors.phone && <p className="text-secondary text-xs mt-1 font-medium">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-[13px] uppercase font-medium tracking-widest text-slate-400 mb-2">Product Interest</label>
                    <div className="relative">
                      <select
                        value={form.product}
                        onChange={(e) => setForm({ ...form, product: e.target.value })}
                        className="w-full appearance-none bg-white border-2 border-yellow-400 focus:border-yellow-500 rounded-xl p-4 pr-10 font-medium text-sm text-slate-900 shadow-sm transition-all outline-none cursor-pointer"
                      >
                        <option value="">Select a product</option>
                        {products.map((p) => (
                          <option key={p.id || p._id} value={p.name}>{p.name}</option>
                        ))}
                        <option value="All Products">Combination / All Products</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                        <FiChevronDown size={18} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] uppercase font-medium tracking-widest text-slate-400 mb-2">Your Message</label>
                  <textarea rows="3" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                    className="w-full bg-white border border-slate-200 focus:border-primary rounded-xl p-4 font-medium text-sm text-slate-900 shadow-sm transition-all outline-none resize-none"
                    placeholder="Tell us about your requirements..." />
                </div>
                </div>
                <button type="submit" disabled={isSubmitting} className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondary hover:bg-red-700'} text-white py-4 rounded-xl font-medium text-[15px] uppercase tracking-widest shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}>
                  <FiSend size={16} /> {isSubmitting ? 'Submitting Message...' : 'Submit Message'}
                </button>
              </form>
            </div>

            {/* Side Info - takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-8 text-white text-center shadow-lg">
                <FiMessageCircle size={36} className="mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Chat on WhatsApp</h3>
                <p className="text-emerald-50/70 text-sm mb-6">Get instant responses for quick enquiries</p>
                <a href="https://wa.me/919677707416" target="_blank" rel="noopener noreferrer"
                  className="inline-block bg-white text-emerald-700 px-8 py-3 rounded-xl font-medium text-[15px] uppercase tracking-widest hover:bg-emerald-50 transition-all duration-300 shadow-lg">
                  WhatsApp Us
                </a>
              </div>

              {/* GSTIN Info */}
              <div className="bg-slate-900 rounded-3xl p-8 text-center shadow-md">
                <h3 className="text-lg font-medium text-white mb-2 uppercase tracking-tight">Business Details</h3>
                <div className="space-y-1">
                  <p className="text-[14px] font-medium uppercase tracking-widest text-slate-500">Sangu Brand Semiya™</p>
                  <p className="text-primary font-medium text-xs tracking-wide">GST: 33ABKPC7067J1ZK</p>
                </div>
              </div>

              {/* Map container */}
              <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-sm aspect-video relative group cursor-pointer">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.123!2d76.94!3d11.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAxJzEyLjAiTiA3NsKwNTYnMjQuMCJF!5e0!3m2!1sen!2sin!4v1616161616161!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, pointerEvents: 'none' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sangu Brand Semiya Location"
                ></iframe>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Sangu+Brand+Semiya,+344+Periyannan+Nagar,+Thadagam+Road,+Coimbatore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-end justify-center pb-4"
                >
                  <span className="bg-white text-slate-700 text-xs font-medium px-4 py-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5">
                    <FiMapPin size={12} /> Open in Google Maps
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Success Popup */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-emerald-500" size={32} />
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-2">Successfully Sent!</h3>
            <p className="text-slate-500 text-sm mb-6">Thank you for your message. We will get back to you shortly.</p>
            <button onClick={() => setSubmitted(false)} className="bg-slate-900 text-white w-full py-3 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-primary transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ContactUs;
