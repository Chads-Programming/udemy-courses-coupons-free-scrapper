import puppeteer from "puppeteer-extra";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import "dotenv/config";
import { evalueIndexTitle, htmlToDictionary } from "./helpers";
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

  await page.goto(urlPage);

  await page.waitForSelector(classCard);

  const indexAndTitle = await page.evaluate(evalueIndexTitle);

  if (!indexAndTitle.courses || indexAndTitle.courses.length === 0) {
    console.error("Courses not found");
    await browser.close();
    return;
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

    await page
      .evaluate((el) => el.scrollIntoView(), courseElement)
      .catch((err) => {
        console.log("error scroll view element", err);
      });

    await Promise.all([
      courseElement.click(),
      page.waitForNavigation({ waitUntil: "networkidle0" }).catch((err) => {
        console.log("Error wait to loading", err);
      }),
    ]);

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

    await page.goBack();
  }

  await fs.writeFile("output/courses.json", JSON.stringify(courses));

  await browser.close();
}

getCard();
