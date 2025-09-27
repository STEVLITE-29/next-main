"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";

import Image1 from "@/public/OnboardingImg1.svg";
import Image2 from "@/public/OnboardingImg2.svg";
import Image3 from "@/public/OnboardingImg3.svg";

const PhotoSlider: React.FC = () => {
  const images: StaticImageData[] = [Image1, Image2, Image3];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className="
        hidden lg:flex
        fixed top-0 right-0
        w-[55%] h-screen
        p-4
        justify-center items-center
      "
    >
      <div className="w-full h-full relative">
        <Image
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          fill
          priority
          className="object-cover rounded-xl"
        />

        {/* Arrows + Pagination */}
        <div className="flex justify-between items-center absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[90%]">
          {/* Pagination Dots */}
          <div className="flex space-x-2">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1 w-8 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-primary" : "bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-4">
            <button
              onClick={prevSlide}
              className="bg-accent/70 hover:bg-accent text-foreground p-1.5 rounded-full backdrop-blur-sm transition"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextSlide}
              className="bg-accent/70 hover:bg-accent text-foreground p-1.5 rounded-full backdrop-blur-sm transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoSlider;
