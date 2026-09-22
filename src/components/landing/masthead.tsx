"use client";

import { useRef, useState } from "react";
import Link from "next/link";

export function Masthead() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  return (
    <header
      className="lp-masthead lp-container"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <a
        href="#top"
        className="lp-brand"
        aria-label="Tray home"
        onClick={() => setOpen(false)}
      >
        tray<span aria-hidden="true">.</span>
      </a>
      <nav className="lp-nav" aria-label="Main">
        <a href="#walkthrough">How it works</a>
        <a href="#demos">Try the demos</a>
        <a href="#trust">Questions</a>
      </nav>
      <div className="lp-header-actions">
        <Link href="/login" className="lp-signin">
          Sign in <span aria-hidden="true">↗</span>
        </Link>
        <button
          ref={menuButton}
          className="lp-menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="lp-mobile-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <nav
        id="lp-mobile-menu"
        className="lp-mobile-menu"
        aria-label="Mobile"
        hidden={!open}
      >
        <a href="#walkthrough" onClick={() => setOpen(false)}>
          How it works
        </a>
        <a href="#demos" onClick={() => setOpen(false)}>
          Try the demos
        </a>
        <a href="#trust" onClick={() => setOpen(false)}>
          Questions
        </a>
        <Link href="/get-started" onClick={() => setOpen(false)}>
          Set up my stall ↗
        </Link>
      </nav>
    </header>
  );
}
