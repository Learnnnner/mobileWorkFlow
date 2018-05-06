$(function () {
    Fun.service.initControl();
    Fun.eventHandler.handleEvents();
});

var Fun = {}

Fun.service = {
    init: function () {
        this.initControl();
    },
    
    initControl: function () {
        var loginname = $.cookie('loginname');

        if(loginname == null || loginname == '') {
            window.href = MW.server + '/index'
        }else {}

        $('#user').html(loginname);
    }
};

Fun.eventHandler = {
    handleEvents: function () {
        
    },
};