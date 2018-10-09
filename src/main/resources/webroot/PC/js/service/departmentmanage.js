$(function () {
    departmentmanage.service.init();
    departmentmanage.eventHandler.handleEvents();
})

var departmentmanage = {};
var editself;

departmentmanage.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
        $.ajax({
            type: "POST",
            url: MW.server + "/fetchOrgsAuth",
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    for (var i = 0; i < data.orgList.length; ++ i) {
                        var code = '<tr id="'+ data.orgList[i][0] +'">\n' +
                            '                                <td>'+ data.orgList[i][1] +'</td>\n' +
                            '                                <td>'+ data.orgList[i][2] +'</td>\n' +
                            '                                <td>\n';
                        var $authList = data.authList[data.orgList[i][0]];
                        if($authList != undefined && $authList != null && $authList.length > 0) {
                            for(var j = 0; j < $authList.length; ++ j) {
                                if($authList[j] == '1') {
                                    code += '<span id="1" class="label label-info"><i class="iconfont icon-tijiao fa" style="color: #ffffff"></i></span>\n';
                                } else if($authList[j] == '2') {
                                    code += '<span id="2" class="label label-info"><i class="iconfont icon-bianji fa" style="color: #ffffff"></i></span>\n';
                                } else if($authList[j] == '3') {
                                    code += '<span id="3" class="label label-info"><i class="iconfont icon-biaodan fa" style="color: #ffffff"></i></span>\n';
                                } else if($authList[j] == '4') {
                                    code += '<span id="4" class="label label-info"><i class="iconfont icon-guanlikehu fa" style="color: #ffffff"></i></span>\n';
                                } else if($authList[j] == '5') {
                                    code += '<span id="5" class="label label-info"><i class="iconfont icon-zuzhi fa" style="color: #ffffff"></i></span>\n';
                                } else if($authList[j] == '6') {
                                    code += '<span id="6" class="label label-info"><i class="iconfont icon-permissions-user fa" style="color: #ffffff"></i></span>\n';
                                }
                            }
                        }
                            code += '                                </td>\n' +
                            '                                <td>\n' +
                            '                                    <button type="button" class="btn btn-success btn-xs detail edit">编辑</button>\n' +
                            '                                    <button type="button" class="btn btn-danger btn-xs detail delete">删除</button>\n' +
                            '                                </td>\n' +
                            '                            </tr>';
                        $('#departmentContainer ').append(code)
                    }
                } else layer.open({
                    title: '异常'
                    ,content: '没有需要您处理的申请！'
                });
                $(document).ready(function(){$(".dataTables-example").dataTable();})
            }, error:
                function (data) {
                    $(document).ready(function(){$(".dataTables-example").dataTable();})
                    layer.open({
                        title: '错误'
                        ,content: '服务器访问异常！'
                    });
                }
        })
    },
}

departmentmanage.eventHandler = {
    handleEvents: function () {
        this.handleEdit();
        this.handleDelete();
        this.handleSubmit();
    }, handleEdit: function () {
        $(document).on('click', '.edit', function () {
            var self = $(this);
            editself = $(this);
            var tdArr = self.parents('tr').find('td');
            var code = '<div style="width: 80%;margin:auto">\n' +
                '    <div style="text-align: center; margin: 2vw">\n' +
                '        <h1>部门信息</h1>\n' +
                '    </div>\n' +
                '    <form class="layui-form" action="">\n' +
                '        <div class="layui-form-item">\n' +
                '            <label class="layui-form-label">名称</label>\n' +
                '            <div class="layui-input-block">\n' +
                '                <input id="name" type="text" placeholder="" class="layui-input" value="'+ tdArr.eq(0).text() +'">\n' +
                '            </div>\n' +
                '        </div>\n' +
                '        <div class="layui-form-item">\n' +
                '            <label class="layui-form-label">权限</label>\n' +
                '            <div class="layui-input-block">\n' +
                '                <textarea id="description" placeholder="请输入内容" class="layui-textarea">' + tdArr.eq(1).text() + '</textarea>' +
                '            </div>\n' +
                '        </div>\n' +
                '<div class="layui-form-item">\n' +
                '    <label class="layui-form-label">复选框</label>\n' +
                '    <div id="authorization" class="layui-input-block">\n' +
                '      <input id="1" type="checkbox" title="与我相关">\n' +
                '      <input id="2" type="checkbox" title="流程创建">\n' +
                '      <input id="3" type="checkbox" title="流程申请">\n' +
                '      <input id="4" type="checkbox" title="人员管理">\n' +
                '      <input id="5" type="checkbox" title="组织管理">\n' +
                '      <input id="6" type="checkbox" title="权限管理">\n' +
                '    </div>\n' +
                '  </div></form>'+
                '<button class="layui-btn" id="submit" style="margin-left: 168px;margin-bottom: 2vw">确定</button>'+
                '<script>'+
                '   layui.use("form", function(){\n' +
                '                                   var form = layui.form;\n' +
                '                                   form.render();\n' +
                '                               });' +
                '</script>';
                '</div>';
            layer.open({
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['600px', '480px'], //宽高
                content: code
            });
        })
    }, handleDelete: function () {
        $(document).on('click', '.delete', function () {
            var self = $(this);
            layer.confirm('确定删除该部门吗？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                var node = self.parents('tr');
                var id = node.attr('id');
                $.ajax({
                    type: "POST",
                    url: MW.server + "/deleteOrg",
                    dataType: "json",
                    data: JSON.stringify({id : id}),
                    success: function (data) {
                        if (200 == data.status) {
                            node.remove();
                            layer.msg('删除成功', {icon: 1});
                        }
                    }, error: function (data) {
                        layer.msg('删除失败', {icon: 2});
                    }
                })
            }, function(){});
        })
    }, handleSubmit:function () {
        $(document).on('click', '#submit', function () {
            layer.confirm('确定修改该部门的信息吗？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                var orgid = $('#orgs').val();
                var authorization = [];
                $('#authorization').find('input:checked').each(function () {
                    authorization.push($(this).attr('id'));
                });
                url = MW.server + "/editOrgUser"
                var userdata = {
                    id : $('#id').val(),
                    name : $('#name').val(),
                    description : $('#realname').val(),
                };

                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(userdata),
                    dataType: "json",
                    success: function (data) {
                        if (200 == data.status) {
                            var $tr = editself.parents('tr').empty();
                            var eletr = $tr;
                            console.log(eletr);
                            $tr.append(
                                '                            <td>'+ $('#id').val() +'</td>\n' +
                                '                            <td>'+ $('#realname').val() +'</td>\n' +
                                '                            <td>'+ $('#loginname').val() +'</td>\n' +
                                '                            <td style="display: none">'+ $('#password').val() +'</td>\n' +
                                '                            <td>'+ $('#telephone').val() +'</td>\n' +
                                '                            <td>'+ $('#email').val() +'</td>\n' +
                                '                            <td>'+ $('#orgs').find("option:selected").text() +'</td>\n' +
                                '                            <td>\n' +
                                '                                <button type="button" class="btn btn-success btn-xs  edit">编辑</button>\n' +
                                '                                <button type="button" class="btn btn-danger btn-xs delete">删除</button>\n' +
                                '                            </td>\n')
                            layer.msg('用户信息已修改', {icon: 1});
                        } else
                            layer.msg('用户信息修改失败', {icon: 2});
                    }, error: function (data) {
                        $.toptip("操作失败!请检查网络情况或与系统管理员联系！", 'error')
                    }
                })
            }, function(){

            });
        })
    }
}
