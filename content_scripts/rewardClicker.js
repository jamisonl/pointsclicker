const pointsParentNode = ".community-points-summary";
const handlePointsUpdate = async (pointsNum) => {
  let title =
    document.URL.split("/")[document.URL.split("/").length - 1].split("?")[0];
  const storedPoints = await browser.storage.local.get("totals");
  if (!!Object.keys(storedPoints).length) {
    if (!!storedPoints.totals[`${title}`]) {
      storedPoints.totals[`${title}`] =
        storedPoints.totals[`${title}`] + pointsNum;
    } else {
      storedPoints.totals[`${title}`] = pointsNum;
    }
    await browser.storage.local.set(storedPoints);
  } else {
    storedPoints.totals = {};
    storedPoints.totals[`${title}`] = pointsNum;
    await browser.storage.local.set(storedPoints);
  }
};

const clicker = () => {
  let button = document.body.querySelector(".ScCoreButtonSuccess-sc-1qn4ixc-5");
  const pointsEvent = (event) => {
    setTimeout(() => {
      handlePointsUpdate(getPointsCount());
    }, 1000);
  };
  if (!!button) {
    button.addEventListener("click", pointsEvent);
    button.click();
    button.removeEventListener("click", pointsEvent);
  }
};

const getPointsCount = () => {
  const pointsNode = document.querySelector(pointsParentNode);
  const pointsNum = parseInt(pointsNode.textContent.split("+")[1]);
  return !!pointsNum ? pointsNum : 50;
};

/**
 * @param {HTMLCollection | Element} target
 */
const classListSearch = (target) => {
  if (
    target.classList &&
    [...target.classList].includes("ScCoreButtonSuccess-sc-1qn4ixc-5")
  ) {
    return clicker();
  }
  if (!!target.children) {
    for (const child of target.children) {
      classListSearch(child);
    }
  }
  return;
};

const obsConfig = { childList: true, subtree: true };
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      classListSearch(mutation.target.children[0]);
    }
  }
});

const titleObsConfig = { attributes: true, childList: true, subtree: true };
const titleObserver = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      //wait for DOM tree to finish..
      observer.disconnect();
      setTimeout(() => {
        let parentNode = document.querySelector(pointsParentNode);
        clicker();
        observer.observe(parentNode, obsConfig);
      }, 5000);
    }
  }
});

try {
  clicker();
  let currentTitle = document.getElementsByTagName("title")[0];
  let parentNode = document.querySelector(pointsParentNode);
  titleObserver.observe(currentTitle, titleObsConfig);
  observer.observe(parentNode, obsConfig);
} catch (e) {
  {
  }
}
