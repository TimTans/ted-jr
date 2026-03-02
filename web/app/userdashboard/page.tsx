"use client";
import { useState } from "react";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const groceryList = [
    { name: "Organic Bananas", qty: "1 bunch", bestPrice: 1.29, store: "Trader Joe's", saved: 0.70 },
    { name: "Whole Milk 1 Gal", qty: "1", bestPrice: 3.49, store: "Aldi", saved: 1.20 },
    { name: "Chicken Breast", qty: "2 lbs", bestPrice: 5.99, store: "Costco", saved: 2.50 },
    { name: "Sourdough Bread", qty: "1 loaf", bestPrice: 3.99, store: "Trader Joe's", saved: 0.50 },
    { name: "Baby Spinach", qty: "5 oz", bestPrice: 2.49, store: "Aldi", saved: 1.00 },
    { name: "Greek Yogurt", qty: "32 oz", bestPrice: 4.29, store: "Walmart", saved: 0.80 },
  ];

  const stores = [
    { name: "Trader Joe's", items: 4, total: 18.42, distance: "0.8 mi", color: "#D94F30" },
    { name: "Aldi", items: 3, total: 12.67, distance: "1.2 mi", color: "#0070C0" },
    { name: "Costco", items: 2, total: 14.99, distance: "2.4 mi", color: "#E31837" },
    { name: "Walmart", items: 3, total: 11.23, distance: "1.7 mi", color: "#0071CE" },
  ];

  const deals = [
    { item: "Avocados (4 pk)", store: "Aldi", price: "$2.99", was: "$4.49", tag: "HOT" },
    { item: "Olive Oil 500ml", store: "Trader Joe's", price: "$5.49", was: "$7.99", tag: "DEAL" },
    { item: "Oat Milk", store: "Walmart", price: "$2.78", was: "$3.98", tag: "NEW" },
  ];

  const routeStops = [
    { num: 1, store: "Aldi", address: "142 Atlantic Ave", items: 3, est: "12 min" },
    { num: 2, store: "Trader Joe's", address: "130 Court St", items: 4, est: "8 min" },
    { num: 3, store: "Costco", address: "976 3rd Ave", items: 2, est: "15 min" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F7F5F0",
      fontFamily: "'DM Sans', 'Avenir', sans-serif",
      color: "#1A1A1A",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: auto auto auto;
          gap: 20px;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 32px 48px;
        }

        .card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 28px;
          border: 1px solid rgba(0,0,0,0.05);
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }

        .card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.06);
          transform: translateY(-2px);
        }

        .card-title {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #8B8680;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stat-big {
          font-family: 'Fraunces', serif;
          font-size: 42px;
          font-weight: 600;
          line-height: 1;
          color: #1A1A1A;
        }

        .stat-label {
          font-size: 14px;
          color: #8B8680;
          margin-top: 4px;
        }

        .accent-green { color: #2D6A4F; }
        .accent-orange { color: #D4700A; }
        .accent-red { color: #C1292E; }

        .bg-green { background: #E8F5E9; color: #2D6A4F; }
        .bg-orange { background: #FFF3E0; color: #D4700A; }
        .bg-red { background: #FFEBEE; color: #C1292E; }
        .bg-blue { background: #E3F2FD; color: #1565C0; }

        .pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .grocery-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #F0EDE8;
        }

        .grocery-item:last-child { border-bottom: none; }

        .store-bar {
          height: 8px;
          border-radius: 100px;
          transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .route-stop {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px 0;
          position: relative;
        }

        .route-num {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #2D6A4F;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .route-line {
          position: absolute;
          left: 17px;
          top: 52px;
          width: 2px;
          height: calc(100% - 36px);
          background: repeating-linear-gradient(
            to bottom,
            #2D6A4F 0px,
            #2D6A4F 4px,
            transparent 4px,
            transparent 8px
          );
        }

        .deal-card {
          background: #FAFAF7;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 12px;
          border: 1px solid #F0EDE8;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s;
        }

        .deal-card:hover { background: #F5F3EE; }
        .deal-card:last-child { margin-bottom: 0; }

        .nav-tab {
          padding: 10px 20px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          background: transparent;
          color: #8B8680;
        }

        .nav-tab.active {
          background: #2D6A4F;
          color: white;
        }

        .nav-tab:not(.active):hover {
          background: #EDEBE6;
          color: #1A1A1A;
        }

        .diet-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          background: #F5F3EE;
          border: 1px solid #E8E4DD;
          color: #5A5550;
        }

        .diet-tag.active-tag {
          background: #E8F5E9;
          border-color: #A5D6A7;
          color: #2D6A4F;
        }

        .map-placeholder {
          background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 40%, #A5D6A7 100%);
          border-radius: 16px;
          height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .map-placeholder::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 30% 40%, rgba(45,106,79,0.12) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(45,106,79,0.08) 0%, transparent 40%);
        }

        .map-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #2D6A4F;
          position: absolute;
          box-shadow: 0 0 0 4px rgba(45,106,79,0.2);
        }

        .map-dot::after {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 2px solid rgba(45,106,79,0.15);
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        .map-path {
          position: absolute;
          border: 2px dashed rgba(45,106,79,0.3);
          border-radius: 50%;
        }

        .progress-ring {
          transform: rotate(-90deg);
        }

        .btn-primary {
          background: #2D6A4F;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-primary:hover {
          background: #1B4332;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(45,106,79,0.3);
        }

        .btn-outline {
          background: transparent;
          color: #2D6A4F;
          border: 1.5px solid #2D6A4F;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-outline:hover {
          background: #E8F5E9;
        }

        .span-2 { grid-column: span 2; }
        .span-3 { grid-column: span 3; }
        .span-row-2 { grid-row: span 2; }
      `}</style>

      {/* Header */}
      <header style={{
        padding: "24px 32px 20px",
        maxWidth: 1320,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: "linear-gradient(135deg, #2D6A4F, #52B788)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 20, fontWeight: 700,
            fontFamily: "'Fraunces', serif",
            boxShadow: "0 4px 14px rgba(45,106,79,0.25)",
          }}>N</div>
          <div>
            <div style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 22, fontWeight: 700, color: "#1A1A1A",
              letterSpacing: "-0.02em",
            }}>Neighborly</div>
            <div style={{ fontSize: 12, color: "#8B8680", marginTop: -2 }}>Smart grocery planning</div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 4, background: "#EDEBE6", borderRadius: 100, padding: 4 }}>
          {["overview", "lists", "routes", "deals"].map(tab => (
            <button
              key={tab}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "#EDEBE6", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", position: "relative",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A5550" strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <div style={{
              position: "absolute", top: -2, right: -2,
              width: 10, height: 10, borderRadius: "50%",
              background: "#C1292E", border: "2px solid #F7F5F0",
            }}/>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #D4700A, #F4A261)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700, fontSize: 15,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
          }}>ET</div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div style={{
        maxWidth: 1320, margin: "0 auto", padding: "0 32px 24px",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)",
          borderRadius: 24, padding: "36px 40px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -60, right: -40,
            width: 240, height: 240, borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}/>
          <div style={{
            position: "absolute", bottom: -80, right: 120,
            width: 180, height: 180, borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}/>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 30, fontWeight: 600, color: "white",
              letterSpacing: "-0.02em", marginBottom: 6,
            }}>
              Good morning, User
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, maxWidth: 460 }}>
              Your optimized route is ready. 3 stores, 12 items — estimated savings of <span style={{ color: "#A5D6A7", fontWeight: 600 }}>$6.70</span> vs. single-store shopping.
            </div>
          </div>
          <button className="btn-primary" style={{
            background: "white", color: "#2D6A4F",
            padding: "14px 28px", fontSize: 15,
            position: "relative", zIndex: 1,
          }}>
            Start Trip →
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">

        {/* Budget Overview */}
        <div className="card">
          <div className="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Weekly Budget
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 16 }}>
            <div className="stat-big accent-green">$57.31</div>
            <div style={{ fontSize: 14, color: "#8B8680", paddingBottom: 6 }}>of $120.00</div>
          </div>
          <div style={{ background: "#F0EDE8", borderRadius: 100, height: 10, overflow: "hidden", marginBottom: 12 }}>
            <div style={{
              width: "47.8%", height: "100%", borderRadius: 100,
              background: "linear-gradient(90deg, #2D6A4F, #52B788)",
              transition: "width 1s ease",
            }}/>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#2D6A4F", fontWeight: 600 }}>47.8% spent</span>
            <span style={{ fontSize: 13, color: "#8B8680" }}>$62.69 remaining</span>
          </div>
        </div>

        {/* Savings Summary */}
        <div className="card">
          <div className="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Savings This Month
          </div>
          <div className="stat-big" style={{ color: "#D4700A" }}>$42.80</div>
          <div className="stat-label">across 6 optimized trips</div>
          <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
            {[28, 45, 32, 58, 42, 65, 38, 52, 70, 48, 55, 60].map((h, i) => (
              <div key={i} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <div style={{
                  width: "100%", height: h, borderRadius: 6,
                  background: i >= 10 ? "linear-gradient(to top, #2D6A4F, #52B788)" : "#E8F5E9",
                  transition: "height 0.5s ease",
                }}/>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 11, color: "#AAA5A0" }}>Feb 1</span>
            <span style={{ fontSize: 11, color: "#AAA5A0" }}>Today</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Trip Stats
          </div>
          {[
            { label: "Avg. trip time", value: "34 min", icon: "⏱", bg: "#E8F5E9" },
            { label: "Miles saved", value: "12.4 mi", icon: "📍", bg: "#FFF3E0" },
            { label: "Items tracked", value: "89", icon: "📦", bg: "#E3F2FD" },
            { label: "Price alerts", value: "3 new", icon: "🔔", bg: "#FFEBEE" },
          ].map((stat, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#FAFAF7", borderRadius: 12, padding: "12px 14px",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: stat.bg, display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>{stat.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#8B8680" }}>{stat.label}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A" }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Grocery List */}
        <div className="card span-2 span-row-2">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
              Current Grocery List
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-outline" style={{ padding: "6px 14px", fontSize: 12 }}>+ Add Item</button>
              <button className="btn-primary" style={{ padding: "6px 14px", fontSize: 12 }}>Optimize</button>
            </div>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            padding: "12px 0", borderBottom: "2px solid #F0EDE8",
            fontSize: 12, fontWeight: 600, color: "#AAA5A0",
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            <span>Item</span>
            <span>Qty</span>
            <span>Best Price</span>
            <span>Store</span>
            <span style={{ textAlign: "right" }}>Saved</span>
          </div>

          {groceryList.map((item, i) => (
            <div key={i} className="grocery-item" style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
              alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: i < 2 ? "#2D6A4F" : i < 4 ? "#D4700A" : "#1565C0",
                }}/>
                <span style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</span>
              </div>
              <span style={{ fontSize: 13, color: "#5A5550" }}>{item.qty}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>${item.bestPrice.toFixed(2)}</span>
              <span className="pill bg-green" style={{ width: "fit-content" }}>{item.store}</span>
              <span style={{
                textAlign: "right", fontSize: 13, fontWeight: 600, color: "#2D6A4F",
              }}>−${item.saved.toFixed(2)}</span>
            </div>
          ))}

          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: 20, padding: "16px 0", borderTop: "2px solid #F0EDE8",
          }}>
            <div>
              <span style={{ fontSize: 13, color: "#8B8680" }}>Estimated Total</span>
              <div style={{
                fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 600,
              }}>$21.54</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 13, color: "#8B8680" }}>Total Savings</span>
              <div style={{
                fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 600, color: "#2D6A4F",
              }}>$6.70</div>
            </div>
          </div>
        </div>

        {/* Route Preview */}
        <div className="card span-row-2">
          <div className="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            Optimized Route
          </div>

          {/* Map Placeholder */}
          <div className="map-placeholder" style={{ marginBottom: 20 }}>
            <div className="map-dot" style={{ top: "30%", left: "25%" }}/>
            <div className="map-dot" style={{ top: "55%", left: "55%", background: "#D4700A", boxShadow: "0 0 0 4px rgba(212,112,10,0.2)" }}/>
            <div className="map-dot" style={{ top: "40%", left: "75%", background: "#C1292E", boxShadow: "0 0 0 4px rgba(193,41,46,0.2)" }}/>
            <div className="map-path" style={{ width: 100, height: 60, top: "28%", left: "30%", borderColor: "rgba(45,106,79,0.2)" }}/>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(45,106,79,0.5)" strokeWidth="1.5" style={{ position: "relative", zIndex: 1 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ fontSize: 12, color: "rgba(45,106,79,0.7)", marginTop: 4, position: "relative", zIndex: 1, fontWeight: 500 }}>
              Google Maps Integration
            </span>
          </div>

          {/* Route Stops */}
          {routeStops.map((stop, i) => (
            <div key={i} className="route-stop">
              {i < routeStops.length - 1 && <div className="route-line"/>}
              <div className="route-num">{stop.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{stop.store}</div>
                <div style={{ fontSize: 12, color: "#8B8680" }}>{stop.address}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                  <span className="pill bg-green" style={{ fontSize: 11 }}>{stop.items} items</span>
                  <span className="pill bg-orange" style={{ fontSize: 11 }}>{stop.est} drive</span>
                </div>
              </div>
            </div>
          ))}

          <div style={{
            marginTop: 16, padding: "14px 16px",
            background: "#F5F3EE", borderRadius: 12,
            display: "flex", justifyContent: "space-between", fontSize: 13,
          }}>
            <div>
              <span style={{ color: "#8B8680" }}>Total distance</span>
              <div style={{ fontWeight: 600 }}>4.3 miles</div>
            </div>
            <div>
              <span style={{ color: "#8B8680" }}>Est. time</span>
              <div style={{ fontWeight: 600 }}>35 min</div>
            </div>
            <div>
              <span style={{ color: "#8B8680" }}>Stops</span>
              <div style={{ fontWeight: 600 }}>3 stores</div>
            </div>
          </div>
        </div>

        {/* Store Breakdown */}
        <div className="card span-2">
          <div className="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Store Breakdown
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {stores.map((store, i) => (
              <div key={i} style={{
                background: "#FAFAF7", borderRadius: 14, padding: "18px",
                border: "1px solid #F0EDE8",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%", background: store.color,
                    }}/>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{store.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#8B8680" }}>{store.distance}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <span style={{ fontSize: 12, color: "#8B8680" }}>{store.items} items</span>
                    <div style={{
                      fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600,
                    }}>${store.total}</div>
                  </div>
                  <div style={{
                    width: 60, height: 40, display: "flex", alignItems: "flex-end", gap: 3,
                  }}>
                    {[60, 80, 45, 90].map((h, j) => (
                      <div key={j} style={{
                        flex: 1, height: `${h}%`, borderRadius: 3,
                        background: j === 3 ? store.color : `${store.color}30`,
                      }}/>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Deals */}
        <div className="card">
          <div className="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            Nearby Deals
          </div>
          {deals.map((deal, i) => (
            <div key={i} className="deal-card">
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{deal.item}</div>
                <div style={{ fontSize: 12, color: "#8B8680" }}>{deal.store}</div>
              </div>
              <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#2D6A4F" }}>{deal.price}</div>
                  <div style={{ fontSize: 11, color: "#AAA5A0", textDecoration: "line-through" }}>{deal.was}</div>
                </div>
                <span className={`pill ${deal.tag === 'HOT' ? 'bg-red' : deal.tag === 'DEAL' ? 'bg-green' : 'bg-blue'}`}>
                  {deal.tag}
                </span>
              </div>
            </div>
          ))}
          <button className="btn-outline" style={{ width: "100%", marginTop: 12 }}>
            View All Deals
          </button>
        </div>

        {/* Dietary Preferences */}
        <div className="card span-3">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="card-title" style={{ marginBottom: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Dietary Preferences
            </div>
            <button className="btn-outline" style={{ padding: "6px 14px", fontSize: 12 }}>Edit Preferences</button>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {[
              { name: "Low Sodium", active: true, icon: "🧂" },
              { name: "High Protein", active: true, icon: "💪" },
              { name: "Halal", active: true, icon: "✓" },
              { name: "Gluten-Free", active: false, icon: "🌾" },
              { name: "Vegan", active: false, icon: "🌱" },
              { name: "Keto", active: false, icon: "🥑" },
              { name: "Low Carb", active: false, icon: "📊" },
              { name: "Vegetarian", active: false, icon: "🥬" },
              { name: "Kosher", active: false, icon: "✡" },
              { name: "Dairy-Free", active: false, icon: "🥛" },
            ].map((diet, i) => (
              <div key={i} className={`diet-tag ${diet.active ? 'active-tag' : ''}`}>
                <span>{diet.icon}</span>
                {diet.name}
                {diet.active && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 16, padding: "14px 18px",
            background: "#FAFAF7", borderRadius: 12,
            display: "flex", gap: 32, fontSize: 13,
            border: "1px solid #F0EDE8",
          }}>
            <div>
              <span style={{ color: "#8B8680" }}>Sodium limit</span>
              <span style={{ fontWeight: 600, marginLeft: 8 }}>{"< 1,500mg/day"}</span>
            </div>
            <div>
              <span style={{ color: "#8B8680" }}>Protein target</span>
              <span style={{ fontWeight: 600, marginLeft: 8 }}>{"> 120g/day"}</span>
            </div>
            <div>
              <span style={{ color: "#8B8680" }}>Cholesterol</span>
              <span style={{ fontWeight: 600, marginLeft: 8 }}>{"< 200mg/day"}</span>
            </div>
            <div>
              <span style={{ color: "#8B8680" }}>Sugar</span>
              <span style={{ fontWeight: 600, marginLeft: 8 }}>{"< 30g/day"}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;