<script type="text/javascript">

	function processEvents(genericGoalID, srv = ['vk', 'fb', 'mt'])
	{
		var generic_social_checker = 0;
		var generic_interval = setInterval(function(){
			if( ( srv.includes('fb') ? typeof fbq == 'function' : true ) && (  srv.includes('vk') ? typeof VK == 'object' : true ) && ( srv.includes('mt') ? typeof _tmr == 'object' : true ) && !generic_social_checker)
			{
				VK.Retargeting.Event(genericGoalID);
				fbq('trackCustom', genericGoalID);
				_tmr.push({ id: window.mt_id, type: "reachGoal", goal: genericGoalID });

				console.log(
					'%c  All social tracking codes fired successfully for Goal: ' + '%c' + genericGoalID + '  ', 
					'background:#37474F;color:white;', 'background:#37474F;color:#FFECB3;font-weight:bold'
				);
				generic_social_checker = 1;
				clearInterval(generic_interval);
			}
		}, 1000);
	}

	var GoalId = 'Place Goal ID Here';
	window.mt_id = 'Place Top Mail Counter ID Here';
	processEvents(GoalId) 
	/*
		One can call function with explicit instructions of which service should be fired
		Example: processEvents(GoalId, srv = ['vk', 'mt'] )
	*/
</script>
