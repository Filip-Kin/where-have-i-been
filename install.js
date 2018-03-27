chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({ deviceName: 'Unknown' }, function() {
		console.log("Storage initiated");
	});
});
