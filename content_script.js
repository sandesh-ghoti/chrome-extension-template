let user_data = {};

function getMsg(msg_type, msg_body) {
  return {
    msg: {
      type: msg_type,
      data: msg_body,
    },
    sender: "content_script",
    id: "extension",
  };
}
function statusUpdate(status) {
  chrome.runtime.sendMessage(
    getMsg("status_update", { status, time: Date.now() })
  );
}

function addDelay(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message, sender, "content_script");
  if (message.id !== "extension") {
    sendResponse("Invalid Id");
    return;
  }
  const type = message.msg.type;
  if (type === "_type_") {
    // work here
  }
  sendResponse("Something went wrong");
});
function continueScript() {
  statusUpdate("from continue_script fn");
}

window.onload = function (e) {
  //this script start working from here, as it called from bg-js
  console.log("content script attached");
  chrome.storage.local.get(null, (result) => {
    user_data = result;
    statusUpdate("loaded user data from local storage");
    continueScript();
  });
};

/**
 * mutation Observer example
 
const loginBtn = document.querySelector(
  "body > app-root > app-home > div.header-fix > app-header > div.col-sm-12.h_container > div.text-center.h_main_div > div.row.col-sm-12.h_head1 "
);
const config = { attributes: false, childList: true, subtree: false };
const loginDetectorCallback = (mutationList, observer) => {
  if (
    mutationList.filter(
      (m) =>
        m.type === "childList" &&
        m.addedNodes.length > 0 &&
        [...m.addedNodes].filter(
          (n) => n?.innerText?.trim()?.toUpperCase() === "LOGOUT"
        ).length > 0
    ).length > 0
  ) {
    observer.disconnect();
    loadJourneyDetails();
  } else {
    loginBtn.click();
    loadLoginDetails();
  }
};
const observer = new MutationObserver(loginDetectorCallback);
observer.observe(loginBtn, config);
*/
