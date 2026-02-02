import React from 'react';

export const Privacy: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 prose prose-invert prose-slate">
    <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-400">Last Updated: {new Date().toLocaleDateString()}</p>
    </div>
    
    <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 space-y-8">
        <section>
            <h3 className="text-xl font-bold text-white mb-3">1. Introduction</h3>
            <p className="text-slate-300 leading-relaxed">
                SmartTraffic AI ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our traffic generation services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
        </section>

        <section>
            <h3 className="text-xl font-bold text-white mb-3">2. Information We Collect</h3>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site.</li>
                <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services.</li>
            </ul>
        </section>
        
        <section>
            <h3 className="text-xl font-bold text-white mb-3">3. Use of Your Information</h3>
            <p className="text-slate-300 leading-relaxed mb-4">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
                <li>Create and manage your account.</li>
                <li>Process payments and refunds.</li>
                <li>Email you regarding your account or order.</li>
                <li>Enable user-to-user communications.</li>
                <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
                <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
            </ul>
        </section>

        <section>
            <h3 className="text-xl font-bold text-white mb-3">4. Disclosure of Your Information</h3>
            <p className="text-slate-300 leading-relaxed">
                We may share information we have collected about you in certain situations. Your information may be disclosed as follows: 
                <br/><br/>
                <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.
            </p>
        </section>

        <section>
            <h3 className="text-xl font-bold text-white mb-3">5. Data Security</h3>
            <p className="text-slate-300 leading-relaxed">
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
        </section>
        
        <section>
            <h3 className="text-xl font-bold text-white mb-3">6. Contact Us</h3>
            <p className="text-slate-300 leading-relaxed">
                If you have questions or comments about this Privacy Policy, please contact us at:<br/>
                <strong className="text-brand-400">privacy@smarttraffic.ai</strong>
            </p>
        </section>
    </div>
  </div>
);

export const Terms: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 prose prose-invert prose-slate">
    <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-slate-400">Last Updated: {new Date().toLocaleDateString()}</p>
    </div>
    
    <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 space-y-8">
        <section>
            <h3 className="text-xl font-bold text-white mb-3">1. Agreement to Terms</h3>
            <p className="text-slate-300 leading-relaxed">
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and SmartTraffic AI (“we,” “us” or “our”), concerning your access to and use of the SmartTraffic AI website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
            </p>
        </section>

        <section>
            <h3 className="text-xl font-bold text-white mb-3">2. Intellectual Property Rights</h3>
            <p className="text-slate-300 leading-relaxed">
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
            </p>
        </section>

        <section>
            <h3 className="text-xl font-bold text-white mb-3">3. User Representations</h3>
            <p className="text-slate-300 leading-relaxed mb-4">By using the Site, you represent and warrant that:</p>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise (except for the authorized AI agents provided by our platform).</li>
                <li>You will not use the Site for any illegal or unauthorized purpose.</li>
            </ul>
        </section>

        <section>
            <h3 className="text-xl font-bold text-white mb-3">4. "Credits" and Virtual Currency</h3>
            <p className="text-slate-300 leading-relaxed">
                "Credits" and "Points" earned within the platform have no real-world monetary value and cannot be exchanged for cash. They are solely for use within the SmartTraffic ecosystem to unlock features or boost traffic visibility. We reserve the right to modify, expire, or revoke credits at any time if we detect abuse.
            </p>
        </section>

        <section>
            <h3 className="text-xl font-bold text-white mb-3">5. Prohibited Activities</h3>
            <p className="text-slate-300 leading-relaxed mb-4">You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Prohibited activities include:</p>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
                <li>Systematic retrieval of data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                <li>Using any information obtained from the Site in order to harass, abuse, or harm another person.</li>
                <li>Use of a buying agent or purchasing agent to make purchases on the Site.</li>
                <li>Using the Site as part of any effort to compete with us or otherwise use the Site and/or the Content for any revenue-generating endeavor or commercial enterprise.</li>
            </ul>
        </section>

        <section>
            <h3 className="text-xl font-bold text-white mb-3">6. Payment and Cancellation</h3>
            <p className="text-slate-300 leading-relaxed">
                Subscription payments are billed in advance on a monthly or annual basis. You may cancel your subscription at any time via your account dashboard. Cancellations will take effect at the end of the current billing period. No refunds are provided for partial months unless otherwise required by law.
            </p>
        </section>

        <section>
            <h3 className="text-xl font-bold text-white mb-3">7. Limitation of Liability</h3>
            <p className="text-slate-300 leading-relaxed">
                In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
            </p>
        </section>
    </div>
  </div>
);