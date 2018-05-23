$(function () {
    staffManage.service.init();
    staffManage.eventHandler.handleEvents();
});

var staffManage = {};
var org = [];

staffManage.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
        $('input').val('');
        $.ajax({
            type: "POST",
            url: MW.server + "/staffManage",
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    console.log(data);
                } else $.toptip('操作失败，请检查用户名或密码是否正确!', 'error');
            }, error:
                function (data) {
                    $.toptip('操作失败!请检查网络情况或与系统管理员联系！', 'error');
                }
        });
        $("#department").select({
            title: "选择手机",
            items: [
                {
                    title: "财务部",
                    value: "4",
                },
                {
                    title: "研发部",
                    value: "1001",
                },
                {
                    title: "学生会",
                    value: "1002",
                }
            ]
        });
    }
};

staffManage.eventHandler = {
    handleEvents: function () {
        this.handleAdd();
    }, handleAdd: function () {
        $('#add').click(function () {
            $('input').val('');
            $("#info").popup();
        })
    }
};