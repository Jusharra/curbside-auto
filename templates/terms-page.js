// Renders the site-wide Terms and Conditions & Partnership Policy: /terms/
// The legal text is word-for-word as supplied. The only values still in
// [square brackets] are the effective date and legal business name, which
// live in data/terms.json so they can be filled in without touching this file.

const { icon, renderFavicons, renderTermsLink } = require('./partials');

function renderTermsPage(site, terms) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Terms and Conditions | Back To Action Roadside Repair</title>
<meta name="description" content="Terms and conditions and partner policy for Back To Action Roadside Repair, serving Fresno, Clovis, Madera and Visalia.">
<meta name="theme-color" content="#14171C">
<link rel="canonical" href="${site.siteUrl}/terms/">
<link rel="stylesheet" href="/assets/styles.css">
${renderFavicons()}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
</head>
<body>

<header>
  <div class="nav wrap">
    <a class="logo" href="/">
      <span class="logo-badge">${icon('phone')}</span>
      <span class="logo-word">${site.logoMain}<span>${site.logoAccent}</span></span>
    </a>
    <a class="call-btn" href="/">Home</a>
  </div>
</header>

<section class="hero legal-hero">
  <div class="wrap">
    <h1>Terms and Conditions &amp; Partnership Policy</h1>
    <p class="legal-meta"><strong>Back To Action Roadside Repair (BTA)</strong><br>
    <a href="/">https://backtoactionroadsiderepair.netlify.app/</a><br>
    <strong>Effective date: ${terms.effectiveDate}</strong></p>
  </div>
</section>

<div class="stripe-rule"></div>

