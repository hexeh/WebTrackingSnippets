function getGTM(type){
var gtm = [];
var gtm_csv = 'Account Name; Container Name; Account ID; Container ID \r\n';
$.each($('div[class="account card"]'), function(i, el){ 
	a_name = $(el).find('div[class="account-name-card-header ddm-bubble-trigger"]').text().trim();
	var a_id = $(el).find('div[class="account-name-card-header ddm-bubble-trigger"]').attr('id');
	var sub = [];
	var sub_csv = '';
	$.each($(el).find('table tr'), function(i2, el2) 
		{
			var c_name = $(el2).find('td').eq(0).text().trim();
			if(c_name.length > 2)
			{
				sub.push({
					'Container Name' : c_name,
					'Container ID' : $(el2).find('td').eq(2).text().trim()
				});
				sub_csv = sub_csv + ';' + c_name + ';' + a_id + ';' + $(el2).find('td').eq(2).text().trim() + '\r\n'
			}
		});
	gtm.push({ 
		'Account Name': a_name,
		'Account ID' : a_id,
		'Childs': sub
	});
	gtm_csv = gtm_csv + a_name + ';' + ';' + a_id + ';\r\n' + sub_csv
});
return( (type == 'csv') ? gtm_csv:gtm);
}

function download(data, filename, type) {
	if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }
    var a = document.createElement("a"),
        file = new Blob([data], {type: (type == 'csv')?'text/csv':'text/json'});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename + '.' + ( (type == 'csv')?'csv':'json' ) );
    else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename + '.' + ( (type == 'csv')?'csv':'json' );
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}
