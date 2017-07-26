	var counterId = 'PlaceCounterIdHere';
	var goalId = 'PlaceJSGoalIdentifierHere';

	var m_checker_firstscreen = 0;
	var m_interval_firstscreen = setInterval(function(){
		if(typeof window['yaCounter' + counterId] == 'object' && !m_checker_firstscreen)
		{
			var sendGoalParams = 
			{
				'fired_through': 'GTM',
				'time': date.now()
			}
			window['yaCounter' + counterId].reachGoal(goalId, sendGoalParams, function(){
				console.log(
					'%c  Counter: ' + '%c' + counterId + ' ' + '%cfired successfully for Goal: ' + '%c' + goalId + '  ', 
					'background:#37474F;color:white;', 'background:#37474F;color:#FFECB3;font-weight:bold', 
					'background:#37474F;color:white;', 'background:#37474F;color:#FFECB3;font-weight:bold'
				);
			});
			m_checker_firstscreen = 1;
			clearInterval(m_interval_firstscreen);
		}
	}, 1000);
