$(function () {
    wfapply.service.init();
    wfapply.eventHandler.handleEvents();
})

var wfapply = {};
var applyform;
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
                            $('tbody').append('<tr id="' + data.formList[i][0] + '">\n' +
                                '<td>'+data.formList[i][1]+'</td><td>'+data.formList[i][2]+'</td><td>'+data.formList[i][4]+'</td>\n' +
                                '<td><button type="button" class="btn btn-primary btn-xs apply">申请</button>\n' +
                                '</td></tr>')
                        }
                    } else {
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
    }, getData: function () {
        var eles = $('.layui-form-item');
        var data = {};

        for(var i = 0 ; i < eles.length; ++ i) {
            var title =  $(eles[i]).find('.layui-form-label').html();
            data[title] = [];
            if($(eles[i]).data('type') == 'radio') {
                var checkedeles = $(eles[i]).find(':radio:checked');
                for (var j = 0; j < checkedeles.length; ++ j) {
                    var opt = $(checkedeles[j]).attr('title');
                    data[title].push(opt);
                }
            }else if($(eles[i]).data('type') == 'checkbox') {
                var checkedeles = $(eles[i]).find(':checkbox:checked');
                for (var j = 0; j < checkedeles.length; ++ j) {
                    var opt = $(checkedeles[j]).attr('title');
                    data[title].push(opt);
                }
            }else if($(eles[i]).data('type') == 'muti') {
                var textEle =  $(eles[i]).find('textarea');
                var text = textEle.val();
                data[title].push(text);
            }else if($(eles[i]).data('type') == 'city') {
                var textEle =  $(eles[i]).find('input').val();
                var reg = new RegExp('/',"g");
                var text = textEle.replace(reg,' ');
                data[title].push(text);
            }else if($(eles[i]).data('type') == 'date') {
                var textEle =  $(eles[i]).find('input').val();
                var reg = new RegExp('-',"g");
                var text = textEle.replace(reg,'/');
                data[title].push(text);
            } else {
                var value = $(eles[i]).find('input').val();
                data[title].push(value);
            }
        }
        return data;
    }
}

