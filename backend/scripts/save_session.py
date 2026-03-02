"""
save a browser session after manually solving cloudflare challenge.

opens a visible browser window, navigates to shoprite.com, and waits for
you to solve the cloudflare "verify you are human" challenge. once the
real shoprite page loads, the script saves cookies + localStorage to
data/shoprite_session.json for use by the headless scraper.

usage (from backend/):
    PYTHONPATH=. uv run python scripts/save_session.py

the session file typically stays valid for several hours. we'd re run
script whenever the scraper starts failing with "no products" again.
"""

import asyncio
from pathlib import Path

from app.scraper.shoprite import USER_AGENT

SESSION_PATH = Path(__file__).parent.parent / "data" / "shoprite_session.json"
LANDING_URL = "https://www.shoprite.com/sm/pickup/rsid/139/categories"


async def main():
    from playwright.async_api import async_playwright

    SESSION_PATH.parent.mkdir(exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(user_agent=USER_AGENT)
        page = await context.new_page()

        print("opening shoprite.com — please solve the cloudflare challenge.")
        print("the script will auto-detect when you're through.\n")

        await page.goto(LANDING_URL, wait_until="domcontentloaded")

        # wait until we're past cloudflare: the real page has __PRELOADED_STATE__
        # poll every second, up to 120 seconds
        for i in range(120):
            title = await page.title()
            if "just a moment" not in title.lower():
                break
            await page.wait_for_timeout(1000)
        else:
            print("ERROR: timed out waiting for cloudflare challenge to be solved.")
            await browser.close()
            return

        print(f"cloudflare passed! page title: {await page.title()}")

        # save the full browser state (cookies + localStorage)
        await context.storage_state(path=str(SESSION_PATH))
        print(f"session saved to: {SESSION_PATH}")
        print("you can close this browser window now.")

        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
