export const evalueIndexTitle = () => {
  const technologiesDict = [
    "ui",
    "ux",
    "php",
    "sql",
    "python",
    "javascript",
    "csharp",
    "cpp",
    "c",
    "java",
    "kotlin",
    "golang",
    "go",
    "reactjs",
    "react",
    "typescript",
    "nestjs",
    "nest",
    "express",
    "expressjs",
    "spring",
    "springboot",
    "angular",
    "angularjs",
    "vue",
    "vuejs",
    "electron",
    "solidjs",
    "solid",
    "frontend",
    "front",
    "back",
    "backend",
    "developer",
    "html",
    "css",
  ];

  const getCard = document.getElementsByClassName(
    "c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden"
  );
  const arrayCards = Array.from(getCard);

  const courses = arrayCards.map((card, index) => {
    let itemText: string = "";

    const titleNode = card.childNodes[3]?.childNodes[3];
    const discountNode =
      card.childNodes[3]?.childNodes[1]?.childNodes[1]?.childNodes[0];

    if (titleNode && titleNode instanceof HTMLElement) {
      itemText = titleNode.innerText;
    }

    if (discountNode && discountNode instanceof HTMLElement) {
      if (discountNode.innerText !== "FREE") {
        return null;
      }
    }

    itemText = itemText.replace("c++", "cpp");

    return { title: itemText.toLocaleLowerCase(), index };
  });

  return {
    courses: courses.filter((course) => {
      return (
        course &&
        technologiesDict.some((tech) =>
          new RegExp(`\\b${tech.toLowerCase()}\\b`).test(course.title)
        )
      );
    }),
  };
};
