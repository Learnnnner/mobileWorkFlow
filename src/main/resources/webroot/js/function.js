$(function () {
    fun.service.init();
    fun.eventHandler.handleEvents();
})


var fun = {};

fun.service = {
    init: function () {

    }, initControl: function () {

        var loginname = $.cookie('loginname');

        if(loginname == null || loginname == '') {
            window.href = MW.server + '/index'
        }else {}

        $('#user').html(loginname);
    }
}

fun.eventHandler = {
    handleEvents: function () {
        
    }
}
