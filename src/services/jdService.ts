import { chromium } from "playwright";
import fs from "fs";

export const extractJD = async (url: string) => {
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1366, height: 768 },
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    }
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // Wait a bit for dynamic content to load
    await page.waitForTimeout(3000);

    // Check if page is blocked
    const pageContent = await page.content();
    if (pageContent.includes('Access Denied') || pageContent.includes('blocked') || pageContent.includes('captcha')) {
      throw new Error('Website is blocking automated access. Please try a different URL or access the site manually.');
    }

    const selectors = [
      // Naukri specific selectors
      "div.readmore",
      "div.JDjobdesc",
      "div.job-description",
      "div[class*='jd']",
      "div[class*='jobDescription']",
      "section[class*='job-description']",
      // LinkedIn
      "div.show-more-less-html__markup",
      "div.jobs-description__content",
      // Indeed
      "div#jobDescriptionText",
      "div.jobsearch-jobDescriptionText",
      // General selectors
      "section.job-description",
      "div.description",
      "div.jd",
      "article",
      "div[class*='description']",
      "div[class*='job-detail']",
      "section[class*='description']",
      // Fallback - get main content
      "main",
      "div[role='main']"
    ];

    let jobDescription: string | null = null;
    
    for (const selector of selectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const text = await element.innerText();
          if (text && text.trim().length > 100) { // Ensure we get substantial content
            jobDescription = text.trim();
            console.log(`Found JD using selector: ${selector}`);
            break;
          }
        }
      } catch (e) {
        console.log(`Selector ${selector} failed:`, e);
        continue;
      }
    }

    // If no specific selectors work, try to get all text content
    if (!jobDescription) {
      try {
        const bodyText = await page.evaluate(() => document.body.innerText);
        if (bodyText && bodyText.length > 1000) {
          // Check if it's an access denied message
          if (bodyText.includes('Access Denied') || bodyText.includes('permission') || bodyText.includes('blocked')) {
            throw new Error('Access denied by website. This site blocks automated access. Please try:\n1. Using a different job URL\n2. Accessing the site manually to copy the job description\n3. Using a different job portal');
          }
          jobDescription = bodyText;
          console.log("Using body text as fallback");
        }
      } catch (e) {
        console.log("Body text extraction failed:", e);
      }
    }

    await browser.close();

    // Final check for blocked content
    if (jobDescription && (jobDescription.includes('Access Denied') || jobDescription.includes('permission to access'))) {
      throw new Error('Website blocked access. Please try a different URL or access the job description manually.');
    }

    const data = { url, jobDescription, extractedAt: new Date().toISOString() };
    fs.writeFileSync("Job_Specific.json", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    await browser.close();
    console.error("Error extracting JD:", error);
    throw error;
  }
};

export const saveManualJD = async (url: string, jobDescription: string) => {
  const data = { url, jobDescription, extractedAt: new Date().toISOString(), method: "manual" };
  fs.writeFileSync("Job_Specific.json", JSON.stringify(data, null, 2));
  return data;
};
