Яндекс.Метрика, GTM, параметры пользователей...
===============================================

Что делать, если вы хотите передавать в Яндекс.Метрику идентификатор клиента Google Analytics правильно и не пострадать при этом морально? Пошаговая инструкция далее

Инициализация счетчика
----------------------

Для того, чтобы иметь возможность работать с Метрикой в GTM, создадим переменную с типом **Константа** и значением идентификатора нашего счетчика.

Далее все коды будут представлены с учетом того, что переменная называется `YM -- Tracker`

Для иницализации счетчика воспользуемся следующим кодом:

```html
<script type="text/javascript">
    (function (d, w, c) {
        (w[c] = w[c] || []).push(function() {
            try {
                w['yaCounter' + {{YM -- Tracker}}] = new Ya.Metrika({
                    id: Number({{YM -- Tracker}}),
                    clickmap: true,
                    trackLinks: true,
                    accurateTrackBounce: true,
                    triggerEvent: true,
                    webvisor: true,
                    ecommerce: "dataLayer"
                });
                w.goalSender = function(t,p,b,id){
                    p = typeof p !== 'undefined' ? p : undefined;
                    b = typeof b !== 'undefined' ? b : undefined;
                    if (typeof w['yaCounter' + id] == 'object') {
                        if (typeof p == 'object' || typeof p == 'function'){
                            if (typeof b == 'function' || typeof b == 'object'){
                                w['yaCounter' + id].reachGoal(t,p,b,id);
                            } else{
                                w['yaCounter' + id].reachGoal(t,p,id);
                            }
                        } else {
                            if (typeof b == 'function' || typeof b == 'object') {
                                w['yaCounter' + id].reachGoal(t,b,id);
                            } else {
                                w['yaCounter' + id].reachGoal(t,id);
                            }
                        }
                    } else {
                        w.setTimeout(function(){w.goalSender(t,p,b,id);}, 300);
                    };
                };
                w['document'].addEventListener('yacounter' + {{YM -- Tracker}} + 'inited', function (){
                    dataLayer = w.dataLayer || [];
                    dataLayer.push({
                        'event': 'YMReady',
                        'isYMReady': 'true',
                        'ymclid': w['yaCounter' + {{YM -- Tracker}}].getClientID()
                    });
                });
            } catch(e) { 
                dataLayer = w.dataLayer || [];
                dataLayer.push({
                    'event': 'YMFail',
                    'isYMReady': 'false',
                    'failReason': String(e)
                });
            }
        });

        var n = d.getElementsByTagName("script")[0],
            s = d.createElement("script"),
            f = function () { n.parentNode.insertBefore(s, n); };
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://mc.yandex.ru/metrika/watch.js";

        if (w.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
    })(document, window, "yandex_metrika_callbacks");
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/{{YM -- Tracker}}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
```

Отличие данного кода от стандартного заключается в следующем:

1.  Явный номер счетчика в каждом упоминании мы заменили на обращение к соответствующей переменной

2.  При инициализации счетчика мы включили событие готовности счетчика - как только оно произойдет, в dataLayer отправится событие `YMReady`. Если при инициализации счетчика на сайте произойдет какая-либо ошибка, то в dataLayer отправится событие `YMFail`. В дальнейшем мы произведем соответсвующие настройки в контейнере для фиксации этих событий

3.  Мы ввели глобальную функцию `goalSender` - эта функция дублирует стандартный метод счетчика reachGoal, но с одним дополнением - при вызове функции происходит проверка инициализации счетчика и, в случае успешной проверки, отправка события достижения цели в Метрику, в противном же случае проверка повторяется каждые 0.3с вплоть до того момента, пока не завершится успешно.

