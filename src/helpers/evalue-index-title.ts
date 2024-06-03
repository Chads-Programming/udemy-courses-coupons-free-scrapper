export const evalueIndexTitle = () => {
  const technologiesDict = [
    "ui",
    "ux",
    "ui/ux",
    "php",
    "sql",
    "python",
    "javascript",
    "c#",
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

    // Verificar que los nodos existen antes de acceder a ellos
    const titleNode = card.childNodes[3]?.childNodes[3];
    const discountNode =
      card.childNodes[3]?.childNodes[1]?.childNodes[1]?.childNodes[0];

    if (titleNode && "innerText" in titleNode) {
      if (typeof titleNode.innerText === "string") {
        itemText = titleNode.innerText;
      }
    }

    if (discountNode && "innerText" in discountNode) {
      if (typeof discountNode.innerText === "string") {
        if (discountNode.innerText !== "FREE") {
          return null; // Return null if the discount is not "FREE"
        }
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
          new RegExp(`\\b${tech.toLowerCase()}\\b`).test(
            course.title.toLowerCase()
          )
        )
      );
    }),
  };
};
