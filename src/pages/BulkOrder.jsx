import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiShield, FiTruck, FiBox, FiPhoneCall, FiMessageCircle } from 'react-icons/fi';

const BulkOrder = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product: '',
    quantity: '',
    message: ''
  });
  const [errors, setErrors] = useState({ name: '', phone: '', email: '' });
  const [touched, setTouched] = useState({ name: false, phone: false, email: false });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://sangu-semiya-backend-bq1f.onrender.com/api/products');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products', err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // If navigated from product page with query param
    const searchParams = new URLSearchParams(location.search);
    const prodName = searchParams.get('product');
    const size = searchParams.get('size');
    if (prodName || size) {
      setFormData(prev => ({ 
        ...prev, 
        product: prodName || '', 
        message: size ? `Source: ${size} variant. ` : '' 
      }));
    }
  }, [location]);

  const validateField = (fieldName, value) => {
    let error = '';
    if (fieldName === 'name') {
      if (!value.trim()) {
        error = 'Name is required';
      }
    } else if (fieldName === 'phone') {
      if (!value.trim()) {
        error = 'Phone number is required';
      } else if (!/^\+?[\d\s-]{10,}$/.test(value)) {
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
    const error = validateField(fieldName, formData[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all validated fields as touched and run full validation
    setTouched({ name: true, phone: true, email: true });
    const nameError = validateField('name', formData.name);
    const phoneError = validateField('phone', formData.phone);
    const emailError = validateField('email', formData.email);

    const newErrors = { name: nameError, phone: phoneError, email: emailError };
    setErrors(newErrors);

    if (nameError || phoneError || emailError) {
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('https://sangu-semiya-backend-bq1f.onrender.com/api/enquiry', formData);
      alert('Enquiry submitted successfully! Our team will contact you soon.');
      setFormData({ name: '', phone: '', email: '', product: '', quantity: '', message: '' });
      setErrors({ name: '', phone: '', email: '' });
      setTouched({ name: false, phone: false, email: false });
    } catch (err) {
      console.error('Submission error:', err);
      alert('Network issue: Please try contacting us via WhatsApp instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const text = `Hi Sangu Semiya team, I want to bulk order %0a*Product:* ${formData.product || 'Any'} %0a*Quantity:* ${formData.quantity || 'TBD'} %0a*Message:* ${formData.message || 'N/A'}`;
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Partner with Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Are you a distributor, wholesaler, or caterer? Fill out the form below for special bulk pricing and dealer benefits.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 max-w-5xl mx-auto">
          
          {/* Info Side */}
          <div className="lg:w-2/5 bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10"></div>
             
             <div className="relative z-10">
               <h3 className="text-3xl font-medium mb-6">Distributor Benefits</h3>
               <ul className="space-y-4 mb-12">
                 <li className="flex items-center gap-3"><div className="w-6 h-6 bg-red-400/20 rounded-lg flex items-center justify-center"><FiShield className="text-white" size={14} /></div> High profit margins</li>
                 <li className="flex items-center gap-3"><div className="w-6 h-6 bg-red-400/20 rounded-lg flex items-center justify-center"><FiBox className="text-white" size={14} /></div> Marketing support & materials</li>
                 <li className="flex items-center gap-3"><div className="w-6 h-6 bg-red-400/20 rounded-lg flex items-center justify-center"><FiTruck className="text-white" size={14} /></div> Priority dispatch pan-India</li>
                 <li className="flex items-center gap-3"><div className="w-6 h-6 bg-red-400/20 rounded-lg flex items-center justify-center"><FiPhoneCall className="text-white" size={14} /></div> Direct factory connect</li>
               </ul>

               <div className="space-y-3">
                 <p className="font-medium text-red-100">Or reach us instantly via WhatsApp:</p>
                 <button onClick={openWhatsApp} className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white py-4 rounded-xl font-medium flex align-center justify-center transition shadow-lg gap-2">
                   <FiMessageCircle size={22} />
                   Message on WhatsApp
                 </button>
               </div>
             </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-3/5 p-12">
            <h3 className="text-2xl font-medium text-gray-900 mb-8">Submit Enquiry</h3>
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={() => handleBlur('name')} className={`w-full px-4 py-3 border ${errors.name ? 'border-secondary focus:ring-secondary focus:border-secondary' : 'border-gray-300 focus:ring-primary focus:border-primary'} rounded-xl focus:ring-2 outline-none transition`} placeholder="John Doe" />
                  {errors.name && <p className="text-secondary text-xs mt-1 font-medium">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={() => handleBlur('phone')} className={`w-full px-4 py-3 border ${errors.phone ? 'border-secondary focus:ring-secondary focus:border-secondary' : 'border-gray-300 focus:ring-primary focus:border-primary'} rounded-xl focus:ring-2 outline-none transition`} placeholder="+91 90000 00000" />
                  {errors.phone && <p className="text-secondary text-xs mt-1 font-medium">{errors.phone}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur('email')} className={`w-full px-4 py-3 border ${errors.email ? 'border-secondary focus:ring-secondary focus:border-secondary' : 'border-gray-300 focus:ring-primary focus:border-primary'} rounded-xl focus:ring-2 outline-none transition`} placeholder="john@company.com" />
                {errors.email && <p className="text-secondary text-xs mt-1 font-medium">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interested Product *</label>
                  <select name="product" value={formData.product} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white">
                    <option value="">Select Product...</option>
                    {products.map((p) => (
                      <option key={p.id || p._id} value={p.name}>{p.name}</option>
                    ))}
                    <option value="All Products">Combination / All Products</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Quantity *</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" placeholder="e.g. 500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" rows="4" placeholder="Tell us about your requirement..."></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black'} text-white py-4 rounded-xl font-medium text-lg shadow-lg transition transform hover:-translate-y-1`}>
                {isSubmitting ? 'Sending Request...' : 'Send Enquiry'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BulkOrder;
