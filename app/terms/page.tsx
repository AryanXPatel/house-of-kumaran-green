import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | House of Kumaran",
  description:
    "Terms and conditions for using House of Kumaran website and services. Please read carefully before making a purchase.",
};

export default function TermsPage() {
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
            Terms & Conditions
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
                Welcome to House of Kumaran. By accessing or using our website
                and services, you agree to be bound by these Terms and
                Conditions. Please read them carefully before making a purchase.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                1. General Terms
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                These Terms and Conditions (&quot;Terms&quot;) govern your use
                of the House of Kumaran website (houseofkumaran.com) and any
                related services. By using our website, you represent that you
                are at least 18 years old or have parental consent to use this
                site.
              </p>
              <p className="text-[#f5f0e1]/70">
                We reserve the right to modify these Terms at any time. Changes
                will be effective immediately upon posting. Your continued use
                of the website constitutes acceptance of the modified Terms.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                2. Products and Orders
              </h2>

              <h3 className="font-semibold text-lg mb-2 mt-6">
                2.1 Product Information
              </h3>
              <p className="text-[#f5f0e1]/70 mb-4">
                We strive to provide accurate product descriptions, images, and
                pricing. However, we do not warrant that product descriptions or
                other content is accurate, complete, or error-free. Colors may
                vary slightly due to display settings.
              </p>

              <h3 className="font-semibold text-lg mb-2">2.2 Pricing</h3>
              <p className="text-[#f5f0e1]/70 mb-4">
                All prices are listed in Indian Rupees (INR) and are inclusive
                of applicable taxes unless otherwise stated. We reserve the
                right to change prices without prior notice. Shipping charges
                are calculated and displayed at checkout.
              </p>

              <h3 className="font-semibold text-lg mb-2">
                2.3 Order Acceptance
              </h3>
              <p className="text-[#f5f0e1]/70 mb-4">
                Your order constitutes an offer to purchase. We reserve the
                right to accept or decline any order. Order confirmation does
                not guarantee acceptance. We may cancel orders due to:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>Product unavailability</li>
                <li>Pricing errors</li>
                <li>Suspected fraudulent activity</li>
                <li>Inability to verify payment</li>
                <li>Shipping restrictions to your location</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2 mt-4">
                2.4 Order Limits
              </h3>
              <p className="text-[#f5f0e1]/70">
                We may limit the quantity of products purchased per customer or
                order. Wholesale orders are subject to separate terms and must
                be placed through our{" "}
                <Link
                  href="/wholesale"
                  className="text-[#b8860b] hover:underline"
                >
                  wholesale program
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                3. Payment Terms
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                We accept the following payment methods:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>Credit/Debit Cards (Visa, Mastercard, RuPay)</li>
                <li>UPI (Google Pay, PhonePe, Paytm)</li>
                <li>Net Banking</li>
                <li>Cash on Delivery (COD) - where available</li>
              </ul>
              <p className="text-[#f5f0e1]/70 mt-4">
                Payment must be received in full before order dispatch (except
                COD). For COD orders, exact change is appreciated as delivery
                personnel may not carry change.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                4. Shipping and Delivery
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                Please refer to our{" "}
                <Link
                  href="/shipping"
                  className="text-[#b8860b] hover:underline"
                >
                  Shipping Policy
                </Link>{" "}
                for detailed information on:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>Delivery timelines and zones</li>
                <li>Shipping charges</li>
                <li>Order tracking</li>
                <li>Delivery attempts and holds</li>
              </ul>
              <p className="text-[#f5f0e1]/70 mt-4">
                Delivery dates are estimates and not guaranteed. We are not
                liable for delays caused by shipping carriers, natural
                disasters, or circumstances beyond our control.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                5. Returns and Refunds
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                Our return and refund policies are detailed in our{" "}
                <Link
                  href="/returns"
                  className="text-[#b8860b] hover:underline"
                >
                  Returns Policy
                </Link>
                . Please review it before making a purchase.
              </p>

              <div className="p-4 bg-[#b8860b]/10 border border-[#b8860b]/30 rounded-xl mt-4">
                <h3 className="font-semibold text-lg mb-2 text-[#b8860b]">
                  Damaged, Spilled, Missing or Expired Products - 70% Refund
                  Guarantee
                </h3>
                <p className="text-[#f5f0e1]/70 mb-2">
                  If your product arrives damaged, spilled, missing, or expired,
                  we offer a{" "}
                  <strong className="text-[#f5f0e1]">
                    70% refund with no questions asked
                  </strong>
                  . Simply:
                </p>
                <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-1 ml-4">
                  <li>Contact us within 3 days of delivery</li>
                  <li>
                    Share an unpacking video showing the issue (MANDATORY)
                  </li>
                  <li>Receive 70% refund within 3-5 business days</li>
                </ul>
                <p className="text-[#f5f0e1]/50 text-sm mt-3">
                  *This policy covers manufacturing defects, transit damage,
                  spillage, missing items, and products received past expiry
                  date. An unpacking video is mandatory for all claims - photos
                  alone will not be accepted.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                6. Unpacking Video Requirement for Damage/Spillage/Missing Item
                Claims
              </h2>
              <div className="p-4 bg-[#b8860b]/10 border border-[#b8860b]/30 rounded-xl mb-4">
                <p className="text-[#f5f0e1]/70 mb-3">
                  <strong className="text-[#f5f0e1]">IMPORTANT:</strong> To
                  raise any complaint regarding damaged products, spillage,
                  missing items, or expired products, customers{" "}
                  <strong className="text-[#b8860b]">
                    MUST provide an unpacking video
                  </strong>
                  .
                </p>
                <p className="text-[#f5f0e1]/70 mb-3">
                  The unpacking video must clearly show:
                </p>
                <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-1 ml-4">
                  <li>The sealed/unopened outer packaging of the parcel</li>
                  <li>The unboxing process from start to finish</li>
                  <li>
                    The condition of all items inside (damaged, spilled,
                    missing, or expired)
                  </li>
                  <li>Any visible defects, spillage, or expiry dates</li>
                </ul>
                <p className="text-[#f5f0e1]/50 text-sm mt-3">
                  ⚠️ Claims without an unpacking video will not be eligible for
                  the 70% refund guarantee. Photos alone are NOT sufficient. We
                  recommend recording the unboxing of all deliveries as a
                  precaution.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                7. Intellectual Property
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                All content on this website, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>Text, graphics, logos, and images</li>
                <li>Product descriptions and photographs</li>
                <li>Website design and layout</li>
                <li>Software and code</li>
              </ul>
              <p className="text-[#f5f0e1]/70 mt-4">
                is the property of House of Kumaran or its licensors and is
                protected by copyright, trademark, and other intellectual
                property laws. You may not reproduce, distribute, or create
                derivative works without our written permission.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                8. User Accounts
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                If you create an account, you are responsible for:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>
                  Maintaining the confidentiality of your login credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>
              <p className="text-[#f5f0e1]/70 mt-4">
                We reserve the right to suspend or terminate accounts that
                violate these Terms or engage in suspicious activity.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                9. Prohibited Activities
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>Use the website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the website&apos;s functionality</li>
                <li>Transmit viruses or malicious code</li>
                <li>Scrape or collect data without permission</li>
                <li>Impersonate another person or entity</li>
                <li>Resell products without authorization</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                10. Food Safety and Allergens
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                Our products may contain allergens including but not limited to:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>Nuts and nut oils</li>
                <li>Sesame seeds</li>
                <li>Dairy products (ghee)</li>
                <li>Gluten (in certain products)</li>
              </ul>
              <p className="text-[#f5f0e1]/70 mt-4">
                Please check product labels carefully before consumption. Our
                products are manufactured in facilities that process multiple
                allergens. If you have severe allergies, please contact us
                before ordering.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                11. Limitation of Liability
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                To the maximum extent permitted by law, House of Kumaran and its
                affiliates shall not be liable for:
              </p>
              <ul className="list-disc list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages arising from product use or misuse</li>
                <li>Third-party actions or content</li>
              </ul>
              <p className="text-[#f5f0e1]/70 mt-4">
                Our total liability shall not exceed the amount paid by you for
                the relevant order.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                12. Indemnification
              </h2>
              <p className="text-[#f5f0e1]/70">
                You agree to indemnify and hold harmless House of Kumaran, its
                officers, directors, employees, and agents from any claims,
                damages, losses, or expenses arising from your violation of
                these Terms or misuse of our website or products.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                13. Governing Law and Disputes
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                These Terms shall be governed by the laws of India. Any disputes
                shall be resolved through:
              </p>
              <ol className="list-decimal list-inside text-[#f5f0e1]/70 space-y-2 ml-4">
                <li>Informal negotiation (30 days)</li>
                <li>Mediation, if negotiation fails</li>
                <li>
                  Courts of Chennai, Tamil Nadu, which shall have exclusive
                  jurisdiction
                </li>
              </ol>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                14. Severability
              </h2>
              <p className="text-[#f5f0e1]/70">
                If any provision of these Terms is found to be unenforceable,
                the remaining provisions shall continue in full force and
                effect.
              </p>
            </div>

            {/* <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10">
              <h2 className="font-serif text-2xl font-bold mb-4 text-[#b8860b]">
                Contact Us
              </h2>
              <p className="text-[#f5f0e1]/70 mb-4">
                For questions about these Terms, please contact us:
              </p>
              <ul className="text-[#f5f0e1]/70 space-y-2">
                <li>
                  <strong className="text-[#f5f0e1]">Email:</strong>{" "}
                  <a
                    href="mailto:support@houseofkumaran.com"
                    className="text-[#b8860b] hover:underline"
                  >
                    support@houseofkumaran.com
                  </a>
                </li>
                <li>
                  <strong className="text-[#f5f0e1]">Phone:</strong> +91 86672
                  62327
                </li>
                <li>
                  <strong className="text-[#f5f0e1]">Address:</strong> 3,
                  Kasthuri 2nd Street, New Lakshmipuram, Chennai, Tamil Nadu -
                  600099, India
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
