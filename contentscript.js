// zip -1 -x "*screens*" -x "*/\.*" x ".*"  -x "*.zip" -r addon.zip .

// get settings
chrome.storage.sync.get({
    // default value
    t1tab: true
    }, function(items) {

        t1tab = items.t1tab;
        
        if ( t1tab == true ){
            var a = document.getElementsByTagName("a"); 
            for (i=0;i<a.length;i++) { 
                
                if (a[i].target=="_blank" /* aggressive mode goes here */) { 
                    a[i].target="_top" /* _self vs _top */
                } 
            }
        }

});