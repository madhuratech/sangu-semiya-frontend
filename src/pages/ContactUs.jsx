import { useState } from 'react';
import axios from 'axios';
import { FiMapPin, FiPhone, FiMail, FiMessageCircle, FiSend, FiClock, FiCheckCircle } from 'react-icons/fi';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', product: '', quantity: '', message: '' });
  const [errors, setErrors] = useState({ name: '', phone: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', phone: '', email: '' };

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^\+?[\d\s-]{10,}$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
      valid = false;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 1. Save to Database
      await axios.post('https://sangu-semiya-backend-bq1f.onrender.com/api/enquiry', form);

      // 2. Send Email via Resend
      const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;
      if (resendApiKey) {
        try {
          await axios.post(
            'https://api.resend.com/emails',
            {
              from: 'Sangu Brand Semiya <onboarding@resend.dev>',
              to: 'dina@madhuratech.in',
              subject: 'New Enquiry from Sangu Brand Semiya',
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                  <h2 style="color: #DA291C; border-bottom: 2px solid #FDB913; padding-bottom: 10px;">New Contact Enquiry</h2>
                  <p><strong>Name:</strong> ${form.name}</p>
                  <p><strong>Phone:</strong> ${form.phone}</p>
                  <p><strong>Email:</strong> ${form.email || 'N/A'}</p>
                  <p><strong>Product Interest:</strong> ${form.product || 'General'}</p>
                  <p><strong>Quantity:</strong> ${form.quantity || 'N/A'}</p>
                  <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #FDB913;">
                    <strong>Message:</strong><br/>
                    ${form.message ? form.message.replace(/\n/g, '<br/>') : 'N/A'}
                  </p>
                </div>
              `
            },
            {
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
              }
            }
          );
        } catch (resendErr) {
          console.error('Failed to send email via Resend:', resendErr);
        }
      } else {
        console.warn('VITE_RESEND_API_KEY is not defined in env variables.');
      }

      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', product: '', quantity: '', message: '' });
      setErrors({ name: '', phone: '', email: '' });
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
                lines: ['344 / 3, Periyannan Nagar,', 'Thadagam Road, Tvs Nagar,', 'Coimbatore - 641 025'],
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
              },
              {
                icon: <FiClock size={24} />,
                title: 'Business Hours',
                lines: ['Monday – Saturday', '9:00 AM – 6:00 PM', 'Sunday – Closed'],
                color: 'from-violet-500 to-violet-700',
              },
            ].map((card, i) => (
              <div key={i} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300 group text-center">
                <div className={`w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg transition-transform duration-300`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-3 uppercase tracking-tight">{card.title}</h3>
                <div className="space-y-1">
                  {card.lines.map((line, j) => (
                    card.links ? (
                      <a key={j} href={card.links[j]} className="block text-[17px] text-slate-500 font-normal hover:text-secondary transition-colors">
                        {line}
                      </a>
                    ) : (
                      <p key={j} className="text-[17px] text-slate-500 font-normal">{line}</p>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form + WhatsApp */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            
            {/* Form - takes 3 columns */}
            <div className="lg:col-span-3 bg-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-100 shadow-sm">
              <h2 className="text-3xl font-medium text-slate-900 mb-2 tracking-tight italic">Send Us a Message</h2>
              <p className="text-slate-500 font-normal mb-8 text-sm">Quick response guaranteed within 2 hours.</p>

              {submitted && (
                <div className="mb-8 p-5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                  <FiCheckCircle className="text-emerald-600 shrink-0" size={20} />
                  <p className="text-emerald-800 font-medium text-xs">{"Thank you! Your enquiry has been received. We'll get back to you shortly."}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] uppercase font-medium tracking-widest text-slate-400 mb-2">Your Name *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                      className={`w-full bg-white border ${errors.name ? 'border-secondary focus:border-secondary' : 'border-slate-200 focus:border-secondary'} rounded-xl p-4 font-medium text-sm text-slate-900 shadow-sm transition-all outline-none`}
                      placeholder="Enter your name" />
                    {errors.name && <p className="text-secondary text-xs mt-1 font-medium">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-[13px] uppercase font-medium tracking-widest text-slate-400 mb-2">Email Address</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                      className={`w-full bg-white border ${errors.email ? 'border-secondary focus:border-secondary' : 'border-slate-200 focus:border-secondary'} rounded-xl p-4 font-medium text-sm text-slate-900 shadow-sm transition-all outline-none`}
                      placeholder="your@email.com" />
                    {errors.email && <p className="text-secondary text-xs mt-1 font-medium">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] uppercase font-medium tracking-widest text-slate-400 mb-2">Phone Number *</label>
                    <input type="tel" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                      className={`w-full bg-white border ${errors.phone ? 'border-secondary focus:border-secondary' : 'border-slate-200 focus:border-secondary'} rounded-xl p-4 font-medium text-sm text-slate-900 shadow-sm transition-all outline-none`}
                      placeholder="+91..." />
                    {errors.phone && <p className="text-secondary text-xs mt-1 font-medium">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-[13px] uppercase font-medium tracking-widest text-slate-400 mb-2">Product Interest</label>
                    <select value={form.product} onChange={(e) => setForm({...form, product: e.target.value})}
                      className="w-full bg-white border border-slate-200 focus:border-secondary rounded-xl p-4 font-medium text-sm text-slate-900 shadow-sm transition-all outline-none">
                      <option value="">Select a product</option>
                      <option value="Roasted Vermicelli">Roasted Vermicelli</option>
                      <option value="Ragi Vermicelli">Ragi Vermicelli</option>
                      <option value="Kambu Vermicelli">Kambu Vermicelli</option>
                      <option value="Wheat Vermicelli">Wheat Vermicelli</option>
                      <option value="Veg Noodles">Veg Noodles</option>
                      <option value="Chinese Noodles">Chinese Noodles</option>
                      <option value="Samba Wheat Broken">Samba Wheat Broken</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] uppercase font-medium tracking-widest text-slate-400 mb-2">Quantity (KG)</label>
                  <input type="text" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})}
                    className="w-full bg-white border border-slate-200 focus:border-secondary rounded-xl p-4 font-medium text-sm text-slate-900 shadow-sm transition-all outline-none"
                    placeholder="e.g. 500 KG" />
                </div>
                <div>
                  <label className="block text-[13px] uppercase font-medium tracking-widest text-slate-400 mb-2">Your Message</label>
                  <textarea rows="3" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                    className="w-full bg-white border border-slate-200 focus:border-secondary rounded-xl p-4 font-medium text-sm text-slate-900 shadow-sm transition-all outline-none resize-none"
                    placeholder="Tell us about your requirements..." />
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
              <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-sm aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.123!2d76.94!3d11.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAxJzEyLjAiTiA3NsKwNTYnMjQuMCJF!5e0!3m2!1sen!2sin!4v1616161616161!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sangu Brand Semiya Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactUs;
