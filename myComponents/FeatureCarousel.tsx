"use client";

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import React from 'react'
import Autoplay from "embla-carousel-autoplay"


const FeatureCarousel = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 4200, stopOnInteraction: false })
  )

  return (
   <div className="w-full pt-10 pb-5 rounded-3xl">
      <Carousel 
        className="w-full max-w-4xl mx-auto" 
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
      >
         <CarouselContent>
            <CarouselItem>
               <div className="flex flex-col items-center justify-center p-8 rounded-xl">
                  <p className="text-2xl text-slate-700 font-valueSerif text-center">"The greatest glory in living lies not in never falling, but in rising every time we fall."</p>
                  <p className="mt-4 text-violet-600 font-outfitRegular">- Nelson Mandela</p>
               </div>
            </CarouselItem>
            <CarouselItem>
               <div className="flex flex-col items-center justify-center p-8 rounded-xl">
                  <p className="text-2xl text-slate-700 font-valueSerif text-center">"Your mental health is a priority. Your happiness is essential. Your self-care is a necessity."</p>
                  <p className="mt-4 text-violet-600 font-outfitRegular">- Anonymous</p>
               </div>
            </CarouselItem>
            <CarouselItem>
               <div className="flex flex-col items-center justify-center p-8 rounded-xl">
                  <p className="text-2xl text-slate-700 font-valueSerif text-center">"You are not alone. You are seen. You are loved. You matter."</p>
                  <p className="mt-4 text-violet-600 font-outfitRegular">- Mental Health Matters</p>
               </div>
            </CarouselItem>
         </CarouselContent>
      </Carousel>
   </div>
  )
}

export default FeatureCarousel