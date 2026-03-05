import Link from 'next/link'
import { login } from './action'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#f8f5ef" }}
    >
      <style>{`
        .nb-input {
          border: 1px solid #ddd6c9;
          background-color: #ffffff;
          color: #2c2c2c;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .nb-input::placeholder {
          color: #bfb8ab;
        }
        .nb-input:focus {
          border-color: #4a8c2a;
          box-shadow: 0 0 0 3px rgba(74,140,42,0.1);
          outline: none;
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
      <div className="nb-card w-full max-w-[400px] rounded-2xl bg-white">
        {/* Header */}
        <div
          className="border-b px-8 pb-5 pt-7"
          style={{ borderColor: "#e4ded3" }}
        >
          <h1
            className="text-[1.55rem] font-semibold tracking-tight"
            style={{ color: "#2c2c2c", fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Welcome back
          </h1>
          <p className="mt-1.5 text-[0.84rem]" style={{ color: "#9b9283" }}>
            Sign in to your Neighborly account
          </p>
        </div>

        {/* Form body */}
        <div className="px-8 pb-7 pt-6">
          {error && (
            <div
              className="mb-5 rounded-xl px-4 py-3 text-[0.84rem]"
              style={{
                backgroundColor: "#fdf3ec",
                color: "#bf4a0a",
                border: "1px solid #f0d4bb",
              }}
            >
              {decodeURIComponent(error)}
            </div>
          )}

          <form className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[0.82rem] font-medium"
                style={{ color: "#5a5347" }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="nb-input w-full rounded-xl px-3.5 py-2.5 text-[0.88rem]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[0.82rem] font-medium"
                style={{ color: "#5a5347" }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="nb-input w-full rounded-xl px-3.5 py-2.5 text-[0.88rem]"
                placeholder="••••••••"
              />
            </div>

            <button
              formAction={login}
              className="nb-btn w-full rounded-xl py-3 text-[0.88rem] font-semibold text-white"
            >
              Sign in →
            </button>
          </form>

          <div
            className="mt-6 border-t pt-5 text-center"
            style={{ borderColor: "#e4ded3" }}
          >
            <p className="text-[0.84rem]" style={{ color: "#9b9283" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="nb-link font-medium underline underline-offset-2"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Link href="/" className="nb-back mt-8 text-[0.84rem]">
        ← Back to home
      </Link>
    </div>
  )
}