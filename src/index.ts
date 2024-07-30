import puppeteer from "puppeteer-extra";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import "dotenv/config";
import { delay, evalueIndexTitle, htmlToDictionary } from "./helpers";

puppeteer.use(AdblockerPlugin());

const urlPage: string = process.env.URL_PAGE;
const classCard: string =
  ".c-card.block.bg-white.shadow-md.hover\\:shadow-xl.rounded-lg.overflow-hidden";

interface Course {
  title: string;
  code: string;
  countdown: string;
  link: string;
}

async function getCard(): Promise<Course[]> {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  try {
    console.log("Navigating to the URL...");
    await page.goto(urlPage, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    console.log("Waiting for selector...");
    await page.waitForSelector(classCard, { timeout: 60000 });

    console.log("Evaluating index and title...");
    const indexAndTitle = await page.evaluate(evalueIndexTitle);

    if (!indexAndTitle.courses || indexAndTitle.courses.length === 0) {
      console.error("Courses not found");
      return [];
    }

    const courses: Course[] = [];

    for (const course of indexAndTitle.courses) {
      const courseElements = await page.$$(classCard);
      const courseElement = courseElements[course.index];

      if (!courseElement) {
        console.error(`Course element not found at index ${course.index}`);
        continue;
      }

      console.log(`Scrolling into view for course index ${course.index}...`);
      await page.evaluate((el) => el.scrollIntoView(), courseElement);

      console.log(`Clicking on course index ${course.index}...`);
      await Promise.all([
        courseElement.click(),
        page.waitForNavigation({
          waitUntil: "networkidle0",
          timeout: 20000,
        }),
      ]);

      console.log("Extracting course HTML...");
      const courseHTML = await page.evaluate(
        () => document.documentElement.outerHTML,
      );

      const dist = htmlToDictionary(courseHTML);

      courses.push({
        title: dist.title,
        code: dist.code,
        countdown: dist.countdown,
        link: dist.link,
      });

      console.log("Going back to the main page...");
      await page.goBack({
        waitUntil: "networkidle0",
        timeout: 60000,
      });
    }

    console.log("Sending data to the server...");
    await fetch(process.env.URL_SEND_SCRAP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.API_KEY}`,
      },
      credentials: "include",
      body: JSON.stringify(courses),
    });

    return courses;
  } catch (error) {
    console.error("Error occurred:", error);
    return [];
  } finally {
    await browser.close();
  }
}

async function retryGetCard(retries: number): Promise<Course[]> {
  for (let i = 0; i < retries; i++) {
    const result = await getCard();
    if (result.length > 0) {
      return result;
    }
  }
  return [];
}

retryGetCard(8).then((courses) => {
  if (courses.length === 0) {
    console.error("Failed to fetch courses after multiple attempts");
  } else {
    console.log("Courses fetched successfully:", courses);
  }
});
