'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import ProfileDropdown from "@/components/ProfileDropdown";
import { getRoutePreferences, saveRoutePreferences, getDietaryPreferences, saveDietaryPreferences } from "./actions";

interface DietaryOption {
  id: string;
  label: string;
  emoji: string;
}

interface TravelMode {
  id: string;
  label: string;
  icon: string;
}

interface OptimizationMode {
  id: string;
  label: string;
  desc: string;
  icon: string;
}

interface NutrientConfig {
  label: string;
  unit: string;
  max: number;
}

interface NutrientState {
  enabled: boolean;
  value: number;
}

interface NutrientsState {
  sodium: NutrientState;
  cholesterol: NutrientState;
  sugar: NutrientState;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const dietaryOptions: DietaryOption[] = [
  { id: "vegan", label: "Vegan", emoji: "🌱" },
  { id: "vegetarian", label: "Vegetarian", emoji: "🥦" },
  { id: "gluten-free", label: "Gluten-Free", emoji: "🌾" },
  { id: "low-carb", label: "Low-Carb", emoji: "📉" },
  { id: "keto", label: "Keto", emoji: "🥑" },
  { id: "halal", label: "Halal", emoji: "☪️" },
  { id: "kosher", label: "Kosher", emoji: "✡️" },
];

const travelModes: TravelMode[] = [
  { id: "driving", label: "Driving", icon: "🚗" },
  { id: "walking", label: "Walking", icon: "🚶" },
  { id: "transit", label: "Transit", icon: "🚌" },
];

const optimizationModes: OptimizationMode[] = [
  { id: "cost", label: "Lowest Cost", desc: "Prioritize saving money", icon: "💰" },
  { id: "stops", label: "Fewest Stops", desc: "Minimize store visits", icon: "📍" },
  { id: "distance", label: "Shortest Distance", desc: "Reduce travel time", icon: "⚡" },
];

const nutrientConfig: Record<keyof NutrientsState, NutrientConfig> = {
  sodium: { label: "Sodium", unit: "mg", max: 5000 },
  cholesterol: { label: "Cholesterol", unit: "mg", max: 800 },
  sugar: { label: "Sugar", unit: "g", max: 150 },
};

const navItems: NavItem[] = [
  { id: "route", label: "Route & Optimization", icon: "🗺️" },
  { id: "dietary", label: "Dietary & Nutrition", icon: "🥗" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "account", label: "Account", icon: "👤" },
];


// ─── Sub-components ──────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
        checked ? "bg-green-700" : "bg-stone-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-stone-800 mb-3 mt-6 first:mt-0">
      {children}
    </h2>
  );
}

