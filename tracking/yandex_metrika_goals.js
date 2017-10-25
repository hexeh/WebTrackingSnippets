	var counterId = 'PlaceCounterIDHere';
	var goalId = 'PlaceJSGoalIdentifierHere';
	var goalSender = function(c,g)
	{
		if( typeof window['yaCounter' + c] == 'object' )
		{
			var sendGoalParams = 
			{
				'fired_through': 'GTM',
				'time': Date.now()
			}
			window['yaCounter' + c].reachGoal(g, sendGoalParams, function(){
				console.log(
					'%c  Counter: ' + '%c' + c + ' ' + '%cfired successfully for Goal: ' + '%c' + g + '  ', 
					'background:#37474F;color:white;', 'background:#37474F;color:#FFECB3;font-weight:bold', 
					'background:#37474F;color:white;', 'background:#37474F;color:#FFECB3;font-weight:bold'
				);
			});
		}
		else
		{
			window.setTimeout(function(){goalSender(c,g);}, 500);
		}
	}
	goalSender(counterId, goalId)
