import React from "react";
import { ArrowDiagonal } from "./Icons";

const Features = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-pink-100 rounded-3xl p-4 shadow-inner h-auto px-12 hover:scale-[1.03] transition-all duration-300">
        <h1 className="text-2xl font-bold font-copernicusMedium text-slate-800 text-center pt-4">
          AI Therapeutic Companion
        </h1>
        <p className="text-sm font-outfitRegular text-slate-600 justify-center text-center pt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
        <div className="flex justify-center items-center gap-2 pt-6 ">
          <p className="text-sm font-outfitRegular font-bold text-slate-600 hover:text-slate-800 transition-colors duration-200">
            Learn more
          </p>
          <ArrowDiagonal className="text-slate-600" />
        </div>
      </div>
      <div className="bg-blue-100 rounded-3xl p-4 shadow-inner h-auto px-12 hover:scale-[1.03] transition-all duration-300">
        <h1 className="text-2xl font-bold font-copernicusMedium text-slate-800 text-center pt-4">
          Holistic Wellness Tracking
        </h1>
        <p className="text-sm font-outfitRegular text-slate-600 justify-center text-center pt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
        <div className="flex justify-center items-center gap-2 pt-6">
          <p className="text-sm font-outfitRegular font-bold text-slate-600 hover:text-slate-800 transition-colors duration-200">
            Learn more
          </p>
          <ArrowDiagonal className="text-slate-600" />
        </div>
      </div>
      <div className="bg-purple-200 rounded-3xl p-4 shadow-inner h-auto px-12 hover:scale-[1.03] transition-all duration-300">
        <h1 className="text-2xl font-bold font-copernicusMedium text-slate-800 text-center pt-4">
          Professional Support & Guidance
        </h1>
        <p className="text-sm font-outfitRegular text-slate-600 justify-center text-center pt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
        <div className="flex justify-center items-center gap-2 pt-6">
          <p className="text-sm font-outfitRegular font-bold text-slate-600 hover:text-slate-800 transition-colors duration-200">
            Learn more
          </p>
          <ArrowDiagonal className="text-slate-600" />
        </div>
      </div>
    </div>
  );
};

export default Features;
