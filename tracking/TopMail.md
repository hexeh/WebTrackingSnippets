Для отправки событий в myTarget и Топ\@Mail используются одинаковые пиксели. Рассмотрим вариант работы с такими пикселями в Google Tag Manager.

Инициализация
-------------

Для того, чтобы иметь возможность работать с пикселем Топ\@Mail в GTM, создадим переменную с типом **Константа** и значением идентификатора нашего счетчика.

Далее все коды будут представлены с учетом того, что переменная называется `TM -- Tracker`

Для иницализации счетчика воспользуемся следующим кодом:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
<!-- Rating@Mail.ru counter -->
<script type="text/javascript">
var _tmr = window._tmr || (window._tmr = []);
_tmr.push({
	id: String({{TM -- Tracker}}), 
	type: "pageView", 
	start: (new Date()).getTime()
});
(function (d, w, id) {
  if (d.getElementById(id)) return;
  var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
  ts.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//top-fwz1.mail.ru/js/code.js";
  var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
  if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
})(document, window, "topmailru-code");
</script>
<script type="text/javascript">
	(function (d,w) {
		// CUSTOM FUNCTIONS
		w.sendTMEvent = function(g) {
			if (typeof _tmr == 'object') {
				_tmr.push({ 
					id: String({{TM -- Tracker}}), 
					type: "reachGoal", 
					goal: g 
				});
			} else {
				w.setTimeout(function(){sendTMEvent(g);}, 300);
			}
		};
		w.sendTMObject = function(o) {
			if (typeof o == 'object') {
				if (typeof _tmr == 'object') {
					_tmr.push(o);
				} else {
					w.setTimeout(function(){sendTMObject(o);}, 300);
				}
			} else {
				console.log('Only objects allowed here');
			} 
		};
	})(document,window);
</script>
<noscript>
	<div>
		<img src="//top-fwz1.mail.ru/counter?id={{TM -- Tracker}};js=na" style="border:0;position:absolute;left:-9999px;" alt="" />
	</div>
</noscript>
<!-- //Rating@Mail.ru counter -->
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Отличие данного кода от стандартного заключается в следующем:

1.  Явный номер счетчика в каждом упоминании мы заменили на обращение к соответствующей переменной.

2.  Мы ввели глобальные функции `sendTMEvent` и `sendTMObject` - функции производят отправку достижения цели и общих данных соответственно, предварительно осуществляя проверку на наличие массива, необходимого для работы пикселя, на странице.

Установливать код в контейнер следует через тег с типом **Пользовательский HTML** со стандартным правилом активации на всех страницах.

Отправка событий
----------------

Поскольку при инициализации пикселя уже была задана функция отправки событий с проверкой наличия пикселя на странице, то теперь для отправки достаточно создать новый тег с типом **Пользовательский HTML**.

Пример кода в случае передачи данных о достижении цели:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
<script type="text/javascript">
    window.sendTMEvent('goalIDGoesHere');
</script>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Пример в случае передачи данных для динамического ремаркетинга:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
<script type="text/javascript">
    window.sendTMObject({
    	type: 'itemView',
    	productid: 'VALUE',
		pagetype: 'VALUE',
		list: 'VALUE',
		totalvalue: 'VALUE'
    });
</script>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
