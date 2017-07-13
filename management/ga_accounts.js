function getGA_JSON()
{
	var ga = [];
	$.each($('.view-result'), function(i,el){
		var a_id = $(el).find('td').eq(0).find('.AccountExplorerResults-id').text();
		var a_name = $(el).find('td').eq(0).text().replace(a_id, '');
		var p_id = $(el).find('td').eq(1).find('.AccountExplorerResults-id').text();
		var p_name = $(el).find('td').eq(1).text().replace(p_id, '');
		var v_id = $(el).find('td').eq(2).find('.AccountExplorerResults-id').text();
		var v_name = $(el).find('td').eq(2).text().replace(v_id, '');
		var t_id = $(el).find('td').eq(3).text();
		ga.push({
			'Account': a_name,
			'Account ID': a_id,
			'Property': p_name,
			'Property ID': p_id,
			'View': v_name,
			'View ID': v_id,
			'Table ID': t_id
		})
	})
	return(ga)
}
(function(console){

console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }
})(console)
console.save(getGA_JSON(), 'ga.json')