<section class="offers">
  <div class="wrap">
  <div class="legal-body">
    <p>Please read these Terms before using this website or requesting service. By using the website, calling us, or submitting a request, you agree to these Terms. If you do not agree, please do not use the website or our services.</p>

    <h2 id="who-we-are">1. Who we are and what we do</h2>
    <p>Back To Action Roadside Repair (“BTA,” “we,” “us,” “our”) is operated by ${terms.legalBusinessName}. We connect drivers in Fresno, Clovis, Madera, Visalia and surrounding areas with independent local roadside, mobile tire, mobile mechanic and auto glass professionals (“Partners”). Partners perform the services. BTA does not perform the repair or roadside work itself.</p>

    <h2 id="eligibility">2. Eligibility</h2>
    <p>Our services are available to individuals who are at least 18 years old and able to form a legally binding contract, and to businesses and fleets acting through an authorized representative.</p>

    <h2 id="using-this-website">3. Using this website</h2>
    <p>You are responsible for complying with all laws that apply to your use of the website and services. You agree to give accurate information, including your location, contact details and vehicle details, when you request service. We may refuse or end service if information is false or if a request is unsafe or unlawful.</p>

    <h2 id="requesting-service-and-pricing">4. Requesting service and pricing</h2>
    <ul>
      <li>When you call or submit a request, we connect you with a Partner who can help in your area.</li>
      <li>We confirm the total price with you, including our service fee, before a Partner is sent. The price may change only if the job turns out to be different from what was described (for example, a different tire size or an additional repair), and the Partner should tell you before doing additional work.</li>
      <li>Arrival times depend on Partner availability, traffic and conditions. We do not guarantee a specific arrival time unless we tell you one in writing.</li>
    </ul>

    <h2 id="fees-payment-and-cancellations">5. Fees, payment and cancellations</h2>
    <ul>
      <li><strong>Our service fee.</strong> BTA charges a service fee for connecting you with a Partner and coordinating your request. The fee varies by service and is included in the price we confirm with you before a Partner is sent.</li>
      <li><strong>Paying the Partner.</strong> Our service fee is separate from the cost of the work itself. After the fee is collected, you are responsible for paying the Partner the remaining balance for the services performed, using the payment methods the Partner accepts.</li>
      <li><strong>Cancelling with BTA.</strong> Our service fee is non-refundable once your request has been confirmed and a Partner has been assigned.</li>
      <li><strong>Cancelling with the Partner.</strong> The Partner’s own cancellation and refund terms apply to the work and to any charges they make. Cancelling with a Partner does not change or refund BTA’s service fee.</li>
      <li><strong>Disputes about the work.</strong> Raise quality or completion issues with the Partner who performed the work first. You may also contact us, and we will help where we reasonably can, but we do not guarantee a particular outcome.</li>
    </ul>

    <h2 id="our-relationship-with-partners">6. Our relationship with Partners</h2>
    <ul>
      <li>All Partners are independent businesses and independent contractors, not employees or agents of BTA. They are solely responsible for their own work, taxes, licenses, insurance, equipment and compliance with local law.</li>
      <li>BTA is not a party to the service work performed by a Partner. We are not responsible for the quality, safety, timing or results of a Partner’s work, except as required by law.</li>
      <li>Please use reasonable care in dealing with any service provider, including confirming the price and scope of work before it begins.</li>
    </ul>

    <h2 id="partner-standards">7. Partner standards</h2>
    <p>Partners who receive requests from BTA agree to:</p>
    <ul>
      <li>Hold the licenses and insurance required for their services, and provide proof on request.</li>
      <li>Respond promptly and be honest about availability and arrival times.</li>
      <li>Honor the price confirmed with the customer and get the customer’s approval before changing the price or scope of work.</li>
      <li>Not solicit customers referred by BTA to bypass BTA for future jobs for 12 months after the referral, without BTA’s written consent.</li>
    </ul>
    <p>BTA may pause or remove a Partner at any time, including for missed jobs, customer complaints, lapsed insurance or licensing, or a breach of these Terms.</p>

    <h2 id="rules-of-conduct">8. Rules of conduct</h2>
    <p>You agree not to: upload viruses or harmful code; send unlawful, threatening, harassing or obscene content; impersonate any person or business, including BTA; send unsolicited advertising or spam through the website; or use the website to engage in or encourage unlawful activity. We may suspend or block access for violations.</p>

    <h2 id="photos-reviews-and-content">9. Photos, reviews and content</h2>
    <p>If you upload photos, videos, reviews or other materials, you confirm you own them or have permission to share them, and you give BTA a non-exclusive, royalty-free right to use them to operate and promote the service, without further payment. Partners own the content they provide and are responsible for it.</p>

    <h2 id="disclaimer">10. Disclaimer</h2>
    <p>The website and our services are provided “as is” and “as available.” To the fullest extent permitted by law, BTA disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose and non-infringement. We do not warrant that the website will be uninterrupted or error-free, or that any particular Partner will be available.</p>

    <h2 id="limitation-of-liability">11. Limitation of liability</h2>
    <p>To the fullest extent permitted by law, BTA is not liable for indirect, incidental or consequential damages, or for any loss arising from a Partner’s work, acts or omissions. Where liability cannot be excluded, it is limited to the amount you paid to BTA for the service in question. Some laws do not allow these limits, so they may not apply to you.</p>

    <h2 id="governing-law">12. Governing law</h2>
    <p>These Terms are governed by the laws of the State of California. Any dispute will be handled in the courts located in Fresno County, California, unless the law requires otherwise.</p>

    <h2 id="changes">13. Changes</h2>
    <p>We may update these Terms from time to time. Changes take effect when posted on this page with a new effective date. Continuing to use the website or services after that means you accept the updated Terms.</p>

    <h2 id="entire-agreement">14. Entire agreement</h2>
    <p>These Terms are the entire agreement between you and BTA about the website and services and replace any earlier understandings on the same subject.</p>

    <h2 id="contact">15. Contact</h2>
    <p>Back To Action Roadside Repair<br>
    Phone: <a href="tel:+15593402999">(559) 340-2999</a></p>
  </div>
  </div>
</section>

<footer>
  <div class="wrap footer-inner">
    <div>
      <span>© <span id="year"></span> ${site.brandName}. We work with independently owned and operated local service providers.</span>
      ${renderTermsLink()}
    </div>
  </div>
</footer>

<script src="/assets/main.js"></script>

</body>
</html>
`;
}

module.exports = { renderTermsPage };
