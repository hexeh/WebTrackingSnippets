dataLayer = window.dataLayer || [];
// sendForm - название функции, указанной в onsubmit формы или onclick кнопки
sendForm = (function(){
	existedF = sendForm;
	return function(){
		console.log('Fired Form: ', arguments);
		var result = existedF.apply(this, arguments);
		dataLayer.push({
			'event': 'form_submit',
			'arguments': arguments
		});
		return result;
	}
})();