function SettingRow({
  label,
  description,
  children,
  border = true,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-3.5 px-5 ${
        border ? "border-b border-stone-100" : ""
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-stone-800">{label}</p>
        {description && (
          <p className="text-xs text-stone-400 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm ring-1 ring-stone-200 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

// ─── Section Panels ───────────────────────────────────────────────────────────

function RouteSection({
  optimization,
  toggleOptimization,
  radius,
  setRadius,
  maxStops,
  setMaxStops,
  travelMode,
  toggleTravel,
}: {
  optimization: string[];
  toggleOptimization: (id: string) => void;
  radius: number;
  setRadius: (v: number) => void;
  maxStops: number;
  setMaxStops: (v: number) => void;
  travelMode: string[];
  toggleTravel: (id: string) => void;
}) {
  return (
    <div>
      <SectionTitle>Optimization Mode</SectionTitle>
      <div className="grid grid-cols-3 gap-3">
        {optimizationModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => toggleOptimization(mode.id)}
            className={`rounded-xl p-4 text-center border-2 transition-all duration-150 cursor-pointer ${
              optimization.includes(mode.id)
                ? "border-green-700 bg-green-50"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            <div className="text-2xl mb-1.5">{mode.icon}</div>
            <div className="text-sm font-semibold text-stone-800 leading-tight mb-0.5">{mode.label}</div>
            <div className="text-xs text-stone-400 leading-snug hidden sm:block">{mode.desc}</div>
          </button>
        ))}
      </div>

      <SectionTitle>Travel Mode</SectionTitle>
      <Card>
        <div className="p-4 flex flex-wrap gap-2">
          {travelModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => toggleTravel(mode.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                travelMode.includes(mode.id)
                  ? "border-green-700 bg-green-50 text-green-800"
                  : "border-stone-200 bg-white text-stone-500 hover:border-stone-300"
              }`}
            >
              <span className="text-base">{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <SectionTitle>Route Limits</SectionTitle>
      <Card>
        <SettingRow label="Search Radius" description="Only include stores within this distance">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-green-700">{radius}</span>
            <span className="text-xs text-stone-400">km</span>
          </div>
        </SettingRow>
        <div className="px-5 pb-4 pt-2">
          <input
            type="range" min={1} max={25} step={1} value={radius}
            style={{ "--pct": `${((radius - 1) / 24) * 100}%` } as React.CSSProperties}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRadius(Number(e.target.value))}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-stone-300">1 mi</span>
            <span className="text-xs text-stone-300">25 mi</span>
          </div>
        </div>

        <SettingRow label="Maximum Stops" description="Limit the number of stores per trip" border={false}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMaxStops(Math.max(1, maxStops - 1))}
              className="w-8 h-8 rounded-lg border border-stone-200 bg-stone-50 text-green-700 font-bold flex items-center justify-center hover:bg-green-50 transition-colors"
            >−</button>
            <span className="text-lg font-bold text-green-700 w-5 text-center">{maxStops}</span>
            <button
              onClick={() => setMaxStops(Math.min(10, maxStops + 1))}
              className="w-8 h-8 rounded-lg border border-stone-200 bg-stone-50 text-green-700 font-bold flex items-center justify-center hover:bg-green-50 transition-colors"
            >+</button>
          </div>
        </SettingRow>
      </Card>
    </div>
  );
}

function DietarySection({
  dietary, toggleDietary,
  nutrients, updateNutrient,
}: {
  dietary: string[]; toggleDietary: (id: string) => void;
  nutrients: NutrientsState; updateNutrient: (k: keyof NutrientsState, f: keyof NutrientState, v: boolean | number) => void;
}) {
  return (
    <div>
      <SectionTitle>Dietary Preferences</SectionTitle>
      <Card>
        <div className="p-4 flex flex-wrap gap-2">
          {dietaryOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => toggleDietary(opt.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all duration-150 ${
                dietary.includes(opt.id)
                  ? "border-green-700 bg-green-50 text-green-800"
                  : "border-stone-200 bg-white text-stone-500 hover:border-stone-300"
              }`}
            >
              <span>{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <SectionTitle>Nutritional Limits</SectionTitle>
      <Card>
        {(Object.entries(nutrientConfig) as [keyof NutrientsState, NutrientConfig][]).map(
          ([key, config], i, arr) => (
            <div key={key} className={i < arr.length - 1 ? "border-b border-stone-100" : ""}>
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-stone-800">{config.label}</span>
                  <Toggle
                    checked={nutrients[key].enabled}
                    onChange={(v: boolean) => updateNutrient(key, "enabled", v)}
                  />
                </div>
                {nutrients[key].enabled ? (
                  <div className="flex items-center gap-4 mt-3">
                    <input
                      type="range"
                      min={0} max={config.max} step={10}
                      value={nutrients[key].value}
                      style={{ "--pct": `${(nutrients[key].value / config.max) * 100}%` } as React.CSSProperties}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateNutrient(key, "value", Number(e.target.value))
                      }
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold text-green-700 w-24 text-right">
                      {nutrients[key].value} {config.unit}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-stone-300 mt-1">No limit applied</p>
                )}
              </div>
            </div>
          )
        )}
      </Card>
    </div>
  );
}

function NotificationsSection({
  notifications, setNotifications,
  communityReports, setCommunityReports,
}: {
  notifications: boolean; setNotifications: (v: boolean) => void;
  communityReports: boolean; setCommunityReports: (v: boolean) => void;
}) {
  return (
    <div>
      <SectionTitle>Notifications</SectionTitle>
      <Card>
        <SettingRow label="Deal Alerts" description="Get notified when prices drop on your list items">
          <Toggle checked={notifications} onChange={setNotifications} />
        </SettingRow>
        <SettingRow label="Community Price Reports" description="Receive updates from verified community submissions" border={false}>
          <Toggle checked={communityReports} onChange={setCommunityReports} />
        </SettingRow>
      </Card>
    </div>
  );
}

function AccountSection() {
  return (
    <div>
      <SectionTitle>Account</SectionTitle>
      <Card>
        <SettingRow label="Email Address" description="user@example.com">
          <button className="text-xs font-medium text-green-700 hover:text-green-800 transition-colors">
            Change
          </button>
        </SettingRow>
        <SettingRow label="Password" description="Last changed 3 months ago">
          <button className="text-xs font-medium text-green-700 hover:text-green-800 transition-colors">
            Update
          </button>
        </SettingRow>
        <SettingRow label="Data & Privacy" description="Manage your data preferences" border={false}>
          <button className="text-xs font-medium text-green-700 hover:text-green-800 transition-colors">
            Review
          </button>
        </SettingRow>
      </Card>

      <SectionTitle>Danger Zone</SectionTitle>
      <Card>
        <SettingRow label="Delete Account" description="Permanently remove your account and data" border={false}>
          <button className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors">
            Delete
          </button>
        </SettingRow>
      </Card>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NeighborlySettings() {
  const [activeSection, setActiveSection] = useState<string>("route");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [optimization, setOptimization] = useState<string[]>(["cost"]);
  const [radius, setRadius] = useState<number>(5);
  const [maxStops, setMaxStops] = useState<number>(3);
  const [travelMode, setTravelMode] = useState<string[]>(["driving"]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [nutrients, setNutrients] = useState<NutrientsState>({
    sodium: { enabled: false, value: 2300 },
    cholesterol: { enabled: false, value: 300 },
    sugar: { enabled: false, value: 50 },
  });
  const [notifications, setNotifications] = useState<boolean>(true);
  const [communityReports, setCommunityReports] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getRoutePreferences(), getDietaryPreferences()]).then(
      ([routeData, dietaryData]) => {
        if (routeData) {
          if (routeData.optimization_mode?.length) setOptimization(routeData.optimization_mode);
          if (routeData.travel_mode?.length) setTravelMode(routeData.travel_mode);
          if (routeData.max_radius_km != null) setRadius(routeData.max_radius_km);
          if (routeData.max_stops != null) setMaxStops(routeData.max_stops);
        }
        if (dietaryData) {
          if (dietaryData.dietary?.length) setDietary(dietaryData.dietary);
          if (dietaryData.nutrients) setNutrients(dietaryData.nutrients);
        }
        setLoading(false);
      }
    );
  }, []);

  const toggleOptimization = (id: string): void =>
    setOptimization((prev) =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter((o) => o !== id) : prev  // keep at least one
        : [...prev, id]
    );

  const toggleTravel = (id: string): void =>
    setTravelMode((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );

  const toggleDietary = (id: string): void =>
    setDietary((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );

  const updateNutrient = (
    key: keyof NutrientsState,
    field: keyof NutrientState,
    value: boolean | number
  ): void => {
    setNutrients((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const handleSave = async (): Promise<void> => {
    setSaveError(null);
    let result: { success?: boolean; error?: string };

    if (activeSection === "route") {
      result = await saveRoutePreferences({
        optimization_mode: optimization,
        travel_mode: travelMode,
        max_radius_km: radius,
        max_stops: maxStops,
      });
    } else if (activeSection === "dietary") {
      result = await saveDietaryPreferences({
        dietary,
        nutrients,
      });
    } else {
      result = { success: true };
    }

    if ('error' in result && result.error) {
      setSaveError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const activeNav = navItems.find((n) => n.id === activeSection);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{fontFamily: "'DM Sans', 'Avenir', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        input[type=range] {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(to right, #15803d 0%, #15803d var(--pct), #d6d3d1 var(--pct), #d6d3d1 100%);
          outline: none;
          cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #15803d;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          cursor: pointer;
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex gap-8">

          {/* Sidebar — hidden on mobile */}
          <aside className="hidden md:flex flex-col w-56 flex-shrink-0">
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl text-stone-800 mb-6">
              Settings
            </h1>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                    activeSection === item.id
                      ? "bg-green-50 text-green-800"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">

            {/* Back to dashboard — visible and scannable at top of content */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-green-700 transition-colors mb-4 sm:mb-6"
            >
              <span aria-hidden>←</span>
              <span>Back to dashboard</span>
            </Link>

            {/* Mobile section picker */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm font-medium text-stone-800"
              >
                <span className="flex items-center gap-2">
                  <span>{activeNav?.icon}</span>
                  <span>{activeNav?.label}</span>
                </span>
                <span className="text-stone-400">{mobileMenuOpen ? "▲" : "▼"}</span>
              </button>
              {mobileMenuOpen && (
                <div className="mt-1 bg-white rounded-xl border border-stone-200 overflow-hidden shadow-lg">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left border-b border-stone-100 last:border-0 transition-colors ${
                        activeSection === item.id
                          ? "bg-green-50 text-green-800"
                          : "text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Page header (desktop) */}
            <div className="hidden md:block mb-6">
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-stone-800">
                {activeNav?.label}
              </h2>
              <p className="text-sm text-stone-400 mt-0.5">
                Manage your {activeNav?.label.toLowerCase()} preferences
              </p>
            </div>

            {/* Section content */}
            {activeSection === "route" && (
              loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <RouteSection
                  optimization={optimization}
                  toggleOptimization={toggleOptimization}
                  radius={radius}
                  setRadius={setRadius}
                  maxStops={maxStops}
                  setMaxStops={setMaxStops}
                  travelMode={travelMode}
                  toggleTravel={toggleTravel}
                />
              )
            )}
            {activeSection === "dietary" && (
              loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <DietarySection
                  dietary={dietary} toggleDietary={toggleDietary}
                  nutrients={nutrients} updateNutrient={updateNutrient}
                />
              )
            )}
            {activeSection === "notifications" && (
              <NotificationsSection
                notifications={notifications} setNotifications={setNotifications}
                communityReports={communityReports} setCommunityReports={setCommunityReports}
              />
            )}
            {activeSection === "account" && <AccountSection />}

            {/* Save button */}
            {activeSection !== "account" && (
              <div className="mt-8 flex flex-col items-end gap-2">
                {saveError && (
                  <p className="text-sm text-red-500">{saveError}</p>
                )}
                <button
                  onClick={handleSave}
                  className={`px-8 py-2.5 rounded-xl text-white text-sm font-semibold tracking-wide transition-all duration-200 active:scale-95 ${
                    saved ? "bg-green-900" : "bg-green-700 hover:bg-green-800"
                  }`}
                >
                  {saved ? "✓ Saved" : "Save Changes"}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}