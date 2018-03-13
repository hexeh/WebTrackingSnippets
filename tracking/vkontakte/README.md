Немногие знают, что для отправки определенных событий в ВКонтакте можно использовать один пиксель, а не создавать новые.

Пример реализации в Google Tag Manager далее.

Инициализация
-------------

Для того, чтобы иметь возможность работать с пикселем ВКонтакте в GTM, создадим переменную с типом **Константа** и значением идентификатора нашего счетчика.

Далее все коды будут представлены с учетом того, что переменная называется `VK -- Tracker`

Для иницализации пикселя воспользуемся следующим кодом:

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

Отличие данного кода от стандартного заключается в следующем:

1.  Явный номер счетчика в каждом упоминании мы заменили на обращение к соответствующей переменной.

2.  Мы ввели глобальные функции `sendVKEvent` и `addVKAud` - функции производят отправку определенного события пикселя и добавляют посетителя в аудиторию с указанным в вызове идентификатором.

Установливать код в контейнер следует через тег с типом **Пользовательский HTML** со стандартным правилом активации на всех страницах.

Отправка событий
----------------

Поскольку при инициализации пикселя уже была задана функция отправки событий с проверкой наличия пикселя на странице, то теперь для отправки достаточно создать новый тег с типом **Пользовательский HTML**.

Пример кода в случае передачи определенного события:

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

Пример кода в случае добавления посетителя в определенную аудиторию:
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


Отправка данных динамического ремаркетинга
------------------------------------------

Читать [тут](https://vk.com/ads?act=office_help&oid=-19542789&p=%CF%E8%EA%F1%E5%EB%FC_%E4%EB%FF_%E4%E8%ED%E0%EC%E8%F7%E5%F1%EA%EE%E3%EE_%F0%E5%F2%E0%F0%E3%E5%F2%E8%ED%E3%E0)


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
