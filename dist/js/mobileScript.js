/*
* @Author: dongying
* @Date:   2017-01-06 16:00:22
* @Last Modified by:   anchen
* @Last Modified time: 2017-01-06 16:00:47
*/

'use strict';
$(function() {
    $(".menu-btn").bind('click', function() {
        $(".navbar").addClass("navbar-open").show();
    });
    $(".navbar-right").bind('click', function(e) {
        var evt = e || window.event; //浏览器兼容性
        var elem = evt.target || evt.srcElement;
        if ($(elem).children('.navbar-list').length == 0) {
            $(".navbar").removeClass("navbar-open").hide();
        }
    });
})