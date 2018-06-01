Немногие знают, то у платформы Facebook есть собственная система аналитики. Отслеживание событий для этой системы производится через пиксель отслеживания. 

В данном материале не будет дублироваться вся справка Facebook по вопросу возможностей отслеживания, однако, будут отмечены наиболее полезные для работы моменты.


Инициализация
-------------


Для отслеживания событий на сайте системой **Facebook** необходимо создать новый пиксель отслеживания

Поскольку мы для внедрения кода пикселя на сайт будем использовать Google Tag Manager, то сразу сохраним значение идентификатора пикселя в виде переменной с типом **Константа**. Далее во всех кодах подразумевается, что переменная с идентификатором пикселя имеет название `FB -- Tracker`.

Дополнительно, мы создадим в контейнере переменную-индикатор того, будет ли использоваться [Расширенное сопоставление](https://developers.facebook.com/docs/facebook-pixel/pixel-with-ads/conversion-tracking#advanced_match) - уточнение информации о посетителе сайта для случая, когда нам доступна какая-либо идентифицрующая этого пользователя информация, - при инициализации пикселя. Коды далее предполагают, что переменная имеет название `isFBAdvancedMatching` и тип **Константа**. В случае, если на сайте есть возможность получения телефона, почты, пола, геоинформации или личной информации посетителя, мы устанавливаем значение переменной в `1`, в противном случае - `0`.

Кроме того, учтем возможность отключения [автоматических событий пикселя](https://developers.facebook.com/docs/facebook-pixel/api-reference#automatic-configuration) аналогичной по конфигурации переменной с именем `isFBAutoConfig`. 

В итоге код имеет следующий вид:

```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
if (!Boolean(parseInt({{isFBAutoConfig}}))) {
	fbq('set', 'autoConfig', false, String({{FB -- Tracker}}));
};
if (Boolean(parseInt({{allowGDPRCheck}}))) {
	fbq('consent', 'revoke');
};
if (Boolean(parseInt({{isFBAdvancedMatching}}))) {
	fbq('init', String({{FB -- Tracker}}), {
		'em': {{userData}}.userEmail,
		'fn': {{userData}}.userFirstName,
		'ln': {{userData}}.userLastName,
		'ph': {{userData}}.userPhone,
		'ge': {{userData}}.userGender, // 'm' or 'f'
		'db': {{userData}}.userBirthDate, // inf format YYYYMMDD
		'ct': String({{userData}}.userCity).toLowerCase().replace(/\s/g,''),
		'st': {{userData}}.userStats, // must be only 2 letters 
		'zp': {{userData}}.userZip // must be only 5 digit
	});
	fbq('track', 'PageView');
} else {
	fbq('init', String({{FB -- Tracker}}));
	fbq('track', 'PageView');
};
</script>
<script type="text/javascript">
	(function (d,w) {
		// CUSTOM FUNCTIONS
		w.sendFBEvent = function(ev,pm,pid) {
			pm = typeof pm !== 'undefined' ? pm : undefined;
			pid = typeof pid !== 'undefined' ? pid : undefined;
			var tracking = 'trackCustom';
			if (pid) {
				tracking = 'trackSingleCustom';
			}
			var standardEvents = ['ViewContent', 'Search', 'AddToCart', 'AddToWishlist', 'InitiateCheckout', 'AddPaymentInfo', 'Purchase', 'Lead', 'CompleteRegistration'];
			var isStandard = (standardEvents.indexOf(ev) !== -1);
			if (isStandard) {
				tracking = 'track';
				if (pid) {
					tracking = 'trackSingle';
				}
			};
			if (typeof pm == 'object') {
				if (typeof fbq == 'function') {
					if (pid) {
						fbq(tracking, String(pid), ev, pm);
					} else {
						fbq(tracking, ev, pm);
					}
				}
				else {
					w.setTimeout(function(){w.sendFBEvent(ev,pm,pid);}, 300);
				}
			} else {
				if (typeof fbq == 'function') {
					if (pid) {
						fbq(tracking, String(pid), ev);
					} else {
						fbq(tracking, ev);
					}
				} else {
					w.setTimeout(function(){w.sendFBEvent(ev,pm,pid);}, 300);
				}
			};
		};
		w.allowToTrackFB = function() {
			fbq('consent', 'grant');
		};
	})(document,window);
</script>
<noscript>
	<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id={{FB -- Tracker}}&ev=PageView&noscript=1"/>
</noscript>
```

В случае, если нас не интересует расширенное сопоставление, то можно воспользоваться укороченной версией кода без соответствующих переменных:

```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
if (!Boolean(parseInt({{isFBAutoConfig}}))) {
	fbq('set', 'autoConfig', false, String({{FB -- Tracker}}));
};
if (Boolean(parseInt({{allowGDPRCheck}}))) {
	fbq('consent', 'revoke');
};
fbq('init', String({{FB -- Tracker}}));
fbq('track', 'PageView');
</script>
<script type="text/javascript">
	(function (d,w) {
		// CUSTOM FUNCTIONS
		w.sendFBEvent = function(ev,pm,pid) {
			pm = typeof pm !== 'undefined' ? pm : undefined;
			pid = typeof pid !== 'undefined' ? pid : undefined;
			var tracking = 'trackCustom';
			if (pid) {
				tracking = 'trackSingleCustom';
			}
			var standardEvents = ['ViewContent', 'Search', 'AddToCart', 'AddToWishlist', 'InitiateCheckout', 'AddPaymentInfo', 'Purchase', 'Lead', 'CompleteRegistration'];
			var isStandard = (standardEvents.indexOf(ev) !== -1);
			if (isStandard) {
				tracking = 'track';
				if (pid) {
					tracking = 'trackSingle';
				}
			};
			if (typeof pm == 'object') {
				if (typeof fbq == 'function') {
					if (pid) {
						fbq(tracking, String(pid), ev, pm);
					} else {
						fbq(tracking, ev, pm);
					}
				}
				else {
					w.setTimeout(function(){w.sendFBEvent(ev,pm,pid);}, 300);
				}
			} else {
				if (typeof fbq == 'function') {
					if (pid) {
						fbq(tracking, String(pid), ev);
					} else {
						fbq(tracking, ev);
					}
				} else {
					w.setTimeout(function(){w.sendFBEvent(ev,pm,pid);}, 300);
				}
			};
		};
		w.allowToTrackFB = function() {
			fbq('consent', 'grant');
		};
	})(document,window);
</script>
<noscript>
	<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id={{FB -- Tracker}}&ev=PageView&noscript=1"/>
</noscript>
```

Отличие данного кода от стандартного заключается в следующем:

1.  Мы контролируем отправку стандартных событий Facebook значением сохраненной переменной `isFBAutoConfig` без необходимости изменения кода отслеживания

2.  Мы контролируем отправку расширенной информации о пользователе значением сохраненной переменной `isFBAdvancedMatching` без необходимости кода отслеживания. Тем не менее стоит обратить внимание на то, что в коде представлены абсолютно все возможные параметры пользователя (в виде JSON-переменной `userData`)- **если на сайте нет возможности отслеживать часть представленных параметров, то соответствующие строки нужно удалить**.

3.  Мы ввели глобальную функцию `sendFBEvent` - эта функция дублирует стандартный метод отправки событий пикселя, но с одним дополнением - при вызове функции происходит проверка инициализации пикселя и, в случае успешной проверки, происходит отправка события, в противном же случае проверка повторяется каждые 0.3с вплоть до того момента, пока не завершится успешно. Помимо этого, функция автоматически определяет, какой конкретно способ отслеживания вызывать - отслеживание стандартных или пользовательских событий, отслеживание для конкретного счетчика или всех счетчиков на сайте.

4.  Мы ввели поддержку регламента по защите данных (GDPR) - логика срабатывания теперь контролируется переменной `allowGDPRCheck` - в случае значения 1 срабатывание пикселя откладывается и может быть активировано позднее вызовом глобальной функции `allowToTrackFB`.


Отправка событий
----------------

Пиксель поддерживает возможность отправлять как стандартные события (к ним относятся, например, события электронной торговли или отправки лида), так и пользовательские события с любым пользовательским текстовым идентификатором. Подробнее о события можно прочитать в [документации](https://developers.facebook.com/docs/facebook-pixel/api-reference#events).

Поскольку ранее мы ввели функцию-обертку отправки событий пикселя, то теперь для отправки достаточно создать тег с типом Пользовательский HTML.

Пример кода для отправки пользовательского события без каких-либо дополнительных параметров:

```html
<script type="text/javascript">
    window.sendFBEvent('hello_there');
</script>
```

Пример кода для отправки стандартного события лида (в данном коде отмечено событие поиска по сайту):

```html
<script type="text/javascript">
    window.sendFBEvent('Search', {
    	'search_string': 'Hello There!'
    });
</script>
```

В данном примере событие поиска будет отправлено на все пиксели, установленные на сайте. Для ограничения срабатывания каким-либо конкретным пикселем достаточно добавить его идентификатор в параметры вызова функции, например:

```html
<script type="text/javascript">
    window.sendFBEvent('Search', {
    	'search_string': 'Hello There!'
    }, 1000000000000);
</script>
```

