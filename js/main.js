var fingerPrinter = function(uidPower, ready) {
    uidPower = uidPower || 8;

    var plugins = [
        "AdobeReader",
        "DevalVR",
        "Flash",
        "Java",
        "PDFReader",
        "QuickTime",
        "RealPlayer",
        "Shockwave",
        "Silverlight",
        "WindowsMediaPlayer",
        "VLC"
    ];
    
    var mimetypes = [
        "application/x-shockwave-flash",
        "application/futuresplash",
        "application/vnd.chromium.remoting-viewer",
        "application/x-nacl",
        "application/pdf",
        "application/x-google-chrome-print-preview-pdf",
        "application/pdf",
        "application/vnd.adobe.pdfxml",
        "application/vnd.adobe.x-mars",
        "application/vnd.fdf",
        "application/vnd.adobe.xfdf",
        "application/vnd.adobe.xdp+xml",
        "application/vnd.adobe.xfd+xml",
        "application/x-msoffice14",
        "application/x-sharepoint",
        "application/geplugin",
        "application/x-vnd.google.update3webcontrol.3",
        "application/x-vnd.google.oneclickctrl.9",
        "application/x-vnd-intel-webapi-ipt-2.0.59",
        "application/x-vnd-intel-webapi-updater",
        "application/x-silverlight",
        "application/x-silverlight-2",
        "image/jps",
        "image/pns",
        "image/mpo",
        "application/mozilla-3dv-streaming-plugin",
        "audio/mpeg",
        "audio/x-mpeg",
        "video/mpeg",
        "video/x-mpeg",
        "video/mpeg-system",
        "video/x-mpeg-system",
        "audio/mp4",
        "audio/x-m4a",
        "video/mp4",
        "application/mpeg4-iod",
        "application/mpeg4-muxcodetable",
        "video/x-m4v",
        "video/x-msvideo",
        "application/ogg",
        "video/ogg",
        "application/x-ogg",
        "application/x-vlc-plugin",
        "video/x-ms-asf-plugin",
        "video/x-ms-asf",
        "application/x-mplayer2",
        "video/x-ms-wmv",
        "video/x-ms-wvx",
        "audio/x-ms-wma",
        "application/x-google-vlc-plugin",
        "audio/wav",
        "audio/x-wav",
        "audio/3gpp",
        "video/3gpp",
        "audio/3gpp2",
        "video/3gpp2",
        "video/divx",
        "video/flv",
        "video/x-flv",
        "application/x-matroska",
        "video/x-matroska",
        "audio/x-matroska",
        "application/xspf+xml",
        "audio/x-mpegurl",
        "video/webm",
        "audio/webm",
        "application/vnd.rn-realmedia",
        "audio/x-realaudio",
        "audio/amr",
        "audio/x-flac",
        "application/x-shockwave-flash",
        "application/futuresplash",
        "application/java-deployment-toolkit"
    ];

    var fonts = [
        "cursive",
        "monospace",
        "serif",
        "sans-serif",
        "fantasy",
        "default",
        "Arial",
        "Arial Black",
        "Arial Narrow",
        "Arial Rounded MT Bold",
        "Bookman Old Style",
        "Bradley Hand ITC",
        "Century",
        "Century Gothic",
        "Comic Sans MS",
        "Courier",
        "Courier New",
        "Georgia",
        "Gentium",
        "Impact",
        "King",
        "Lucida Console",
        "Lalit",
        "Modena",
        "Monotype Corsiva",
        "Papyrus",
        "Tahoma",
        "TeX",
        "Times",
        "Times New Roman",
        "Trebuchet MS",
        "Verdana",
        "Verona"
    ];

    ready = ready || function() {};

    //plugin and mimetypes detection
    PluginDetect.getVersion(".");
    //fonts detection
    var fontDetector = new Detector();

    var useFlashLSO = !!PluginDetect.getVersion("Flash");

    function rand() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    function createUID() {
        var uid = '';
        var power = uidPower;

        while(power--) {
            uid += rand();
        }
        return uid;
    }

    function getUID() {
        if(useFlashLSO) {
            CrossBrowserCookieManager.LoadCookie();
        }
        var uid = $.cookie('_uid_');
        if(!uid) {
            uid = createUID();
            $.cookie('_uid_', uid, { path: '/', expires: 20 * 365 });
        }
        if(useFlashLSO) {
            CrossBrowserCookieManager.SaveCookie();
        }

        return uid;
    }

    function getSystemInfo() {
        var result = {};

        result.platform = voodoo.ua().platform.name;
        result.os = voodoo.ua().platform.os;
        result.lang = window.navigator.userLanguage || window.navigator.language;
        result.timezone = (new Date().getTimezoneOffset() / (-60))*100;
        result.timezone = result.timezone < 1000 ? ('0'+result.timezone) : (''+result.timezone);

        return result;
    }

    function getBrowserInfo() {
        var result = {};

        result.name = voodoo.ua().browser.name;
        result.version = voodoo.ua().browser.version;

        return result;
    }

    function getPluginsInfo() {
        var result = [];

        for(var i = 0, l = plugins.length, version = null; i < l; i++) {
            //fix for bug with java plugin detection
            if("Java" === plugins[i]) {
                version = navigator.javaEnabled();
            }
            else {
                version = PluginDetect.getVersion(plugins[i]);
            }

            if(version) {
                result.push({name: plugins[i], version: version});
            }
        }

        return result;
    }

    function getMimetypesInfo() {
        var result = [];

        for(var i = 0, l = mimetypes.length; i < l; i++) {
            if(PluginDetect.hasMimeType(mimetypes[i])) {
                result.push(mimetypes[i]);
            }
        }

        return result;
    }

    function getFontsInfo() {
        var result = [];

        for(var i = 0, l = fonts.length; i < l; i++) {
            if(fontDetector.detect(fonts[i])) {
                result.push(fonts[i]);
            }
        }

        return result;
    }

    function getAcceptHeaders(success, failure) {
        $.ajax({
            url: "http://ajaxhttpheaders.appspot.com",
            dataType: 'jsonp',
            success: function(headers) {
                var result = [];
                for(var idx in headers) {
                    if(headers.hasOwnProperty(idx)) {
                        result.push({name: idx, value: headers[idx]});
                    }
                }
                success(result);
            },
            error: function() {
                failure();
            }
        });
    }

    var iface = {
        getSystemInfo: getSystemInfo,
        getBrowserInfo: getBrowserInfo,
        getPluginsInfo: getPluginsInfo,
        getMimetypesInfo: getMimetypesInfo,
        getFontsInfo: getFontsInfo,
        getAcceptHeaders: getAcceptHeaders,
        getUID: getUID
    };

    var initFPWithFlash = function() {
        CrossBrowserCookieManager.FlashReady = function() {
            CrossBrowserCookieManager.LoadCookie();
            ready(iface);
        };
        CrossBrowserCookieManager.Init();
    }

    var initFPBasic = function() {
        ready(iface);
    }

    if(useFlashLSO) {
        initFPWithFlash();
    }
    else {
        initFPBasic();
    }

    return iface;
}


