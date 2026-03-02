"use client";
import React, { useState, useRef, useEffect } from "react";


interface StoreProduct {
  id: string;
  name: string;            
  brand: string | null;    
  category: string;       
  unit_type: string;       
  price: number;           
  sale_price: number | null; 
  in_stock: boolean;      
  data_source: string;     
  updated_at: string;     
}

interface PriceHistoryEntry {
  price: number;          
  sale_price: number | null; 
  recorded_at: string;     
}

interface StoreReview {
  rating: number;          
  comment: string | null;  
  user_name: string;       
  created_at: string;      
}

interface Store {
  name: string;            
  address: string;        
  phone: string | null;    
  website_url: string | null;
  zip_code: string | null; 
}

/* ═══ DATA ═══ */

const INITIAL_PRODUCTS: StoreProduct[] = [
  { id: "sp1", name: "Organic Bananas", brand: "Trader Joe's", category: "Produce", unit_type: "bunch", price: 1.29, sale_price: null, in_stock: true, data_source: "vendor", updated_at: "2026-02-24T10:30:00" },
  { id: "sp2", name: "Whole Milk 1 Gal", brand: "Trader Joe's", category: "Dairy", unit_type: "gal", price: 4.69, sale_price: null, in_stock: true, data_source: "vendor", updated_at: "2026-02-24T11:00:00" },
  { id: "sp3", name: "Chicken Breast", brand: null, category: "Meat", unit_type: "lb", price: 8.49, sale_price: 6.99, in_stock: true, data_source: "vendor", updated_at: "2026-02-24T08:15:00" },
  { id: "sp4", name: "Sourdough Bread", brand: "Trader Joe's", category: "Bakery", unit_type: "loaf", price: 4.49, sale_price: null, in_stock: true, data_source: "vendor", updated_at: "2026-02-24T11:45:00" },
  { id: "sp5", name: "Baby Spinach 5oz", brand: "Trader Joe's", category: "Produce", unit_type: "bag", price: 3.49, sale_price: 2.99, in_stock: true, data_source: "api", updated_at: "2026-02-24T09:20:00" },
  { id: "sp6", name: "Greek Yogurt 32oz", brand: "Fage", category: "Dairy", unit_type: "tub", price: 5.09, sale_price: null, in_stock: false, data_source: "vendor", updated_at: "2026-02-24T06:00:00" },
  { id: "sp7", name: "Olive Oil 500ml", brand: "Trader Joe's", category: "Pantry", unit_type: "bottle", price: 7.99, sale_price: 5.49, in_stock: true, data_source: "vendor", updated_at: "2026-02-24T11:00:00" },
  { id: "sp8", name: "Avocados (4 pk)", brand: null, category: "Produce", unit_type: "pack", price: 4.49, sale_price: 2.99, in_stock: true, data_source: "community", updated_at: "2026-02-23T17:30:00" },
];

const PRICE_HISTORY: Record<string, PriceHistoryEntry[]> = {
  sp3: [
    { price: 8.49, sale_price: null, recorded_at: "2026-02-01" },
    { price: 8.49, sale_price: 7.49, recorded_at: "2026-02-10" },
    { price: 8.49, sale_price: 6.99, recorded_at: "2026-02-20" },
  ],
  sp7: [
    { price: 8.99, sale_price: null, recorded_at: "2026-01-15" },
    { price: 7.99, sale_price: null, recorded_at: "2026-02-01" },
    { price: 7.99, sale_price: 5.49, recorded_at: "2026-02-22" },
  ],
  sp1: [
    { price: 1.49, sale_price: null, recorded_at: "2026-02-01" },
    { price: 1.29, sale_price: null, recorded_at: "2026-02-15" },
  ],
};

