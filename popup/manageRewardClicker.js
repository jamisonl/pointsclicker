const reload = (tabs) => {
  browser.storage.local.clear().then((e) => {
    displayPoints();
  });
};

const listenForClicks = () => {
  displayPoints();
  document.addEventListener("click", (e) => {
    const reportError = (error) => {
      console.error(`Could not load: ${error}`);
    };

    if (e.target.classList.contains("reload")) {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(reload)
        .catch(reportError);
    }
    if (e.target.classList.contains("settings")) {
      getSettings();
    }
    if (e.target.classList.contains("close-modal")) {
      closeSettings();
    }
    if (e.target == document.getElementById("settings-modal")) {
      closeSettings();
    }
    if (e.target.classList.contains("hide-points")) {
      hidePoints(e.target);
    }
  });
};

const reportExecuteScriptError = (error) => {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to run: ${error.message}`);
};

const getSettings = () => {
  document.getElementById("settings-modal").style.display = "block";
};

const closeSettings = () => {
  document.getElementById("settings-modal").style.display = "none";
};

const hidePoints = (node) => {
  const settingsObj = browser.storage.local.get("settings");
  if (!!Object.keys(settings).length) {
    if (node.checked) {
      settingsObj.settings.hidePoints = true;
    } else {
      settingsObj.settings.hidePoints = false;
    }
  }
};

const displayPoints = async () => {
  let points = document.getElementById("points");
  points.style.display = "none";
  const storedItems = await browser.storage.local.get("totals");
  if (!!Object.keys(storedItems.totals).length) {
    points.style.display = "block";
  }
  points.innerText = "";
  for (let [k, v] of Object.entries(storedItems.totals)) {
    points.innerText += `${k.toString()}: ${v.toString()}\n`;
  }
};

listenForClicks();
