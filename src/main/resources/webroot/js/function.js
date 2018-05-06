$(function () {
<<<<<<< HEAD
    fun.service.init();
    fun.eventHandler.handleEvents();
})


var fun = {};

fun.service = {
    init: function () {

    }, initControl: function () {

        $('#user').html(username);
    }
}

fun.eventHandler = {
    handleEvents: function () {
        
    }
}
=======
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
>>>>>>> 004f8a6e967a28ee118b855e6bc3b7570898738f
