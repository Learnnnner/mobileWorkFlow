$(function () {
    table.service.init();
    table.service.handlerEvents();
})

var table = {};

table.service = {
    init : function () {
        this.initControl();
    }, initControl: function () {
        $.ajax({
            type: "POST",
            url: MW.server + "/fetchTable",
            data: JSON.stringify(data),
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    console.log(data.templateList);
                } else $.toptip("服务器访问异常!", "error")
            }, error:
                function (data) {
                    $.alert("操作失败!请检查网络情况或与系统管理员联系！")
                }
        })
    }
};

table.eventHandler = {
    handlerEvents : function () {

    },
}