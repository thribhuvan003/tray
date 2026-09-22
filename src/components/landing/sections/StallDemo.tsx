"use client";

import { useState } from "react";

const steps = ["Choose", "Confirm", "Collect"];
const descriptions = [
  "A customer scans your QR and chooses from your menu.",
  "They pay your UPI. You check the credit before confirming payment.",
  "Prepare the confirmed order, mark it ready, then verify the customer’s four-digit pickup code at handover.",
];

export function StallDemo() {
  const [step, setStep] = useState(0);
  return (
    <div className="lp-demo" id="walkthrough">
      <div className="lp-demo-top">
        <span>ONE ORDER AT A TIME</span>
        <span>Interactive sample</span>
      </div>
      <div className="lp-stall-sign" aria-hidden="true">
        <span>THE CORNER</span>
        <strong>Tiffin &amp; coffee</strong>
        <span>FRESH OFF THE TAWA</span>
      </div>
      <div className="lp-ticket">
        <div className="lp-ticket-heading">
          <span>ORDER 027</span>
          <span>Sample order</span>
        </div>
        <div className="lp-ticket-scene" key={step}>
          {step === 0 && (
            <>
              <h2>Something good?</h2>
              <p className="lp-ticket-sub">A quick bite. A proper coffee.</p>
              <div className="lp-menu-item">
                <span>
                  <strong>Masala dosa</strong>
                  <small>1 × ₹70</small>
                </span>
                <b>₹70</b>
              </div>
              <div className="lp-menu-item">
                <span>
                  <strong>Filter coffee</strong>
                  <small>1 × ₹25</small>
                </span>
                <b>₹25</b>
              </div>
              <div className="lp-ticket-total">
                <span>Order total</span>
                <strong>₹95</strong>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2>Straight to your UPI.</h2>
              <p className="lp-ticket-sub">Customer pays the stall directly.</p>
              <div className="lp-payment-amount">₹95</div>
              <div className="lp-payment-state">Awaiting your confirmation</div>
              <p className="lp-ticket-explainer">
                Check the credit in your UPI app or bank account, then confirm
                payment in Tray.
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <h2>Ready at the counter.</h2>
              <p className="lp-ticket-sub">
                Payment checked. Food prepared and marked ready.
              </p>
              <div className="lp-token">
                <span>PICKUP CODE</span>
                <strong>4821</strong>
                <span>1 dosa · 1 coffee</span>
              </div>
              <p className="lp-ticket-explainer">
                Verify the customer’s four-digit code in Tray before handing
                over their food.
              </p>
            </>
          )}
        </div>
        <button
          className="lp-demo-next"
          type="button"
          onClick={() => setStep((step + 1) % steps.length)}
        >
          {step === 0
            ? "Next: payment"
            : step === 1
              ? "Next: collection"
              : "Start again"}
          <span aria-hidden="true">{step === 2 ? "↺" : "→"}</span>
        </button>
        <p className="lp-demo-disclaimer">
          Sample only. No order or payment is created.
        </p>
      </div>
      <div
        className="lp-demo-steps"
        role="group"
        aria-label="Explore a sample order"
      >
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={step === index}
            onClick={() => setStep(index)}
          >
            <span>0{index + 1}</span>
            {label}
          </button>
        ))}
      </div>
      <p className="lp-demo-description" aria-live="polite" aria-atomic="true">
        {descriptions[step]}
      </p>
    </div>
  );
}
