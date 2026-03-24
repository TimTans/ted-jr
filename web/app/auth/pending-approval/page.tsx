import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#f8f5ef" }}
    >
      <style>{`
        .nb-link {
          color: #3d7a1c;
          transition: color 0.15s;
        }
        .nb-link:hover {
          color: #316315;
        }
        .nb-back {
          color: #9b9283;
          transition: color 0.15s;
        }
        .nb-back:hover {
          color: #5a5347;
        }
        .nb-card {
          border: 1px solid #e4ded3;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02);
        }
        .nb-btn-outline {
          border: 1px solid #3d7a1c;
          color: #3d7a1c;
          transition: all 0.2s;
        }
        .nb-btn-outline:hover {
          background-color: rgba(61,122,28,0.06);
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* Logo */}
      <Link href="/" className="mb-10 flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold text-white"
          style={{ backgroundColor: "#3d7a1c" }}
        >
          N
        </div>
        <div className="flex flex-col">
          <span
            className="text-[1.3rem] font-semibold leading-tight"
            style={{ color: "#2c2c2c" }}
          >
            Neighborly
          </span>
          <span
            className="text-[0.7rem] tracking-wide"
            style={{ color: "#9b9283" }}
          >
            Smart grocery planning
          </span>
        </div>
      </Link>

      {/* Card */}
      <div className="nb-card w-full max-w-[440px] rounded-2xl bg-white">
        <div className="px-8 py-10 text-center">
          {/* Status icon */}
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: "rgba(234, 179, 8, 0.1)",
                animation: "pulse-ring 2.5s ease-out infinite",
              }}
            />
            <div
              className="relative flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: "#fef9ed", border: "2px solid #f0e4bb" }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b8960c"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>

          <h1
            className="text-[1.55rem] font-semibold tracking-tight"
            style={{
              color: "#2c2c2c",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            Application received
          </h1>

          <p
            className="mx-auto mt-3 max-w-[320px] text-[0.9rem] leading-relaxed"
            style={{ color: "#7a7265" }}
          >
            Your vendor account is pending approval. An administrator will
            review your application and you&apos;ll be granted access once
            approved.
          </p>

          {/* Status steps */}
          <div
            className="mx-auto mt-7 max-w-[280px] rounded-xl px-5 py-4 text-left"
            style={{ backgroundColor: "#fafaf7", border: "1px solid #eeead9" }}
          >
            <div className="flex items-center gap-3 text-[0.82rem]">
              <div
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: "#3d7a1c" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span style={{ color: "#3d7a1c" }} className="font-medium">
                Account created
              </span>
            </div>

            <div
              className="ml-3 h-4 border-l"
              style={{ borderColor: "#ddd6c9" }}
            />

            <div className="flex items-center gap-3 text-[0.82rem]">
              <div
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "#fef3c7",
                  border: "2px solid #f59e0b",
                }}
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "#f59e0b" }}
                />
              </div>
              <span style={{ color: "#92710c" }} className="font-medium">
                Awaiting admin review
              </span>
            </div>

            <div
              className="ml-3 h-4 border-l"
              style={{ borderColor: "#ddd6c9" }}
            />

            <div className="flex items-center gap-3 text-[0.82rem]">
              <div
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "#f3f0e8", border: "2px solid #ddd6c9" }}
              />
              <span style={{ color: "#b0a899" }}>Vendor access granted</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="nb-btn-outline block w-full rounded-xl py-3 text-center text-[0.88rem] font-semibold no-underline"
            >
              Continue as shopper →
            </Link>
            <Link
              href="/auth/login"
              className="block text-center text-[0.84rem] no-underline"
              style={{ color: "#9b9283" }}
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>

      <Link href="/" className="nb-back mt-8 text-[0.84rem] no-underline">
        ← Back to home
      </Link>
    </div>
  );
}
