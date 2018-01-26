//var basePath = "http://www.maimaiti.cn/wechat";//因为开发环境没有外网，所以通过该路径进行映射，路径中必须包含“/wechat”,否则不会映射到开发环境
//var basePath = "https://www.maimaiti.cn";
var basePath = "https://m.maimaiti.cn/dev/wallet";
var imgsPath = "https://static.maimaiti.cn/";
var base = "https://m.maimaiti.cn/dev/wechat";
// var basePath = "http://10.82.2.22:8081/wallet";
// var homePath = "http://m.maimaiti.cn/dev/wechat";
//var homePath = "http://www.maimaiti.cn";
//var host_url = "http://www.maimaiti.cn";
//var staticPath = "https://uat.maimaiti.cn/static";
if (location.href.match(/\/([a-z]+)\/wechat/)) {
    var imgPath = location.protocol + "//" + location.host + "/" + location.href.match(/\/([a-z]+)\/wechat/)[1];
} else {
    var imgPath = location.protocol + "//" + location.host + "/";
}
var wxPath;
if (window.location.href.match(/dev/)) {
    wxPath = "https://m.maimaiti.cn/dev/wechat";
} else if (window.location.href.match(/sit/)) {
    wxPath = "https://m.maimaiti.cn/sit/wechat";
} else if (window.location.href.match(/uat/)) {
    wxPath = "https://m.maimaiti.cn/";
} else {
    wxPath = "https://www.maimaiti.cn";
}
$.ajaxSetup({
    xhrFields: {
        withCredentials: true
    }
});

/*function shareProduct(opts) {
	var opt = opts ? opts : {};
	var url = opt.url ? opt.url : "",
		icon = opt.icon ? opt.icon : "",
		discription = opt.dsc ? opt.dsc : "",
		titles = opt.title ? opt.title : "";
	if (window.localStorage) {
		var data = {
			"title": titles,
			"icon": icon,
			"url": url,
			"discription": discription
		};
		window.localStorage.setItem("shareData", JSON.stringify(data));
	}
}*/
/*分享函数，根据实际情况传入标题，url地址，icon图标，描述*/
function shareProduct(opts) {
    var opt = opts ? opts : {};
    var url = opt.url ? opt.url : "",
		icon = opt.icon ? opt.icon : "",
		discription = opt.dsc ? opt.dsc : "",
		titles = opt.title ? opt.title : "";
    JSInterface.setShare({
        "title": titles,
        "icon": icon,
        "url": url,
        "discription": discription
    });
}

//自动登录
(function () {
    if (is_weixn()) {
        //获取openId
        var openId = localStorage.getItem("openId") || "";
        $.ajax({
            type: "post",
            url: basePath + "../wechat/wechatuser/autoLogin",
            async: false,
            data: { "openId": openId },
            dataType: "JSON",
            success: function (data) {
                if (data.status == 0) {
                    localStorage.setItem("openId", data.data.openId)
                } else if (data.status == 1) {
                    localStorage.setItem("openId", data.data.openId)
                } else if (data.status == 2) {
                    // 改为同步请求
                    $.ajax({
                        url: basePath + "../wechat/wechatuser/getWXUrl.do?hrefUrl=" + window.location.href,
                        type: "get",
                        async: false,
                        dataType: "JSON",
                        success: function (data) {
                            if (data.status == 0) {
                                location.href = data.message;
                            }
                        }
                    });
                }
            }
        });

    }
})();

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}
/**
 * 获取未编码搜索值
 * @param name
 * @returns {*}
 * @constructor
 */
function GetQueryString2(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2]; return null;
}

