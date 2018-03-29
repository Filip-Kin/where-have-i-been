var deviceNameForm = document.getElementById('deviceName');
var deviceNameInput = document.getElementById('deviceNameInput');
var sheetLink = document.getElementById('sheetLink');

chrome.storage.local.get('deviceName', function(data) {
	deviceNameInput.value = data.deviceName;
	console.log(data.deviceName);
	deviceNameForm.addEventListener("submit", function(evt) {
		chrome.storage.local.set({ deviceName: deviceNameInput.value }, function(data) {
			return false;
		});
	});
});
chrome.storage.local.get('history', function(data) {
	sheetLink.href = 'https://docs.google.com/spreadsheets/d/'+data.history;
});
