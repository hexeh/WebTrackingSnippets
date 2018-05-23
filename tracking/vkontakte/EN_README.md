**_[RUSSIAN VERSION](https://github.com/hexeh/WebTrackingSnippets/tree/master/tracking/vkontakte)_**

For VKontakte social network there is a possibility to create multiple pixel instances on same website to track user activities.

Current branch show a modified version of standart API to work with GTM or any other tag management tool.

## Initialization

The first step is in creation of new **Constant** variable inside GTM container, which will store Tracking ID of our pixel.

Below are the code snippets considering the name of variable is `VK -- Tracker`

Following code represents initialization of the tracking pixel with some helpers:

```html
<div id="vk_api_transport"></div>
<script type="text/javascript">
  var vk_ret = 1;
  window.vkAsyncInit = function() {
    if(vk_ret)
    {
        VK.Retargeting.Init({{VK -- Tracker}});
        VK.Retargeting.Hit();
        vk_ret = 0
    }
  };
  setTimeout(function() {
    var el = document.createElement("script");
    el.type = "text/javascript";
    el.src = "https://vk.com/js/api/openapi.js?150";
    el.async = true;
    document.getElementById("vk_api_transport").appendChild(el);
  }, 0);
</script>
<script type="text/javascript">
  (function (d,w) {
    // CUSTOM FUNCTIONS
    w.sendVKEvent = function(g,retries) {
      var retries = typeof retries == 'number' ? retries : 1;
      var g = typeof g !== 'undefined' ? g : '_blank';
      if (retries <= 15) {
        if (typeof VK == 'object') {
          if (typeof VK.Retargeting.pixelCode !== 'undefined') {
          	if (VK.Retargeting.pixelCode == {{VK -- Tracker}}) {
          		VK.Retargeting.Event(g);
          	} else {
          	  VK.Retargeting.pixelCode = {{VK -- Tracker}};
              VK.Retargeting.Event(g);
          	}
          } else {
              w.setTimeout(function(){w.sendVKEvent(g,retries);}, 300);
          }
        } else {
          	retries += 1;
            w.setTimeout(function(){w.sendVKEvent(g,retries);}, 300);
        }
      }
    };
    w.addVKAud = function(i,retries) {
      var retries = typeof retries == 'number' ? retries : 1;
      if (retries <= 15) {
        if (typeof VK == 'object') {
          if (typeof VK.Retargeting.pixelCode !== 'undefined') {
              if (VK.Retargeting.pixelCode == {{VK -- Tracker}}) {
              	VK.Retargeting.Add(parseInt(i));
              } else {
              	VK.Retargeting.pixelCode = {{VK -- Tracker}};
                VK.Retargeting.Add(parseInt(i));
              }
            } else {
              w.setTimeout(function(){w.addVKAud(i, retries);}, 300);
            }
          } else {
          	retries += 1;
            w.setTimeout(function(){w.addVKAud(i, retries);}, 300);
          }
        } else {
          retries += 1;
          w.setTimeout(function(){w.addVKAud(i, retries);}, 300);
        }
    };
    w.addVKProductEvent = function(l,t,p,retries) {
      var retries = typeof retries == 'number' ? retries : 1;
      var p = typeof p !== 'undefined' ? p : {};
      var allowed = ['view_home', 'view_category', 'view_product', 'view_search', 'view_other', 'add_to_wishlist', 'add_to_cart', 'remove_from_wishlist', 'remove_from_cart', 'init_checkout', 'add_payment_info', 'purchase']
      var isAllowed = (allowed.indexOf(t) !== -1);
      if (isAllowed) {
        if (retries <= 50) {
          if (typeof VK == 'object' && typeof VK.Retargeting.ProductEvent == 'function') {
            if (typeof VK.Retargeting.pixelCode !== 'undefined') {
              if (VK.Retargeting.pixelCode == {{VK -- Tracker}}) {
              	VK.Retargeting.ProductEvent(parseInt(l),t,p);
              } else {
              	VK.Retargeting.pixelCode = {{VK -- Tracker}};
              	VK.Retargeting.ProductEvent(parseInt(l),t,p);
              }
            } else {
              	w.setTimeout(function(){w.addVKProductEvent(l,t,p, retries);}, 300);
            }
          } else {
           	  retries += 1;
              w.setTimeout(function(){w.addVKProductEvent(l,t,p, retries);}, 300);
          }
        }
      }
      else {
        console.log('event type not allowed')
      }
    };
  })(document,window);
</script>
```

The main differences with the standard variant of the code are:

1.  Explicit designation of the tracking ID we replaced with appeal to corresponding **GTM variable**.

2.  We produced window-leveled functions `sendVKEvent`,`addVKAud` and `addVKProductEvent` - wrappers of standard pixel methods.

We consider installation of the code via **Custom HTML** Tag with the **Window Loaded** trigger.

## The process of event sending

Since we produced event sending function, there is no need to perform explicit checking of availability _VK_ object on the page.

All we need to do is to set up new tag of **Custom HTML** type. 
The code is:

```html
<script type="text/javascript">  
    window.sendVKEvent('hello_there');  
</script>
<noscript>
  <div>
    <img src="https://vk.com/rtrg?p={{VK -- Tracker}}&event=hello_there" style="position:absolute; left:-9999px;" alt="" />
  </div>
</noscript>
```

And here is the example of adding a user in a specific audience:
```html
<script type="text/javascript">  
    window.addVKAud(123456);  
</script>
<noscript>
  <div>
    <img src="https://vk.com/rtrg?p={{VK -- Tracker}}&audience=123456" style="position:absolute; left:-9999px;" alt="" />
  </div>
</noscript>
```

## The process of passing parameters for dynamic retargeting

The full description of retargeting capabilities could be found [here(RUS)](https://vk.com/ads?act=office_help&oid=-19542789&p=%CF%E8%EA%F1%E5%EB%FC_%E4%EB%FF_%E4%E8%ED%E0%EC%E8%F7%E5%F1%EA%EE%E3%EE_%F0%E5%F2%E0%F0%E3%E5%F2%E8%ED%E3%E0)

The corresponding code:
```html
<script type="text/javascript">  
    window.addVKProductEvent(123456, 'view_product', {
        'products': [{'id': '123', price: 999}],
        'currency_code': 'RUR',
        'search_string': 'shtotutunas'
    });  
</script>
<noscript>
  <div>
    <!--product params are encodeURIComponent(JSON.stringify(PARAMS))-->
    <img 
      src="https://vk.com/rtrg?p={{VK -- Tracker}}&products_event=view_product&price_list_id=123456&products_params=%7B%22products%22%3A%5B%7B%22id%22%3A%22123%22%2C%22price%22%3A999%7D%5D%2C%22currency_code%22%3A%22RUR%22%2C%22search_string%22%3A%22shtotutunas%22%7D" 
      style="position:absolute; left:-9999px;" 
      alt="" 
    />
  </div>
</noscript>
```

**_Notes_**:

1. The calls of specific functions must be perfrormed _after_ inserting pixel initialization tag. 
Otherwise we need to perform specific check of the function availability similarly with the checking process inside wrappers.
2. `noscript`-parts are not necessary for GTM implementations and could take effect only in the case of direct implementation code on the pages.