function myencodeURI(str) {
    return encodeURIComponent(encodeURIComponent(str));
}
//=====================微信jssdk 配置============================
function getJsApiconfig() {
    //加载中样式
    var data = {};
    data.url = window.location.href;
    $.ajax({
        type: "post",
        async: true,
        data: data,
        url: wxPath + "/wechatuser/getJsApiConfig.do",
        dataType: 'json',
        timeout: 30000,
        error: function () {
            textLog("页面加载错误，请刷新");
        },
        success: function (res) {
            if (res.status == "0") {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.data.appId, // 必填，公众号的唯一标识
                    timestamp: "" + res.data.timestamp,
                    nonceStr: res.data.nonceStr,
                    signature: res.data.signature,
                    jsApiList: [
				                'checkJsApi',
				                'onMenuShareTimeline',
				                'onMenuShareAppMessage',
				                'onMenuShareQQ',
				                'onMenuShareWeibo',
				                'hideMenuItems',
				                'showMenuItems',
				                'hideAllNonBaseMenuItem',
				                'showAllNonBaseMenuItem',
				                'translateVoice',
				                'startRecord',
				                'stopRecord',
				                'onRecordEnd',
				                'playVoice',
				                'pauseVoice',
				                'stopVoice',
				                'uploadVoice',
				                'downloadVoice',
				                'chooseImage',
				                'previewImage',
				                'uploadImage',
				                'downloadImage',
				                'getNetworkType',
				                'openLocation',
				                'getLocation',
				                'hideOptionMenu',
				                'showOptionMenu',
				                'closeWindow',
				                'scanQRCode',
				                'chooseWXPay',
				                'openProductSpecificView',
				                'addCard',
				                'chooseCard',
				                'openCard'
                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            } else {
                textLog("页面加载失败，请刷新");
            }
        }
    });
}
//======================微信 jssdk end=========================

//消息提示框
function textLog(str) {
    String.prototype.len = function () {
        return this.replace(/[^\x00-\xff]/g, "xx").length;
    }
    var textDiv = "<div class='alert'><div class='bg'></div><div class='alerCon'>" + str + "</div></div>";
    $(textDiv).appendTo("body");
    var len = str.len() + 8;
    $(".bg").height($(window).height());
    var height = -$(".alerCon").height() / 2;
    $(".alerCon").css({ "margin-left": -(len / 2) * 0.6 + "rem", "margin-top": height });
    setTimeout(function () {
        $(".alert").fadeOut(500);
    }, 1500);
    setTimeout(function () {
        $(".alert").remove();
    }, 2000);
}

// 修改 logStr 方法 调用 APP 原生提示
function logStr(str) {
    try {
        if (origin == 3) {
            // android
            mobile.showToast(str);
        } else if (origin == 4) {
            // ios
            window.webkit.messageHandlers.showToast.postMessage(str);
        } else {
            oldLogStr(str);
        }
    } catch (error) {
        // 兼容之前 h5 提示
        oldLogStr(str);
    }
}

function oldLogStr(str) {
    var html = '<div class="throw-tips-wrap"><p>' + str + '</p></div>';
    $('body').append(html);
    // String.prototype.len = function () {
    //     return this.replace(/[^\x00-\xff]/g, "xx").length;
    // }
    // var textDiv = "<div class='alert'><div class='bg'></div><div class='alerCon'>" + str + "</div></div>";
    // $(textDiv).appendTo("body");
    // var len = str.len() + 8;
    // $(".bg").height($(window).height());
    // var height = -$(".alerCon").height() / 2;
    // $(".alerCon").css({ "margin-left": -(len / 2) * 0.14 + "rem", "margin-top": height });
    setTimeout(function () {
        $(".throw-tips-wrap").fadeOut(500);
    }, 1500);
    setTimeout(function () {
        $(".throw-tips-wrap").remove();
    }, 2000);
    return false;
}

//消息确认提示框
function conFirm(title, con, arr, fun) {
    var conFirm = "<div class='confirm'><div class='conBg'></div><div class='conCon'><div class='conTile'>" + title + "</div><p>" + con + "</p><div class='conA'></div></div></div>";
    $(conFirm).appendTo("body");
    $(".conBg").height($(window).height());
    var height = -($(".conCon").height() + parseFloat($(".conCon").css("padding-top"))) / 2;
    console.log(height);
    $(".conCon").css("margin-top", height);
    if (arr.length == 1) {
        var a = "<a href='javascript:' onClick='conClose()'>" + arr[0] + "</a>";
        $(a).appendTo(".conA");
        $(".conA a").width($(".conCon").width());
        $(".conA a").css({ "border-bottom-left-radius": "0.25rem", "border-bottom-right-radius": "0.25rem" });
    } else {
        var a = "<a href='javascript:' onClick='conClose()' style='border-bottom-left-radius:0.25rem'>" + arr[0] + "</a><a href='javascript:' onClick='conClose()' style='border-bottom-right-radius:0.25rem'>" + arr[1] + "</a>";
        $(a).appendTo(".conA");
        $(".conA a").width($(".conCon").width() / 2);
    }
    $(".conA a:last").bind("click", fun);
}

function conClose() {
    $(".confirm").fadeOut(400);
    setTimeout(function () {
        $(".confirm").remove();
    }, 500);
}

//时间格式化  例子var time1 = new Date(1462413639233).Format("yyyy-MM-dd hh:mm:ss"); alert(time1);
function myDate(date) {
    if (date == null || date == undefined || date == 'null') {
        return "";
    }
    return new Date(date).Format("yyyy-MM-dd hh:mm:ss");
}
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//判断是否登录
function isLogin(data) {
    if (data.status == 3) {
        var url = location.href;
        location.href = "login.html?url=" + url;
    }
}

//截取url后面的json对象
function GetRequest() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return;
    }
    f = Math.round(x * 100) / 100;
    return f;
}

