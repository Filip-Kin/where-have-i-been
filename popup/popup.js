var deviceNameForm = document.getElementById('deviceName');
var deviceNameInput = document.getElementById('deviceNameInput');

chrome.storage.local.get('deviceName', function(data) {
	deviceNameInput.value = data.deviceName;
	console.log(data.deviceName);
	deviceNameForm.addEventListener("submit", function(evt) {
		chrome.storage.local.set({ deviceName: deviceNameInput.value }, function(data) {
			return false;
		});
	});
});
