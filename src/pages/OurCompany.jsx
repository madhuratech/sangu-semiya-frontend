import React from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiEye, FiTarget, FiClock, FiUsers, FiHeart, FiArrowRight } from 'react-icons/fi';
import founderImage from '../assets/Chairman.jpg';



const OurCompany = () => {
  return (
    <div className="w-full bg-white font-sans">
      
      {/* Hero Banner */}
      <section className="relative bg-slate-900 py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="page-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="30" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#page-pattern)"/>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-primary border border-white/10 font-medium text-[13px] tracking-widest uppercase mb-2">
            Since 1982
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight mb-4">
            Our Story
          </h1>
          <p className="text-lg text-slate-400 font-normal max-w-xl mx-auto">
            From a humble beginnings in Coimbatore to becoming South India's trusted vermicelli brand.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-secondary/10 via-primary/5 to-transparent rounded-3xl blur-xl opacity-40"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                          <div className="aspect-[4/5] bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative">
                            <img src={founderImage} alt="Founder Image" className='w-full h-full object-cover' />
                
                            <div className="absolute inset-0 opacity-">
                              {/* <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                  <defs>
                                    <pattern id="founder-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                      <circle cx="20" cy="20" r="10" fill="none" stroke="white" strokeWidth="0.5"/>
                                    </pattern>
                                  </defs>
                                  <rect width="100%" height="100%" fill="url(#founder-pattern)"/>
                                </svg> */}
                            </div>
                            {/* <div className="text-center z-10 p-8">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-lg">
                                  <FiAward className="text-white" size={24} />
                                </div>
                                <h3 className="text-white text-xl font-medium mb-1">K. Chandran</h3>
                                <p className="text-white/50 text-[12px] font-medium uppercase tracking-widest">Founder & Visionary</p>
                                <div className="mt-4 inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/50">
                                  <span className="text-primary font-medium text-sm">1982</span>
                                  <span className="text-white/40 text-[12px]">EST.</span>
                                </div>
                              </div> */}
                          </div>
                        </div>

              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <span className="inline-block py-1 px-3 rounded-full bg-red-50 border border-red-100 text-secondary font-medium text-[13px] tracking-widest uppercase mb-1">
                  Our Founder
                </span>
                <h2 className="text-3xl lg:text-4xl font-medium text-slate-900 tracking-tight leading-tight">
                  K. Chandran
                </h2>
                <p className="text-primary font-medium text-[15px] uppercase tracking-widest opacity-80">
                  Founder, Sangu Brand Semiya
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-base text-slate-600 font-normal leading-relaxed">
                  Sangu Brand Semiya is a renowned company that has been offering delectable and authentic traditional foods to its customers for over <span className="text-secondary font-medium">three decades</span>.
                </p>
                <p className="text-base text-slate-600 font-normal leading-relaxed">
                  Mr. K Chandran's entrepreneurial journey began in <span className="text-secondary font-medium">1982</span> with a modest production. His commitment to <span className="text-secondary font-medium">superior quality and taste</span> enabled him to seize the Coimbatore market and beyond.
                </p>
                <p className="text-base text-slate-600 font-normal leading-relaxed">
                  Today, the brand stands as a testament to quality traditional food. The legacy continues with the same passion and dedication to excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-red-700 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg">
                <FiEye size={28} />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-4 uppercase tracking-tight">Our Vision</h3>
              <p className="text-[19px] text-slate-600 font-normal leading-relaxed">
                To be the leading provider of food products, empowering tradition through quality. We envision a future where every Indian household enjoys authentic, healthy traditional meals.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-yellow-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg">
                <FiTarget size={28} />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-4 uppercase tracking-tight">Our Mission</h3>
              <p className="text-[19px] text-slate-600 font-normal leading-relaxed">
                To deliver the highest quality vermicelli products while preserving authentic flavors. We aim to reach every kitchen through trusted dealer partnerships and uncompromising standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones (Simplified) */}
      <section className="py-20 lg:py-28 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-3">
             <span className="text-primary font-medium text-[13px] uppercase tracking-widest">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight">Key Milestones</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FiClock size={24} />, title: '40+ Years', desc: 'Expertise in food production', color: 'from-secondary to-red-700' },
              { icon: <FiUsers size={24} />, title: '10+ Dealers', desc: 'Growing distribution network', color: 'from-primary to-yellow-600' },
              { icon: <FiHeart size={24} />, title: 'Tradition', desc: 'Preserving authentic flavors', color: 'from-emerald-500 to-emerald-700' },
              { icon: <FiAward size={24} />, title: 'Quality', desc: 'Superior taste commitment', color: 'from-violet-500 to-violet-700' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-3xl p-8 text-center hover:bg-white/10 transition-all duration-300">
                <div className={`w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-xs font-normal leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="inline-block py-1 px-3 rounded-full bg-red-50 border border-red-100 text-secondary font-medium text-[13px] tracking-widest uppercase">
              Core Values
            </span>
            <h2 className="text-3xl md:text-4xl font-medium text-slate-900 tracking-tight">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Authenticity', desc: 'Recipes and methods passed down through generations.', icon: '🌾' },
              { title: 'Quality', desc: 'No compromise on ingredients or manufacturing.', icon: '⭐' },
              { title: 'Innovation', desc: 'Continual innovation with healthy grain variants.', icon: '💡' },
            ].map((value, i) => (
              <div key={i} className="bg-slate-50 rounded-3xl p-10 border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300 text-center">
                <div className="text-4xl mb-6">{value.icon}</div>
                <h3 className="text-lg font-medium text-slate-900 mb-3 uppercase tracking-tight">{value.title}</h3>
                <p className="text-slate-500 text-sm font-normal leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-medium text-slate-900 tracking-tight">Partner With Us</h2>
          <p className="text-base text-slate-500 font-normal max-w-xl mx-auto">
            Join our growing network of dealers and distributors. Experience the Sangu Brand difference.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link to="/bulk-order" className="bg-secondary hover:bg-red-700 text-white px-8 py-4 rounded-xl font-medium text-xs uppercase tracking-widest transition-all duration-300 shadow-lg inline-flex items-center gap-2 group">
              Contact Us <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/products" className="bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 px-8 py-4 rounded-xl font-medium text-xs uppercase tracking-widest transition-all duration-300">
              View Products
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OurCompany;
