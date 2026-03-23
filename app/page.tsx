export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <header
        style={{
          background: "#06122b",
          color: "white",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: "28px", fontWeight: 800 }}>Shuka</div>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#features"
              style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 600 }}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 600 }}
            >
              How it works
            </a>
            <a
              href="/pricing"
              style={{ color: "#cbd5e1", textDecoration: "none", fontWeight: 600 }}
            >
              Pricing
            </a>
            <a
              href="/login"
              style={{
                textDecoration: "none",
                color: "white",
                padding: "10px 16px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.08)",
                fontWeight: 700,
              }}
            >
              Log in
            </a>
            <a
              href="/pricing"
              style={{
                textDecoration: "none",
                color: "white",
                padding: "10px 16px",
                borderRadius: "12px",
                background: "#2563eb",
                fontWeight: 700,
              }}
            >
              Start free trial
            </a>
          </nav>
        </div>
      </header>

      <section
        style={{
          background:
            "linear-gradient(180deg, #06122b 0%, #0b1b3d 55%, #f8fafc 55%, #f8fafc 100%)",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "56px 20px 72px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "28px",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(37,99,235,0.15)",
                  color: "#93c5fd",
                  border: "1px solid rgba(147,197,253,0.25)",
                  borderRadius: "999px",
                  padding: "8px 12px",
                  fontWeight: 700,
                  fontSize: "14px",
                  marginBottom: "18px",
                }}
              >
                AI procurement for modern teams
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(38px, 7vw, 64px)",
                  lineHeight: 1.02,
                  color: "white",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Source vendors, compare quotes, and manage purchasing in one place.
              </h1>

              <p
                style={{
                  marginTop: "18px",
                  fontSize: "20px",
                  lineHeight: 1.65,
                  color: "#cbd5e1",
                  maxWidth: "700px",
                }}
              >
                Shuka helps teams move faster with AI-powered sourcing, vendor
                comparison, approvals, saved items, and order workflows — without
                juggling spreadsheets, inbox threads, and disconnected tools.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap",
                  marginTop: "26px",
                }}
              >
                <a
                  href="/pricing"
                  style={{
                    textDecoration: "none",
                    background: "#2563eb",
                    color: "white",
                    padding: "14px 18px",
                    borderRadius: "14px",
                    fontWeight: 800,
                    boxShadow: "0 10px 25px rgba(37,99,235,0.25)",
                  }}
                >
                  Start free trial
                </a>

                <a
                  href="/pricing"
                  style={{
                    textDecoration: "none",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    padding: "14px 18px",
                    borderRadius: "14px",
                    fontWeight: 800,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  View pricing
                </a>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  flexWrap: "wrap",
                  marginTop: "24px",
                  color: "#cbd5e1",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                <span>7-day free trial</span>
                <span>No setup headaches</span>
                <span>Built for real purchasing workflows</span>
              </div>
            </div>

            <div>
              <div
                style={{
                  background: "white",
                  borderRadius: "24px",
                  padding: "22px",
                  boxShadow: "0 25px 60px rgba(2,6,23,0.28)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      borderRadius: "18px",
                      padding: "16px",
                    }}
                  >
                    <div style={{ color: "#1d4ed8", fontWeight: 800, fontSize: "14px" }}>
                      AI sourcing
                    </div>
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "26px",
                        fontWeight: 900,
                        color: "#0f172a",
                      }}
                    >
                      Faster
                    </div>
                    <div style={{ marginTop: "6px", color: "#475569", lineHeight: 1.6 }}>
                      Generate vendor options from a single request.
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "18px",
                      padding: "16px",
                    }}
                  >
                    <div style={{ color: "#334155", fontWeight: 800, fontSize: "14px" }}>
                      Quote comparison
                    </div>
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "26px",
                        fontWeight: 900,
                        color: "#0f172a",
                      }}
                    >
                      Clearer
                    </div>
                    <div style={{ marginTop: "6px", color: "#475569", lineHeight: 1.6 }}>
                      Compare vendors, pricing, and fit side by side.
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "18px",
                      padding: "16px",
                    }}
                  >
                    <div style={{ color: "#334155", fontWeight: 800, fontSize: "14px" }}>
                      Approvals
                    </div>
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "26px",
                        fontWeight: 900,
                        color: "#0f172a",
                      }}
                    >
                      Simpler
                    </div>
                    <div style={{ marginTop: "6px", color: "#475569", lineHeight: 1.6 }}>
                      Keep requests, decisions, and order context together.
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#ecfeff",
                      border: "1px solid #a5f3fc",
                      borderRadius: "18px",
                      padding: "16px",
                    }}
                  >
                    <div style={{ color: "#0f766e", fontWeight: 800, fontSize: "14px" }}>
                      Purchasing flow
                    </div>
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "26px",
                        fontWeight: 900,
                        color: "#0f172a",
                      }}
                    >
                      Centralized
                    </div>
                    <div style={{ marginTop: "6px", color: "#475569", lineHeight: 1.6 }}>
                      Manage saved items, orders, and shipments in one workspace.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    background: "#0f172a",
                    color: "white",
                    borderRadius: "18px",
                    padding: "18px",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: "15px" }}>
                    One workflow instead of five tools
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      color: "#cbd5e1",
                      lineHeight: 1.7,
                      fontSize: "15px",
                    }}
                  >
                    Shuka brings sourcing, comparison, approvals, saved items,
                    and order visibility into one clean system.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "26px 20px 20px",
        }}
      >
        <div style={{ maxWidth: "760px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.1,
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            Everything your team needs to move from request to purchase.
          </h2>
          <p
            style={{
              marginTop: "14px",
              color: "#475569",
              fontSize: "18px",
              lineHeight: 1.7,
            }}
          >
            Built for teams that need structure, speed, and visibility across the
            purchasing process.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "18px",
            marginTop: "28px",
          }}
        >
          {[
            {
              title: "AI vendor sourcing",
              text: "Generate supplier options faster instead of starting from scratch every time.",
            },
            {
              title: "Quote comparison",
              text: "See vendors side by side so pricing and tradeoffs are easier to evaluate.",
            },
            {
              title: "Approval workflow",
              text: "Keep manual approvals organized without messy email chains.",
            },
            {
              title: "Saved items and orders",
              text: "Track what matters after sourcing instead of losing it in tabs and notes.",
            },
            {
              title: "Vendor ranking",
              text: "Use smarter logic to highlight stronger vendor fits for each request.",
            },
            {
              title: "Shipment visibility",
              text: "Keep order progress and follow-through visible after purchasing decisions are made.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "20px",
                boxShadow: "0 8px 22px rgba(15,23,42,0.04)",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: 800 }}>{item.title}</div>
              <p
                style={{
                  margin: "10px 0 0",
                  color: "#475569",
                  lineHeight: 1.7,
                  fontSize: "15px",
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "54px 20px 20px",
        }}
      >
        <div style={{ maxWidth: "760px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.1,
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            How Shuka works
          </h2>
          <p
            style={{
              marginTop: "14px",
              color: "#475569",
              fontSize: "18px",
              lineHeight: 1.7,
            }}
          >
            From sourcing to purchasing, the flow stays clean and easy to follow.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "18px",
            marginTop: "28px",
          }}
        >
          {[
            {
              number: "01",
              title: "Submit what you need",
              text: "Start with a request and describe the item, vendor needs, or workflow details.",
            },
            {
              number: "02",
              title: "Let Shuka source and compare",
              text: "Use AI and structured comparison tools to review vendor options faster.",
            },
            {
              number: "03",
              title: "Approve and manage purchase flow",
              text: "Move into approvals, saved items, orders, and shipment tracking without losing context.",
            },
          ].map((step) => (
            <div
              key={step.number}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "999px",
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  marginBottom: "16px",
                }}
              >
                {step.number}
              </div>
              <div style={{ fontWeight: 800, fontSize: "20px" }}>{step.title}</div>
              <p
                style={{
                  marginTop: "10px",
                  color: "#475569",
                  lineHeight: 1.7,
                  fontSize: "15px",
                }}
              >
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "54px 20px 20px",
        }}
      >
        <div
          style={{
            background: "#0f172a",
            borderRadius: "26px",
            padding: "30px",
            color: "white",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.08)",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#cbd5e1",
                }}
              >
                Built for growth-stage teams
              </div>
              <h3
                style={{
                  marginTop: "16px",
                  marginBottom: 0,
                  fontSize: "clamp(28px, 4vw, 42px)",
                  lineHeight: 1.1,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Stop running procurement out of inboxes and spreadsheets.
              </h3>
              <p
                style={{
                  marginTop: "14px",
                  color: "#cbd5e1",
                  lineHeight: 1.75,
                  fontSize: "17px",
                }}
              >
                Shuka gives your team a cleaner way to source vendors, compare
                quotes, organize approvals, and keep purchasing decisions moving.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "22px",
                padding: "22px",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: "20px" }}>
                Start with a 7-day free trial
              </div>
              <p
                style={{
                  marginTop: "10px",
                  color: "#cbd5e1",
                  lineHeight: 1.7,
                }}
              >
                Explore vendor sourcing, approvals, pricing workflows, and
                purchasing tools without a complicated setup process.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "16px",
                }}
              >
                <a
                  href="/pricing"
                  style={{
                    textDecoration: "none",
                    background: "#2563eb",
                    color: "white",
                    padding: "13px 16px",
                    borderRadius: "12px",
                    fontWeight: 800,
                  }}
                >
                  Start free trial
                </a>
                <a
                  href="/pricing"
                  style={{
                    textDecoration: "none",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    padding: "13px 16px",
                    borderRadius: "12px",
                    fontWeight: 800,
                  }}
                >
                  See pricing
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "56px 20px 80px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.1,
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            Simple pricing for growing teams
          </h2>
          <p
            style={{
              marginTop: "14px",
              color: "#475569",
              fontSize: "18px",
              lineHeight: 1.7,
            }}
          >
            Start with the essentials, then upgrade when you want more sourcing
            power and automation.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "22px",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "22px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: "999px",
                background: "#fef3c7",
                color: "#92400e",
                fontWeight: 800,
                fontSize: "13px",
              }}
            >
              Starter
            </div>

            <div
              style={{
                marginTop: "18px",
                fontWeight: 900,
                fontSize: "46px",
                letterSpacing: "-0.03em",
              }}
            >
              $9
              <span
                style={{
                  fontSize: "22px",
                  color: "#475569",
                  fontWeight: 700,
                }}
              >
                /mo
              </span>
            </div>

            <p style={{ color: "#475569", lineHeight: 1.7 }}>
              Manual procurement workflow for solo buyers and small teams.
            </p>

            <ul
              style={{
                margin: "18px 0 0",
                paddingLeft: "20px",
                color: "#334155",
                lineHeight: 2,
              }}
            >
              <li>Create requests</li>
              <li>Generate quotes</li>
              <li>Compare vendors</li>
              <li>Manual approvals</li>
              <li>Orders and saved items</li>
              <li>Basic AI assistant</li>
            </ul>

            <a
              href="/pricing"
              style={{
                display: "block",
                marginTop: "22px",
                textAlign: "center",
                textDecoration: "none",
                background: "#0f172a",
                color: "white",
                padding: "14px 16px",
                borderRadius: "14px",
                fontWeight: 800,
              }}
            >
              Start 7-day trial
            </a>
          </div>

          <div
            style={{
              background: "white",
              border: "2px solid #2563eb",
              borderRadius: "22px",
              padding: "24px",
              boxShadow: "0 16px 40px rgba(37,99,235,0.10)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: "999px",
                background: "#dbeafe",
                color: "#1d4ed8",
                fontWeight: 800,
                fontSize: "13px",
              }}
            >
              Premium
            </div>

            <div
              style={{
                marginTop: "18px",
                fontWeight: 900,
                fontSize: "46px",
                letterSpacing: "-0.03em",
              }}
            >
              $25
              <span
                style={{
                  fontSize: "22px",
                  color: "#475569",
                  fontWeight: 700,
                }}
              >
                /mo
              </span>
            </div>

            <p style={{ color: "#475569", lineHeight: 1.7 }}>
              Advanced AI sourcing and premium automation for faster procurement.
            </p>

            <ul
              style={{
                margin: "18px 0 0",
                paddingLeft: "20px",
                color: "#334155",
                lineHeight: 2,
              }}
            >
              <li>Everything in Starter</li>
              <li>AI multi-item sourcing</li>
              <li>Smarter vendor ranking</li>
              <li>Automation features</li>
              <li>Preferred vendor logic</li>
              <li>Premium workflows</li>
            </ul>

            <a
              href="/pricing"
              style={{
                display: "block",
                marginTop: "22px",
                textAlign: "center",
                textDecoration: "none",
                background: "#2563eb",
                color: "white",
                padding: "14px 16px",
                borderRadius: "14px",
                fontWeight: 800,
              }}
            >
              Start 7-day trial
            </a>
          </div>
        </div>
      </section>

      <footer
        style={{
          borderTop: "1px solid #e2e8f0",
          background: "white",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "22px 20px",
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            color: "#475569",
          }}
        >
          <div>
            <span style={{ fontWeight: 800, color: "#0f172a" }}>Shuka</span>{" "}
            — AI-powered procurement for modern teams
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="/pricing" style={{ color: "#475569", textDecoration: "none" }}>
              Pricing
            </a>
            <a href="/login" style={{ color: "#475569", textDecoration: "none" }}>
              Login
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
