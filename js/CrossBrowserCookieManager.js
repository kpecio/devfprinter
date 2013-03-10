// CrossBrowserCookieManager 0.1
// Copyright Thom Shannon 2007

var CrossBrowserCookieManager = function () {
    var b;
    return{
        Init: function () {
            $("body").append("<div style=\"display:block;position:absolute;left:-200px;top:-200px;\" id=\"cbcm_flashholder\"></div>");
            var a = new SWFObject("swf/cm.swf", "cbcm_flashobject", 10, 10, "8.0.0", "");
            a.addParam("allowScriptAccess", "always");
            a.addParam("scale", "noScale");
            a.write("cbcm_flashholder");
            b = $("#cbcm_flashobject")[0];
        },
        FlashReady: function () {
        },
        SaveCookie: function () {
            b = b || $("#cbcm_flashobject")[0];
            b.setCookie(document.cookie, "cbcm", "/", false);
        },
        LoadCookie: function () {
            b = b || $("#cbcm_flashobject")[0];
            if(b.getCookie("cbcm", "/", false)) {
                var aCookies = b.getCookie("cbcm", "/", false).split("; ");
                for (var x = 0; x < aCookies.length; x++) {
                    document.cookie = aCookies[x];
                }
            }
        }
    }
}();