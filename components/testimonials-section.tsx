"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Raghavan",
    location: "Mumbai",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "The Idly Podi tastes exactly like what my grandmother used to make back in Chennai. House of Kumaran brought those memories back.",
    product: "Idly Milagai Podi",
  },
  {
    id: 2,
    name: "Karthik Sundaram",
    location: "Bangalore",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "I've been ordering their Mysore Pak for every family gathering. It's pure ghee, no shortcuts. My relatives now request it specifically!",
    product: "Mysore Pak",
  },
  {
    id: 3,
    name: "Lakshmi Venkatesh",
    location: "Delhi",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "Being a Tamilian in North India, finding authentic South Indian products was always a challenge. House of Kumaran has been a blessing.",
    product: "Mango Thokku",
  },
  {
    id: 4,
    name: "Arvind Krishnamurthy",
    location: "Hyderabad",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "The snacks are incredibly fresh - you can tell they're made in small batches. The Mullu Murukku reminds me of Deepavali at home.",
    product: "Mullu Murukku",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () =>
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () =>
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <section className="relative py-16 md:py-20 bg-[#0d1f14] overflow-hidden">
      {/* Background elements - simplified */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#2a4a35]/20 opacity-20" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section header - compact */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase mb-2">
              Testimonials
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#f5f0e1]">
              Loved Across India
            </h2>
          </div>
          {/* Navigation arrows - desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-[#2a4a35] hover:border-[#b8860b] flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#f5f0e1]" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-[#2a4a35] hover:border-[#b8860b] flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#f5f0e1]" />
            </button>
          </div>
        </div>

        {/* Testimonial cards - horizontal scroll on mobile, carousel on desktop */}
        <div className="relative">
          {/* Desktop: Single testimonial with fade */}
          <div className="hidden md:block">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Quote */}
              <div className="relative p-8 bg-[#132a1c] rounded-2xl border border-[#2a4a35]">
                <Quote className="w-10 h-10 text-[#b8860b]/30 mb-4" />
                <p className="font-serif text-xl lg:text-2xl text-[#f5f0e1]/90 leading-relaxed mb-6 italic">
                  &quot;{testimonials[activeIndex].text}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#b8860b]">
                    <Image
                      src={
                        testimonials[activeIndex].image || "/placeholder.svg"
                      }
                      alt={testimonials[activeIndex].name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#f5f0e1]">
                      {testimonials[activeIndex].name}
                    </h4>
                    <p className="text-[#f5f0e1]/50 text-sm">
                      {testimonials[activeIndex].location}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#b8860b] text-[#b8860b]"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "4.9", label: "Average Rating", icon: "⭐" },
                  { value: "10K+", label: "Happy Customers", icon: "😊" },
                  { value: "98%", label: "Would Recommend", icon: "👍" },
                  { value: "5K+", label: "5-Star Reviews", icon: "🌟" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-5 bg-[#1a472a]/30 rounded-xl border border-[#2a4a35] text-center"
                  >
                    <span className="text-2xl mb-2 block">{stat.icon}</span>
                    <p className="text-2xl font-serif font-bold text-[#b8860b]">
                      {stat.value}
                    </p>
                    <p className="text-[#f5f0e1]/50 text-sm mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: Horizontal scroll cards */}
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {testimonials.map((testimonial, i) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0 w-[300px] p-5 bg-[#132a1c] rounded-xl border border-[#2a4a35]"
                >
                  <div className="flex items-center gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-3 h-3 fill-[#b8860b] text-[#b8860b]"
                      />
                    ))}
                  </div>
                  <p className="text-[#f5f0e1]/80 text-sm leading-relaxed mb-4 line-clamp-3">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#b8860b]">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-[#f5f0e1] text-sm font-semibold">
                        {testimonial.name}
                      </p>
                      <p className="text-[#f5f0e1]/40 text-xs">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial indicators - compact */}
        <div className="flex justify-center gap-2 mt-6 md:mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-8 bg-[#b8860b]"
                  : "w-2 bg-[#2a4a35] hover:bg-[#3a5a45]"
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
