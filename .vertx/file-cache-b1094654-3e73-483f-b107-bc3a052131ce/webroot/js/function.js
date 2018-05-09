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
        this.handletemplateSelect();
        this.handleManage();
    }, handleEdit: function () {
        $('#edit').click(function () {
            window.href = MW.server + '/edit';
        })
    }, handleManage: function () {
        $('#manage').click(function () {
            window.href = MW.server + '/staffManage';
        })
    }, handletemplateSelect: function () {
        $('#fillForm').click(function () {
            window.href = MW.server + '/templateSelect';
        })
    }
}
