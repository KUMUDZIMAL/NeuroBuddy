import React from 'react';
import { Button } from '@/components/ui/button';

function Assessment() {
  return (
    <div className="w-full bg-white flex flex-col items-center justify-center rounded-3xl overflow-hidden p-8 mt-16">
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-2xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-600 font-valueSerif">
          Take Your Mental Health Assessment
        </h1>
        <p className="text-lg md:text-xl text-slate-700 max-w-lg font-outfitRegular">
          Start your journey towards better mental health by completing this
          comprehensive self-assessment.
        </p>


        <div className="relative">
          <Button
            className="font-outfitRegular rounded-full px-6 py-6 bg-white hover:bg-white/80 text-slate-700 border-2 hover:text-violet-900 border-slate-300 shadow-lg hover:shadow-[0_0_30px_rgba(90,103,246,0.5)] transition-all duration-300 hover:border-transparent"
          >
            Start Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Assessment;