wfapply.eventHandler = {
    handleEvents: function () {
        this.handleApply();
        this.handleSubmit();
    }, handleApply: function () {
        $(document).on('click', '.apply', function () {
            var self = $(this);
            applyform = $(this);
            var id= self.parents('tr').attr('id');
            var name = self.parents('tr').find('td:first').text();

            if(id != null && id != undefined) {
                $.ajax({
                    type: "POST",
                    url: MW.server + "/fetchFormData",
                    data: JSON.stringify({id: id}),
                    dataType: "json",
                    success: function (data) {
                        if (200 == data.status) {
                            if(data.data.length == 1) {
                                if(data.data[0][2] != undefined && data.data[0][2] != '' && data.data[0][2] != null) {
                                    var code = '<div style="width: 80%; margin: auto">\n' +
                                        '    <div style="text-align: center; margin: 2vw">\n' +
                                        '        <h1>' + name +'</h1>\n' +
                                        '    </div>' +
                                        '<form class="layui-form">\n';
                                    var json = JSON.parse(data.data[0][2]);
                                    for(var ele in json) {
                                        var type = json[ele].type;
                                        switch (type) {
                                            case 'single':
                                                code += '  <div class="layui-form-item" data-type="single">\n' +
                                                    '    <label class="layui-form-label">' + ele + '</label>\n' +
                                                    '    <div class="layui-input-block">\n' +
                                                    '      <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入内容" class="layui-input">\n' +
                                                    '    </div>\n' +
                                                    '  </div>';
                                                break;
                                            case 'muti':
                                                code += '<div class="layui-form-item layui-form-text" data-type="muti">\n' +
                                                    '    <label class="layui-form-label">' + ele + '</label>\n' +
                                                    '    <div class="layui-input-block">\n' +
                                                    '      <textarea placeholder="请输入内容" class="layui-textarea"></textarea>\n' +
                                                    '    </div>\n' +
                                                    '  </div>';
                                                break;
                                            case 'radio':
                                                code += '<div class="layui-form-item" data-type="radio">\n' +
                                                    '    <label class="layui-form-label">' + ele + '</label>\n' +
                                                    '    <div class="layui-input-block">\n';
                                                for(var i = 0; i < json[ele].options.length; ++ i) {
                                                    code += '<input type="radio" name="radio" title="' + json[ele].options[i] + '"><br>\n';
                                                }
                                                code +='</div></div>'
                                                break;
                                            case 'checkbox':
                                                code += '<div class="layui-form-item" data-type="checkbox">\n' +
                                                    '    <label class="layui-form-label">' + ele + '</label>\n' +
                                                    '    <div class="layui-input-block">\n' +
                                                    '      <select>\n';
                                                for(var i = 0; i < json[ele].options.length; ++ i) {
                                                    code += '<input type="checkbox" title="' + json[ele].options[i] + '" lay-skin="primary">';
                                                }
                                                code +='</select></div></div>'
                                                break;
                                            case 'date':
                                                code +=  '<div class="layui-form-item" data-type="date">\n' +
                                                        '    <label class="layui-form-label">' + ele + '</label>\n' +
                                                        '<div class="layui-input-block">' +
                                                        '  <input type="text" class="layui-input date" style="padding-left: 10px" placeholder="请输入日期" >\n' +
                                                        '</div></div>'+
                                                        '<script>\n' +
                                                        '</script>';
                                                break;
                                            case 'city':
                                                code +=  '<div class="layui-form-item" data-type="city">\n' +
                                                    '    <label class="layui-form-label">' + ele + '</label>\n' +
                                                    '<div class="layui-input-block">' +
                                                    '<div style="position: relative;"><!-- container -->\n' +
                                                    '  <input id="" class="layui-input city-picker" style="padding-left: 10px" readonly type="text">\n' +
                                                    '</div>'+
                                                    '</div></div>';
                                                break;
                                            case 'number':
                                                code += '  <div class="layui-form-item" data-type="number">\n' +
                                                    '    <label class="layui-form-label">'+ ele +'</label>\n' +
                                                    '    <div class="layui-input-block">\n' +
                                                    '      <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入内容" class="layui-input">\n' +
                                                    '    </div>\n' +
                                                    '  </div>';
                                                break;
                                            case 'picture':

                                                break;
                                        }
                                    }
                                    code += '  </form><button class="layui-btn" id="submit" style="margin-left: 218px;margin-bottom: 2vw">确定</button></div>';
                                    layer.open({
                                        type: 1,
                                        skin: 'layui-layer-rim', //加上边框
                                        area: ['600px', '480px'], //宽高
                                        content: code
                                    });
                                    layui.use('form', function(){
                                        var form = layui.form;
                                        form.render();
                                    });
                                    layui.use("laydate", function(){
                                        var laydate = layui.laydate;
                                        laydate.render({
                                            elem: ".date"
                                        });
                                    });
                                    $(".city-picker").citypicker();
                                }
                            }else {
                                layer.msg('数据异常!', {icon: 2});
                            }
                        } else layer.msg('数据获取失败！', {icon: 2});
                    }, error: function (data) {
                        layer.msg('数据获取失败', {icon: 2});
                    }
                })
            }else layer.msg('访问出错!', {icon: 2});
        })
    }, handleSubmit:function () {
        $(document).on('click', '#submit', function () {
            layer.confirm('确定提交该申请吗？', {
                btn: ['确定','取消'] //按钮
            }, function() {
                var data = wfapply.service.getData();
                var timeStamp = new Date().getTime();
                var templateId= applyform.parents('tr').attr('id');
                $.ajax({
                    type: "POST",
                    url: MW.server + "/saveFormData",
                    data: JSON.stringify({
                        data : JSON.stringify(data),
                        timeStamp: timeStamp,
                        templateId: templateId
                    }),
                    dataType: "json",
                    success: function (data) {
                        if (200 == data.status) {
                            layer.msg('申请成功', {icon: 1});
                        } else layer.msg('申请失败', {icon: 2});
                    }, error:
                        function (data) {
                            $.alert("操作失败!请检查网络情况或与系统管理员联系！")
                        }
                })
            }, function(){

            });
        })
    }
}
