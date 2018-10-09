$(function () {
    wfapply.service.init();
    wfapply.eventHandler.handleEvents();
})

var wfapply = {};

wfapply.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
        $.ajax({
            type: "POST",
            url: MW.server + "/fetchTemplateTable",
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    if(data.formList.length > 0) {
                        for(var i = 0; i < data.formList.length; ++ i) {
                            code =
                            $('tbody').append('<tr>\n' +
                                '<td>'+data.formList[i][1]+'</td><td>'+data.formList[i][2]+'</td><td>'+data.formList[i][4]+'</td>\n' +
                                '<td><button type="button" class="btn btn-primary btn-xs apply">申请</button>\n' +
                                '</td></tr>')
                        }
                    }else {
                        layer.open({
                            title: '异常'
                            ,content: '未查询到相应数据！'
                        });
                    }
                } else
                    layer.open({
                        title: '错误'
                        ,content: '服务器访问异常！'
                    });
                $(document).ready(function(){$(".dataTables-example").dataTable();})
            }, error: function (data) {
                $(document).ready(function(){$(".dataTables-example").dataTable();})
                layer.open({
                    title: '错误'
                    ,content: '服务器访问异常！'
                });
            }
        })
    },
}

wfapply.eventHandler = {
    handleEvents: function () {
        this.handleEdit();
    }, handleEdit: function () {
        $(document).on('click', '.apply', function () {
            var test = '<html>test</html>';
            layer.open({
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['500px', '300px'], //宽高
                content: test
            });
        })
    }
}
