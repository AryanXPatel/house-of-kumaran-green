"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Instagram,
  Facebook,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Using Web3Forms - free form submission service
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "73b5ab25-d66d-44b5-a914-aa6e5dedf83d", // Replace with actual key from web3forms.com
          from_name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone || "Not provided",
          subject: `Contact Form: ${formData.subject || "General Inquiry"}`,
          message: formData.message,
          to: "hello@houseofkumaran.com",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        // Fallback to mailto if web3forms fails
        const mailtoLink = `mailto:hello@houseofkumaran.com?subject=${encodeURIComponent(
          `Contact Form: ${formData.subject || "General Inquiry"}`
        )}&body=${encodeURIComponent(
          `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${
            formData.email
          }\nPhone: ${formData.phone || "Not provided"}\n\nMessage:\n${
            formData.message
          }`
        )}`;
        window.location.href = mailtoLink;
        setSubmitStatus("success");
      }
    } catch {
      // Fallback to mailto on error
      const mailtoLink = `mailto:hello@houseofkumaran.com?subject=${encodeURIComponent(
        `Contact Form: ${formData.subject || "General Inquiry"}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${
          formData.email
        }\nPhone: ${formData.phone || "Not provided"}\n\nMessage:\n${
          formData.message
        }`
      )}`;
      window.location.href = mailtoLink;
      setSubmitStatus("success");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                      Usually replies within 6-8 hours (excl. weekends)
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
                    <MessageSquare className="w-5 h-5 text-[#b8860b]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp Support</h3>
                    <p className="text-[#f5f0e1]/60 text-sm mb-2">
                      Mon-Sat, 9 AM - 6 PM IST
                    </p>
                    <a
                      href="https://wa.me/917358407027"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#b8860b] hover:underline"
                    >
                      Chat with us on WhatsApp
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
                      3, Kasthuri 2nd Street
                      <br />
                      New Laxmipuram
                      <br />
                      Chennai, Tamil Nadu - 600099
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

                {submitStatus === "success" ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-[#f5f0e1]/60 mb-6">
                      Thank you for reaching out. We&apos;ll get back to you
                      within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitStatus("idle")}
                      className="px-6 py-2 border border-[#b8860b]/30 rounded-full text-[#b8860b] hover:bg-[#b8860b]/10 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          placeholder="John"
                          className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          placeholder="Doe"
                          className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
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
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] focus:outline-none focus:border-[#b8860b] transition-colors"
                      >
                        <option value="">Select a topic</option>
                        <option value="Order Inquiry">Order Inquiry</option>
                        <option value="Product Question">
                          Product Question
                        </option>
                        <option value="Wholesale Inquiry">
                          Wholesale Inquiry
                        </option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
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
            We typically respond to emails within 6-8 hours (excluding
            weekends).
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
