Немногие знают, что для отправки определенных событий в ВКонтакте можно использовать один пиксель, а не создавать новые.

Пример реализации в Google Tag Manager далее.

Инициализация
-------------

Для того, чтобы иметь возможность работать с пикселем ВКонтакте в GTM, создадим переменную с типом **Константа** и значением идентификатора нашего счетчика.

Далее все коды будут представлены с учетом того, что переменная называется `VK -- Tracker`

Для иницализации пикселя воспользуемся следующим кодом:

```javascript
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
    el.src = "https://vk.com/js/api/openapi.js?144";
    el.async = true;
    document.getElementById("vk_api_transport").appendChild(el);
  }, 0);
</script>
<script type="text/javascript">
  (function (d,w) {
    // CUSTOM FUNCTIONS
    w.sendVKEvent = function(g) {
      if (typeof VK == 'object') {
        VK.Retargeting.Event(g);
      } else {
        w.setTimeout(function(){w.sendVKEvent(g);}, 300);
      }
    };
    w.addVKAud = function(i) {
      if (typeof VK == 'object') {
        VK.Retargeting.Event(parseInt(i));
      } else {
        w.setTimeout(function(){w.addVKAud(i);}, 300);
      }
    };
    w.addVKProductEvent = function(l,t,p) {
      var allowed = ['view_home', 'view_category', 'view_product', 'view_search', 'view_other', 'add_to_wishlist', 'add_to_cart', 'remove_from_wishlist', 'remove_from_cart', 'init_checkout', 'add_payment_info', 'purchase']
      var isAllowed = (allowed.indexOf(t) !== -1);
      if (isAllowed) {
        if (typeof VK == 'object') {
          VK.Retargeting.ProductEvent(parseInt(l),t,p);
        } else {
          w.setTimeout(function(){w.addVKProductEvent(l,t,p);}, 300);
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

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
<script type="text/javascript">  
    window.sendVKEvent('hello_there');  
</script>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Пример кода в случае добавления посетителя в определенную аудиторию:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
<script type="text/javascript">  
    window.addVKAud(123456);  
</script>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
