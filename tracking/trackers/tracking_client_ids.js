// Universal Analytics
function getGAClientID(target_property) {
	var clid = ''
	var trackers = ga.getAll();
	for (var i = 0; i < trackers.length; i++) {
		if (trackers[i].get('trackingId') == target_property) {
			clid = trackers[i].get('clientId');
			break;
		}
	}
	return clid;
}
