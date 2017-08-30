dataLayer = window.dataLayer || [];
var action_url = 'some url';
$.ajaxSetup({
	complete: function(x, s)
	{
		// s = ['success', 'notmodified', 'nocontent', 'error', 'timeout', 'abort','parsererror']
		if(this.url == action_url)
		{
			dataLayer.push(
			{
				'event': 'form_submit',
				'status': s,
				'ajax_url': action_url,
				'response': x.responseText
			});
		}
	}
});
