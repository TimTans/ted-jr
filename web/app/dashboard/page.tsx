"use client";
import { useState } from "react";
import ProfileDropdown from "@/components/ProfileDropdown";
import StoreMap from "@/components/StoreMap";

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

  const dealTagClass = (tag: string) => {
    if (tag === "HOT") return "bg-red-100 text-red-600";
    if (tag === "DEAL") return "bg-green-100 text-green-800";
    return "bg-blue-100 text-blue-700";
  };

  const itemDotColor = (i: number) =>
    i < 2 ? "bg-green-700" : i < 4 ? "bg-orange-600" : "bg-blue-700";

  return (
    <div
      className="min-h-screen text-stone-900"
      style={{ background: "#F7F5F0", fontFamily: "'DM Sans', 'Avenir', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&display=swap');
        .fraunces { font-family: 'Fraunces', serif; }
        @keyframes ping-dot {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        .map-ping::after {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid rgba(45,106,79,0.2);
          animation: ping-dot 2s cubic-bezier(0,0,0.2,1) infinite;
        }
        .route-dash {
          background: repeating-linear-gradient(
            to bottom,
            #2D6A4F 0px, #2D6A4F 4px,
            transparent 4px, transparent 10px
          );
        }
      `}</style>

      {/* ── Header ── */}
      <header className="max-w-[1320px] mx-auto px-8 pt-6 pb-5 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center text-white text-xl font-bold fraunces"
            style={{
              background: "linear-gradient(135deg, #2D6A4F, #52B788)",
              boxShadow: "0 4px 14px rgba(45,106,79,0.25)",
            }}
          >N</div>
          <div>
            <div className="fraunces text-[22px] font-bold tracking-tight leading-tight">Neighborly</div>
            <div className="text-xs text-stone-400">Smart grocery planning</div>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="flex gap-1 bg-stone-200 rounded-full p-1">
          {["overview", "lists", "routes", "deals"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border-none cursor-pointer
                ${activeTab === tab
                  ? "bg-green-800 text-white shadow-sm"
                  : "bg-transparent text-stone-500 hover:bg-stone-300 hover:text-stone-800"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          {/* Bell */}
          <div className="relative w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center cursor-pointer hover:bg-stone-300 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A5550" strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-[#F7F5F0]"/>
          </div>

          {/* Profile */}
          <ProfileDropdown />
        </div>
      </header>

      {/* ── Welcome Banner ── */}
      <div className="max-w-[1320px] mx-auto px-8 pb-6">
        <div
          className="rounded-3xl px-10 py-9 flex justify-between items-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)" }}
        >
          <div className="absolute -top-16 -right-10 w-60 h-60 rounded-full bg-white/[0.04] pointer-events-none"/>
          <div className="absolute -bottom-20 right-32 w-44 h-44 rounded-full bg-white/[0.03] pointer-events-none"/>
          <div className="relative z-10">
            <div className="fraunces text-3xl font-semibold text-white tracking-tight mb-1.5">
              Good morning, User
            </div>
            <div className="text-white/70 text-[15px] max-w-[460px]">
              Your optimized route is ready. 3 stores, 12 items — estimated savings of{" "}
              <span className="text-green-300 font-semibold">$6.70</span> vs. single-store shopping.
            </div>
          </div>
          <button className="relative z-10 bg-white text-green-800 font-semibold text-[15px] px-7 py-3.5 rounded-xl cursor-pointer border-none hover:bg-green-50 transition-all hover:-translate-y-0.5 hover:shadow-lg">
            Start Trip →
          </button>
        </div>
      </div>

      {/* ── Dashboard Grid ── */}
      <div className="max-w-[1320px] mx-auto px-8 pb-12 grid grid-cols-3 gap-5">

        {/* ── Budget Overview ── */}
        <div className="bg-white rounded-2xl p-7 border border-black/[0.05] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Weekly Budget
          </div>
          <div className="flex items-end gap-3 mb-4">
            <div className="fraunces text-[42px] font-semibold leading-none text-green-800">$57.31</div>
            <div className="text-sm text-stone-400 pb-1.5">of $120.00</div>
          </div>
          <div className="bg-stone-100 rounded-full h-2.5 overflow-hidden mb-3">
            <div
              className="h-full rounded-full"
              style={{ width: "47.8%", background: "linear-gradient(90deg, #2D6A4F, #52B788)" }}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-green-800 font-semibold">47.8% spent</span>
            <span className="text-sm text-stone-400">$62.69 remaining</span>
          </div>
        </div>

        {/* ── Savings Summary ── */}
        <div className="bg-white rounded-2xl p-7 border border-black/[0.05] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            Savings This Month
          </div>
          <div className="fraunces text-[42px] font-semibold leading-none text-orange-600">$42.80</div>
          <div className="text-sm text-stone-400 mt-1 mb-5">across 6 optimized trips</div>
          <div className="flex items-end gap-1 h-16">
            {[28, 45, 32, 58, 42, 65, 38, 52, 70, 48, 55, 60].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-md"
                style={{
                  height: `${h}%`,
                  background: i >= 10 ? "linear-gradient(to top, #2D6A4F, #52B788)" : "#E8F5E9",
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[11px] text-stone-300">Feb 1</span>
            <span className="text-[11px] text-stone-300">Today</span>
          </div>
        </div>

        {/* ── Trip Stats ── */}
        <div className="bg-white rounded-2xl p-7 border border-black/[0.05] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            Trip Stats
          </div>
          {[
            { label: "Avg. trip time", value: "34 min", icon: "⏱", bg: "bg-green-50" },
            { label: "Miles saved", value: "12.4 mi", icon: "📍", bg: "bg-orange-50" },
            { label: "Items tracked", value: "89", icon: "📦", bg: "bg-blue-50" },
            { label: "Price alerts", value: "3 new", icon: "🔔", bg: "bg-red-50" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 bg-stone-50 rounded-xl px-3.5 py-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${stat.bg}`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-xs text-stone-400">{stat.label}</div>
                <div className="text-base font-semibold text-stone-900">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Grocery List — col-span-2 row-span-2 ── */}
        <div className="bg-white rounded-2xl p-7 border border-black/[0.05] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 col-span-2 row-span-2">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
              </svg>
              Current Grocery List
            </div>
            <div className="flex gap-2">
              <button className="border border-green-800 text-green-800 bg-transparent px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer hover:bg-green-50 transition-colors">
                + Add Item
              </button>
              <button className="bg-green-800 text-white border-none px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer hover:bg-green-900 transition-colors">
                Optimize
              </button>
            </div>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] py-3 border-b-2 border-stone-100 text-[11px] font-semibold text-stone-300 uppercase tracking-wider">
            <span>Item</span>
            <span>Qty</span>
            <span>Best Price</span>
            <span>Store</span>
            <span className="text-right">Saved</span>
          </div>

          {groceryList.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center py-3.5 border-b border-stone-100 last:border-b-0"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${itemDotColor(i)}`}/>
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              <span className="text-sm text-stone-500">{item.qty}</span>
              <span className="text-sm font-semibold">${item.bestPrice.toFixed(2)}</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-800 w-fit">
                {item.store}
              </span>
              <span className="text-right text-sm font-semibold text-green-800">
                −${item.saved.toFixed(2)}
              </span>
            </div>
          ))}

          {/* Totals */}
          <div className="flex justify-between items-center mt-5 pt-4 border-t-2 border-stone-100">
            <div>
              <div className="text-sm text-stone-400">Estimated Total</div>
              <div className="fraunces text-3xl font-semibold">$21.54</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-stone-400">Total Savings</div>
              <div className="fraunces text-3xl font-semibold text-green-800">$6.70</div>
            </div>
          </div>
        </div>

        {/* ── Optimized Route — row-span-2 ── */}
        <div className="bg-white rounded-2xl p-7 border border-black/[0.05] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 row-span-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
            Optimized Route
          </div>

          <div className="rounded-2xl h-52 relative overflow-hidden mb-5">
            <StoreMap />
          </div>

          {/* Route stops */}
          {routeStops.map((stop, i) => (
            <div key={i} className="flex items-start gap-4 py-4 relative">
              {i < routeStops.length - 1 && (
                <div
                  className="route-dash absolute w-0.5"
                  style={{ left: 17, top: 52, height: "calc(100% - 36px)" }}
                />
              )}
              <div className="w-9 h-9 rounded-full bg-green-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {stop.num}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[15px] mb-0.5">{stop.store}</div>
                <div className="text-xs text-stone-400">{stop.address}</div>
                <div className="flex gap-3 mt-1.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-800">
                    {stop.items} items
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-700">
                    {stop.est} drive
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Route summary */}
          <div className="mt-4 px-4 py-3.5 bg-stone-50 rounded-xl flex justify-between text-sm border border-stone-100">
            <div>
              <div className="text-stone-400 text-xs">Total distance</div>
              <div className="font-semibold">4.3 miles</div>
            </div>
            <div>
              <div className="text-stone-400 text-xs">Est. time</div>
              <div className="font-semibold">35 min</div>
            </div>
            <div>
              <div className="text-stone-400 text-xs">Stops</div>
              <div className="font-semibold">3 stores</div>
            </div>
          </div>
        </div>

        {/* ── Store Breakdown — col-span-2 ── */}
        <div className="bg-white rounded-2xl p-7 border border-black/[0.05] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 col-span-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            Store Breakdown
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            {stores.map((store, i) => (
              <div key={i} className="bg-stone-50 rounded-2xl p-[18px] border border-stone-100 flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: store.color }}/>
                    <span className="font-semibold text-[15px]">{store.name}</span>
                  </div>
                  <span className="text-xs text-stone-400">{store.distance}</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-stone-400">{store.items} items</div>
                    <div className="fraunces text-[22px] font-semibold">${store.total}</div>
                  </div>
                  {/* Mini bar chart */}
                  <div className="flex items-end gap-1 w-16 h-10">
                    {[60, 80, 45, 90].map((h, j) => (
                      <div
                        key={j}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: j === 3 ? store.color : `${store.color}30`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Nearby Deals ── */}
        <div className="bg-white rounded-2xl p-7 border border-black/[0.05] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            Nearby Deals
          </div>
          {deals.map((deal, i) => (
            <div
              key={i}
              className="bg-stone-50 rounded-2xl p-4 mb-3 last:mb-0 border border-stone-100 flex justify-between items-center hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <div>
                <div className="font-semibold text-sm mb-0.5">{deal.item}</div>
                <div className="text-xs text-stone-400">{deal.store}</div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <div className="font-bold text-base text-green-800">{deal.price}</div>
                  <div className="text-[11px] text-stone-300 line-through">{deal.was}</div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${dealTagClass(deal.tag)}`}>
                  {deal.tag}
                </span>
              </div>
            </div>
          ))}
          <button className="w-full mt-3 border border-green-800 text-green-800 bg-transparent py-2.5 rounded-xl text-sm font-semibold cursor-pointer hover:bg-green-50 transition-colors">
            View All Deals
          </button>
        </div>

        {/* ── Dietary Preferences — col-span-3 ── */}
        <div className="bg-white rounded-2xl p-7 border border-black/[0.05] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 col-span-3">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Dietary Preferences
            </div>
            <button className="border border-green-800 text-green-800 bg-transparent px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer hover:bg-green-50 transition-colors">
              Edit Preferences
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
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
              <div
                key={i}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium border cursor-pointer transition-colors
                  ${diet.active
                    ? "bg-green-50 border-green-300 text-green-800"
                    : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100"
                  }`}
              >
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

          {/* Nutrition limits */}
          <div className="mt-4 px-4 py-3.5 bg-stone-50 rounded-xl flex gap-8 text-sm border border-stone-100 flex-wrap">
            {[
              { label: "Sodium limit", value: "< 1,500mg/day" },
              { label: "Protein target", value: "> 120g/day" },
              { label: "Cholesterol", value: "< 200mg/day" },
              { label: "Sugar", value: "< 30g/day" },
            ].map((n, i) => (
              <div key={i}>
                <span className="text-stone-400">{n.label}</span>
                <span className="font-semibold ml-2">{n.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;