$(document.body).ready(function() {
    var $generateBtn = $('#generateBtn');
    var $field = $('#idField');

    var fp = new fingerPrinter(3, function(fp) {
        $generateBtn.attr('disabled', null);
        $generateBtn.click(function() {
            $field.val(fp.getUID());
        });
    });



    /* rendering device info */

    $('#systemInfo').append(
        '<div>platform: '+fp.getSystemInfo().platform+'</div>'+
            '<div>os: '+fp.getSystemInfo().os+'</div>'+
            '<div>lang: '+fp.getSystemInfo().lang+'</div>'+
            '<div>timezone: GMT+'+fp.getSystemInfo().timezone+'</div>'
    );

    $('#browserInfo').append(
        '<div>name: '+fp.getBrowserInfo().name+'</div>'+
        '<div>version: '+fp.getBrowserInfo().version+'</div>'
    );

    var pluginsInfoStr = '';
    if(fp.getPluginsInfo().length) {
        $(fp.getPluginsInfo()).each(function(idx, itm) {
            pluginsInfoStr += '<li><b>'+itm.name+'</b>: '+itm.version+'</li>'
        });
        if(pluginsInfoStr) {
            pluginsInfoStr = '<ul>'+pluginsInfoStr+'</ul>';
        }
    }
    pluginsInfoStr = '<div>plugins found: '+fp.getPluginsInfo().length+'</div>'+pluginsInfoStr;
    $('#pluginsList').append(pluginsInfoStr);

    var mimetypesInfoStr = '';
    if(fp.getMimetypesInfo().length) {
        $(fp.getMimetypesInfo()).each(function(idx, itm) {
            mimetypesInfoStr += '<li>'+itm+'</li>'
        });
        if(mimetypesInfoStr) {
            mimetypesInfoStr = '<ul>'+mimetypesInfoStr+'</ul>';
        }
    }
    mimetypesInfoStr = '<div>mimetypes found: '+fp.getMimetypesInfo().length+'</div>'+mimetypesInfoStr;
    $('#mimetypesList').append(mimetypesInfoStr);

    var fontsInfoStr = '';
    if(fp.getFontsInfo().length) {
        $(fp.getFontsInfo()).each(function(idx, itm) {
            fontsInfoStr += '<li style="font-family: '+itm+';">'+itm+'</li>'
        });
        if(fontsInfoStr) {
            fontsInfoStr = '<ul>'+fontsInfoStr+'</ul>';
        }
    }
    fontsInfoStr = '<div>fonts found: '+fp.getFontsInfo().length+'</div>' + fontsInfoStr;
    $('#fontsList').append(fontsInfoStr);

    fp.getAcceptHeaders(function(headers) {
        var heeadersInfoStr = '';
        if(headers.length) {
            $(headers).each(function(idx, itm) {
                heeadersInfoStr += '<li><b>'+itm.name+'</b>: '+itm.value+'</li>'
            });
            if(heeadersInfoStr) {
                heeadersInfoStr = '<ul>'+heeadersInfoStr+'</ul>';
            }
        }
        heeadersInfoStr = '<div>headers found: '+headers.length+'</div>' + heeadersInfoStr;
        $('#headersList').append(heeadersInfoStr);
    }, function() {});


    $('.showFull').click(function() {
        var $this = $(this);
        var rel = $this.attr('rel');
        if(rel) {
            if($('#'+rel).hasClass('short')) {
                $this.html('-');
                $('#'+rel).removeClass('short');
            }
            else {
                $this.html('+');
                $('#'+rel).addClass('short');
            }
        }
    });
});