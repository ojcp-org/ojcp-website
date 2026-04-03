"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import styles from "./demo.module.css";

function DebugOverlay() {
  const searchParams = useSearchParams();
  const debug = searchParams.get("debug") === "true";
  const [show, setShow] = useState(false);
  const [injectedElements, setInjectedElements] = useState<string[]>([]);

  useEffect(() => {
    if (!debug) return;
    setShow(true);
    const timer = setTimeout(() => {
      const elements: string[] = [];
      const link = document.querySelector('link[rel="ojcp-manifest"]');
      if (link)
        elements.push(
          `<link rel="ojcp-manifest" href="${link.getAttribute("href")}">`
        );
      const meta = document.querySelector('meta[name="ojcp-endpoint"]');
      if (meta)
        elements.push(
          `<meta name="ojcp-endpoint" content="${meta.getAttribute("content")}">`
        );
      const p = document.querySelector("[data-ojcp-discovery]");
      if (p)
        elements.push(
          `<p data-ojcp-discovery>${p.textContent?.slice(0, 80)}...</p>`
        );
      setInjectedElements(elements);
    }, 500);
    return () => clearTimeout(timer);
  }, [debug]);

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.overlayInner}>
        <strong>OJCP Discovery Demo</strong>
        <p>
          This page simulates a typical enterprise career page. The Recruitics
          OJCP tag (<code>tag.js</code>) has been injected, adding discovery
          signals that AI agents can detect.
        </p>
        {injectedElements.length > 0 && (
          <div className={styles.injected}>
            <strong>Injected by tag.js:</strong>
            {injectedElements.map((el, i) => (
              <code key={i}>{el}</code>
            ))}
          </div>
        )}
        <button onClick={() => setShow(false)}>
          Dismiss &amp; view as an agent would
        </button>
      </div>
    </div>
  );
}

export default function DemoCareerPage() {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />

      <Script
        src="/tag.js"
        data-employer="globex-corp"
        data-manifest="https://ojcp.dev/api/manifest?employer=globex-corp"
        data-mcp="https://ojcp.dev/api/mcp"
        strategy="afterInteractive"
      />

      <Suspense>
        <DebugOverlay />
      </Suspense>

      {/* ── Fake career page ── */}
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>G</div>
            <span>Globex Corporation</span>
          </div>
          <nav className={styles.nav}>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#" className={styles.navActive}>
              Careers
            </a>
            <a href="#">Contact</a>
          </nav>
        </header>

        <main className={styles.main}>
          <div className={styles.breadcrumbs}>
            Careers &gt; Engineering &gt; Senior Software Engineer, Platform
          </div>

          <div className={styles.layout}>
            {/* ── Job detail column ── */}
            <div className={styles.jobDetail}>
              <h1>Senior Software Engineer, Platform</h1>
              <div className={styles.meta}>
                <span>Chicago, IL (Hybrid)</span>
                <span>Full-time</span>
                <span>$140,000 - $185,000</span>
              </div>
              <div className={styles.tags}>
                <span>Go</span>
                <span>Kubernetes</span>
                <span>Distributed Systems</span>
                <span>Rust</span>
              </div>

              <section>
                <h2>About the Role</h2>
                <p>
                  We&apos;re looking for a Senior Software Engineer to join our
                  Platform team of 12 engineers. You&apos;ll design and build the
                  core infrastructure that powers Globex&apos;s manufacturing
                  logistics platform, serving 200+ facilities worldwide.
                </p>
              </section>

              <section>
                <h2>Responsibilities</h2>
                <ul>
                  <li>
                    Design and implement distributed systems for real-time
                    facility coordination
                  </li>
                  <li>
                    Own the deployment pipeline and infrastructure-as-code
                    practices
                  </li>
                  <li>
                    Mentor junior engineers and contribute to technical
                    architecture decisions
                  </li>
                  <li>
                    Collaborate with product and operations teams on reliability
                    targets
                  </li>
                </ul>
              </section>

              <section>
                <h2>Requirements</h2>
                <ul>
                  <li>5+ years of backend engineering experience</li>
                  <li>Strong Go or Rust experience</li>
                  <li>Experience with Kubernetes in production</li>
                  <li>Understanding of distributed systems fundamentals</li>
                  <li>US work authorization required</li>
                </ul>
              </section>

              <section>
                <h2>Benefits</h2>
                <ul>
                  <li>
                    Comprehensive health, dental, and vision insurance
                  </li>
                  <li>401(k) with 6% company match</li>
                  <li>Flexible PTO policy</li>
                  <li>$3,000 annual learning budget</li>
                  <li>Relocation assistance available</li>
                </ul>
              </section>
            </div>

            {/* ── Apply form column ── */}
            <div className={styles.applyForm}>
              <h2>Apply for this position</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className={styles.field}>
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Jane Smith"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="jane@example.com"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="resume">Resume *</label>
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  <span className={styles.hint}>PDF or Word, max 5MB</span>
                </div>

                <div className={styles.field}>
                  <label htmlFor="cover">Cover Letter</label>
                  <textarea
                    id="cover"
                    name="cover"
                    rows={4}
                    placeholder="Tell us why you're interested in this role..."
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="auth">Work Authorization *</label>
                  <select id="auth" name="auth" required>
                    <option value="">Select...</option>
                    <option value="us_citizen">US Citizen</option>
                    <option value="permanent_resident">
                      Permanent Resident
                    </option>
                    <option value="visa_holder">Visa Holder</option>
                    <option value="requires_sponsorship">
                      Requires Sponsorship
                    </option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="experience">
                    Years of Relevant Experience *
                  </label>
                  <select id="experience" name="experience" required>
                    <option value="">Select...</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-8">5-8 years</option>
                    <option value="8+">8+ years</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="linkedin">LinkedIn Profile</label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="source">How did you hear about us?</label>
                  <select id="source" name="source">
                    <option value="">Select...</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="indeed">Indeed</option>
                    <option value="referral">Employee Referral</option>
                    <option value="company_site">Company Website</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.checkbox}>
                  <input type="checkbox" id="eeo" name="eeo" />
                  <label htmlFor="eeo">
                    I voluntarily self-identify for equal employment opportunity
                    purposes
                  </label>
                </div>

                <div className={styles.checkbox}>
                  <input type="checkbox" id="agree" name="agree" required />
                  <label htmlFor="agree">
                    I certify that all information provided is accurate and
                    complete *
                  </label>
                </div>

                <button type="submit" className={styles.submit}>
                  Submit Application
                </button>

                <p className={styles.disclaimer}>
                  Globex Corporation is an equal opportunity employer. We
                  celebrate diversity and are committed to creating an inclusive
                  environment.
                </p>
              </form>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <p>&copy; 2026 Globex Corporation. All rights reserved.</p>
          <div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
            <a href="#">Accessibility</a>
          </div>
        </footer>
      </div>
    </>
  );
}
