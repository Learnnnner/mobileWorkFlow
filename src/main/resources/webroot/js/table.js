$(function () {
    table.service.init();
    table.eventHandler.handlerEvents();
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
                    if(data.templateList.length > 0) {
                        for(var i = 0; i < data.templateList.length; ++ i) {
                            $('#templates').append('        ' +
                                '<a id="'+ data.templateList[i][0] +'" class="weui-media-box weui-media-box_appmsg template">\n' +
                                '            <div class="weui-media-box__bd">\n' +
                                '                <h4 class="weui-media-box__title">' + data.templateList[i][1] + '</h4>\n' +
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
};

table.eventHandler = {
    handlerEvents : function () {
        this.handleEdit();
        this.handleAdd();
    }, handleEdit: function () {
        $(document).on('click', '.template', function () {
            var self = this;
            if(self.id != undefined) {
                var id = self.id;
                var url = MW.server + '/edit?id=' + id;
                location.href = url;
            }else {
                $.toptip('操作异常！');
            }
        })
    },handleAdd: function () {
        $(document).on('click', '#add', function () {
            var url = MW.server + '/edit';
            location.href = url;
        })
    }
}