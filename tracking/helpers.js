function setCookie(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}

function getCookie(name) {
    var cookie = " " + document.cookie;
    var search = " " + name + "=";
    var setStr = null;
    var offset = 0;
    var end = 0;
    if (cookie.length > 0) {
        offset = cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = cookie.indexOf(";", offset)
            if (end == -1) {
                end = cookie.length;
            }
            setStr = unescape(cookie.substring(offset, end));
        }
    }
    return (setStr);
}

window.onload = function() {
    var dataLayer = window.dataLayer || [];
    var count_page = getCookie("count_page");
    var dType = /iPad/.test(navigator.userAgent) ? "t" : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : "d";
    var ua_string = navigator.userAgent;

    if (count_page == null)
        count_page = 0;

    var current_page = document.location.href;

    var prev_page = getCookie("current_page");

    if (current_page != prev_page) {
        count_page = parseInt(count_page) + 1;

        expires = new Date();
        expires.setTime(expires.getTime() + 3600000);

        setCookie("count_page", count_page, expires, "/");
        setCookie("current_page", current_page, expires, "/");
    }
    dataLayer.push({
        'event': 'helpers',
        'viewDepth': getCookie("current_page"),
        'deviceType': dType,
        'userAgent': ua_string
    })
};
