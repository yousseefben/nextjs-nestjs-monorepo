"use client";
import { PhotoUserType } from "@frontend/src/types/users.types";
import Image from "next/image";
import React, { useState } from "react";

const Carousel = ({ photos }: { photos: PhotoUserType[] }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = photos.length;

  const carouselItems = Array.from({ length: totalSlides }, (_, i) => (
    <div
      className={
        i === activeSlide
          ? "block duration-700 ease-in-out "
          : "hidden duration-700 ease-in-out"
      }
      key={i}
    >
      <Image
        src={photos[i].url}
        alt={photos[i].name}
        width={600}
        height={600}
      />
    </div>
  ));

  const carouselIndicators = Array.from({ length: totalSlides }, (_, i) => (
    <button
      type="button"
      className="w-3 h-3 rounded-full"
      aria-current={i === activeSlide}
      aria-label={`Slide ${i + 1}`}
      onClick={() => setActiveSlide(i)}
      key={i}
    ></button>
  ));

  const prevSlide = () =>
    setActiveSlide((oldSlide) =>
      oldSlide === 0 ? totalSlides - 1 : oldSlide - 1
    );
  const nextSlide = () =>
    setActiveSlide((oldSlide) =>
      oldSlide === totalSlides - 1 ? 0 : oldSlide + 1
    );

  return (
    <div
      id="default-carousel"
      className="relative w-full"
      data-carousel="slide"
      data-testid="default-carousel"
    >
      <div className="relative flex justify-center h-56 overflow-hidden rounded-lg md:h-96">
        {carouselItems}
      </div>
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {carouselIndicators}
      </div>
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-prev
        onClick={prevSlide}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-next
        onClick={nextSlide}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Carousel;
