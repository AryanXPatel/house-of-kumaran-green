import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import {
  Heart,
  Leaf,
  Users,
  GraduationCap,
  Coffee,
  Clock,
  MapPin,
  Briefcase,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Careers | House of Kumaran - Join Our Team",
  description:
    "Build your career at House of Kumaran. Join our team passionate about preserving South Indian culinary traditions.",
};

const perks = [
  {
    icon: Coffee,
    title: "Free Meals",
    description: "Enjoy authentic South Indian meals during work hours",
  },
  {
    icon: Heart,
    title: "Health Benefits",
    description: "Comprehensive health insurance for you and family",
  },
  {
    icon: GraduationCap,
    title: "Learning & Growth",
    description: "Training programs and career development opportunities",
  },
  {
    icon: Users,
    title: "Team Culture",
    description: "Work with passionate food lovers in a supportive environment",
  },
];

const openings = [
  {
    title: "Production Supervisor",
    location: "Chennai",
    type: "Full-time",
    department: "Operations",
    description:
      "Oversee daily production operations, ensure quality standards, and manage production team.",
  },
  {
    title: "Quality Control Analyst",
    location: "Chennai",
    type: "Full-time",
    department: "Quality",
    description:
      "Conduct quality tests, maintain documentation, and ensure products meet safety standards.",
  },
  {
    title: "Marketing Executive",
    location: "Chennai / Remote",
    type: "Full-time",
    department: "Marketing",
    description:
      "Drive brand awareness through digital marketing, content creation, and campaign management.",
  },
  {
    title: "E-commerce Manager",
    location: "Remote",
    type: "Full-time",
    department: "Digital",
    description:
      "Manage online store operations, optimize conversions, and enhance customer experience.",
  },
  {
    title: "Customer Support Executive",
    location: "Chennai",
    type: "Full-time",
    department: "Support",
    description:
      "Handle customer inquiries, resolve issues, and maintain high satisfaction levels.",
  },
  {
    title: "Packaging Designer",
    location: "Chennai",
    type: "Contract",
    department: "Design",
    description:
      "Design innovative and sustainable packaging solutions for our product range.",
  },
];

