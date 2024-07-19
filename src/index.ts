import puppeteer from "puppeteer-extra";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import "dotenv/config";
import { delay, evalueIndexTitle, htmlToDictionary } from "./helpers";
import { promises as fs } from "fs";

const urlPage: string = process.env.URL_PAGE;
const classCard: string =
  ".c-card.block.bg-white.shadow-md.hover\\:shadow-xl.rounded-lg.overflow-hidden";

puppeteer.use(AdblockerPlugin());

async function getCard(): Promise<
  {
    title: string;
    code: string;
    countdown: string;
    link: string;
  }[]
> {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  try {
    await page.goto(urlPage, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    await page.waitForSelector(classCard, { timeout: 60000 });

    const indexAndTitle = await page.evaluate(evalueIndexTitle);

    if (!indexAndTitle.courses || indexAndTitle.courses.length === 0) {
      console.error("Courses not found");
      await browser.close();
      return [];
    }

    const courses: {
      title: string;
      code: string;
      countdown: string;
      link: string;
    }[] = [];

    for (let course of indexAndTitle.courses) {
      const courseElements = await page.$$(classCard);
      const courseElement = courseElements[course.index];

      await page.evaluate((el) => el.scrollIntoView(), courseElement);

      await Promise.all([
        courseElement.click(),
        page.waitForNavigation({
          waitUntil: "networkidle0",
          timeout: 60000,
        }),
      ]);

      await delay(2000);

      const courseHTML = await page.evaluate(
        () => document.documentElement.outerHTML
      );

      const dist = htmlToDictionary(courseHTML);

      courses.push({
        title: dist.title,
        code: dist.code,
        countdown: dist.countdown,
        link: dist.link,
      });

      await page.goBack({
        waitUntil: "networkidle0",
        timeout: 60000,
      });
    }

    // await fs.writeFile("output/courses.json", JSON.stringify(courses));
    await fetch(process.env.URL_SEND_SCRAP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.API_KEY}`,
      },
      credentials: "include",
    });

    await browser.close();
    return courses;
  } catch (error) {
    console.error("Error occurred:", error);
    await browser.close();
    return [];
  }
}

getCard();
