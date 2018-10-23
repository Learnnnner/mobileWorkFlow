$(function () {
    mywork.service.init();
    mywork.eventHandler.handleEvents();
})

var mywork = {};
var self;

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
                        var code = '<tr id="' + data.data.mysubmit[i][5] + '" data-template="'+ data.data.mysubmit[i][3] +'"><td>'+ data.data.mysubmit[i][2] + data.data.mysubmit[i][4] + data.data.mysubmit[i][7] +'</td>\n'
                        var date = mywork.service.myDate(data.data.mysubmit[i][7]);
                        code +=    '<td>'+ date +'</td><td>'+ data.data.mysubmit[i][2] + '</td><td>'+ data.data.mysubmit[i][9] +'</td>';
                        code += '<td><button type="button" class="btn btn-primary btn-xs detail">详情</button> ';
                        if(data.data.mysubmit[i][9] == '审批中' ) {
                            code += '<button type="button" class="btn btn-danger btn-xs cancel">撤销</button></td></tr>';
                        }
                        if(data.data.mysubmit[i][9] == '已退审' ) {
                            code += '<button type="button" class="btn btn-success btn-xs edit">编辑</button></td></tr>';
                        }
                        code +='</td></tr>';
                        $('#home tbody').append(code);
                    }
                }else
                    layer.open({
                        title: '异常'
                        ,content: '您目前没有任何申请！'
                    });
                if(data.data.tosubmit.length > 0) {
                    for(var i = 0; i < data.data.tosubmit.length; ++ i) {
                        var code = '<tr id="' + data.data.tosubmit[i][5] + '"><td>'+ data.data.tosubmit[i][2] + data.data.tosubmit[i][4] + data.data.tosubmit[i][7] +'</td>\n'
                        var date = mywork.service.myDate(data.data.tosubmit[i][7]);
                        code +=    '<td>'+ date +'</td><td>'+ data.data.tosubmit[i][2] + '</td><td>'+ data.data.tosubmit[i][9] +'</td>';
                        code += '<td><button type="button" class="btn btn-success btn-xs detail">详情</button> '
                        if(data.data.tosubmit[i][9] == '审批中' ) {
                            code += '<button type="button" class="btn btn-primary btn-xs check">审核</button> ';
                            code += '<button type="button" class="btn btn-danger btn-xs recall">退审</button> ';
                        }
                        code +='</td></tr>';
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
    }, add0: function(m) {
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


mywork.eventHandler = {
    handleEvents: function () {
        this.handleDetail();
        this.handleCancel();
        this.handleCheck();
        this.handleRecall();
        this.handleEdit();
        this.handleSubmit();
    }, handleCheck: function () {
        $(document).on('click', '.check', function () {
            self = $(this);
            var dataId = self.parents('tr').attr('id');
            layer.confirm('确定审核通过吗？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                $.ajax({
                    type: "POST",
                    url: MW.server + "/ApprovalForm",
                    data: JSON.stringify({dataId: dataId}),
                    dataType: "json",
                    success: function (data) {
                        if (200 == data.status) {
                            layer.msg('已审核', {icon: 1});
                        }
                    }, error: function (data) {
                        layer.msg('已审核', {icon: 2});
                    }
                })
            }, function(){
            });
        })
    }, handleCancel: function () {
        $(document).on('click', '.cancel', function () {
            self = $(this);
            var dataId = self.parents('tr').attr('id');
            layer.confirm('确定撤销申请吗？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                $.ajax({
                    type: "POST",
                    url: MW.server + "/CancelAudit",
                    data: JSON.stringify({dataId: dataId}),
                    dataType: "json",
                    success: function (data) {
                        if (200 == data.status) {
                            console.log(self.parents('tr').find('td'));
                            self.parents('tr').find('td').eq(3).text('已关闭');
                            layer.msg('申请已撤销', {icon: 1});
                        }
                    }, error: function (data) {
                        layer.msg('撤销失败', {icon: 1});
                    }
                })
            }, function(){
            });
        })
    }, handleDetail: function () {
        $(document).on('click', '.detail', function () {
            self = $(this);
            var dataId = self.parents('tr').attr('id');
            $.ajax({
                type: "POST",
                url: MW.server + "/fetchUserData",
                data: JSON.stringify({dataId: dataId}),
                dataType: "json",
                success: function (data) {
                    if (200 == data.status) {
                        if(data.data.length == 1) {
                            var title = '' + data.data[0][2] + data.data[0][4] + data.data[0][7];
                            $('#tag').html(data.data[0][9]);
                            $('#title').html(title);
                            $('#statusNow').html(data.data[0][8]);

                            formdata = JSON.parse(data.data[0][6]);
                            var code = ' <table style="width: 90%;margin:auto;margin-top: 1vw;" lay-skin="line" class="layui-table">\n' +
                                '                        <colgroup>\n' +
                                '                            <col width="200">\n' +
                                '                            <col width="800">\n' +
                                '                        </colgroup>\n' +
                                '                        <thead>\n' +
                                '                        <tr>\n' +
                                '                            <th colspan="2" style="text-align: center">\n' +
                                '                                <span class="layui-badge layui-bg-green">'+ data.data[0][9] +'</span>\n' + title +
                                '                            </th>\n' +
                                '                        </tr>\n' +
                                '                        </thead>\n' +
                                '                        <tbody>';
                            $.each(formdata,function(name, value) {
                                code += '<tr>\n' +
                                    '                            <td>' + name + '</td>\n';
                                code += '                            <td>'
                                for(var j = 0; j < value.length; ++ j) {
                                    code += value[j];
                                }
                                code +='</td>';
                                code += '                        </tr>';
                            });
                            code += '                        <tr>\n' +
                                '                            <td>当前节点</td>' +
                                '                            <td>' + data.data[0][8] + '</td>\n' +
                                '                        </tr>\n' +
                                '                        </tbody>\n' +
                                '                    </table>';
                        } else {
                            layer.msg('数据错误', {icon: 2});
                        }
                    }
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-rim', //加上边框
                        area: ['500px', '600px'], //宽高
                        content: code
                    });
                }, error: function (data) {
                    layer.msg('数据获取失败', {icon: 2});
                }
            })
        })
    }, handleRecall: function () {
        $(document).on('click', '.recall', function () {
            self = $(this);
            var dataId = self.parents('tr').attr('id');
            layer.confirm('确定退审该申请吗？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                $.ajax({
                    type: "POST",
                    url: MW.server + "/RecallForm",
                    data: JSON.stringify({dataId: dataId}),
                    dataType: "json",
                    success: function (data) {
                        if (200 == data.status) {
                            console.log(self.parents('tr').find('td'));
                            self.parents('tr').find('td').eq(3).text('已退审');
                            layer.msg('操作成功，申请已拒绝！', {icon: 1});
                        }
                    }, error: function (data) {
                        layer.msg('申请审批失败！', {icon: 1});
                    }
                })
            }, function(){
            });
        })
    }, handleEdit: function () {
        $(document).on('click', '.edit', function () {
            self = $(this);
            var dataId = self.parents('tr').attr('id');
            var id = '' + self.parents('tr').data('template');
            $.ajax({
                type: "POST",
                url: MW.server + "/fetchReEditData",
                data: JSON.stringify({
                    id: id,
                    dataId: dataId
                }),
                dataType: "json",
                success: function (data) {
                    if (200 == data.status) {
                        if(data.data.length == 1 && data.data.length == data.template.length) {
                            var jsonData = JSON.parse(data.data[0]);
                            var title = data.template[0][0];
                            var jsonTemplate = JSON.parse(data.template[0][1]);

                            var code = '<div style="width: 80%; margin: auto">\n' +
                                '    <div style="text-align: center; margin: 2vw">\n' +
                                '        <h1>' + title +'</h1>\n' +
                                '    </div>' +
                                '<form class="layui-form">\n';

                            if(jsonTemplate != undefined && jsonTemplate != '' && jsonTemplate != null) {
                                for(var ele in jsonTemplate) {
                                    var type = jsonTemplate[ele].type;
                                    switch (type) {
                                        case 'single':
                                            code += '  <div class="layui-form-item" data-type="single">\n' +
                                                '    <label class="layui-form-label">' + ele + '</label>\n' +
                                                '    <div class="layui-input-block">\n' +
                                                '      <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入内容" value="' +jsonData[ele][0] +'"  class="layui-input">\n' +
                                                '    </div>\n' +
                                                '  </div>';
                                            break;
                                        case 'muti':
                                            code += '<div class="layui-form-item layui-form-text" data-type="muti">\n' +
                                                '    <label class="layui-form-label">' + ele + '</label>\n' +
                                                '    <div class="layui-input-block">\n' +
                                                '      <textarea placeholder="请输入内容" class="layui-textarea" value="' +jsonData[ele][0] +'"></textarea>\n' +
                                                '    </div>\n' +
                                                '  </div>';
                                            break;
                                        case 'radio':
                                            code += '<div class="layui-form-item" data-type="radio">\n' +
                                                '    <label class="layui-form-label">' + ele + '</label>\n' +
                                                '    <div class="layui-input-block">\n';
                                            for(var i = 0; i < jsonTemplate[ele].options.length; ++ i) {
                                                if(jsonData[ele].indexOf(jsonTemplate[ele].options[i]) >= 0) {
                                                    code += '<input type="radio" name="radio" title="' + jsonTemplate[ele].options[i] + '" checked="checked"><br>\n';
                                                } else {
                                                    code += '<input type="radio" name="radio" title="' + jsonTemplate[ele].options[i] + '"><br>\n';
                                                }
                                            }
                                            code +='</div></div>'
                                            break;
                                        case 'checkbox':
                                            code += '<div class="layui-form-item" data-type="checkbox">\n' +
                                                '    <label class="layui-form-label">' + ele + '</label>\n' +
                                                '    <div class="layui-input-block">\n' +
                                                '      <select>\n';
                                            for(var i = 0; i < json[ele].options.length; ++ i) {
                                                if(jsonData[ele].indexOf(jsonTemplate[ele].options[i]) >= 0) {
                                                    code += '<input type="checkbox" title="' + json[ele].options[i] + '" lay-skin="primary" checked="checked">';
                                                } else {
                                                    code += '<input type="checkbox" title="' + json[ele].options[i] + '" lay-skin="primary">';
                                                }
                                            }
                                            code +='</select></div></div>'
                                            break;
                                        case 'date':
                                            code +=  '<div class="layui-form-item" data-type="date">\n' +
                                                '    <label class="layui-form-label">' + ele + '</label>\n' +
                                                '<div class="layui-input-block">' +
                                                '  <input type="text" class="layui-input date" style="padding-left: 10px" value="' +jsonData[ele][0] +'" placeholder="请输入日期" >\n' +
                                                '</div></div>'+
                                                '<script>\n' +
                                                '</script>';
                                            break;
                                        case 'city':
                                            var textEle =  jsonData[ele][0];
                                            var reg = new RegExp(' ',"g");
                                            var region = textEle.replace(reg,'/');
                                            code +=  '<div class="layui-form-item" data-type="city">\n' +
                                                '    <label class="layui-form-label">' + ele + '</label>\n' +
                                                '<div class="layui-input-block">' +
                                                '<div style="position: relative;"><!-- container -->\n' +
                                                '  <input id="" class="layui-input city-picker" style="padding-left: 10px" value="' + region + '" readonly type="text">\n' +
                                                '</div>'+
                                                '</div></div>';
                                            break;
                                        case 'number':
                                            code += '  <div class="layui-form-item" data-type="number">\n' +
                                                '    <label class="layui-form-label">'+ ele +'</label>\n' +
                                                '    <div class="layui-input-block">\n' +
                                                '      <input type="text" name="title" lay-verify="title" autocomplete="off" value="' +jsonData[ele][0] +'" placeholder="请输入内容" class="layui-input">\n' +
                                                '    </div>\n' +
                                                '  </div>';
                                            break;
                                        case 'picture':
                                            code += '';
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

                        }
                    }else {
                        layer.msg('数据获取失败', {icon: 2});
                    }
                }, error: function (data) {
                    layer.msg('数据获取失败', {icon: 2});
                }
            })
        })
    }, handleSubmit: function () {
        $(document).on('click', '#submit', function () {
            var data = mywork.service.getData();
            var timeStamp = new Date().getTime();
            var dataId = '' + self.parents('tr').attr('id');
            var templateId = '' + self.parents('tr').data('template');
            layer.confirm('确定重新发起该申请吗？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                $.ajax({
                    type: "POST",
                    url: MW.server + "/updateFormData",
                    data: JSON.stringify({
                        data : JSON.stringify(data),
                        timeStamp: timeStamp,
                        templateId: templateId,
                        dataId: dataId
                    }),
                    dataType: "json",
                    success: function (data) {
                        if (200 == data.status) {
                            layer.msg('操作成功！', {icon: 1});
                        } else layer.msg('操作失败！', {icon: 2});
                    }, error:
                        function (data) {
                            layer.msg('操作失败！', {icon: 2});
                        }
                })
            }, function(){
            });
        })
    }
}
