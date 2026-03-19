import Link from "next/link";

export default function EmailConfirmedPage() {
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
        .nb-btn {
          background-color: #3d7a1c;
          transition: background-color 0.2s, transform 0.1s;
        }
        .nb-btn:hover {
          background-color: #316315;
        }
        .nb-btn:active {
          transform: scale(0.98);
        }
        @keyframes check-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ring-expand {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Logo */}
      <Link href="/" className="mb-10 flex items-center gap-3 no-underline">
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
          {/* Success icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                backgroundColor: "#edf7e6",
                border: "2px solid #c5e4b0",
                animation: "ring-expand 0.4s ease-out",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3d7a1c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animation: "check-pop 0.5s ease-out 0.2s both" }}
              >
                <polyline points="20 6 9 17 4 12" />
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
            Email confirmed
          </h1>

          <p
            className="mx-auto mt-3 max-w-[320px] text-[0.9rem] leading-relaxed"
            style={{ color: "#7a7265" }}
          >
            Your email has been verified successfully. You can now sign in to
            your Neighborly account.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="nb-btn block w-full rounded-xl py-3 text-center text-[0.88rem] font-semibold text-white no-underline"
            >
              Sign in →
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
