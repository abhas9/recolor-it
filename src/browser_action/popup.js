function popup() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "recolorIt"});
    window.close();
   });
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("recolorIt").addEventListener("click", popup);
});