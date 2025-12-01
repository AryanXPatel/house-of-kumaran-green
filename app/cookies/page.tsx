import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | House of Kumaran",
  description:
    "Cookie policy for House of Kumaran. Learn about how we use cookies and tracking technologies on our website.",
};

export default function CookiesPage() {
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
            Cookie Policy
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
                This Cookie Policy explains how House of Kumaran uses cookies
                and similar tracking technologies when you visit our website. By
                continuing to use our website, you consent to the use of cookies
                as described in this policy.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                What Are Cookies?
              </h2>
              <p className="text-[#f5f0e1]/70">
                Cookies are small text files that are stored on your device
                (computer, tablet, or mobile) when you visit a website. They
                help websites remember your preferences, understand how you use
                the site, and improve your overall experience. Cookies can be
                &quot;session&quot; cookies (deleted when you close your
                browser) or &quot;persistent&quot; cookies (remain until they
                expire or you delete them).
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                Types of Cookies We Use
              </h2>

              <h3 className="font-semibold text-lg mb-2 mt-6">
                1. Essential Cookies
              </h3>
              <p className="text-[#f5f0e1]/70 mb-2">
                These cookies are necessary for the website to function
                properly. They enable core functionality such as:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4 mb-4">
                <li>Shopping cart functionality</li>
                <li>Secure checkout process</li>
                <li>User authentication and login</li>
                <li>Remembering your cookie preferences</li>
              </ul>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-[#f5f0e1]/70 border border-[#b8860b]/20">
                  <thead className="bg-[#b8860b]/10">
                    <tr>
                      <th className="px-4 py-2 text-left border-b border-[#b8860b]/20">
                        Cookie
                      </th>
                      <th className="px-4 py-2 text-left border-b border-[#b8860b]/20">
                        Purpose
                      </th>
                      <th className="px-4 py-2 text-left border-b border-[#b8860b]/20">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        cart_id
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        Shopping cart identifier
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        Session
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        session_id
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        User session management
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        Session
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        cookie_consent
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        Stores cookie preferences
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        1 year
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-lg mb-2 mt-6">
                2. Analytics Cookies
              </h3>
              <p className="text-[#f5f0e1]/70 mb-2">
                These cookies help us understand how visitors interact with our
                website by collecting and reporting anonymous information:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4 mb-4">
                <li>Pages visited and time spent</li>
                <li>Scroll depth and click patterns</li>
                <li>Traffic sources and referrers</li>
                <li>Error tracking and performance metrics</li>
              </ul>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-[#f5f0e1]/70 border border-[#b8860b]/20">
                  <thead className="bg-[#b8860b]/10">
                    <tr>
                      <th className="px-4 py-2 text-left border-b border-[#b8860b]/20">
                        Cookie
                      </th>
                      <th className="px-4 py-2 text-left border-b border-[#b8860b]/20">
                        Provider
                      </th>
                      <th className="px-4 py-2 text-left border-b border-[#b8860b]/20">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        _ga
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        Google Analytics
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        2 years
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        _gid
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        Google Analytics
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        24 hours
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        _gat
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        Google Analytics
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        1 minute
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-lg mb-2 mt-6">
                3. Functional Cookies
              </h3>
              <p className="text-[#f5f0e1]/70 mb-2">
                These cookies enable enhanced functionality and personalization:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4 mb-4">
                <li>Remembering your recently viewed products</li>
                <li>Language and region preferences</li>
                <li>Personalized product recommendations</li>
                <li>Saved preferences and settings</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2 mt-6">
                4. Marketing Cookies
              </h3>
              <p className="text-[#f5f0e1]/70 mb-2">
                These cookies are used to deliver relevant advertisements and
                track the effectiveness of our marketing campaigns:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4 mb-4">
                <li>Displaying relevant ads on other websites</li>
                <li>Measuring ad campaign performance</li>
                <li>Limiting how often you see an ad</li>
                <li>Retargeting based on browsing history</li>
              </ul>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-[#f5f0e1]/70 border border-[#b8860b]/20">
                  <thead className="bg-[#b8860b]/10">
                    <tr>
                      <th className="px-4 py-2 text-left border-b border-[#b8860b]/20">
                        Cookie
                      </th>
                      <th className="px-4 py-2 text-left border-b border-[#b8860b]/20">
                        Provider
                      </th>
                      <th className="px-4 py-2 text-left border-b border-[#b8860b]/20">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        _fbp
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        Facebook Pixel
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        3 months
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        _gcl_au
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        Google Ads
                      </td>
                      <td className="px-4 py-2 border-b border-[#b8860b]/10">
                        3 months
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                Third-Party Cookies
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                Some cookies are placed by third-party services that appear on
                our pages. We do not control these cookies. Third parties
                include:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>
                  <strong className="text-[#f5f0e1]">Google Analytics:</strong>{" "}
                  Website analytics
                </li>
                <li>
                  <strong className="text-[#f5f0e1]">Facebook:</strong> Social
                  sharing and advertising
                </li>
                <li>
                  <strong className="text-[#f5f0e1]">Instagram:</strong> Social
                  media widgets
                </li>
                <li>
                  <strong className="text-[#f5f0e1]">Payment Providers:</strong>{" "}
                  Secure payment processing
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                Managing Your Cookie Preferences
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                You have several options for managing cookies:
              </p>

              <h3 className="font-semibold text-lg mb-2 mt-4">
                Browser Settings
              </h3>
              <p className="text-[#f5f0e1]/70 mb-4">
                Most browsers allow you to control cookies through their
                settings. You can typically:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4 mb-4">
                <li>View cookies stored on your device</li>
                <li>Delete all or specific cookies</li>
                <li>Block cookies from certain websites</li>
                <li>Block all third-party cookies</li>
                <li>Clear all cookies when you close the browser</li>
              </ul>
              <p className="text-[#f5f0e1]/70 mb-4">
                For more information, check your browser&apos;s help
                documentation:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#b8860b] hover:underline"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#b8860b] hover:underline"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/en-in/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#b8860b] hover:underline"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#b8860b] hover:underline"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>

              <h3 className="font-semibold text-lg mb-2 mt-6">Opt-Out Tools</h3>
              <p className="text-[#f5f0e1]/70 mb-4">
                You can opt out of targeted advertising through:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#b8860b] hover:underline"
                  >
                    Google Analytics Opt-out
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/settings/?tab=ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#b8860b] hover:underline"
                  >
                    Facebook Ad Preferences
                  </a>
                </li>
                <li>
                  <a
                    href="https://optout.networkadvertising.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#b8860b] hover:underline"
                  >
                    Network Advertising Initiative
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                Impact of Disabling Cookies
              </h2>
              <p className="text-[#f5f0e1]/70">
                Please note that blocking or deleting cookies may affect your
                experience on our website. Some features may not work properly,
                including:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4 mt-4">
                <li>Shopping cart may not retain items</li>
                <li>You may need to log in repeatedly</li>
                <li>Personalized recommendations won&apos;t work</li>
                <li>Preferences won&apos;t be saved</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                Updates to This Policy
              </h2>
              <p className="text-[#f5f0e1]/70">
                We may update this Cookie Policy from time to time to reflect
                changes in technology, legislation, or our data practices. We
                encourage you to review this page periodically for the latest
                information.
              </p>
            </div>

            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10">
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                Contact Us
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                If you have questions about our use of cookies, please contact
                us:
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
              </ul>
              <p className="text-[#f5f0e1]/70 mt-4">
                For more information about how we handle your personal data,
                please see our{" "}
                <Link
                  href="/privacy"
                  className="text-[#b8860b] hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
