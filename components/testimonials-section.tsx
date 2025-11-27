"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Priya Raghavan",
    location: "Mumbai",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "The Idly Podi tastes exactly like what my grandmother used to make back in Chennai. Living in Mumbai, I missed that authentic taste so much. House of Kumaran brought those memories back.",
    product: "Idly Milagai Podi",
  },
  {
    id: 2,
    name: "Karthik Sundaram",
    location: "Bangalore",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "I've been ordering their Mysore Pak for every family gathering. It's pure ghee, no shortcuts. My relatives now request it specifically for all our festivals!",
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
    text: "The snacks are incredibly fresh - you can tell they're made in small batches. The Mullu Murukku reminds me of Deepavali at my ancestral home.",
    product: "Mullu Murukku",
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-32 bg-[#0d1f14] overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#2a4a35]/30 opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#2a4a35]/30 opacity-20" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase mb-4">Testimonials</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#f5f0e1]">Loved Across India</h2>
        </div>

        {/* Main testimonial */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Quote className="w-16 h-16 mx-auto mb-8 text-[#b8860b]/30" />

          <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#f5f0e1]/90 leading-relaxed mb-12 italic">
            "{testimonials[activeIndex].text}"
          </p>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#b8860b] mb-4">
              <Image
                src={testimonials[activeIndex].image || "/placeholder.svg"}
                alt={testimonials[activeIndex].name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#f5f0e1]">{testimonials[activeIndex].name}</h4>
            <p className="text-[#f5f0e1]/50">{testimonials[activeIndex].location}</p>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#b8860b] text-[#b8860b]" />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial indicators */}
        <div className="flex justify-center gap-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === activeIndex ? "w-12 bg-[#b8860b]" : "w-4 bg-[#2a4a35] hover:bg-[#3a5a45]"
              }`}
            />
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-20 pt-16 border-t border-[#2a4a35]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "4.9", label: "Average Rating" },
              { value: "10,000+", label: "Happy Customers" },
              { value: "98%", label: "Would Recommend" },
              { value: "5000+", label: "5-Star Reviews" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-serif font-bold text-[#b8860b]">{stat.value}</p>
                <p className="text-[#f5f0e1]/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
