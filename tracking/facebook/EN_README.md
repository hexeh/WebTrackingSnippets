Facebook has a possibility to track user activity on websites via Facebook Pixel installed.

The current article describes not all but the most important tracking options implemented via **Google Tag Manager**.

<p align="center"><a href = "https://github.com/hexeh/WebTrackingSnippets/tree/master/tracking/facebook">:ru:</a></p>

## Initialization


To start track user activities one need to [create Facebook Pixel first](https://www.facebook.com/business/help/952192354843755).
The following examples suggest `FB -- Tracker` variable inside GTM variable.

Example:

![](https://i.imgur.com/aM7JyrD.png)

Also we had to define a couple of additional variables:

 - `allowGDPRCheck` - the **Constant** with possible values 1 or 0 - should we deffer tracking process or not.
 - `isFBAutoConfig` - the **Constant** with possible values 1 or 0 - should we [enable automatic](https://developers.facebook.com/docs/facebook-pixel/api-reference#automatic-configuration) events or not.
 - `isFBAdvancedMatching` - the **Constant** with possible values 1 or 0 - should we enabled [advanced matching](https://developers.facebook.com/docs/facebook-pixel/pixel-with-ads/conversion-tracking#advanced_match) or not.
 - `userData` - related to advanced matching variable.

Example of the initialization:

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

You can use shorter version in case of disabled automatic mathcing:

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

**Tag configuration**:

Type: __Custom HTML__

Activation: Standard trigger __All Pages__


The main differences between standard variant are:

1.  We control manually auto-events behaviour with the `isFBAutoConfig` variable.

2.  We control manually automatic matching behaviour with the `isFBAdvancedMatching` variable.

3.  We produced wrapper-function `sendFBEvent` with the automatic detection of event type and parameters.

4.  We added GDPR support - it is controlled with the `allowGDPRCheck` variable - in case of value equaled to 1 tracking disabled until call of the function `allowToTrackFB`.


## Sending events

Facebook pixel supports **standard** (for example, ecommerce or lead) and **custom** events. 

More information could be found [here](https://developers.facebook.com/docs/facebook-pixel/api-reference#events).

As we already produced wrapper-function, event sending could be achieved by simple function call with the **Custom HTML** tag.

The following code demonstrates event tracking without additional parameters:

```html
<script type="text/javascript">
    window.sendFBEvent('hello_there');
</script>
```

The following code demonstrates event tracking for standard event (search on the website) with additional parameters:

```html
<script type="text/javascript">
    window.sendFBEvent('Search', {
    	'search_string': 'Hello There!'
    });
</script>
```

The following code demonstrates event tracking for standard event (search on the website) with additional parameters for specific pixel:

```html
<script type="text/javascript">
    window.sendFBEvent('Search', {
    	'search_string': 'Hello There!'
    }, 1000000000000);
</script>
```