const REVIEWS: StoreReview[] = [
  { rating: 5, comment: "Great prices on produce, always fresh.", user_name: "Maria S.", created_at: "2026-02-22" },
  { rating: 4, comment: "Love the store brand items. Wish they had more organic options.", user_name: "James L.", created_at: "2026-02-20" },
  { rating: 5, comment: "Best prices in the neighborhood for everyday staples.", user_name: "Priya K.", created_at: "2026-02-18" },
  { rating: 3, comment: "Sometimes out of stock on popular items.", user_name: "David R.", created_at: "2026-02-15" },
  { rating: 5, comment: null, user_name: "Aisha M.", created_at: "2026-02-12" },
];

const STORE: Store = {
  name: "Trader Joe's",
  address: "130 Court St, Brooklyn, NY 11201",
  phone: "(718) 246-8460",
  website_url: "traderjoes.com",
  zip_code: "11201",
};

/* ═══ HELPERS ═══ */

const CAT_COLORS: Record<string, string> = { Produce: "#2D6A4F", Dairy: "#1565C0", Meat: "#C1292E", Bakery: "#D4700A", Pantry: "#6D6560" };
const SRC_LABELS: Record<string, string> = { vendor: "Vendor", api: "API", community: "Community", scrape: "Scraped" };
const SRC_PILLS: Record<string, string> = { vendor: "bg-g", api: "bg-b", community: "bg-o", scrape: "bg-gr" };

const catColor = (c: string): string => CAT_COLORS[c] || "#8B8680";
const srcLabel = (s: string): string => SRC_LABELS[s] || s;
const srcPill = (s: string): string => SRC_PILLS[s] || "bg-gr";