const values = [
  {
    icon: Leaf,
    title: "Authenticity",
    description:
      "We stay true to traditional recipes while embracing modern quality standards.",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "Every team member shares a genuine love for food and culture.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We support local farmers, artisans, and each other as one family.",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-96 h-96 border border-[#b8860b] rounded-full" />
        </div>

        <div className="max-w-[1400px] mx-auto relative">
          <p className="text-[#b8860b] text-sm tracking-[0.3em] uppercase mb-4">
            Join Our Team
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Build Your <span className="text-[#b8860b]">Career</span>
          </h1>
          <p className="text-xl text-[#f5f0e1]/70 max-w-2xl mb-8">
<<<<<<< HEAD
            Be part of a team that&apos;s passionate about preserving and
            sharing South Indian culinary traditions with the world.
=======
            Be part of a team that&apos;s passionate about preserving and sharing
            South Indian culinary traditions with the world.
>>>>>>> 17c510e9eeae2ab11385825134c6e5679e9b3c1d
          </p>
          <Link
            href="#openings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
          >
            View Openings
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-4 text-center">
            What We Stand For
          </h2>
          <p className="text-[#f5f0e1]/60 text-center mb-12 max-w-xl mx-auto">
            Our values guide everything we do, from how we source ingredients to
            how we treat each other.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-[#b8860b]" />
                </div>
                <h3 className="font-semibold text-xl mb-2">{value.title}</h3>
                <p className="text-[#f5f0e1]/60">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-12 text-center">
            Why Work With Us?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10"
              >
                <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center mb-4">
                  <perk.icon className="w-6 h-6 text-[#b8860b]" />
                </div>
                <h3 className="font-semibold mb-2">{perk.title}</h3>
                <p className="text-[#f5f0e1]/60 text-sm">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Life at House of Kumaran */}
      <section className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">
                Life at House of Kumaran
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
<<<<<<< HEAD
                At House of Kumaran, we&apos;re more than colleagues—we&apos;re
                a family united by our love for authentic South Indian cuisine.
                Our workplace buzzes with the aroma of spices and the warmth of
                shared meals.
              </p>
              <p className="text-[#f5f0e1]/70 mb-4">
                We believe that great food comes from happy people. That&apos;s
                why we&apos;ve created an environment where creativity
                flourishes, ideas are valued, and every team member has the
                opportunity to grow.
              </p>
              <p className="text-[#f5f0e1]/70">
                Whether you&apos;re crafting recipes in our kitchen, engaging
                with customers, or strategizing our next big move, you&apos;ll
                be part of something meaningful.
=======
                At House of Kumaran, we&apos;re more than colleagues—we&apos;re a family
                united by our love for authentic South Indian cuisine. Our
                workplace buzzes with the aroma of spices and the warmth of
                shared meals.
              </p>
              <p className="text-[#f5f0e1]/70 mb-4">
                We believe that great food comes from happy people. That&apos;s why
                we&apos;ve created an environment where creativity flourishes, ideas
                are valued, and every team member has the opportunity to grow.
              </p>
              <p className="text-[#f5f0e1]/70">
                Whether you&apos;re crafting recipes in our kitchen, engaging with
                customers, or strategizing our next big move, you&apos;ll be part of
                something meaningful.
>>>>>>> 17c510e9eeae2ab11385825134c6e5679e9b3c1d
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gradient-to-br from-[#b8860b]/20 to-transparent rounded-2xl flex items-center justify-center">
                <Leaf className="w-16 h-16 text-[#b8860b]/50" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-[#b8860b]/30 to-transparent rounded-2xl flex items-center justify-center mt-8">
                <Heart className="w-16 h-16 text-[#b8860b]/50" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-[#b8860b]/30 to-transparent rounded-2xl flex items-center justify-center">
                <Users className="w-16 h-16 text-[#b8860b]/50" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-[#b8860b]/20 to-transparent rounded-2xl flex items-center justify-center mt-8">
                <Coffee className="w-16 h-16 text-[#b8860b]/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-4 text-center">
            Open Positions
          </h2>
          <p className="text-[#f5f0e1]/60 text-center mb-12 max-w-xl mx-auto">
            Find your perfect role and become part of our growing team.
          </p>

          <div className="space-y-4">
            {openings.map((job) => (
              <div
                key={job.title}
                className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 hover:border-[#b8860b]/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1 text-[#f5f0e1]/60">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-[#f5f0e1]/60">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1 text-[#f5f0e1]/60">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                    </div>
                    <p className="text-[#f5f0e1]/60 text-sm mt-3">
                      {job.description}
                    </p>
                  </div>
                  <Link
                    href="#apply"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b8860b]/10 border border-[#b8860b]/30 text-[#b8860b] font-medium rounded-full hover:bg-[#b8860b] hover:text-[#0d1f14] transition-colors whitespace-nowrap"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold mb-4">Apply Now</h2>
            <p className="text-[#f5f0e1]/60">
              Submit your application and we&apos;ll get back to you within 5
              business days.
            </p>
          </div>

          <form className="bg-[#0d1f14] rounded-3xl border border-[#b8860b]/10 p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-[#1a472a]/20 border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-[#1a472a]/20 border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 bg-[#1a472a]/20 border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Position *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 bg-[#1a472a]/20 border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] focus:outline-none focus:border-[#b8860b] transition-colors"
                >
                  <option value="">Select position</option>
                  {openings.map((job) => (
                    <option key={job.title} value={job.title}>
                      {job.title}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Years of Experience
              </label>
              <select className="w-full px-4 py-3 bg-[#1a472a]/20 border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] focus:outline-none focus:border-[#b8860b] transition-colors">
                <option value="">Select experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Resume Link (Google Drive / LinkedIn)
              </label>
              <input
                type="url"
                placeholder="https://"
                className="w-full px-4 py-3 bg-[#1a472a]/20 border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cover Letter / Why do you want to join us?
              </label>
              <textarea
                rows={5}
                placeholder="Tell us about yourself and why you'd be a great fit..."
                className="w-full px-4 py-3 bg-[#1a472a]/20 border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
            >
              Submit Application
            </button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="font-serif text-2xl font-bold mb-4">
            Don&apos;t see your perfect role?
          </h2>
          <p className="text-[#f5f0e1]/60 mb-6 max-w-lg mx-auto">
<<<<<<< HEAD
            We&apos;re always looking for talented people. Send us your resume
            and we&apos;ll keep you in mind for future opportunities.
=======
            We&apos;re always looking for talented people. Send us your resume and
            we&apos;ll keep you in mind for future opportunities.
>>>>>>> 17c510e9eeae2ab11385825134c6e5679e9b3c1d
          </p>
          <a
            href="mailto:careers@houseofkumaran.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8860b]/10 border border-[#b8860b]/30 text-[#b8860b] font-medium rounded-full hover:bg-[#b8860b] hover:text-[#0d1f14] transition-colors"
          >
            careers@houseofkumaran.com
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
