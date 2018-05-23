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
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    // console.log(data.templateList);
                    if(data.templateList.length > 0) {
                        for(var i = 0; i < data.templateList.length; ++ i)_{
                            $('#templates').append('        ' +
                                '<a id="'+ data.templateList.[i][0] +'" class="weui-media-box weui-media-box_appmsg template">\n' +
                                '            <div class="weui-media-box__bd">\n' +
                                '                <h4 class="weui-media-box__title">' + data.templateList.[i][1] + '</h4>\n' +
                                '            </div>\n' +
                                '        </a>')
                        }

                    }
                } else $.toptip("服务器访问异常!", "error");
            }, error: function (data) {
                $.alert("操作失败!请检查网络情况或与系统管理员联系！");
            }
        })
    }
};

table.eventHandler = {
    handlerEvents : function () {

    },
}