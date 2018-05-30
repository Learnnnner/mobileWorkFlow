$(function () {
    templateSelect.service.init();
    templateSelect.eventHandler.handlerEvents();
});

var templateSelect = {};

templateSelect.service = {
    init : function () {
        this.initControl();
    }, initControl : function () {
        $.ajax({
            type: "POST",
            url: MW.server + "/fetchForm",
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    if(data.formList.length > 0) {
                        for(var i = 0; i < data.formList.length; ++ i) {
                            $('#forms').append('        ' +
                                '<a id="'+ data.formList[i][0] +'" class="weui-media-box weui-media-box_appmsg template">\n' +
                                '            <div class="weui-media-box__bd">\n' +
                                '                <h4 class="weui-media-box__title">' + data.formList[i][1] + '</h4>\n' +
                                '            </div>\n' +
                                '        </a>')
                        }
                    }else {
                        $.toptip("数据异常!", "error");
                    }
                } else $.toptip("服务器访问异常!", "error");
            }, error: function (data) {
                $.toptip("服务器访问异常!", "error");
            }
        })
    }
}

templateSelect.eventHandler = {
    handlerEvents: function () {
        this.handlerSelectForm()
    }, handlerSelectForm : function () {
        $(document).on('click', '.template', function () {
            var self = this;
            var id = self.id;
            window.location = MW.server + '/form?id='+id;
        })
    }
}