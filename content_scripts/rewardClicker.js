/*
    If the points object doesnt exist in local storage, instantiate it.
    Else update points object, and send message to manageRewardClicker to retrieve points.
  */
const pointsParentNode = "community-points-summary";
const handlePointsUpdate = async (pointsNum) => {
  let title = document.URL.split("/")[document.URL.split("/").length - 1].split(
    "?"
  )[0];
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
  let button = document.body.querySelector(".tw-button, .tw-button--success");
  if (!!button) {
    button.click();
    setTimeout(() => {
      handlePointsUpdate(getPointsCount());
    }, 500);
  }
};

const getPointsCount = () => {
  const pointsNode = document.getElementsByClassName(pointsParentNode)[0];
  const pointsNum = parseInt(pointsNode.textContent.split("+")[1]);
  return !!pointsNum ? pointsNum : 50;
};

const obsConfig = { childList: true, subtree: true };
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (
      mutation.type === "childList" &&
      mutation.target.className === "tw-full-height tw-relative tw-z-above"
    ) {
      clicker();
    }
  }
});

const titleObsConfig = { attributes: true, childList: true, subtree: true };
const titleObserver = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      //wait for DOM tree to finish..
      setTimeout(() => {
        let parentNode = document.getElementsByClassName(pointsParentNode)[0];
        clicker();
        observer.disconnect();
        observer.observe(parentNode, obsConfig);
      }, 5000);
    }
  }
});

setTimeout(() => {
  let currentTitle = document.getElementsByTagName("title")[0];
  let parentNode = document.getElementsByClassName(pointsParentNode)[0];
  titleObserver.observe(currentTitle, titleObsConfig);
  observer.observe(parentNode, obsConfig);
}, 5000);
setTimeout(() => clicker(), 3000);
