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
            window.href = MW.server + '/myform';
        })
    }, handleEdit: function () {
        $('#edit').click(function () {
            window.href = MW.server + '/edit';
        })
    }, handleManage: function () {
        $('#manage').click(function () {
            window.href = MW.server + '/staffManage';
        })
    }, handleFillForm: function () {
        $('#fillForm').click(function () {
            window.href = MW.server + '/fillForm';
        })
    }, handleOrg: function () {
        $('#org').click(function () {
            window.href = MW.server + '/org';
        })
    }, handlePermission: function () {
        $('#permissions').click(function () {
            window.href = MW.server + '/permissions';
        })
    }, handleLogout: function () {
        $('#fillForm').click(function () {
            window.href = MW.server + '/login';
        })
    }
}
