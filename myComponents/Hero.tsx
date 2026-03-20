import React from "react";

const Hero = () => {
  return (
    <div className="flex h-[75vh] w-full rounded-3xl relative overflow-hidden bg-violet-50 shadow-inner">
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
        <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
        <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
     </div>
      <div className="w-1/2 h-full flex items-center pl-12 relative z-10">
        <div className="flex flex-col">
          <div className="text-7xl font-bold drop-shadow-xl text-slate-800 font-valueSerif">Personalized</div>
          <div className="text-7xl font-bold drop-shadow-xl text-slate-800 font-valueSerif">Mental Wellness,</div>
          <div className="text-7xl font-bold drop-shadow-xl text-slate-800 font-valueSerif">Powered by AI</div>
        </div>
      </div>
      <div className="w-1/2 h-full flex items-center justify-center relative z-10">
        {/* <div>Right Container</div> */}
      </div>
    </div>
  );
};

export default Hero;
