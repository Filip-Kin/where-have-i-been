chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.local.get("deviceName", function(data) {
		if (!data.hasOwnProperty("deviceName")) {
			chrome.storage.local.set({ deviceName: 'Unknown' }, function() {
				console.log("Storage initiated");
			});
		} else {
			console.log("Storage already initiated, deviceName = " + data.deviceName);
		}
	});
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: { hostEquals: "developer.chrome.com" },
			})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});
