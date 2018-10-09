$(function () {
    index.service.init();
    index.eventHandler.handleEvents();
})

var index = {};

index.service = {
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
                    }
                } else
                    layer.open({
                        title: '异常'
                        ,content: '未查询到相应数据！'
                    });
            }, error: function (data) {
                $.toptip("跳转异常，请稍后再试!", "error");
            }
        })
    }
}

index.eventHandler = {
    handleEvents: function () {}
}