const fmtTime = (iso: string): string => {
  const d = new Date(iso);
  const now = new Date("2026-02-24T12:00:00");
  const m = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const starsStr = (n: number): string => "★".repeat(n) + "☆".repeat(5 - n);

const VendorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("products");
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>(INITIAL_PRODUCTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editSale, setEditSale] = useState<string>("");
  const [historyOpen, setHistoryOpen] = useState<string | null>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && priceInputRef.current) {
      priceInputRef.current.focus();
    }
  }, [editingId]);

  const inStockCount = storeProducts.filter((p) => p.in_stock).length;
  const outOfStockCount = storeProducts.filter((p) => !p.in_stock).length;
  const onSaleCount = storeProducts.filter((p) => p.sale_price !== null).length;
  const stockPct = Math.round((inStockCount / storeProducts.length) * 100);
  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  const categoryCounts: Record<string, number> = {};
  storeProducts.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const startEdit = (p: StoreProduct) => {
    setEditingId(p.id);
    setEditPrice(p.price.toFixed(2));
    setEditSale(p.sale_price ? p.sale_price.toFixed(2) : "");
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = (id: string) => {
    const np = parseFloat(editPrice);
    if (isNaN(np)) return;
    const ns = editSale.trim() ? parseFloat(editSale) : null;
    if (ns !== null && isNaN(ns)) return;
    setStoreProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, price: np, sale_price: ns, data_source: "vendor", updated_at: new Date().toISOString() }
          : p
      )
    );
    setEditingId(null);
  };

  const toggleStock = (id: string) => {
    setStoreProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, in_stock: !p.in_stock, data_source: "vendor", updated_at: new Date().toISOString() }
          : p
      )
    );
  };

  const handleEditKeydown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") saveEdit(id);
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F0", fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .vg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;max-width:1320px;margin:0 auto;padding:0 32px 48px}
        .s2{grid-column:span 2}.s3{grid-column:span 3}
        .vc{background:#fff;border-radius:20px;padding:28px;border:1px solid rgba(0,0,0,.05);transition:box-shadow .3s,transform .2s}
        .vc:hover{box-shadow:0 8px 32px rgba(0,0,0,.06);transform:translateY(-2px)}
        .vt{font-weight:600;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#8B8680;margin-bottom:16px;display:flex;align-items:center;gap:8px}
        .vbig{font-family:'Fraunces',serif;font-size:42px;font-weight:600;line-height:1}
        .pill{display:inline-flex;align-items:center;padding:4px 10px;border-radius:100px;font-size:11px;font-weight:600;letter-spacing:.04em}
        .bg-g{background:#E8F5E9;color:#2D6A4F}.bg-o{background:#FFF3E0;color:#D4700A}.bg-r{background:#FFEBEE;color:#C1292E}.bg-b{background:#E3F2FD;color:#1565C0}.bg-gr{background:#F0EDE8;color:#6D6560}
        .tab{padding:10px 20px;border-radius:100px;font-size:14px;font-weight:500;cursor:pointer;border:none;transition:all .2s;background:transparent;color:#8B8680;font-family:'DM Sans',sans-serif}
        .tab.on{background:#2D6A4F;color:#fff}.tab:not(.on):hover{background:#EDEBE6;color:#1A1A1A}
        .bp{background:#2D6A4F;color:#fff;border:none;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
        .bp:hover{background:#1B4332;transform:translateY(-1px);box-shadow:0 4px 12px rgba(45,106,79,.3)}
        .bo{background:transparent;color:#2D6A4F;border:1.5px solid #2D6A4F;padding:10px 20px;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
        .bo:hover{background:#E8F5E9}
        .sm{padding:6px 14px;font-size:12px}
        .gh{background:transparent;border:none;color:#8B8680;cursor:pointer;padding:6px 10px;border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;transition:all .15s;display:inline-flex;align-items:center}
        .gh:hover{background:#F0EDE8;color:#1A1A1A}
        .vi{border:1.5px solid #E8E4DD;border-radius:10px;padding:8px 12px;font-size:14px;font-family:'DM Sans',sans-serif;color:#1A1A1A;background:#FAFAF7;outline:none;font-weight:600;transition:border-color .2s}
        .vi:focus{border-color:#2D6A4F;background:#fff;box-shadow:0 0 0 3px rgba(45,106,79,.1)}
        .throw{display:grid;grid-template-columns:2.2fr .8fr .9fr .7fr .7fr .7fr 80px;align-items:center;padding:14px 0;border-bottom:1px solid #F0EDE8;font-size:14px}
        .throw:last-child{border-bottom:none}
        .thead{font-size:12px;font-weight:600;color:#AAA5A0;letter-spacing:.06em;text-transform:uppercase;padding:12px 0;border-bottom:2px solid #F0EDE8}
        .stock-btn{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:100px;font-size:12px;font-weight:600;border:none;cursor:pointer;transition:all .2s}
        .stock-in{background:#E8F5E9;color:#2D6A4F}.stock-out{background:#FFEBEE;color:#C1292E}
        .sale-card{background:#FAFAF7;border-radius:14px;padding:18px;border:1px solid #F0EDE8}
        .review-item{padding:14px 0}.review-item:not(:last-child){border-bottom:1px solid #F0EDE8}
        .info-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:16px;margin-top:16px}
        .info-box{background:#FAFAF7;border-radius:12px;padding:14px 16px;border:1px solid #F0EDE8}
        .info-label{font-size:11px;color:#AAA5A0;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;font-weight:600}
        .info-value{font-size:14px;font-weight:500;word-break:break-word}
        .rating-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
        .rating-bar-bg{flex:1;background:#F0EDE8;border-radius:100px;height:6px;overflow:hidden}
        .rating-bar-fill{height:100%;border-radius:100px;background:#D4700A}
        .stock-bar-bg{background:#F0EDE8;border-radius:100px;height:10px;overflow:hidden}
        .stock-bar-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#2D6A4F,#52B788);transition:width .6s ease}
      `}</style>

      {/* ═══ HEADER ═══ */}
      <header style={{ padding: "24px 32px 20px", maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#2D6A4F,#52B788)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 700, fontFamily: "'Fraunces',serif", boxShadow: "0 4px 14px rgba(45,106,79,.25)" }}>N</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, letterSpacing: "-.02em" }}>Neighborly</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#D4700A", background: "#FFF3E0", padding: "3px 10px", borderRadius: 100, letterSpacing: ".04em" }}>VENDOR</span>
            </div>
            <div style={{ fontSize: 12, color: "#8B8680", marginTop: -2 }}>Store management portal</div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 4, background: "#EDEBE6", borderRadius: 100, padding: 4 }}>
          {["products", "reviews", "store info"].map((t) => (
            <button key={t} className={`tab ${activeTab === t ? "on" : ""}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: "#EDEBE6", borderRadius: 12, padding: "6px 14px 6px 6px" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#D94F30,#F4A261)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>TJ</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{STORE.name}</div>
              <div style={{ fontSize: 11, color: "#8B8680" }}>130 Court St</div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ BANNER ═══ */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px 24px" }}>
        <div style={{ background: "linear-gradient(135deg,#1B4332 0%,#2D6A4F 50%,#40916C 100%)", borderRadius: 24, padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
          <div style={{ position: "absolute", bottom: -80, right: 120, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.03)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: "#fff", letterSpacing: "-.02em", marginBottom: 6 }}>
              Welcome back, {STORE.name}
            </div>
            <div style={{ color: "rgba(255,255,255,.7)", fontSize: 15, maxWidth: 520 }}>
              <span style={{ color: "#A5D6A7", fontWeight: 600 }}>{storeProducts.length} products</span> listed
              {" · "}{inStockCount} in stock
              {outOfStockCount > 0 && (
                <>{" · "}<span style={{ color: "#FFCDD2", fontWeight: 600 }}>{outOfStockCount} out of stock</span></>
              )}
              {" · "}{onSaleCount} on sale
            </div>
          </div>
          <button className="bp" style={{ background: "#fff", color: "#2D6A4F", padding: "14px 28px", fontSize: 15, position: "relative", zIndex: 1 }}>+ Add Product</button>
        </div>
      </div>

      {/* ═══ GRID ═══ */}
      <div className="vg">

        {/* ── Total Products ── */}
        <div className="vc">
          <div className="vt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            Total Products
          </div>
          <div className="vbig">{storeProducts.length}</div>
          <div style={{ fontSize: 13, color: "#8B8680", marginTop: 4 }}>listed in your store</div>
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <span key={cat} className="pill" style={{ background: `${catColor(cat)}14`, color: catColor(cat) }}>{cat} ({count})</span>
            ))}
          </div>
        </div>

        {/* ── Stock Status ── */}
        <div className="vc">
          <div className="vt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>
            Stock Status
          </div>
          <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
            <div>
              <div className="vbig" style={{ color: "#2D6A4F" }}>{inStockCount}</div>
              <div style={{ fontSize: 13, color: "#8B8680" }}>in stock</div>
            </div>
            <div>
              <div className="vbig" style={{ color: outOfStockCount > 0 ? "#C1292E" : "#2D6A4F" }}>{outOfStockCount}</div>
              <div style={{ fontSize: 13, color: "#8B8680" }}>out of stock</div>
            </div>
          </div>
          <div className="stock-bar-bg">
            <div className="stock-bar-fill" style={{ width: `${stockPct}%` }} />
          </div>
          <div style={{ fontSize: 12, color: "#8B8680", marginTop: 6 }}>{stockPct}% availability</div>
        </div>

        {/* ── Reviews Summary ── */}
        <div className="vc">
          <div className="vt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            Shopper Reviews
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 8 }}>
            <div className="vbig" style={{ color: "#D4700A" }}>{avgRating}</div>
            <div style={{ fontSize: 22, color: "#D4700A", letterSpacing: 2, paddingBottom: 4 }}>{"★".repeat(Math.round(parseFloat(avgRating)))}</div>
          </div>
          <div style={{ fontSize: 13, color: "#8B8680" }}>{REVIEWS.length} reviews</div>
          <div style={{ marginTop: 14 }}>
            {[5, 4, 3, 2, 1].map((r) => {
              const count = REVIEWS.filter((rv) => rv.rating === r).length;
              const pctW = REVIEWS.length ? (count / REVIEWS.length) * 100 : 0;
              return (
                <div key={r} className="rating-row">
                  <span style={{ fontSize: 12, color: "#8B8680", width: 14, textAlign: "right" }}>{r}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4700A" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <div className="rating-bar-bg"><div className="rating-bar-fill" style={{ width: `${pctW}%` }} /></div>
                  <span style={{ fontSize: 12, color: "#8B8680", width: 16 }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ PRODUCT TABLE ═══ */}
        <div className="vc s3">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div className="vt" style={{ marginBottom: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Product Inventory
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="bo sm">Export</button>
              <button className="bp sm">+ Add Product</button>
            </div>
          </div>

          {/* thead */}
          <div className="throw thead">
            <span>Product</span>
            <span>Price</span>
            <span>Sale Price</span>
            <span>In Stock</span>
            <span>Source</span>
            <span>Updated</span>
            <span style={{ textAlign: "right" }}>Actions</span>
          </div>

          {/* rows */}
          {storeProducts.map((p) => {
            const isEditing = editingId === p.id;
            const hasHistory = !!PRICE_HISTORY[p.id];
            const isHistoryOpen = historyOpen === p.id;

            return (
              <div key={p.id}>
                <div className="throw">
                  {/* product name, brand, category, unit_type */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: catColor(p.category), flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#AAA5A0" }}>
                        {p.brand || "Generic"} · {p.category}{p.unit_type ? ` · per ${p.unit_type}` : ""}
                      </div>
                    </div>
                  </div>

                  {/* price */}
                  <div>
                    {isEditing ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: 13, color: "#8B8680" }}>$</span>
                        <input
                          ref={priceInputRef}
                          className="vi"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          onKeyDown={(e) => handleEditKeydown(e, p.id)}
                          style={{ width: 64, textAlign: "right" }}
                        />
                      </div>
                    ) : (
                      <span style={{ fontWeight: 600, cursor: "pointer" }} onClick={() => startEdit(p)}>
                        ${p.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* sale_price */}
                  <div>
                    {isEditing ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: 13, color: "#8B8680" }}>$</span>
                        <input
                          className="vi"
                          value={editSale}
                          placeholder="—"
                          onChange={(e) => setEditSale(e.target.value)}
                          onKeyDown={(e) => handleEditKeydown(e, p.id)}
                          style={{ width: 64, textAlign: "right" }}
                        />
                      </div>
                    ) : p.sale_price ? (
                      <span style={{ fontWeight: 600, color: "#2D6A4F" }}>${p.sale_price.toFixed(2)}</span>
                    ) : (
                      <span style={{ color: "#C8C3BE" }}>—</span>
                    )}
                  </div>

                  {/* in_stock toggle */}
                  <div>
                    <button className={`stock-btn ${p.in_stock ? "stock-in" : "stock-out"}`} onClick={() => toggleStock(p.id)}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.in_stock ? "#2D6A4F" : "#C1292E" }} />
                      {p.in_stock ? "In Stock" : "Out"}
                    </button>
                  </div>

                  {/* data_source */}
                  <span className={`pill ${srcPill(p.data_source)}`}>{srcLabel(p.data_source)}</span>

                  {/* updated_at */}
                  <span style={{ fontSize: 12, color: "#8B8680" }}>{fmtTime(p.updated_at)}</span>

                  {/* actions */}
                  <div style={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    {isEditing ? (
                      <>
                        <button className="gh" onClick={() => saveEdit(p.id)} style={{ color: "#2D6A4F", fontWeight: 600, fontSize: 12 }}>Save</button>
                        <button className="gh" onClick={cancelEdit} style={{ fontSize: 12 }}>✕</button>
                      </>
                    ) : (
                      <>
                        <button className="gh" onClick={() => startEdit(p)} title="Edit price">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        {hasHistory && (
                          <button className="gh" onClick={() => setHistoryOpen(isHistoryOpen ? null : p.id)} title="Price history">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* price history panel */}
                {isHistoryOpen && hasHistory && (
                  <div style={{ background: "#FAFAF7", borderRadius: 12, padding: 16, margin: "4px 0 8px", border: "1px solid #F0EDE8" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#8B8680", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>
                      Price History — {p.name}
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      {PRICE_HISTORY[p.id].map((h, i) => (
                        <div key={i} style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "12px 14px", border: "1px solid #F0EDE8" }}>
                          <div style={{ fontSize: 11, color: "#AAA5A0", marginBottom: 4 }}>{fmtDate(h.recorded_at)}</div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>${h.price.toFixed(2)}</div>
                          {h.sale_price && (
                            <div style={{ fontSize: 12, color: "#2D6A4F", fontWeight: 600, marginTop: 2 }}>Sale: ${h.sale_price.toFixed(2)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 16, borderTop: "2px solid #F0EDE8" }}>
            <span style={{ fontSize: 13, color: "#8B8680" }}>
              {storeProducts.length} products · {onSaleCount} on sale · {outOfStockCount} out of stock
            </span>
          </div>
        </div>

        {/* ═══ ON SALE ═══ */}
        <div className="vc s2">
          <div className="vt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
            Products on Sale
          </div>
          {onSaleCount > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {storeProducts.filter((p) => p.sale_price !== null).map((p) => {
                const pctOff = Math.round(((p.price - p.sale_price!) / p.price) * 100);
                return (
                  <div key={p.id} className="sale-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "#8B8680" }}>{p.brand || "Generic"} · per {p.unit_type}</div>
                      </div>
                      <span className="pill bg-g">SALE</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 600, color: "#2D6A4F" }}>${p.sale_price!.toFixed(2)}</span>
                      <span style={{ fontSize: 14, color: "#AAA5A0", textDecoration: "line-through" }}>${p.price.toFixed(2)}</span>
                      <span className="pill bg-g" style={{ fontSize: 11 }}>−{pctOff}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 32, color: "#AAA5A0", fontSize: 14 }}>
              No active sales. Set a sale price on any product to create a deal.
            </div>
          )}
        </div>

        {/* ═══ RECENT REVIEWS ═══ */}
        <div className="vc">
          <div className="vt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Recent Reviews
          </div>
          {REVIEWS.map((r, i) => (
            <div key={i} className="review-item">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "#EDEBE6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#5A5550" }}>
                    {r.user_name.charAt(0)}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{r.user_name}</span>
                </div>
                <span style={{ fontSize: 11, color: "#AAA5A0" }}>{fmtDate(r.created_at)}</span>
              </div>
              <div style={{ color: "#D4700A", fontSize: 13, letterSpacing: 1, marginBottom: 4, marginLeft: 36 }}>
                {starsStr(r.rating)}
              </div>
              {r.comment && (
                <div style={{ fontSize: 13, color: "#5A5550", lineHeight: 1.5, marginLeft: 36 }}>{r.comment}</div>
              )}
            </div>
          ))}
        </div>

        {/* ═══ STORE INFO ═══ */}
        <div className="vc s3">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="vt" style={{ marginBottom: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              Store Information
            </div>
            <button className="bo sm">Edit Store Info</button>
          </div>
          <div className="info-grid">
            {([
              { label: "Store Name", value: STORE.name },
              { label: "Address", value: STORE.address },
              { label: "Phone", value: STORE.phone },
              { label: "Website", value: STORE.website_url },
              { label: "Zip Code", value: STORE.zip_code },
            ] as { label: string; value: string | null }[]).map((f, i) => (
              <div key={i} className="info-box">
                <div className="info-label">{f.label}</div>
                <div className="info-value">{f.value || "—"}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VendorDashboard;