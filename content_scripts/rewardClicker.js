/*
    If the points object doesnt exist in local storage, instantiate it.
    Else update points object, and send message to manageRewardClicker to retrieve points.
  */
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
    handlePointsUpdate(50);
  }
};

let parentNodeClass = "community-points-summary";
const config = { childList: true, subtree: true };
let parentNode = document.getElementsByClassName(parentNodeClass)[0];
const observer = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    if (
      mutation.type === "childList" &&
      mutation.target.className === "tw-full-height tw-relative tw-z-above"
    ) {
      clicker();
    }
  }
});

let currentTitle = document.getElementsByTagName("title")[0];
const titleObsConfig = { attributes: true, childList: true, subtree: true };
const titleObserver = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      //wait for DOM tree to finish..
      setTimeout(() => {
        let parentNodeClass = "community-points-summary";
        let parentNode = document.getElementsByClassName(parentNodeClass)[0];
        clicker();
        observer.disconnect();
        observer.observe(parentNode, config);
      }, 3000);
    }
  }
});

titleObserver.observe(currentTitle, titleObsConfig);
observer.observe(parentNode, config);
setTimeout(() => clicker(), 3000);