//加载动画
function loading() {
    var documentH,//文档高度
	winH, 		   //窗口高度
	loadingHtml;	//结构
    documentH = $(document).height();
    winH = $(window).height();
    loadingHtml = '<div id="loadingMask" class="p-loading-mask"><img id="loadingGif" class="p-loading-gif" src="images/loading-gray.gif"/></div>';
    $(loadingHtml).appendTo("body");
    //mask样式
    $('#loadingMask').css({
        "width": "100%",
        "text-align": "center",
        "background": "rgba(0,0,0,.1)",
        "filter": "progid:DXImageTransform.Microsoft.gradient(startColorstr=#B2000000,endColorstr=#B2000000)",
        "position": "fixed",
        "top": "0",
        "left": "0",
        "bottom": "0",
        "z-index": "9999",
        "zoom": "1"
    });
    //gif样式
    $('#loadingGif').css({
        "position": "absolute",
        "top": "50%",
        "left": "50%",
    });

}
//加载完去掉动画
function removeLoading() {
    $('#loadingMask').remove();
}

// (function ($) {
//     //备份jquery的ajax方法
//     var _ajax = $.ajax;
//     //重写jquery的ajax方法
//     $.ajax = function (opt) {
//         //备份opt中error和success方法
//         var fn = {
//             error: function (XMLHttpRequest, textStatus, errorThrown) {
//             },
//             success: function (data, textStatus) {
//             }
//         }
//         if (opt.error) {
//             fn.error = opt.error;
//         }
//         if (opt.success) {
//             fn.success = opt.success;
//         }
//         if (opt.loading) {
//             loading();
//         }
//         //扩展增强处理
//         var _opt = $.extend(opt, {
//             error: function (XMLHttpRequest, textStatus, errorThrown) {
//                 //错误方法增强处理
//                 fn.error(XMLHttpRequest, textStatus, errorThrown);
//             },
//             success: function (data, textStatus) {
//                 //成功回调方法增强处理
//                 fn.success(data, textStatus);
//             },
//             complete: function (httpRequest, status) {
//                 //统一的结束状态显示
//                 if (opt.loading) {
//                     removeLoading();
//                 }
//             }
//         });
//         _ajax(_opt);
//     };
// })(jQuery);

//获取首付比例
function getFirstRatio(Num, callback) {
    var resultArr = [];
    $.get(basePath + "/data/audit/first_pay_account_data.do", function (data) {
        if (data.status == 0) {
            $.each(data.data, function (i, item) {
                var minAccount = item.minAccount;
                var maxAccount = item.maxAccount;
                if (maxAccount == 7500) {
                    if (minAccount <= Num && Num <= maxAccount) {
                        resultArr.push(item.firstRatio);
                    }
                } else {
                    if (minAccount <= Num && Num < maxAccount) {
                        resultArr.push(item.firstRatio);
                    }
                }
            });
            callback(resultArr);
        } else {
            textLog(data.message);
        }
    })
}

