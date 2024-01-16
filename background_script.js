let scriptActivated = false;
let tabDetails;
let status_updates = {};

function getMsg(msg_type, msg_body) {
  return {
    msg: {
      type: msg_type,
      data: msg_body,
    },
    sender: "background js",
    id: "extension",
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message, sender, "background_script received a msg");
  if (message.id !== "extension") {
    sendResponse("Invalid Id");
    return;
  }
  const type = message.msg.type;
  const data = message.msg.data;
  if (type === "activate_script") {
    chrome.tabs.create(
      {
        url: "",
      },
      (tab) => {
        tabDetails = tab;
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["./content_script.js"],
        });
      }
    );
    sendResponse("Script activated");
  } else if (type === "status_update") {
    //for first time status update create
    if (!status_updates[sender.id]) status_updates[sender.id] = [];
    // else save in
    status_updates[sender.id].push({
      sender: sender,
      data,
    });
    console.log(`status at ${message?.sender}`, data.status, data.time);
  } else {
    sendResponse("Something went wrong");
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === tabDetails?.id && changeInfo?.status === "complete") {
    if (tab.url.includes("_urlPath_")) {
      chrome.tabs.sendMessage(tabDetails.id, getMsg("_sendmessage_"));
    }
  }
});

// On installing the extension
chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: "onboarding.html",
    });
  }
});
// chrome.tabs.create(
//   createProperties: object,
//   callback?: function,
// )
