let finalData = {};

const errors = [];
let port;

window.addEventListener("load", () => {});
function getMsg(msg_type, msg_body) {
  return {
    msg: {
      type: msg_type,
      data: msg_body,
    },
    sender: "popup",
    id: "extension",
  };
}

function saveData() {
  chrome.storage.local.set(finalData);
}
function clearData() {
  chrome.storage.local.clear();
}

function connectWithBg() {
  startScript();
}

function startScript() {
  chrome.runtime.sendMessage(
    getMsg("activate_script", finalData),
    (response) => {
      console.log(response, "activate_script response");
    }
  );
}