//获取分期期数
function getStages(Num, callback) {
    var termArr = [];
    var serviceArr = [];
    $.get(basePath + "/data/audit/business_type_data.do", function (data) {
        if (data.status == 0) {
            $.each(data.data, function (i, item) {
                var lowprincipal = item.lowprincipal;
                var tallprincipal = item.tallprincipal;
                if (lowprincipal <= Num && Num <= tallprincipal) {
                    termArr.push(item.term);
                    serviceArr.push(item.customerservicerates);
                }
            });
            callback(termArr, serviceArr);
        } else {
            textLog(data.message);
        }
    })
}

//百度统计 微信端
(function () {
    var shopReg = /^\/wallet\/shop\/hot.html$/; //买买提微信-分期商新版首页 /wallet/shop/hot.html
    var hotReg = /^\/wechat\/hot\/hot.html$/; //买买提微信-分期商城 /wechat/hot/hot.html
    var stagesReg = /^\/wechat\/stages.html$/; //买买提我要分期页面 /wechat/stages.html
    var mmtReg = /^\/wechat\/activity\/stagingShopping\/mmt.html$/; //买买提广告 /wechat/activity/stagingShopping/mmt.html
    var appNewUserReg = /^\/wallet\/activity\/newUser\/newUserApp.html$/;//新人礼站内版
    //站外版本
    var outIndex = /^\/wallet\/activity\/newUser\/outIndex.html$/;// 站外未注册
    var newIndex = /^\/wallet\/activity\/newUser\/newIndex.html$/;// 站外已注册
    //var getLjqx = /^\/wallet\/activity\/newUser\/newIndex.html?channel=1988$/;//弹窗立即取现
  //  var otherDownLoad = /^\/android\prd\/mmt-wallet.apk$/;//站外已注册-立即取现-其他浏览器
    var pathname = window.location.pathname;
    var _hmt = _hmt || [];
    var base = "//hm.baidu.com/hm.js?";
    var hm = document.createElement("script");
    var query = GetQueryString("channel");
    if (hotReg.test(pathname)) {
        hm.src = base + "9c2d2bcfbfe9ee972ec0e2542bdb353b";
    } else if (stagesReg.test(pathname)) {
        hm.src = base + "faeb1183becf85d4ac4658c023c81845";
    } else if (mmtReg.test(pathname)) {
        if (query == "1") {
            hm.src = base + "89e7fff625593ff86426e184274be298";
        } else {
            hm.src = base + "30b3c979c9987959d7240b2fa5c87762";
        }
    } else if (appNewUserReg.test(pathname)) {
        if (query == "1101") {
            hm.src = base + "3fdbcb517c22f09519b1f8526dbe9612";
        } else {
            hm.src = base + "93730cb78e5b6d142a6046ae3afdd102";
        }
    }
    else if (outIndex.test(pathname)) {
        if (query == "1204") {
            hm.src = base + "0505bf5d2776b5c32d9411aa8f840028";
        } else if (query == "1205") {
            hm.src = base + "21b960d9bb33f2b78bebd13f46fd2e77";
        } else if (query == "1401") {
            hm.src = base + "3e266cdd02ed45b5426380186583313f";
        }
        else {
            hm.src = base + "cab75afbceb771fa823084f99a37b765";
        }
    }
    else if (newIndex.test(pathname)) {
        if (query == "1204") {
            hm.src = base + "68af8df2a19a80fd2899f8733293cfa6";
        } else if (query == "1205") {
            hm.src = base + "f7e63b74f9b897c3f9b0207c6859728c";
        } else if (query == "1401") {
            hm.src = base + "32161bf84cfc73a44a34194863ba37a6";
        }
        else if (query == "1988") {
            hm.src = base + "3e7bfc008d38b941db09ba526e15271e";
        }
        else {
            hm.src = base + "f955865819c90647f2e81a82ecd89b47";
        }
    } else if (shopReg.test(pathname)) {
        hm.src = base + "fd20bac3f0ad247c21797c051b4d2608";
    }
    //else if (otherDownLoad.test(pathname)) {
    //    hm.src = base + "0575dcbe45e0b7bba0f59b14bfa0b24f";
    //}
    else {
        return;
    }
    //hm.src = "//hm.baidu.com/hm.js?cc8b41849ba9c249fe9050dac399454b";
    var script = document.getElementsByTagName("script")[0];
    script.parentNode.insertBefore(hm, script);
})();

//判断是否是微信浏览器
function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

