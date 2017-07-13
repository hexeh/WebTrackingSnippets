	var genericGoalId = 'PlaceGoalIdHere';

	var generic_checker = 0;
	var interval_generic = setInterval(function(){
		if(typeof fbq == 'function' && typeof VK == 'object' && !generic_checker)
		{
			VK.Retargeting.Event(genericGoalId);
			fbq('trackCustom', genericGoalId);

			console.log(
				'%c  Both VK and FB fired successfully for Goal: ' + '%c' + genericGoalId + '  ', 
				'background:#37474F;color:white;', 'background:#37474F;color:#FFECB3;font-weight:bold'
			);

			generic_checker = 1;
			clearInterval(interval_generic);
		}
	}, 1000);
