/**
 * Generate resume PDF via Playwright
 *
 * Starts the dev server (via start-server-and-test) and screenshots /resume/ page to PDF.
 * Run with: pnpm gen:resume
 */

import { chromium } from 'playwright';

const DEV_URL = 'http://localhost:5173/resume';
const PROD_URL = 'https://jasonraimondi.com/resume';
const OUTPUT_PATH = './static/resume.pdf';

async function generateResumePdf() {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	try {
		// Try local dev server first
		await page.goto(DEV_URL, { waitUntil: 'networkidle' });
		console.log('Connected to local dev server');
	} catch {
		// Fall back to production URL
		console.log('Local dev server not available, using production URL');
		await page.goto(PROD_URL, { waitUntil: 'networkidle' });
	}

	await page.pdf({
		path: OUTPUT_PATH,
		margin: { top: 25, bottom: 25, left: 50, right: 50 }
	});

	console.log(`Resume PDF generated at ${OUTPUT_PATH}`);
	await browser.close();
}

generateResumePdf();
