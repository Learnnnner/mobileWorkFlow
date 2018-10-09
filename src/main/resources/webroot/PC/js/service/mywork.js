$(function () {
    mywork.service.init();
    mywork.eventHandler.handleEvents();
})

var mywork = {};

mywork.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
        $.ajax({
            type: "POST",
            url: MW.server + "/fetchSubmitForms",
            dataType: "json",
            success: function (data) {
                if(data.data.mysubmit.length > 0) {
                    for(var i = 0; i < data.data.mysubmit.length; ++ i) {
                        var code = '<tr><td>'+ data.data.mysubmit[i][2] + data.data.mysubmit[i][4] + data.data.mysubmit[i][7] +'</td>\n'
                        var date = mywork.service.myDate(data.data.mysubmit[i][7]);
                        code +=    '<td>'+ date +'</td><td>'+ data.data.mysubmit[i][2] + '</td><td>'+ data.data.mysubmit[i][9] +'</td>';
                        code += '<td><button type="button" class="btn btn-primary btn-xs detail">详情</button> ' +
                            '<button type="button" class="btn btn-danger btn-xs cancel">撤销</button></td></tr>';
                        $('#home tbody').append(code);
                    }
                }else
                    layer.open({
                        title: '异常'
                        ,content: '您目前没有任何申请！'
                    });
                if(data.data.tosubmit.length > 0) {
                    for(var i = 0; i < data.data.tosubmit.length; ++ i) {
                        var code = '<tr><td>'+ data.data.tosubmit[i][2] + data.data.tosubmit[i][4] + data.data.tosubmit[i][7] +'</td>\n'
                        var date = mywork.service.myDate(data.data.tosubmit[i][7]);
                        code +=    '<td>'+ date +'</td><td>'+ data.data.tosubmit[i][2] + '</td><td>'+ data.data.tosubmit[i][9] +'</td>';
                        code += '<td><button type="button" class="btn btn-success btn-xs detail">详情</button> ' +
                            '<button type="button" class="btn btn-primary btn-xs check">审核</button> ' +
                            '<button type="button" class="btn btn-danger btn-xs cancel">退审</button></td></tr>';
                        $('#profile tbody').append(code);
                    }
                } else
                    layer.open({
                        title: '异常'
                        ,content: '没有需要您处理的申请！'
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
    },add0: function(m) {
        return m < 10 ? '0' + m : m
    }, myDate: function(timestamp) {
        var time = new Date(parseInt(timestamp));
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
    }
}


mywork.eventHandler = {
    handleEvents: function () {
        this.handleDetail();
        this.handleCancel();
        this.handleCheck();
    }, handleCheck: function () {
        $(document).on('click', '.check', function () {
            layer.confirm('确定审核通过吗？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                layer.msg('已审核', {icon: 1});
            }, function(){
            });
        })
    }, handleCancel: function () {
        $(document).on('click', '.cancel', function () {
            layer.confirm('确定退审吗？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                layer.msg('已退审', {icon: 1});
            }, function(){
            });
        })
    }, handleDetail: function () {
        $(document).on('click', '.detail', function () {
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