// 设置来源 1:PC,2:微信(android),3:android,4:ios,5:其他,6:android浏览器,7:ios浏览器,.8微信(ios)
var origin;
var os = function () {
    var ua = navigator.userAgent,
		isWindowsPhone = /(?:Windows Phone)/.test(ua),
		isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
		isAndroid = /(?:Android)/.test(ua),
		isFireFox = /(?:Firefox)/.test(ua),
		isChrome = /(?:Chrome|CriOS)/.test(ua),
		isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
		isPhone = /(?:iPhone)/.test(ua) && !isTablet,
		isPc = !isPhone && !isAndroid && !isSymbian,
		isWechat = /(?:MicroMessenger)/.test(ua),
        isAndroidApp = /(?:wallet_android)/.test(ua),
        isiOSApp = /(?:wallet_iOS)/.test(ua);

    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc,
        isWechat: isWechat,
        isAndroidApp: isAndroidApp,
        isiOSApp: isiOSApp
    };
}();

! function() {
    if (os.isPc) {
        origin = 1;
    } else if (os.isWechat) {
        if (os.isAndroid) {
            origin = 2;
        } else if (os.isPhone) {
            origin = 8;
        }
    } else {
        if (os.isAndroidApp) {
            origin = 3;
        } else if (os.isiOSApp) {
            origin = 4;
        } else if (os.isPhone) {
            origin = 7;
        } else if (os.isAndroid) {
            origin = 6;
        } else {
            origin = 5;
        }
    }
}();

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) { }
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (arguments.length > 1 && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
            }

            return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

        for (; i < l; i++) {
            var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');

            if (key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));

//替换字符串
function replaceText(str) {
    str = str.replace("<", "& lt;").replace(">", "& gt;");
    str = str.replace("\\x3c", "& lt;").replace("\\x3e", "& gt;");
    str = str.replace("%253c", "& lt;").replace("%253e", "& gt;");
    str = str.replace("%253C", "& lt;").replace("%253E", "& gt;");
    str = str.replace("%3c", "& lt;");
    str = str.replace("%3C", "& lt;");
    str = str.replace("'", "& #39;");
    str = str.replace("eval\\((.*)\\)", "");
    str = str.replace("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']", "\"\"");
    str = str.replace("script", "");
}

// 广告位设置
(function () {
    if (!$.cookie('adPosition')) {
        adPosition = GetQueryString("item");
        if (adPosition) {
            $.cookie('adPosition', adPosition, { expires: 7, path: '/' })
        }
    }
})();

//返回顶部
$(function () {
    $(window).scroll(function () {
        if ($(window).scrollTop() > 900) {
            $(".back").show();
        } else {
            $(".back").hide();
        }
    });
});

function goTop() {
    $(window).scrollTop(0);
};

//埋点数据统计
function addStatistics(options) {
    try {
        var opt = options ? options : {};
        var spm = opt.spm ? opt.spm : "";
        var eventType = opt.eventType ? opt.eventType : "VIEW";
        var eventItem = opt.eventItem ? opt.eventItem : location.href;
        var operationType = opt.operationType ? opt.operationType : 0;
        var url = basePath + "/event/addEvent.do?r=" + Math.random();
        var data = { "eventType": eventType, "eventItem": eventItem, "operationType": operationType, "spm": spm };
        $.post(url, data, function (jsonData) {
            var result = typeof (jsonData);
            if (result == "string") {
                jsonData = JSON.parse(jsonData);
            }
            if (jsonData.status == "0") {
                console.log("success!");
            } else {
                showTit(jsonData.message);
            }
        }, "json");
    }
    catch (ex) {
        if (window.console) {
            console.log(ex);
        }
    }
}

$(function() {
    // 行为数据统计
    try {
        window.webkit.messageHandlers.getDeviceInfo.postMessage();
        mobile.getDeviceInfo();
    } catch (error) {

    }
})

function cb_getDeviceInfo(json) {
    var info = null

    try {
        info = JSON.parse(json)
    } catch (error) {
        info = {}
    }

    info.userId && !$.cookie('userId') && $.cookie('userId', info.userId, { path: '/'})
    info.deviceId && !$.cookie('deviceId') && $.cookie('deviceId', info.deviceId, { path: '/'})
}