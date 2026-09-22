import Link from "next/link";
import type { ResolvedTenant } from "@/lib/tenant";
import { Masthead } from "./masthead";
import { StallDemo } from "./sections/StallDemo";
import "./ledger.css";

const tools = [
  {
    number: "01",
    title: "Customer menu",
    description:
      "Browse the menu, add food to your cart and try placing a sample order.",
    href: "/demo/student",
    label: "Open customer demo",
    detail: "FOR YOUR CUSTOMERS",
  },
  {
    number: "02",
    title: "Kitchen board",
    description:
      "Start a sample order, mark it ready and check its pickup code at handover.",
    href: "/demo/kitchen",
    label: "Open kitchen demo",
    detail: "FOR YOUR COUNTER",
  },
  {
    number: "03",
    title: "Owner dashboard",
    description:
      "Explore sample sales and orders, then try updating menu availability.",
    href: "/demo/admin",
    label: "Open owner demo",
    detail: "FOR YOU",
  },
];

const questions = [
  {
    question: "Where does the payment go?",
    answer:
      "In direct UPI mode, customers pay your UPI ID. Check the credit in your payment app or bank account before confirming the payment in Tray. A screenshot alone is not proof of payment.",
  },
  {
    question: "Does Tray take a cut of each order?",
    answer:
      "Tray does not charge an order commission. Any charges from your payment provider are separate.",
  },
  {
    question: "Do customers need to install an app?",
    answer:
      "No. Your QR opens a web menu on their phone. Customers sign in to place a real order. The demos use sample data and do not need sign-in.",
  },
  {
    question: "Do I need a separate kitchen screen?",
    answer:
      "No. A small stall can work from the counter. The kitchen board is there when you want a separate view for the person preparing orders.",
  },
  {
    question: "What do I need to get started?",
    answer:
      "An account, your stall details, menu and payment setup. Add your items and prices, then share your menu link or display its QR at your stall. You and your customers need an internet connection.",
  },
];

export function LandingPage({ tenant }: { tenant: ResolvedTenant | null }) {
  return (
    <div className="lp" id="top">
      <a className="lp-skip" href="#main">
        Skip to content
      </a>
      <Masthead />
      <main id="main">
        <section className="lp-hero lp-container" aria-labelledby="hero-title">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow">
              <span className="lp-dot" aria-hidden="true" /> MADE FOR THE
              STREET. BUILT FOR YOUR STALL.
            </p>
            <h1 id="hero-title">
              Take orders.
              <br />
              Run your stall.
            </h1>
            <p className="lp-hero-lede">
              Give customers a QR menu. Manage incoming orders, check UPI
              payments and keep track of pickups—all from your counter.
            </p>
            <div className="lp-actions">
              <Link href="/get-started" className="lp-button">
                Set up my stall <span aria-hidden="true">↗</span>
              </Link>
              <a href="#demos" className="lp-text-link">
                Explore the demos <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="lp-small-note">
              No order commission. No app for customers to install.
            </p>
            <nav
              className="lp-demo-shortcuts"
              aria-label="Try Tray with sample data"
            >
              <p>Try it first. No sign-in. No real payments.</p>
              <div>
                {tools.map((tool) => (
                  <Link key={tool.number} href={tool.href}>
                    {tool.title}
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
          <StallDemo />
        </section>
        <div className="lp-caption-band">
          <span>From the first chai to the last order.</span>
          <span>Tiffin stalls · Food carts · Small counters</span>
        </div>
        <section
          id="demos"
          className="lp-section lp-container"
          aria-labelledby="tools-title"
        >
          <div className="lp-section-heading">
            <p className="lp-eyebrow">THREE DEMOS. ONE STALL.</p>
            <h2 id="tools-title">
              Try the whole ordering flow.
            </h2>
            <p>
              Open a demo and try the controls. Each view uses sample data, with
              no sign-in or real payments.
            </p>
          </div>
          <div className="lp-tools">
            {tools.map((tool) => (
              <article className="lp-tool" key={tool.number}>
                <span className="lp-tool-number" aria-hidden="true">
                  {tool.number}
                </span>
                <div>
                  <p className="lp-eyebrow">{tool.detail}</p>
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                  <Link href={tool.href} className="lp-text-link">
                    {tool.label} <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          id="trust"
          className="lp-questions"
          aria-labelledby="questions-title"
        >
          <div className="lp-section-heading">
            <p className="lp-eyebrow">BEFORE YOU PUT UP THE QR</p>
            <h2 id="questions-title">
              Before you get started.
            </h2>
            <p>
              Your stall runs on trust. You should know how the system works.
            </p>
          </div>
          <div className="lp-faq">
            {questions.map(({ question, answer }) => (
              <details key={question}>
                <summary>
                  {question}
                  <span className="lp-faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="lp-closing" aria-labelledby="closing-title">
          <p className="lp-eyebrow">YOUR NEXT ORDER STARTS HERE</p>
          <h2 id="closing-title">
            Start with your menu.
          </h2>
          <Link href="/get-started" className="lp-button">
            Set up my stall <span aria-hidden="true">↗</span>
          </Link>
          <p>Add your menu. Set up payments. Put up your QR.</p>
        </section>
      </main>
      <footer className="lp-footer">
        <div className="lp-footer-top">
          <a href="#top" className="lp-brand" aria-label="Tray, back to top">
            tray<span aria-hidden="true">.</span>
          </a>
          <p>
            A little less managing.
            <br />A little more making.
          </p>
          <nav aria-label="Footer">
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <a
              href="https://github.com/thribhuvan003/tray"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
            <Link href={tenant ? `/c/${tenant.slug}/menu` : "/demo/student"}>
              Sample menu
            </Link>
          </nav>
        </div>
        <div className="lp-footer-bottom">
          <span>Tray · Made for everyday stalls.</span>
          <span className="lp-makers-mark">GOOD FOOD. YOUR RULES.</span>
          <span>Built in India.</span>
        </div>
      </footer>
    </div>
  );
}
