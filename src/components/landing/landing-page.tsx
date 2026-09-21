import Link from "next/link";
import type { ResolvedTenant } from "@/lib/tenant";
import { Masthead } from "./masthead";
import { StallDemo } from "./sections/StallDemo";
import "./ledger.css";

const tools = [
  { number: "01", title: "A menu in every pocket.", description: "Customers scan your QR, choose their food and place an order on their phone.", href: "/demo/student", label: "Try the customer menu", detail: "FOR YOUR CUSTOMERS" },
  { number: "02", title: "A little order in the rush.", description: "See incoming orders in one queue. Use the kitchen board when you have someone helping with prep.", href: "/demo/kitchen", label: "Try the kitchen board", detail: "FOR YOUR COUNTER" },
  { number: "03", title: "Know how the day went.", description: "Manage your menu, update availability and see your orders and sales in one place.", href: "/demo/admin", label: "Try the owner dashboard", detail: "FOR YOU" },
];

const questions = [
  { question: "Where does the payment go?", answer: "In direct UPI mode, customers pay your UPI ID. Check the credit in your payment app or bank account before confirming the payment in Tray. A screenshot alone is not proof of payment." },
  { question: "Does Tray take a cut of each order?", answer: "Tray does not charge an order commission. Any charges from your payment provider are separate." },
  { question: "Do customers need to install an app?", answer: "No. Your QR opens a web menu on their phone. They can browse and order in the browser." },
  { question: "Do I need a separate kitchen screen?", answer: "No. A small stall can work from the counter. The kitchen board is there when you want a separate view for the person preparing orders." },
  { question: "What do I need to get started?", answer: "An account, your stall details, menu and payment setup. Add your items and prices, then share your menu link or display its QR at your stall. You and your customers need an internet connection." },
];

export function LandingPage({ tenant }: { tenant: ResolvedTenant | null }) {
  return (
    <div className="lp" id="top">
      <a className="lp-skip" href="#main">Skip to content</a>
      <Masthead />
      <main id="main">
        <section className="lp-hero lp-container" aria-labelledby="hero-title">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow"><span className="lp-dot" aria-hidden="true" /> MADE FOR THE STREET. BUILT FOR YOUR STALL.</p>
            <h1 id="hero-title">Your food.<br />Your stall.<br /><em>Your own system.</em></h1>
            <p className="lp-hero-lede">A menu on their phone. Orders at your counter. Payments to your UPI. Tray brings it all together, so you can get on with the cooking.</p>
            <div className="lp-actions">
              <Link href="/get-started" className="lp-button">Set up my stall <span aria-hidden="true">↗</span></Link>
              <a href="#demos" className="lp-text-link">Explore the demos <span aria-hidden="true">↓</span></a>
            </div>
            <p className="lp-small-note">No order commission. No app for customers to install.</p>
          </div>
          <StallDemo />
        </section>
        <div className="lp-caption-band lp-container"><span>From the first chai to the last order.</span><span>Tiffin stalls · Food carts · Small counters</span></div>
        <section id="demos" className="lp-section lp-container" aria-labelledby="tools-title">
          <div className="lp-section-heading"><p className="lp-eyebrow">THE WHOLE COUNTER, CONNECTED</p><h2 id="tools-title">Small stall.<br /><em>Everything in place.</em></h2><p>One system for the people ordering, the people cooking, and you. Explore each side with sample data.</p></div>
          <div className="lp-tools">{tools.map((tool) => <article className="lp-tool" key={tool.number}><span className="lp-tool-number" aria-hidden="true">{tool.number}</span><div><p className="lp-eyebrow">{tool.detail}</p><h3>{tool.title}</h3><p>{tool.description}</p><Link href={tool.href} className="lp-text-link">{tool.label} <span aria-hidden="true">↗</span></Link></div></article>)}</div>
        </section>
        <section id="trust" className="lp-questions lp-container" aria-labelledby="questions-title">
          <div className="lp-section-heading"><p className="lp-eyebrow">BEFORE YOU PUT UP THE QR</p><h2 id="questions-title">Good questions.<br /><em>Straight answers.</em></h2><p>Your stall runs on trust. You should know how the system works.</p></div>
          <div className="lp-faq">{questions.map(({ question, answer }) => <details key={question}><summary>{question}<span className="lp-faq-plus" aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
        </section>
        <section className="lp-closing lp-container" aria-labelledby="closing-title"><p className="lp-eyebrow">YOUR NEXT ORDER STARTS HERE</p><h2 id="closing-title">Make room<br />for <em>what’s cooking.</em></h2><Link href="/get-started" className="lp-button">Set up my stall <span aria-hidden="true">↗</span></Link><p>Add your menu. Set up payments. Put up your QR.</p></section>
      </main>
      <footer className="lp-footer lp-container"><div className="lp-footer-top"><a href="#top" className="lp-brand" aria-label="Tray, back to top">tray<span aria-hidden="true">®</span></a><p>A little less managing.<br />A little more making.</p><nav aria-label="Footer"><Link href="/legal/terms">Terms</Link><Link href="/legal/privacy">Privacy</Link><a href="https://github.com/thribhuvan003/tray" target="_blank" rel="noreferrer">GitHub ↗</a><Link href={tenant ? `/c/${tenant.slug}/menu` : "/demo/student"}>Sample menu</Link></nav></div><div className="lp-footer-bottom"><span>Tray · Made for everyday stalls.</span><span className="lp-makers-mark">GOOD FOOD. YOUR RULES.</span><span>Built in India.</span></div></footer>
    </div>
  );
}
