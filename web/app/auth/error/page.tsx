import Link from "next/link";

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  "Email link is invalid or has expired": {
    title: "Link expired",
    description:
      "This confirmation link is no longer valid. Links expire after a short time for security reasons. Please request a new one.",
  },
  "Token has expired or is invalid": {
    title: "Link expired",
    description:
      "This link has expired or is no longer valid. Please request a new one to continue.",
  },
  "Missing confirmation parameters": {
    title: "Invalid link",
    description:
      "This link appears to be malformed or incomplete. Please check the link in your email and try again.",
  },
  "Missing authorization code": {
    title: "Invalid link",
    description:
      "This link is missing required information. Please check the link in your email and try again.",
  },
};

function getErrorContent(reason: string | undefined) {
  if (reason && ERROR_MESSAGES[reason]) {
    return ERROR_MESSAGES[reason];
  }

  if (reason) {
    return {
      title: "Something went wrong",
      description: reason,
    };
  }

  return {
    title: "Something went wrong",
    description:
      "An unexpected error occurred during authentication. Please try again.",
  };
}

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>
}) {
  const { reason } = await searchParams;
  const decodedReason = reason ? decodeURIComponent(reason) : undefined;
  const { title, description } = getErrorContent(decodedReason);

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
          {/* Error icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                backgroundColor: "#fdf3ec",
                border: "2px solid #f0d4bb",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#bf4a0a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
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
            {title}
          </h1>

          <p
            className="mx-auto mt-3 max-w-[320px] text-[0.9rem] leading-relaxed"
            style={{ color: "#7a7265" }}
          >
            {description}
          </p>

          {/* Suggestions */}
          <div
            className="mx-auto mt-7 max-w-[320px] rounded-xl px-5 py-4 text-left"
            style={{ backgroundColor: "#fafaf7", border: "1px solid #eeead9" }}
          >
            <p
              className="mb-2.5 text-[0.78rem] font-semibold uppercase tracking-wider"
              style={{ color: "#9b9283" }}
            >
              What you can do
            </p>
            <ul
              className="space-y-2 text-[0.84rem]"
              style={{ color: "#7a7265" }}
            >
              <li className="flex items-start gap-2">
                <span
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: "#3d7a1c" }}
                >
                  •
                </span>
                Try signing in — your account may already be active
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: "#3d7a1c" }}
                >
                  •
                </span>
                Register again to receive a fresh confirmation link
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: "#3d7a1c" }}
                >
                  •
                </span>
                Request a password reset if you forgot your credentials
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="nb-btn-outline block w-full rounded-xl py-3 text-center text-[0.88rem] font-semibold no-underline"
            >
              Go to sign in
            </Link>
            <Link
              href="/auth/register"
              className="block text-center text-[0.84rem] no-underline"
              style={{ color: "#9b9283" }}
            >
              Create a new account
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
