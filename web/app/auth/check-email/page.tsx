import Link from "next/link";

export default function CheckEmailPage() {
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
        @keyframes float-envelope {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
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
          {/* Email icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                backgroundColor: "#edf7e6",
                border: "2px solid #c5e4b0",
                animation: "float-envelope 3s ease-in-out infinite",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3d7a1c"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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
            Check your email
          </h1>

          <p
            className="mx-auto mt-3 max-w-[320px] text-[0.9rem] leading-relaxed"
            style={{ color: "#7a7265" }}
          >
            We&apos;ve sent you a confirmation link. Please check your inbox
            and click the link to verify your account.
          </p>

          {/* Tips */}
          <div
            className="mx-auto mt-7 max-w-[320px] rounded-xl px-5 py-4 text-left"
            style={{ backgroundColor: "#fafaf7", border: "1px solid #eeead9" }}
          >
            <p
              className="mb-2.5 text-[0.78rem] font-semibold uppercase tracking-wider"
              style={{ color: "#9b9283" }}
            >
              Didn&apos;t get it?
            </p>
            <ul className="space-y-2 text-[0.84rem]" style={{ color: "#7a7265" }}>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0" style={{ color: "#3d7a1c" }}>•</span>
                Check your spam or junk folder
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0" style={{ color: "#3d7a1c" }}>•</span>
                Make sure the email address was correct
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0" style={{ color: "#3d7a1c" }}>•</span>
                Try registering again if the link expired
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-8">
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
