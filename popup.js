// zip -1 -x "*screen*" -x "*/\.*" x ".*"  -x "*.zip" -r addon.zip .


var urlList = {}; 

// Saves options to chrome.storage
function save_options(reload) {
  chrome.storage.sync.set({
    urlList: JSON.stringify(urlList),
  }, function() {
    console.log('Options saved');
    if (reload == true ) {  setTimeout( ()=>chrome.runtime.reload(), 1000) }
  });
}

// Restores select box and checkbox state using the preferences stored in chrome.storage.
window.onload = function restore_options() {
  chrome.storage.sync.get({
    // default values
    t1pop: true,
    urlList: false
  }, function(items) {
    

    //default state of checkbox depends if no settings found t1pop?checked:unchecked
    try {
      urlList = items.urlList?JSON.parse(items.urlList):{};
    } catch (error) {
      console.error("cant load urls");
    }

    //switch description
    if ( items.t1pop){
      //blacklist mode
      document.querySelector('#desciption').textContent = "Uncheck to blacklist this URL";
      
    } else {
      //whitelist mode
      document.querySelector('#desciption').textContent = "Check to whitelist this URL";

    }

    //find current url to blacklist
    chrome.tabs.query(
      {'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
      function( [tab]){
        const URL = tab.url;

        document.querySelector('#whitelisted_url').value = URL;

        //if url ins settings set checkbox
        if (URL in urlList){
          document.querySelector('#whitelisted_checkbox').checked = urlList[URL];
        } else {
          //set state based on global default
          //blacklist mode or whitelist mode
          document.querySelector('#whitelisted_checkbox').checked = items.t1pop;
        }
      }
    );    

	  console.log('Options restored');
  });





}


document.getElementById('whitelisted_checkbox').addEventListener('click', function(e) {

  //find current url to blacklist
  chrome.tabs.query(
    {'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
    function([tab]){
      const URL = tab.url;
      urlList[URL] = e.target.checked;
      save_options(true);
    }
  );

  
});

document.querySelector('#go-to-options').addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});