При необходимости вы можете добавить любые другие параметры инициализации из [документации](https://yandex.ru/support/metrika/code/counter-initialize.html).

Установливать код в контейнер следует через тег с типом **Пользовательский HTML** со стандартным правилом активации на всех страницах.

Проверка готовности счетчика
----------------------------

Ранее уже было отмечено, что как в случае успешной инициализации, так и в случае ошибки инициализации отправляются соответствующие события:

-   `YMReady` - счетчик загружен, и его можно использовать

-   `YMFail` - во время инициализации счетчика произошла ошибка

Добавить эти события в GTM можно через создание триггеров с типом **Пользовательское событие**. Пример такого триггера:

![](https://i.imgur.com/gY3sALm.png)

Кроме того, мы можем создать несколько переменных на основе тех данных, что передаются в уровень данных сайта при инициализации счетчика:

-   `isYMReady` - переменная-индикатор успешной иницилизации счетчика - в случае успешной инициализации содержит значение `true`, в противном - `false`

-   `ymclid` - идентификатор клиента Яндекс.Метрики, содержит значение только в случае успешной инициализации

-   `failReason` - описание ошибки инициализации, содержит значение только в случае ошибки иниицализации

Указанные выше переменные необходимо задавать при помощи типа **Переменная уровня данных**, пример:

![](https://i.imgur.com/zKiCwia.png)

Отправка параметров пользователя
--------------------------------

Подготовка к отправке данных завершена, теперь можно приступить к отправке данных.

В данном примере мы будем передавать идентификаторы клиента Google Analytics и Яндекс.Метрики в качестве [параметров пользователя Яндекс.Метрики](https://yandex.ru/support/metrika/objects/user-params.html) и идентификатор пользователя Google Analytics в качестве п[ользовательского идентификатора Яндекс.Метрики](https://yandex.ru/support/metrika/objects/set-user-id.html).

Для получения идентификатора пользователя GA мы воспользуемся готовыми функциями библиотеки *analytics.js*, а именно:

```javascript
ga.getAll()[0].get('clientId')
```

Полный код передачи параметров добавляется в контейнер через тег с типом **Пользовательский HTML** с правилом активации на триггер, определенный нами ранее через событие **YMReady**, и выглядит следующим образом:

```html
<script type="text/javascript">

    var supplyParams = function(){
        try
        {
            gaclid = ga.getAll()[0].get('clientId');
        }
        catch(e)
        {
            gaclid = 0
        }
        if( typeof gaclid == 'string' )
        {
            try
            {
                window['yaCounter' + {{YM -- Tracker}}].setUserID(gaclid)
                window['yaCounter' + {{YM -- Tracker}}].userParams({
                    'gaclid': gaclid,
                    'ymclid': {{YMCLID}}
                })
            }
            catch(e)
            {
                console.log('Something Went Wrong!');
                console.error(e);
                window.setTimeout(function(){supplyParams();}, 300);
            }
        }
        else
        {
            window.setTimeout(function(){supplyParams();}, 300);
        }
    }

    supplyParams();
    
</script>
```

 

Отправка целей
--------------

 

Поскольку при инициализации счетчика уже была задана функция отправки целей с проверкой наличия счетчика на странице, то теперь для отправки достаточно создать новый тег с типом **Пользовательский HTML**. Пример кода:
```html
<script type="text/javascript">
    window.goalSender('hello_there',  {{YM -- Tracker}}, function(){
        console.log('We\'ve just sent hello to Metrika')
    }, {{YM -- Tracker}});
</script>
```

Никаких дополнительных настроек не потребуется, достаточно активировать подобный тег на интересующее нас событие.

Заключение
----------

При помощи описанной модели внедрения счетчика Яндекс.Метрики мы получаем целый ряд преимуществ по отношению к стандартному варианту:

1.  В системе **Google Tag Manager** сохраняется готовое событие-индикатор готовности счетчика Метрики

2.  В системе **Google Tag Manager** сохраняется значение идентификатора пользователя Яндекс.Метрики, которое в дальнейшем можно передавать в другие системы аналитики.

3.  В Метрику отправляются значения идентификаторов GA и самой Метрики в качестве параметров пользователя.

4.  Идентификатор пользователя GA определяет пользовательский идентификатор Метрики.
