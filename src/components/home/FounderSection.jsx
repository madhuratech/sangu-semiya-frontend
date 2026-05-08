import React from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiArrowRight } from 'react-icons/fi';
import founderImage from '../../assets/Chairman.jpg';

const FounderSection = () => (
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

      {/* Image Side */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-br from-secondary/5 via-primary/5 to-transparent rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
        <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-100">
          <div className="aspect-[4/5] bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative">
            <img src={founderImage} alt="" />

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
        {/* <div className="absolute -bottom-4 -right-2 bg-primary text-white px-5 py-2 rounded-xl shadow-lg font-medium text-sm transform group-hover:scale-105 transition-transform duration-300">
            40+ Years
          </div> */}
      </div>

      {/* Content Side */}
      <div className="space-y-6">
        <div className="space-y-2">
          <span className="inline-block py-1 px-3 rounded-full bg-red-50 border border-red-100 text-secondary font-medium text-[12px] tracking-widest uppercase mb-1">
            Our Legacy
          </span>
          <h2 className="text-2xl lg:text-3xl font-medium text-slate-900 tracking-tight leading-tight">
            K. Chandran
          </h2>
          <p className="text-primary font-medium text-[13px] uppercase tracking-[0.15em] opacity-70">
            Founder, Sangu Brand Semiya
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-500 font-normal leading-relaxed opacity-90">
            Sangu Brand Semiya has been offering delectable and authentic traditional foods for over <span className="text-secondary font-medium">three decades</span>, a success largely attributable to its visionary founder.
          </p>
          <p className="text-sm text-slate-500 font-normal leading-relaxed opacity-90">
            Mr. K Chandran's journey began in <span className="text-secondary font-medium">1982</span> with a modest production in a small workshop. His focus on <span className="text-secondary font-medium">superior quality and taste</span> enabled him to quickly capture the market trust.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 text-center">
          <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
            <p className="text-xl font-medium text-secondary mb-0.5">1982</p>
            <p className="text-[12px] font-medium text-slate-400 uppercase tracking-widest">Established</p>
          </div>
          <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
            <p className="text-xl font-medium text-secondary mb-0.5">40+</p>
            <p className="text-[12px] font-medium text-slate-400 uppercase tracking-widest">Years Legacy</p>
          </div>
        </div>

        <Link
          to="/about"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-secondary text-white px-6 py-3 rounded-lg font-medium text-[14px] tracking-widest uppercase transition-all duration-300 shadow-md group"
        >
          Know More
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  </div>
);

export default FounderSection;
