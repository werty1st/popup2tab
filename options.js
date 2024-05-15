
// Saves options to chrome.storage
function save_options(reload) {
  var t1pop = document.getElementById('cb_t1pop').checked
  var t1foc = document.getElementById('cb_t1foc').checked
  //var t1tab = document.getElementById('cb_t1tab').checked
  
  chrome.storage.sync.set({
    t1pop: t1pop,
    t1foc: t1foc,
//    t1tab: t1tab,
  }, function() {
	console.log('Options saved')
	if (reload == true ) { chrome.runtime.reload() }

  })
}

// Restores select box and checkbox state using the preferences stored in chrome.storage.
window.onload = function restore_options() {
  chrome.storage.sync.get({
    // default values
    t1pop: true,
    t1foc: true,
//    t1tab: true,
  }, function(items) {
    document.getElementById('cb_t1pop').checked = items.t1pop
    document.getElementById('cb_t1foc').checked = items.t1foc
//    document.getElementById('cb_t1tab').checked = items.t1tab
    console.log('Options restored')
  })

}

document.getElementById('cb_t1pop').addEventListener('click', function() {save_options(true)} )
document.getElementById('cb_t1foc').addEventListener('click', function() {save_options(false)} )
//document.getElementById('cb_t1tab').addEventListener('click', function() {save_options(false)} )
