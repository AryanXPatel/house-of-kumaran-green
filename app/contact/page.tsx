import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Instagram,
  Facebook,
} from "lucide-react";

export const metadata = {
  title: "Contact Us | House of Kumaran",
  description:
    "Get in touch with House of Kumaran. We're here to help with your orders, questions, and feedback about our authentic South Indian products.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 border border-[#b8860b] rounded-full" />
          <div className="absolute bottom-10 right-20 w-64 h-64 border border-[#b8860b] rounded-full" />
        </div>

        <div className="max-w-[1400px] mx-auto relative">
          <p className="text-[#b8860b] text-sm tracking-[0.3em] uppercase mb-4">
            Get In Touch
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Contact <span className="text-[#b8860b]">Us</span>
          </h1>
          <p className="text-xl text-[#f5f0e1]/70 max-w-2xl">
            Have questions about our products or your order? We&apos;re here to
            help. Reach out and we&apos;ll respond as soon as we can.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="font-serif text-2xl font-bold mb-8">
                Ways to Reach Us
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10">
                  <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#b8860b]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-[#f5f0e1]/60 text-sm mb-2">
                      For general inquiries and support
                    </p>
                    <a
                      href="mailto:hello@houseofkumaran.com"
                      className="text-[#b8860b] hover:underline"
                    >
                      hello@houseofkumaran.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10">
                  <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#b8860b]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-[#f5f0e1]/60 text-sm mb-2">
                      Mon-Sat, 9 AM - 6 PM IST
                    </p>
                    <a
                      href="tel:+919876543210"
                      className="text-[#b8860b] hover:underline"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10">
                  <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-[#b8860b]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <p className="text-[#f5f0e1]/60 text-sm mb-2">
                      Quick responses via WhatsApp
                    </p>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#b8860b] hover:underline"
                    >
                      Chat with us
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10">
                  <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#b8860b]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Visit Us</h3>
                    <p className="text-[#f5f0e1]/60 text-sm">
                      House of Kumaran
                      <br />
                      123 Anna Nagar
                      <br />
                      Chennai, Tamil Nadu 600040
                      <br />
                      India
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <p className="text-[#f5f0e1]/60 text-sm mb-4">
                  Follow us on social media
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com/houseofkumaran"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-[#b8860b]/30 flex items-center justify-center text-[#f5f0e1]/60 hover:border-[#b8860b] hover:text-[#b8860b] transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://facebook.com/houseofkumaran"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-[#b8860b]/30 flex items-center justify-center text-[#f5f0e1]/60 hover:border-[#b8860b] hover:text-[#b8860b] transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-[#1a472a]/20 rounded-3xl border border-[#b8860b]/10 p-8">
                <h2 className="font-serif text-2xl font-bold mb-2">
                  Send us a Message
                </h2>
                <p className="text-[#f5f0e1]/60 mb-8">
                  Fill out the form below and we&apos;ll get back to you within
                  24 hours.
                </p>

                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <select className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] focus:outline-none focus:border-[#b8860b] transition-colors">
                      <option value="">Select a topic</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b8860b]/10 rounded-full mb-6">
            <Clock className="w-4 h-4 text-[#b8860b]" />
            <span className="text-[#b8860b] text-sm font-medium">
              Business Hours
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold mb-4">
            When We&apos;re Available
          </h2>
          <div className="text-[#f5f0e1]/60">
            <p>Monday - Saturday: 9:00 AM - 6:00 PM IST</p>
            <p>Sunday: Closed</p>
          </div>
          <p className="text-[#f5f0e1]/40 text-sm mt-4">
            We typically respond to emails within 24 hours on business days.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
