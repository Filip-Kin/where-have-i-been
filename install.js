chrome.runtime.onInstalled.addListener(function() {

	var device = "";

	//Device name stuff
	chrome.storage.local.get("device", function(data) {
		if(!data.hasOwnProperty("deviceName") || !data.hasOwnProperty("timeZone")) {
			if(!data.hasOwnProperty("timeZone")) {
				var xhr = new XMLHttpRequest();
				xhr.open("GET", 'https://filipkin.com/whib/timezone.php', true);
				xhr.onreadystatechange = function() {
					if(xhr.readyState == 4) {
						var offset = JSON.parse(xhr.responseText).offset;
						if(data.hasOwnProperty("deviceName")) {
							chrome.storage.local.set({ deviceName: data.deviceName, timeZone: offset }, function() {
								console.log("Storage reinitiated, devicename present: "+data.deviceName+", timezone reset to: " + offset);
							});
						} else {
							chrome.storage.local.set({ deviceName: 'Unknown', timeZone: offset }, function() {
								console.log("Storage initiated, devicename set to Unkown, timezone set to: "+offset);
							});
						}
					}
				}
				xhr.send();
			} else {
				chrome.storage.local.set({ deviceName: 'Unknown', timeZone: data.timeZone }, function() {
					console.log("Storage reinitiated, devicename reset, timezone present: "+date.timeZone);
				});
			}
		} else {
			console.log("Storage already initiated, deviceName = " + data.deviceName);
			device = data.deviceName;
		}
	});

	//Get history from before install
	chrome.storage.local.get("history", function(data) {
		if(data.hasOwnProperty("history")) {
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
				chrome.identity.getProfileUserInfo(function(email, id) {
					var xhr = new XMLHttpRequest();
					xhr.open("POST", 'https://filipkin.com/whib/timezone.php?email='+encodeURIComponent(email)+"&device="+encodeURIComponent(device), true);
					xhr.onreadystatechange = function() {
						if(xhr.readyState == 4) {
							var out = JSON.parse(xhr.responseText);
							if (out.status[0] == "exists") {
								console.log("History storage already initiated, id = " + json.status[1])
								chrome.storage.local.set({history: json.status[1]}, function() {
								}
							} else if (out.status[0] == "created") {
								console.log("History storage initiated, id = " + json.status[1])
								chrome.storage.local.set({history: json.status[1]}, function() {
								}
							} else {
								console.log("History init failed: " + JSON.stringify(json.status))
							}
						}
					}
					xhr.send();
				});
			});
		} else {
			console.log("History storage already initiated, id = " + data.history);
		}
	});

	//Popup
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: { hostEquals: "developer.chrome.com" },
			})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});

	//Add to history when tab changes
	chrome.tabs.onUpdated.addListener(function(tabId, chgInfo, tab) {
		if (chgInfo.status == "complete") {
			console.log(tab);
			console.log(new Date().toISOString().slice(0, 19).replace('T', ' '));
		}
	});
});
