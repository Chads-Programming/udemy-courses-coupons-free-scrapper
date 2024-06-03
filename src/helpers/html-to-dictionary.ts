import { JSDOM } from "jsdom";

type Dict = {
  title: string;
  countdown: string;
  code: string;
  link: string;
};

export const htmlToDictionary = (htmlString: string) => {
  const dom = new JSDOM(htmlString);
  const doc = dom.window.document;

  let dictionary: Dict = {
    title: "",
    code: "",
    countdown: "",
    link: "",
  };

  const title = doc.querySelector("h1");
  const code = doc.getElementsByClassName(
    "inline-flex px-2 mx-2 text-lg text-red-600 uppercase font-bold"
  )[0];
  const countdown = doc.getElementsByClassName("text-black days")[0];
  const link = doc
    .getElementsByClassName(
      "mt-3 text-base sm:text-xs md:text-sm lg:text-lg xl:text-xl font-semibold bg-blue850 w-full text-white rounded-lg px-6 py-3 block shadow-xl hover:bg-indigo-500"
    )[0]
    .getAttribute("href");

  if (title) {
    dictionary.title = title.textContent.replace(/\s+/g, " ").trim();
    dictionary.title = dictionary.title.slice(14);
  }
  if (code) {
    dictionary.code = code.textContent.trim();
  }
  if (countdown) {
    dictionary.countdown = countdown.textContent.trim() + " " + "Days";
  }
  if (link) {
    dictionary.link = link;
  }

  return dictionary;
};
