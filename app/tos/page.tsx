import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - E2EBin",
  description: "Terms of Service for E2EBin",
};

export default function TosPage() {
  return (
    <main className="relative max-w-3xl mx-auto mt-28 px-6 pb-8">
      <h1 className="text-4xl font-bold uppercase tracking-wide mb-6">Terms of Service</h1>
      
      <div className="border-2 border-black p-6 bg-white">
        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">Last updated: 2026</p>
        
        <p className="text-sm leading-relaxed mb-4">
          By using this service, you agree to the following terms.
        </p>

        <h2 className="text-lg font-bold uppercase tracking-wide mb-3">1. No Content Visibility</h2>
        <p className="text-sm leading-relaxed mb-4">
          This service implements end-to-end encryption. This means: content posted on this service is encrypted on the user's device before transmission. The server operators <strong>cannot read, view, access, or decrypt</strong> any content stored on this service. We have no visibility into what is posted, shared, or stored.
        </p>

        <h2 className="text-lg font-bold uppercase tracking-wide mb-3">2. Liability Disclaimer</h2>
        <p className="text-sm leading-relaxed mb-4">
          <strong>You are solely responsible for the content you post.</strong>
        </p>
        <p className="text-sm leading-relaxed mb-4">
          The operator of this service cannot be held liable for any content posted by users, any use of content by third parties, any illegal, harmful, offensive, or objectionable content, any violation of intellectual property rights, or any damage caused by posted content.
        </p>
        <p className="text-sm leading-relaxed mb-4">
          Because the content is encrypted and unreadable by us, we cannot monitor, review, moderate, or remove specific content on ethical, legal, or moral grounds.
        </p>

        <h2 className="text-lg font-bold uppercase tracking-wide mb-3">3. Prohibited Uses</h2>
        <p className="text-sm leading-relaxed mb-4">You may not use this service for:</p>
        <ul className="text-sm leading-relaxed list-disc pl-6 mb-4 space-y-1">
          <li>Illegal activities of any kind</li>
          <li>Content that infringes on intellectual property rights</li>
          <li>Harassment, threats, or stalking</li>
          <li>Distribution of malware or malicious code</li>
          <li>Spam or automated abuse</li>
          <li>Any activity that violates applicable law</li>
        </ul>

        <h2 className="text-lg font-bold uppercase tracking-wide mb-3">4. Data Retention</h2>
        <p className="text-sm leading-relaxed mb-4">
          Pastes are stored until they are automatically deleted or until the server storage is cleared. We do not guarantee how long pastes will remain available. We may delete pastes at any time without notice.
        </p>

        <h2 className="text-lg font-bold uppercase tracking-wide mb-3">5. No Warranty</h2>
        <p className="text-sm leading-relaxed mb-4">
          This service is provided "as is" without warranty of any kind. We do not guarantee uptime, availability, data integrity, security against all threats, or that encryption cannot be broken.
        </p>

        <h2 className="text-lg font-bold uppercase tracking-wide mb-3">6. Changes to Terms</h2>
        <p className="text-sm leading-relaxed mb-4">
          We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
        </p>

        <h2 className="text-lg font-bold uppercase tracking-wide mb-3">7. Contact</h2>
        <p className="text-sm leading-relaxed">
          If you have questions about these terms, contact the operator via their GitHub profile listed on the site.
        </p>
      </div>

      <a 
        href="/" 
        className="inline-block px-4 py-3 border-2 border-black bg-white text-black font-bold uppercase text-xs tracking-wider cursor-pointer transition-all duration-200 no-underline mt-4"
      >
        ← Back to home
      </a>
    </main>
  );
}