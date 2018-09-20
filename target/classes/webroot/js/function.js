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
    }, auth: function (id) {
        $.ajax({
            type: "POST",
            url: MW.server + "/myformAuth",
            data: JSON.stringify({
                id: id
            }),
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    if(data.url.length > 0) {
                        var url = MW.server + data.url[0];
                        location.href = url;
                    }else {
                        $.toptip("没有访问权限!", "error");
                    }
                } else $.toptip("跳转异常，请稍后再试!", "error");
            }, error: function (data) {
                $.toptip("跳转异常，请稍后再试!", "error");
            }
        })
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
            fun.service.auth("1");
        })
    }, handleEdit: function () {
        $('#edit').click(function () {
            location.href = MW.server + '/table';
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
