import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | House of Kumaran",
  description:
    "Privacy policy for House of Kumaran. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#b8860b] text-sm tracking-[0.3em] uppercase mb-4">
            Legal
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#f5f0e1]/60">Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto prose prose-invert prose-gold">
          <div className="space-y-8">
            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10">
              <p className="text-[#f5f0e1]/70 mb-0">
                At House of Kumaran, we are committed to protecting your privacy
                and ensuring the security of your personal information. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website or make a
                purchase.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                1. Information We Collect
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>Name, email address, phone number</li>
                <li>Shipping and billing addresses</li>
                <li>
                  Payment information (processed securely through our payment
                  providers)
                </li>
                <li>Order history and preferences</li>
                <li>Communications with our customer support team</li>
                <li>Account login credentials (if you create an account)</li>
              </ul>

              <p className="text-[#f5f0e1]/70 mt-4 mb-4">
                We also automatically collect certain information when you visit
                our website:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and location data</li>
                <li>Pages viewed and time spent on our website</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                2. How We Use Your Information
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Improve our website, products, and services</li>
                <li>Detect and prevent fraud or unauthorized activity</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                3. Information Sharing
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>
                  <strong className="text-[#f5f0e1]">Service Providers:</strong>{" "}
                  Payment processors, shipping carriers, and other vendors who
                  assist in our operations
                </li>
                <li>
                  <strong className="text-[#f5f0e1]">
                    Legal Requirements:
                  </strong>{" "}
                  When required by law or to protect our rights
                </li>
                <li>
                  <strong className="text-[#f5f0e1]">
                    Business Transfers:
                  </strong>{" "}
                  In connection with a merger, acquisition, or sale of assets
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                4. Data Security
              </h2>
              <p className="text-[#f5f0e1]/70">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. All payment
                transactions are encrypted using SSL technology. However, no
                method of transmission over the Internet is 100% secure, and we
                cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                5. Cookies and Tracking
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>Remember your preferences and cart contents</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Personalize your shopping experience</li>
                <li>Deliver targeted advertisements</li>
              </ul>
              <p className="text-[#f5f0e1]/70 mt-4">
                You can control cookies through your browser settings. For more
                details, please see our{" "}
                <Link
                  href="/cookies"
                  className="text-[#b8860b] hover:underline"
                >
                  Cookie Policy
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                6. Your Rights
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>Access and receive a copy of your data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
                <li>Opt-out of marketing communications</li>
              </ul>
              <p className="text-[#f5f0e1]/70 mt-4">
                To exercise these rights, please contact us using the
                information below.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                7. Data Retention
              </h2>
              <p className="text-[#f5f0e1]/70">
                We retain your personal information for as long as necessary to
                fulfill the purposes outlined in this policy, unless a longer
                retention period is required by law. Order information is
                typically retained for 7 years for accounting and legal
                purposes.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                8. Third-Party Links
              </h2>
              <p className="text-[#f5f0e1]/70">
                Our website may contain links to third-party websites. We are
                not responsible for the privacy practices of these external
                sites. We encourage you to review their privacy policies before
                providing any personal information.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                9. Children&apos;s Privacy
              </h2>
              <p className="text-[#f5f0e1]/70">
                Our website is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children.
                If you believe a child has provided us with their information,
                please contact us immediately.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                10. Changes to This Policy
              </h2>
              <p className="text-[#f5f0e1]/70">
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page with an updated revision date. We
                encourage you to review this policy periodically.
              </p>
            </div>

            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10">
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                Contact Us
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <ul className="text-[#f5f0e1]/70 space-y-2">
                <li>
                  <strong className="text-[#f5f0e1]">Email:</strong>{" "}
                  <a
                    href="mailto:privacy@houseofkumaran.com"
                    className="text-[#b8860b] hover:underline"
                  >
                    privacy@houseofkumaran.com
                  </a>
                </li>
                <li>
                  <strong className="text-[#f5f0e1]">Phone:</strong> +91 86672
                  62327
                </li>
                <li>
                  <strong className="text-[#f5f0e1]">Address:</strong> 3,
                  Kasthuri 2nd Street, New Laxmipuram, Chennai, Tamil Nadu -
                  600099, India
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
