

!function(a){var b=!1;if("function"==typeof define&&define.amd&&(define(a),b=!0),"object"==typeof exports&&(module.exports=a(),b=!0),!b){var c=window.Cookies,d=window.Cookies=a();d.noConflict=function(){return window.Cookies=c,d}}}(function(){function a(){for(var a=0,b={};a<arguments.length;a++){var c=arguments[a];for(var d in c)b[d]=c[d]}return b}function b(c){function d(b,e,f){var g;if("undefined"!=typeof document){if(arguments.length>1){if(f=a({path:"/"},d.defaults,f),"number"==typeof f.expires){var h=new Date;h.setMilliseconds(h.getMilliseconds()+864e5*f.expires),f.expires=h}f.expires=f.expires?f.expires.toUTCString():"";try{g=JSON.stringify(e),/^[\{\[]/.test(g)&&(e=g)}catch(a){}e=c.write?c.write(e,b):encodeURIComponent(String(e)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),b=encodeURIComponent(String(b)),b=b.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),b=b.replace(/[\(\)]/g,escape);var i="";for(var j in f)f[j]&&(i+="; "+j,f[j]!==!0&&(i+="="+f[j]));return document.cookie=b+"="+e+i}b||(g={});for(var k=document.cookie?document.cookie.split("; "):[],l=/(%[0-9A-Z]{2})+/g,m=0;m<k.length;m++){var n=k[m].split("="),o=n.slice(1).join("=");'"'===o.charAt(0)&&(o=o.slice(1,-1));try{var p=n[0].replace(l,decodeURIComponent);if(o=c.read?c.read(o,p):c(o,p)||o.replace(l,decodeURIComponent),this.json)try{o=JSON.parse(o)}catch(a){}if(b===p){g=o;break}b||(g[p]=o)}catch(a){}}return g}}return d.set=d,d.get=function(a){return d.call(d,a)},d.getJSON=function(){return d.apply({json:!0},[].slice.call(arguments))},d.defaults={},d.remove=function(b,c){d(b,"",a(c,{expires:-1}))},d.withConverter=b,d}return b(function(){})});function getUrlParam(a){try{var b=new RegExp("[\\?&]"+a+"=([^&#]*)").exec(window.location.href);return null==b?"":b[1]}catch(a){return""}}
function isNotBlank(r){return!isBlank(r)}function isBlank(r){try{return!r||void 0===r||0===r.length}catch(r){return console.error("Error in isBlank method: "+r),!1}}function stringReplaceAll(r,t,e){try{return r.replace(new RegExp(t,"g"),e)}catch(r){console.error("Error in stringReplaceAll method: "+r)}}function extractHostNameFromUrl(r){var t="";try{isBlank(r)||(t=(t=(t=r.indexOf("//")>-1?r.split("/")[2]:r.split("/")[0]).split(":")[0]).split("?")[0])}catch(r){console.error("Error in extractHostNameFromUrl method: "+r)}return t}function getJavaScriptArray(r){var t="";try{if(r&&r.length>0)for(t=r.split(","),i=0;i<t.length;i++)/\[/.test(t[i])&&(t[i]=stringReplaceAll(t[i],"\\[","")),/\]/.test(t[i])&&(t[i]=stringReplaceAll(t[i],"\\]",""))}catch(r){console.error("Error in getJavaScriptArray method: "+r)}return t}function getTrafficSourceMatchString(r){var t="";try{var e=getJavaScriptArray(r);if(e.length>0)for(i=0;i<e.length;i++){var n=e[i].trim();isBlank(n)||"null"===n||(n=stringReplaceAll(n,"\\.","\\."),i<e.length-1?t=t+n+"|":t+=n)}}catch(r){console.error("Error in getTrafficSourceMatchString method: "+r)}return t}function getOnly(t,n){try{return t&&0!=t.trim().length?n>=t.trim().length?t:t.slice(0,n):t}catch(n){return t}}


function processHttpCampaign(campaignBean, campainSection){
    campaignBean = processTsbCampaign(campaignBean, campainSection, null);
    return campaignBean;
}
function processTsbCampaign(campaignBean, campainSection, trafficSourceBean){
    try{
        var setCookieFlag = false;
        if(campaignBean==null || !campaignBean){
            return campaignBean;
        }

        if(campaignBean.isCampaignEnabled==false){
            return campaignBean;
        }
        var staticHtmlBanner = "";
        var ecid = getOnly(getUrlParam("ecid"), 255);
        if(!ecid){ ecid = getOnly(getUrlParam("ECID"), 255); }
        var pageUrl = getOnly(window.location.hostname + window.location.pathname, 1000);
        campaignBean = processEcomUrlParams(campaignBean, ecid);

        if(ecid && ecid.length>0){
            campaignBean.doc_ref_type = 'CAMPAIGN';
        }else{
            campaignBean.doc_ref_type = 'DIRECT';
        }

        if(campaignBean && campaignBean!=null && ecid){
            campaignBean.ecid = ecid;
            campaignBean.pageUrl = pageUrl;
            setCookieFlag = true;
        }
        else if(isBlank(ecid)) {

            var campaignCookieData = Cookies.getJSON('adt_campaign_data');
            var refererURL = document.referrer;
            var refererHost = extractHostNameFromUrl(refererURL);
            var currURL = window.location.hostname;

            if(campaignCookieData && campaignCookieData!=undefined &&
                (campaignCookieData.doc_ref_type == 'DIRECT' || campaignCookieData.doc_ref_type == 'CAMPAIGN' ) &&
                ( isBlank(refererHost) || (currURL == refererHost) ) ){

                console.info("- processTsbCampaign - campaignCookieData: ",  campaignCookieData);

                if(((campaignCookieData.isCampaignCarryOverSection == false) && (campaignBean.sectionPath != campaignCookieData.sectionPath) ) ||
                    (campaignCookieData.isCampaignCarryOver == false && campaignCookieData.pageUrl != pageUrl)){
                    return campaignBean
                }
                else{
                    if(campaignCookieData.tfn_indicator == true){

                        campaignCookieData.tfn_desktop = campaignBean.tfn_desktop;
                        campaignCookieData.tfn_mobile = campaignBean.tfn_mobile;
                    }
                    if(campaignCookieData.dns_indicator == true){

                        campaignCookieData.dnis_desktop = campaignBean.dnis_desktop;
                        campaignCookieData.dnis_mobile = campaignBean.dnis_mobile;
                    }
                    if(campaignCookieData.chat_indicator == true){

                        campaignCookieData.chat_desktop = campaignBean.chat_desktop;
                        campaignCookieData.chat_mobile = campaignBean.chat_mobile;
                    }
                    campaignBean = campaignCookieData;
                    ecid = campaignCookieData.ecid;
                }
            }
            else{
                campaignBean = processTsbData(campaignBean, trafficSourceBean);
                setCookieFlag = true;
            }

        }

        if(isBlank(ecid)){
            return campaignBean;
        }

        var  url = "/content/campaign/";
        if (campainSection && campainSection.trim().length > 0) {
            url += campainSection + "/";
        }

        if (campaignBean.section && campaignBean.section.length > 0) {
            url += campaignBean.section + "/";
        }

        if (ecid.length > 0) {
            url += ecid;
        }

        url += ".model.json";
        console.log("- processTsbCampaign - campaign url: ", url);
        $.ajax({
            type:'GET',
            url:url,
            dataType:'json',
            timeout:30000,
            async:false,
            success:function(data){
                if (data) {
                    console.log("- processTsbCampaign - campaign http data: ", data);
                    campaignBean.ecid = ecid;

                    var tfnD = (data['tfnDesktop']) ? data['tfnDesktop'] : "";
                    if(tfnD && tfnD.length>0){
                        campaignBean.tfn_desktop = tfnD;
                    }

                    var tfnM = (data['tfnMobile']) ? data['tfnMobile'] : "";
                    if(tfnM && tfnM.length>0){
                        campaignBean.tfn_mobile = tfnM;
                    }

                    if(tfnM.length == 0 && tfnD.length == 0 ){
                        campaignBean.tfn_indicator = true;
                    }


                    var dnsD = (data['dnisDesktop']) ? data['dnisDesktop'] : "";
                    if(dnsD && dnsD.length>0){
                        campaignBean.dnis_desktop = dnsD;
                    }

                    var dnsM = (data['dnisMobile']) ? data['dnisMobile'] : "";
                    if(dnsM && dnsM.length>0){
                        campaignBean.dnis_mobile = dnsM;
                    }

                    if(dnsM.length == 0 && dnsD.length == 0 ){
                        campaignBean.dns_indicator = true;
                    }

                    var chM = (data['chatMobile']) ? data['chatMobile'] : "";
                    if(chM && chM.length>0){
                        campaignBean.chat_mobile = chM;
                    }

                    var chD = (data['chatDesktop']) ? data['chatDesktop'] : "";
                    if(chD && chD.length>0){
                        campaignBean.chat_desktop = chD;
                    }
                    if(chM.length == 0 && chD.length == 0 ){
                        campaignBean.chat_indicator = true;
                    }

                    campaignBean.isCampaignCarryOver = (data.isCampaignCarryOver) ? data.isCampaignCarryOver : true;
                    if(campaignBean.isCampaignCarryOver==0 || campaignBean.isCampaignCarryOver == "false"){campaignBean.isCampaignCarryOver=false}
                    else if(campaignBean.isCampaignCarryOver==1 || campaignBean.isCampaignCarryOver == "true"){campaignBean.isCampaignCarryOver=true}

                    campaignBean.isCampaignCarryOverSection = (data.isCampaignCarryOverSection) ? data.isCampaignCarryOverSection : false;
                    if(campaignBean.isCampaignCarryOverSection==0 || campaignBean.isCampaignCarryOverSection == "false"){campaignBean.isCampaignCarryOverSection=false}
                    else if(campaignBean.isCampaignCarryOverSection==1 || campaignBean.isCampaignCarryOverSection == "true"){campaignBean.isCampaignCarryOverSection=true}

                    campaignBean.banner_image_desktop_xl = (data.desktopXLBackgroundImage) ? data.desktopXLBackgroundImage : "";
                    campaignBean.banner_image_desktop = (data.backgroundImage) ? data.backgroundImage : "";
                    campaignBean.banner_image_tablet = (data.tabletBackgroundImage) ? data.tabletBackgroundImage : "";
                    campaignBean.banner_image_mobile = (data.mobileBackgroundImage) ? data.mobileBackgroundImage : "";

                    staticHtmlBanner = processCampaignBanner(data, campaignBean, campaignCookieData, pageUrl);

                    processPromotionBanner(data);

                    setCookieFlag = true;
                    console.log("- processTsbCampaign - campaignBean: ", campaignBean);
                }
                else{
                    console.log("- processTsbCampaign - campaign http data is empty: ",  data);
                }
            },
            error:function(){
                console.log("Failed HTTP request for campaignBean: ", campaignBean);
            }

        });


    }catch (error){
        console.error("Error in processHttpCampaign method: " + error);
    }
    finally {
        if(setCookieFlag==true){
            campaignBean.timestamp = new Date().toUTCString();
            Cookies.set('adt_campaign_data', campaignBean, { expires: campaignBean.cbCookieTime });
        }
        campaignBean.staticBannerOverride = staticHtmlBanner;
        console.info("- processTsbData - Using Traffic Source: ",  campaignBean.doc_ref_type);
    }
    return campaignBean;
}

function processCampaignBanner(data,campaignBean, campaignCookieData, pageUrl) {
    try{
        var bannerHtml = "";
        if(data.bannerOverride){
            if( data.bannerOverride == true || data.bannerOverride=="true" || data.bannerOverride==1){
                campaignBean.bannerOverride = true;
            }
            else{
                campaignBean.bannerOverride == false;
            }
        }
        else{
            campaignBean.bannerOverride == false;
        }

        var bannerHtmlTemp = "";

        if( campaignCookieData && (campaignCookieData.isCampaignCarryOverBanner == false && campaignCookieData.pageUrl != pageUrl)){
            campaignBean.isCampaignCarryOverBannerImage = false;
            return bannerHtmlTemp;
        }
        else{
            campaignBean.isCampaignCarryOverBannerImage = true;
        }

        try{
            if(data[':items'] && data[':items'].bannerCampaign && data[':items'].bannerCampaign.htmlBody){
                bannerHtmlTemp += data[':items'].bannerCampaign.htmlBody;
            }
        }catch(err){ console.error("bannerCampaign: " + err);}

        try{
            if( campaignBean.bannerOverride && data.staticBannerOverride){
                bannerHtmlTemp += data.staticBannerOverride;
            }
        }catch(err){ console.error("staticBannerOverride: " + err);}

        if(bannerHtmlTemp){
            bannerHtml = window.btoa(bannerHtmlTemp);
        }

    }catch(err){ console.error("Error in processCampaignBanner method: " + err);}
    return bannerHtml;
}


var promotionBean = {};

$(function () {
    checkUpdatePromotion(promotionBean)
})

function processPromotionBanner(data) {
    try{
        if(!data){return;}
        promotionBean.promotionalBanner = (data.promotionalBanner && data.promotionalBanner != "disabled") ? data.promotionalBanner : "disabled";
        promotionBean.promotionalBannerMobile = (data.promotionalBannerMobile && data.promotionalBannerMobile!= "disabled") ? data.promotionalBannerMobile : "disabled";

        if(( data.promotionalBanner!="disabled") || (data.promotionalBannerMobile!="disabled" )){
            promotionBean.promotionalBannerHtml = (data.promotionalBannerHtml) ? data.promotionalBannerHtml : "";
        }

    }catch(err){ console.error("Error in promotionalBanner method: " + err);}

    try{
        promotionBean.promotionalModal = (data.promotionalModal && data.promotionalModal != "disabled") ? data.promotionalModal : "disabled";
        if(data.promotionalModal!="disabled"){
            promotionBean.promotionalModalHtml = (data.promotionalModalHtml) ? data.promotionalModalHtml : "";
        }
    }catch(err){ console.error("Error in promotionalModal method: " + err);}
}


function checkUpdatePromotion(campaignData) {

    try{

        if(campaignData==null || !campaignData){ return;}

        if (campaignData.promotionalBannerHtml && campaignData.promotionalBannerHtml != ""){
            let commonScript = '<script>function closePromotionBannerOverride(btnObj){try{if(!btnObj){return;}$(btnObj).closest(".coreheader").find(".promotion-banner-override-content").slideUp(500, function(){window.ADTApp.navigation.Events.adjustNavPadding();}); var jd=JSON.stringify({exists:"true"}); Cookies.set("promontion_banner_cookie", jd); window.ADTApp.navigation.DOM.promotionBannerNavShow=false;}catch (e){console.info("closePromotionBannerOverride error: " + e)}}</script>';
            let commonStyle = "<style>.promotion-banner-override-content{position: relative;} .promotion-banner-override-content .pbclose-btn{color:#898e91;font-size:21px;text-transform:lowercase}.promotion-banner-override-content .pbclose-btn{position:absolute;right:5px;top:5px;width:36px;height:30px;opacity:1}.promotion-banner-override-content .pbclose-btn:hover{opacity:.7}.pbclose-btn:after,.promotion-banner-override-content .pbclose-btn:before{position:absolute;left:15px;content:' ';height:16px;width:2px;background-color:#898E91}.promotion-banner-override-content .pbclose-btn:before{transform:rotate(45deg)}.promotion-banner-override-content .pbclose-btn:after{transform:rotate(-45deg)}</style>";
            let closeBtnHtml = "<a href='javascript:void(0);' class='pbclose-btn' onclick='closePromotionBannerOverride(this)' ></a>"

            if (campaignData.promotionalBanner && campaignData.promotionalBanner != "disabled") {
                if (campaignData.promotionalBanner === "top") {
                    let style = commonStyle + "<style>#mobile-tap-to-call-sticky,.c-mobile-navbar,.global-nav-container{position:relative}.navigation-wrapper{position:fixed;width:100%;z-index:1030;top:-2px}.c-mobile-navbar{top:0}</style><div id='promotion-banner-override-content-desktop' class='promotion-banner-override-content' style='display:none'>";
                    let html = style + campaignData.promotionalBannerHtml + closeBtnHtml + "</div>" + commonScript;
                    $(".promotion-banner-top-override").html(html);
                    $(".promotion-banner-bottom-override").html("");
                } else if (campaignData.promotionalBanner === "bottom") {
                    let html = commonStyle + "<div id='promotion-banner-override-content-desktop' class='promotion-banner-override-content' style='display:none'>" + campaignData.promotionalBannerHtml + closeBtnHtml + "</div>" + commonScript;
                    $(".promotion-banner-bottom-override").html(html);
                    $(".promotion-banner-top-override").html("");
                }
            }
            if (campaignData.promotionalBannerMobile && campaignData.promotionalBannerMobile != "disabled") {
                if (campaignData.promotionalBannerMobile === "top") {
                    let html = commonStyle + "<div id='promotion-banner-override-content-mobile' class='promotion-banner-override-content' style='display:none'>" + campaignData.promotionalBannerHtml + closeBtnHtml+ "</div>" + commonScript;
                    $(".promotion-banner-mobile-top-override").html(html);
                    $(".promotion-banner-mobile-bottom-override").html("");
                } else if (campaignData.promotionalBannerMobile === "bottom") {
                    let html = commonStyle + "<div id='promotion-banner-override-content-mobile' class='promotion-banner-override-content' style='display:none'>" + campaignData.promotionalBannerHtml + closeBtnHtml + "</div>" + commonScript;
                    $(".promotion-banner-mobile-bottom-override").html(html);
                    $(".promotion-banner-mobile-top-override").html("");
                }
            }
        }
        if (campaignData.promotionalModalHtml && campaignData.promotionalModalHtml != ""){
            if (campaignData.promotionalModal && campaignData.promotionalModal != "disabled") {
                let style = '<style>.promotion-modal-override{color: black;}.promotion-modal-override .promotion-modal-content{background-color: white; width:100%}.promotion-modal-override .pmclose-btn{color: black; font-size: 21px; text-transform: lowercase;}.promotion-modal-override .pmclose-btn{position: absolute; right: -5px; top: 7px; width: 36px; height: 30px; opacity: 1;}.promotion-modal-override .pmclose-btn:hover{opacity: .7;}.promotion-modal-override .pmclose-btn:before, .promotion-modal-override .pmclose-btn:after{position: absolute; left: 15px; content: \' \'; height: 16px; width: 2px; background-color: black;}.promotion-modal-override .pmclose-btn:before{transform: rotate(45deg);}.promotion-modal-override .pmclose-btn:after{transform: rotate(-45deg);}</style>';
                let script = "<script>try{$('#promotion-modal-id').on('hide.bs.modal', function (e){var jd=JSON.stringify({exists:'true'}); Cookies.set('promontion_modal_cookie', jd);}); var pmCookie=Cookies.get('promontion_modal_cookie'); if(!pmCookie || pmCookie==undefined ){$('html').bind(\"mouseleave\", function (){$('#promotion-modal-id').modal({keyboard: true}); $(\"html\").unbind(\"mouseleave\");});}}catch (e){console.info(\"PromotionModalOverride init error: \" + e)}</script>";
                let html =style + '<div class="promotion-modal modal fade" id="promotion-modal-id" tabindex="-1" role="dialog" aria-labelledby="promotional-modal-title" aria-hidden="true"> <div class="promotion-modal-wrapper modal-dialog modal-dialog-centered" role="document"> <div class="promotion-modal-content modal-content"> <div class="promotion-modal-head modal-header"> <a href="javascript:void(0);" class="pmclose-btn" data-dismiss="modal" aria-label="Close"></a> </div><div class="promotion-modal-body modal-body">'+ campaignData.promotionalModalHtml+' </div></div></div></div>' + script;
                $(".promotion-modal-override").html(html)
            }
        }

    }catch(err){
        console.error("Error in checkUpdatePromotion method: " + err);
    }

}
function processTsbData(campaignBean, trafficSourceBean){

    try{
        var setCookieFlag = false;
        if(!trafficSourceBean){
            return campaignBean
        }

        var tsbCookieData = Cookies.getJSON('adt_campaign_traffic_source_data');
        var refererURL = document.referrer;
        var refererHost = extractHostNameFromUrl(refererURL);
        var currURL = window.location.hostname;
        var tsType = "";

        if(isNotBlank(refererURL) && tsbCookieData && tsbCookieData.doc_ref_type && (currURL == refererHost)){
            tsType = tsbCookieData.doc_ref_type;
        }
        else if(isNotBlank(refererURL) && (currURL == refererHost)){
            return campaignBean;
        }
        else if(isNotBlank(refererURL) && tsbCookieData && tsbCookieData.doc_ref_type && (currURL != refererHost)){

            setCookieFlag = true;
        }
        else if (isNotBlank(tsbCookieData) && isNotBlank(tsbCookieData.refererHost)) {
            console.info("- processTsbData - tsbCookieData: ",  tsbCookieData);
            tsType = tsbCookieData.doc_ref_type;
            refererURL = tsbCookieData.refererHost;
        } else if(isBlank(refererURL)) {
            return campaignBean;
        }
        else{
            setCookieFlag = true;
        }
        console.info("- processTsbData - Referer URL: ",  refererURL);

        trafficSourceBean.sectionPath = campaignBean.sectionPath;
        var tscd = { refererHost : refererHost, };

        if(tsType == 'SEO' || isSeoTrafficSource(trafficSourceBean, refererHost)) {
            campaignBean.doc_ref_type = 'SEO';
            trafficSourceBean.doc_ref_type = campaignBean.doc_ref_type;
            var tfnDesktop = trafficSourceBean.seo_tfn_desktop;
            if(!isBlank(tfnDesktop)){
                campaignBean.tfn_desktop = tfnDesktop;
            }

            var tfnMobile = trafficSourceBean.seo_tfn_mobile;
            if(!isBlank(tfnMobile)){
                campaignBean.tfn_mobile = tfnMobile;
            }

            var dnisDesktop = trafficSourceBean.seo_dnis_desktop;
            if(!isBlank(dnisDesktop)){
                campaignBean.dnis_desktop = dnisDesktop;
            }

            var dnisMobile = trafficSourceBean.seo_dnis_mobile;
            if(!isBlank(dnisMobile)){
                campaignBean.dnis_mobile = dnisMobile;
            }

            var chatDesktop = trafficSourceBean.seo_chat_desktop;
            if(!isBlank(chatDesktop)){
                campaignBean.chat_desktop = chatDesktop;
            }

            var chatMobile = trafficSourceBean.seo_chat_mobile;
            if(!isBlank(chatMobile)){
                campaignBean.chat_mobile = chatMobile;
            }

        } else if(tsType == 'SOCIAL' ||  isSocialTrafficSource(trafficSourceBean, refererHost)) {
            campaignBean.doc_ref_type = 'SOCIAL';
            trafficSourceBean.doc_ref_type = campaignBean.doc_ref_type;
            var tfnDesktop = trafficSourceBean.social_tfn_desktop;
            if(!isBlank(tfnDesktop)){
                campaignBean.tfn_desktop = tfnDesktop;
            }

            var tfnMobile = trafficSourceBean.social_tfn_mobile;
            if(!isBlank(tfnMobile)){
                campaignBean.tfn_mobile = tfnMobile;
            }

            var dnisDesktop = trafficSourceBean.social_dnis_desktop;
            if(!isBlank(dnisDesktop)){
                campaignBean.dnis_desktop = dnisDesktop;
            }

            var dnisMobile = trafficSourceBean.social_dnis_mobile;
            if(!isBlank(dnisMobile)){
                campaignBean.dnis_mobile = dnisMobile;
            }

            var chatDesktop = trafficSourceBean.social_chat_desktop;
            if(!isBlank(chatDesktop)){
                campaignBean.chat_desktop = chatDesktop;
            }

            var chatMobile = trafficSourceBean.social_chat_mobile;
            if(!isBlank(chatMobile)){
                campaignBean.chat_mobile = chatMobile;
            }

        } else {
            campaignBean.doc_ref_type = 'REFERRED';
            trafficSourceBean.doc_ref_type = campaignBean.doc_ref_type;
            var tfnDesktop = trafficSourceBean.referred_tfn_desktop;
            if(!isBlank(tfnDesktop)){
                campaignBean.tfn_desktop = tfnDesktop;
            }

            var tfnMobile = trafficSourceBean.referred_tfn_mobile;
            if(!isBlank(tfnMobile)){
                campaignBean.tfn_mobile = tfnMobile;
            }

            var dnisDesktop = trafficSourceBean.referred_dnis_desktop;
            if(!isBlank(dnisDesktop)){
                campaignBean.dnis_desktop = dnisDesktop;
            }

            var dnisMobile = trafficSourceBean.referred_dnis_mobile;
            if(!isBlank(dnisMobile)){
                campaignBean.dnis_mobile = dnisMobile;
            }

            var chatDesktop = trafficSourceBean.referred_chat_desktop;
            if(!isBlank(chatDesktop)){
                campaignBean.chat_desktop = chatDesktop;
            }

            var chatMobile = trafficSourceBean.referred_chat_mobile;
            if(!isBlank(chatMobile)){
                campaignBean.chat_mobile = chatMobile;
            }

        }


    }catch (error){
        console.error("Error in processTsbData method: " + error);
    }finally{
        if(setCookieFlag){
            tscd.doc_ref_type = trafficSourceBean.doc_ref_type;
            tscd.timestamp = new Date().toUTCString();
            Cookies.set('adt_campaign_traffic_source_data', tscd, { expires: trafficSourceBean.tsbCookieTime });
            console.info("- processTsbData - Creating Traffic Source Cookie: " + tscd.doc_ref_type);
        }
    }
    return campaignBean;
}

function isSocialTrafficSource(trafficSourceBean, refererHost){
    try {
        if(trafficSourceBean.doc_ref_type == 'SOCIAL'){
            return true;
        }
        var socialList = trafficSourceBean.social_sites_list;
        if(!socialList){
            return false;
        }
        var isSocial = isTrafficSourceMatch(socialList, refererHost);
        return isSocial;
    }catch (error){
        console.error("Error in isSeoTrafficSource method: " + error);
        return false;
    }
}

function isSeoTrafficSource(trafficSourceBean, refererHost){
    try {
        if(trafficSourceBean.doc_ref_type == 'SEO'){
            return true;
        }
        var seoList = trafficSourceBean.seo_sites_list;
        if(!seoList){
            return false;
        }
        var isSeo = isTrafficSourceMatch(seoList, refererHost);
        return isSeo;
    }catch (error){
        console.error("Error in isSeoTrafficSource method: " + error);
        return false;
    }
}

function isTrafficSourceMatch(trafficSourceList, refererHost) {
    var isTrafficSourceMatch = false;
    try {
        if(isBlank(trafficSourceList) || isBlank(refererHost)){
            return false;
        }
        var CONST_WWW_DOT = 'www.';
        var CONST_EMPTY = '';
        if(new RegExp('^www\\.', 'i').test(refererHost)){
            refererHost = refererHost.replace(CONST_WWW_DOT,CONST_EMPTY);
        }
        var trafficSourceArrayList = getJavaScriptArray(trafficSourceList);
        if (trafficSourceArrayList.length > 0 && isNotBlank(refererHost)) {
            for (var i = 0; i < trafficSourceArrayList.length; i++) {
                var trafficSource = trafficSourceArrayList[i].trim();
                if(new RegExp('^www\\.', 'i').test(trafficSource)){
                    trafficSource = trafficSource.replace(CONST_WWW_DOT,CONST_EMPTY);
                }
                if(isNotBlank(trafficSource) && (trafficSource == refererHost)){
                    return true;
                }
            }
        }
    } catch (error) {
        console.error("Error in isTrafficSourceMatch method: " + error)
    }
    return isTrafficSourceMatch;
}

function processEcomUrlParams(campaignBean, ecid){
    try{
        if(!campaignBean){
            return campaignBean;
        }

        var pageUrl = getOnly(window.location.hostname + window.location.pathname, 1000);
        var subid = getOnly(getUrlParam("subid"), 255);
        var tr = getOnly(getUrlParam("tr"), 255);

        if(subid.length > 0 && tr.length > 0 ){
            campaignBean.subid = subid;
            campaignBean.tr = tr;
        }

    }catch (error){
        console.error("Error in processEcomUrlParams method: " + error);
        return campaignBean;
    }
    return campaignBean;
}

function initializeConfigBean() {
    var cb = {};
    try{
        cb = Cookies.getJSON('adt_configurator');
        if(!cb){
            cb = Cookies.getJSON('adt_configurator_uu');
            if(!cb){
                cb = {};
                return cb;
            }
        }
    }catch(err){
        console.error("error in initializeConfigBean(): " + err);
    }
    return cb;
}

function processAEMSourceParamsData(campaignBean) {
    try{

        var aemSourceParamsBean;
        var aemSourceParamsCookieData = Cookies.getJSON('aem_source_params');
        if(!!aemSourceParamsCookieData){
            var tempC = (campaignBean.section === "home" || campaignBean.section === "none") ? 'resi' : (campaignBean.section === "business") ? 'business' : campaignBean.section;
            var tempE = (campaignBean.ecid && campaignBean.ecid != 'default') ? campaignBean.ecid : 'none';
            if(aemSourceParamsCookieData.ecid_value == tempE && aemSourceParamsCookieData.channel == tempC){
                aemSourceParamsBean = aemSourceParamsCookieData;
                console.info("- processAEMSourceParamsData - AEM Source Parameters Cookie already exists ");
                return aemSourceParamsBean;
            } else{
                aemSourceParamsCookieData = null;
            }
        }

        var aemSourceParamsBean_Channel = (campaignBean.section === "home" || campaignBean.section === "none") ? 'resi' : (campaignBean.section === "business") ? 'business' : campaignBean.section;
        var aemSourceParamsBean_Ecid = campaignBean.ecid;
        var aemSourceParamsBean_Source = (!!aemSourceParamsBean_Ecid && aemSourceParamsBean_Ecid != 'default') ? 'campaign' : campaignBean.doc_ref_type.toLowerCase();
        var aemSourceParamsBean_DnisDesktop;
        var aemSourceParamsBean_DnisMobile;
        var aemSourceParamsBean_ChatDesktop;
        var aemSourceParamsBean_ChatMobile;
        var aemSourceParamsBean_TfnDesktop;
        var aemSourceParamsBean_TfnMobile;
        var aemSourceParamsBean_DeviceType = (isMobileDeviceCheck()) ? 'Mobile' : 'Desktop';

        if(aemSourceParamsBean_Source == "campaign"){
            aemSourceParamsBean_DnisDesktop = campaignBean.dnis_desktop;
            aemSourceParamsBean_DnisMobile = campaignBean.dnis_mobile;
            aemSourceParamsBean_ChatDesktop = campaignBean.chat_desktop;
            aemSourceParamsBean_ChatMobile = campaignBean.chat_mobile;
            aemSourceParamsBean_TfnDesktop = campaignBean.tfn_desktop;
            aemSourceParamsBean_TfnMobile = campaignBean.tfn_mobile;
        } else {
            var AEMSourceParamsJSON = getAEMSourceParamsJSON();
            if(!!AEMSourceParamsJSON){
                if(aemSourceParamsBean_Channel == "resi" || aemSourceParamsBean_Channel == "support"){
                    if(aemSourceParamsBean_Source == "social"){
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.resi.social.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.resi.social.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.resi.social.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.resi.social.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.resi.social.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.resi.social.tfn_mobile;
                    } else if(aemSourceParamsBean_Source == "referred") {
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.resi.referred.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.resi.referred.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.resi.referred.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.resi.referred.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.resi.referred.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.resi.referred.tfn_mobile;
                    } else if(aemSourceParamsBean_Source == "seo") {
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.resi.seo.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.resi.seo.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.resi.seo.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.resi.seo.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.resi.seo.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.resi.seo.tfn_mobile;
                    } else if(aemSourceParamsBean_Source == "direct") {
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.resi.direct.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.resi.direct.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.resi.direct.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.resi.direct.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.resi.direct.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.resi.direct.tfn_mobile;
                    }
                } else if(aemSourceParamsBean_Channel == "business"){
                    if(aemSourceParamsBean_Source == "social"){
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.business.social.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.business.social.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.business.social.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.business.social.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.business.social.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.business.social.tfn_mobile;
                    } else if(aemSourceParamsBean_Source == "referred") {
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.business.referred.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.business.referred.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.business.referred.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.business.referred.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.business.referred.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.business.referred.tfn_mobile;
                    } else if(aemSourceParamsBean_Source == "seo") {
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.business.seo.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.business.seo.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.business.seo.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.business.seo.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.business.seo.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.business.seo.tfn_mobile;
                    } else if(aemSourceParamsBean_Source == "direct") {
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.business.direct.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.business.direct.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.business.direct.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.business.direct.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.business.direct.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.business.direct.tfn_mobile;
                    }
                } else if(aemSourceParamsBean_Channel == "health"){
                    if(aemSourceParamsBean_Source == "social"){
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.health.social.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.health.social.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.health.social.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.health.social.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.health.social.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.health.social.tfn_mobile;
                    } else if(aemSourceParamsBean_Source == "referred") {
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.health.referred.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.health.referred.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.health.referred.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.health.referred.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.health.referred.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.health.referred.tfn_mobile;
                    } else if(aemSourceParamsBean_Source == "seo") {
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.health.seo.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.health.seo.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.health.seo.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.health.seo.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.health.seo.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.health.seo.tfn_mobile;
                    } else if(aemSourceParamsBean_Source == "direct") {
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.health.direct.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.health.direct.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.health.direct.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.health.direct.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.health.direct.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.health.direct.tfn_mobile;
                    }
                } else if(aemSourceParamsBean_Channel == "commercial"){
                    if(aemSourceParamsBean_Source == "social"){
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.commercial.social.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.commercial.social.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.commercial.social.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.commercial.social.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.commercial.social.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.commercial.social.tfn_mobile;
                    } else if(aemSourceParamsBean_Source == "referred") {
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.commercial.referred.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.commercial.referred.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.commercial.referred.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.commercial.referred.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.commercial.referred.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.commercial.referred.tfn_mobile;
                    } else if(aemSourceParamsBean_Source == "seo") {
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.commercial.seo.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.commercial.seo.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.commercial.seo.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.commercial.seo.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.commercial.seo.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.commercial.seo.tfn_mobile;
                    } else if(aemSourceParamsBean_Source == "direct") {
                        aemSourceParamsBean_DnisDesktop = AEMSourceParamsJSON.commercial.direct.sales_dnis_desktop;
                        aemSourceParamsBean_DnisMobile = AEMSourceParamsJSON.commercial.direct.sales_dnis_mobile;
                        aemSourceParamsBean_ChatDesktop = AEMSourceParamsJSON.commercial.direct.chat_dnis_desktop;
                        aemSourceParamsBean_ChatMobile = AEMSourceParamsJSON.commercial.direct.chat_dnis_mobile;
                        aemSourceParamsBean_TfnDesktop = AEMSourceParamsJSON.commercial.direct.tfn_desktop;
                        aemSourceParamsBean_TfnMobile = AEMSourceParamsJSON.commercial.direct.tfn_mobile;
                    }
                }
            }
        }

        aemSourceParamsBean =  {
            "channel": aemSourceParamsBean_Channel,
            "source": aemSourceParamsBean_Source,
            "ecid_value": (!!aemSourceParamsBean_Ecid && aemSourceParamsBean_Ecid != 'default') ? aemSourceParamsBean_Ecid : 'none',
            "sales.dnis.desktop": (!!aemSourceParamsBean_DnisDesktop) ? aemSourceParamsBean_DnisDesktop : '',
            "sales.dnis.mobile": (!!aemSourceParamsBean_DnisMobile) ? aemSourceParamsBean_DnisMobile : '',
            "chat.dnis.desktop": (!!aemSourceParamsBean_ChatDesktop) ? aemSourceParamsBean_ChatDesktop : '',
            "chat.dnis.mobile": (!!aemSourceParamsBean_ChatMobile) ? aemSourceParamsBean_ChatMobile : '',
            "tfn.desktop": (!!aemSourceParamsBean_TfnDesktop) ? aemSourceParamsBean_TfnDesktop : '',
            "tfn.mobile": (!!aemSourceParamsBean_TfnMobile) ? aemSourceParamsBean_TfnMobile : '',
            "device.type": aemSourceParamsBean_DeviceType
        };

    }catch (error){
        console.error("Error in processAEMSourceParamsData method: " + error);
    }finally{
        if(!!aemSourceParamsBean && !aemSourceParamsCookieData){
            var aemCookieDomain = getAEMCookieDomain();
            aemCookieDomain = (!!aemCookieDomain) ? aemCookieDomain : '.adt.com';
            Cookies.set('aem_source_params', aemSourceParamsBean, { expires: 90 , domain : aemCookieDomain});
            console.info("- processAEMSourceParamsData - Creating AEM Source Parameters Cookie ");
        }
    }
    return aemSourceParamsBean;
}

function getAEMSourceParamsJSON(){
    try{
        var url = '/content/dam/adt6/ecomm-config/aem-source-params.json';
        var JSONData;
        $.ajax({
            type: "GET",
            url: url,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (data) {
                JSONData = data;
            },
            error: function (error) {
                console.error("HTTP Error in getAEMSourceParamsJSON method: " + error);
            }
        });
    }catch (error) {
        console.error("Error in getAEMSourceParamsJSON method: " + error);
    }
    return JSONData;
}

function isMobileDeviceCheck(){
    var check = false;
    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
            check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

function getAEMCookieDomain(){
    try{
        var domain = window.location.hostname;
        if(domain.startsWith('author-adt')){
            return "";
        }
        var dSplitRev = domain.split('.').reverse();
        if(!!dSplitRev && dSplitRev.length === 3 && !!dSplitRev[0] && !!dSplitRev[1]){
            domain = '.' + dSplitRev[1] + '.' + dSplitRev[0];
        }
    }catch (error){
        console.error("Error in getAEMCookieDomain method: " + error);
    }
    return domain;
}
