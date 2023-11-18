import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const resumePath = "./static/resume";
  try {
    await page.goto("http://localhost:1313/resume");
  } catch {
    await page.goto("https://jasonraimondi.com/resume");
  }
  await page.pdf({
    path: `${resumePath}.pdf`,
    margin: { top: 25, bottom: 25, left: 50, right: 50 },
  });
  // await page.screenshot({ path: `${resumePath}.png`, fullPage: true  });
  // await page.screenshot({ path: `${resumePath}.jpg`, fullPage: true  });
  await browser.close();
})();
