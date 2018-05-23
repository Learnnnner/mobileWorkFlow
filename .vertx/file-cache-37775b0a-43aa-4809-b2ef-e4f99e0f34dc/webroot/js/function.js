$(function () {
    fun.service.init();
    fun.eventHandler.handleEvents();
})

var fun = {};

fun.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
        var loginname = $.cookie('loginname');

        if(loginname == null || loginname == '') {
            window.href = MW.server + '/index';
        }else {}
        $('#user').html(loginname);
    }
}

fun.eventHandler = {
    handleEvents: function () {
        this.handleEdit();
        this.handleFillForm();
        this.handleManage();
        this.handleMyForm();
        this.handleOrg();
        this.handlePermission();
        this.handleLogout();
    }, handleMyForm: function () {
        $('#myform').click(function () {
            var url = MW.server + '/myform'
            location.href = url;
        })
    }, handleEdit: function () {
        $('#edit').click(function () {
            location.href = MW.server + '/fetchTable';
        })
    }, handleManage: function () {
        $('#manage').click(function () {
            location.href = MW.server + '/staffManage';
        })
    }, handleFillForm: function () {
        $('#fillForm').click(function () {
            location.href = MW.server + '/fillForm';
        })
    }, handleOrg: function () {
        $('#org').click(function () {
            location.href = MW.server + '/org';
        })
    }, handlePermission: function () {
        $('#permissions').click(function () {
            window.href = MW.server + '/permissions';
        })
    }, handleLogout: function () {
        $('#logout').click(function () {
            location.href = MW.server + '/login';
        })
    }
}
