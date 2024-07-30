export const evalueIndexTitle = () => {
  const technologiesDict = [
    "ui",
    "ux",
    "php",
    "sql",
    "python",
    "cpp",
    "c",
    "c#",
    "javascript",
    "csharp",
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

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const normalizeString = (string: string) => {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const getCard = document.getElementsByClassName(
    "c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden",
  );
  const arrayCards = Array.from(getCard);

  console.log(`Found ${arrayCards.length} cards`);

  const courses = arrayCards.map((card, index) => {
    let itemText: string = "";

    const titleNode = card.childNodes[3]?.childNodes[3];
    const discountNode =
      card.childNodes[3]?.childNodes[1]?.childNodes[1]?.childNodes[0];

    if (titleNode && titleNode instanceof HTMLElement) {
      itemText = titleNode.innerText;
    } else {
      console.warn(`Title node not found for card at index ${index}`);
    }

    if (discountNode && discountNode instanceof HTMLElement) {
      if (discountNode.innerText !== "FREE") {
        console.warn(`Discount node not "FREE" for card at index ${index}`);
        return null;
      }
    } else {
      console.warn(`Discount node not found for card at index ${index}`);
    }

    // Normalizar y escapar el título
    itemText = normalizeString(itemText);
    itemText = escapeRegExp(itemText);

    console.log(`Card at index ${index} has title: "${itemText}"`);

    return { title: itemText.toLocaleLowerCase(), index };
  });

  const filteredCourses = courses.filter((course) => {
    if (!course) return false;
    const matches = technologiesDict.some((tech) =>
      new RegExp(`\\b${tech.toLowerCase()}\\b`).test(course.title),
    );
    if (!matches) {
      console.warn(
        `Course title "${course.title}" does not match any technology`,
      );
    }
    return matches;
  });

  console.log(`Filtered down to ${filteredCourses.length} courses`);

  return {
    courses: filteredCourses,
  };
};
