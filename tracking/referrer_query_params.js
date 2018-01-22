var dataLayer = window.dataLayer || [];
var dr = document.referrer;
var ref_params = {};
if( dr.length > 0 && !document.referrer.includes(document.location.host) ) {
	var url = new URL(dr);
	var sp = new URLSearchParams(url.search);
	ref_params['link'] = url.href;
	for(let i of sp.keys()){
		ref_params[i] = sp.get(i)
	}
}
if(Object.keys(ref_params).length > 1) {
	dataLayer.push({
		'event': 'referrerParse',
		'eventData': ref_params
	})
}
