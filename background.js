// background script

// get settings
chrome.storage.sync.get({
    // default value
    t1pop: true,
    t1foc: true,
    urlList: false
    }, function(items) {
      
        t1pop = items.t1pop
        t1foc = items.t1foc

        urlList = {}

        try {
            urlList = items.urlList?JSON.parse(items.urlList):{}
        } catch (error) {
            console.error("cant load urls")
        }
    }
)

// open pop-up as a tab
// chrome.windows.getCurrent({},function(w){
//     console.log("getCurrent")

//     mainwindowId = w.id
// })


chrome.windows.onFocusChanged.addListener(function(w){
    console.log("onFocusChanged")
    //ignore debug window
    if ( w < 0){  
        return
    }
    chrome.windows.get(w,{},function(w){	
        if(w.type == "normal"){
            mainwindowId = w.id
        }
    })
})

chrome.windows.onCreated.addListener(function(w){
    console.log("onCreated")

    if(w.type == "popup"){

        chrome.windows.get(w.id,{populate:true},function(w){
            
            chrome.tabs.query({
                active: true,
                windowId: w.id
            }, function (tabs) {
                var t1popUrl = tabs[0].url
                const URL = tabs[0].pendingUrl
                
                //implement blacklist
                if (URL in urlList){
                    if (t1pop && urlList[URL]){
                        //blacklist mode: URL==true ? tab : popup
                        //move popup to tab
                        chrome.tabs.move(w.tabs[0].id,{windowId:mainwindowId,index:-1},function(){
                            chrome.tabs.update(w.tabs[0].id,{active:t1foc /* focus new window or not */})
                        })
                    } else if (!t1pop && urlList[URL]) {
                        //whitelist mode: URL==true ? tab : popup
                        //move popup to tab
                        chrome.tabs.move(w.tabs[0].id,{windowId:mainwindowId,index:-1},function(){
                            chrome.tabs.update(w.tabs[0].id,{active:t1foc /* focus new window or not */})
                        })
                    } else {
                        //settings found but no action required => popup
                    }
                } else {
                    //no settings for this url

                    if (t1pop){
                        //blacklist mode:
                        //move popup to tab
                        chrome.tabs.move(w.tabs[0].id,{windowId:mainwindowId,index:-1},function(){
                            chrome.tabs.update(w.tabs[0].id,{active:t1foc /* focus new window or not */})
                        })
                    } else {
                        //whitelist mode
                        //no action required => popup
                    }
                }

            })
            

        })
    }
})