
from playwright.sync_api import sync_playwright

def verify_train_status():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to Train Status page...")
            page.goto("http://localhost:3000/train-status")
            # Wait for content or 5 seconds, capture screenshot even if timeout
            try:
                page.wait_for_selector("h1", timeout=5000)
            except:
                print("Timeout waiting for h1, taking screenshot anyway...")

            print("Page loaded/timeout. Taking screenshot...")
            page.screenshot(path="verification/train_status.png", full_page=True)
            print("Screenshot saved to verification/train_status.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_train_status()
