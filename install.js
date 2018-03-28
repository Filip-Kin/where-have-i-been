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
	chrome.storage.local.get("history", function(data) {
		if(!data.hasOwnProperty("history")) {
			var query = { 
				text: "",
				startTime: 1,
				maxResults: 1000000
			}
			chrome.history.search(query, function(results) {
				var out = [];
				var lasttime = 10000000000000.00;
				console.log(results);
				results.forEach(function(obj) {
					console.debug(obj);
					var direct = false;
					if (obj.typedCount != 0) direct = true;
					var timestamp = obj.lastVisitTime;
					if (obj.visitCount != 1) {
						timestamp = lasttime;
					} else {
						lasttime = timestamp;
					}
					var time = new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
					var outobj = {
						"id": obj.id,
						"title": obj.title,
						"url": obj.url,
						"direct": direct,
						"visits": obj.visitCount,
						"time": time
					};
					out.push(outobj);
				});
				console.log(out);
			});
		} else {
			console.log("History storage already initiated, id = " + data.history);
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
