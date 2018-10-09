$(function () {
    staffmanage.service.init();
    staffmanage.eventHandler.handleEvents();
})

var staffmanage = {};
var editself;

staffmanage.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
        $.ajax({
            type: "POST",
            url: MW.server + "/fetchOrgUser",
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    var $data = data.data;
                    var code = '';
                    for(var i = 0; i < $data.length; ++ i) {
                        code += '<tr>\n' +
                            '                            <td>'+ $data[i][2] +'</td>\n' +
                            '                            <td>'+ $data[i][5] +'</td>\n' +
                            '                            <td>'+ $data[i][3] +'</td>\n' +
                            '                            <td style="display: none">'+ $data[i][4] +'</td>\n' +
                            '                            <td>'+ $data[i][6] +'</td>\n' +
                            '                            <td>'+ $data[i][7] +'</td>\n' +
                            '                            <td>'+ $data[i][1] +'</td>\n' +
                            '                            <td>\n' +
                            '                                <button type="button" class="btn btn-success btn-xs  edit">编辑</button>\n' +
                            '                                <button type="button" class="btn btn-danger btn-xs delete">删除</button>\n' +
                            '                            </td>\n' +
                            '                        </tr>'
                    };
                    $('tbody').append(code);
                } else{
                    layer.open({
                        title: '异常'
                        ,content: '未查询到相应数据！'
                    });
                }
                $(document).ready(
                    function(){
                        $(".dataTables-example").dataTable();
                    })
            }, error:
                function (data) {
                    layer.open({
                        title: '错误'
                        ,content: '服务器访问异常！'
                    });
                }
        });

    },
}

staffmanage.eventHandler = {
    handleEvents: function () {
        this.handleEdit();
        this.handleDelete();
        this.handleSave();
    }, handleEdit: function () {
        $(document).on('click', '.edit', function () {
            var self = $(this);
            editself = $(this);
            var tdArr = self.parents('tr').find('td');
            var code = '<div style="width: 80%;margin:auto">\n' +
                '    <div style="text-align: center; margin: 2vw">\n' +
                '        <h1>个人信息</h1>\n' +
                '    </div>\n' +
                '    <form class="layui-form" action="">\n' +
                '        <div class="layui-form-item">\n' +
                '            <label class="layui-form-label">ID</label>\n' +
                '            <div class="layui-input-block">\n' +
                '                <input id="id" type="text" placeholder="" class="layui-input" value="'+ tdArr.eq(0).text() +'" readonly>\n' +
                '            </div>\n' +
                '        </div>\n' +
                '        <div class="layui-form-item">\n' +
                '            <label class="layui-form-label">登陆账号</label>\n' +
                '            <div class="layui-input-block">\n' +
                '                <input id="loginname" type="text" placeholder="" class="layui-input" value="' + tdArr.eq(2).text() + '" readonly>\n' +
                '            </div>\n' +
                '        </div>\n' +
                '        <div class="layui-form-item">\n' +
                '            <label class="layui-form-label">姓名</label>\n' +
                '            <div class="layui-input-block">\n' +
                '                <input id="realname" type="text" placeholder="请输入姓名" class="layui-input" value="'+ tdArr.eq(1).text() +'">\n' +
                '            </div>\n' +
                '        </div>\n' +
                '        <div class="layui-form-item">\n' +
                '            <label class="layui-form-label">密码</label>\n' +
                '            <div class="layui-input-block">\n' +
                '                <input id="password" type="password" placeholder="请输入密码" class="layui-input" value="' + tdArr.eq(3).text() + '">\n' +
                '            </div>\n' +
                '        </div>\n' +
                '        <div class="layui-form-item">\n' +
                '            <label class="layui-form-label">手机</label>\n' +
                '            <div class="layui-input-block">\n' +
                '                <input id="telephone" type="text" placeholder="请输入手机号" class="layui-input" value="' + tdArr.eq(4).text() + '">\n' +
                '            </div>\n' +
                '        </div>\n' +
                '        <div class="layui-form-item">\n' +
                '            <label class="layui-form-label">email</label>\n' +
                '            <div class="layui-input-block">\n' +
                '                <input id="email" type="text" placeholder="请输入邮箱" class="layui-input" value="' + tdArr.eq(5).text() + '">\n' +
                '            </div>\n' +
                '        </div>\n' +
                '        <div class="layui-form-item">\n' +
                '            <label class="layui-form-label">组织</label>\n' +
                '            <div class="layui-input-block">\n' +
                '                <select id="orgs" name="interest" lay-filter="zuzhi">\n';
                for(var i = 0; i < department.length; ++ i) {
                    if(department[i][1] == tdArr.eq(6).text()) {
                        code += '<option value="'+ department[i][0] +'" selected="">' + department[i][1] + '</option>\n';
                    } else {
                        code += '<option value="'+ department[i][0] +'">' + department[i][1] + '</option>\n';
                    }
                }
                code += '</select>\n'+
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </form>\n' +
                    '<button class="layui-btn" id="submit" style="margin-left: 168px;margin-bottom: 2vw">确定</button>'+
                    '</div>\n' +
                    '<script>' +
                    'layui.use("form", function(){\n' +
                    '                                var form = layui.form;\n' +
                    '                                form.render();\n' +
                    '                            });' +
                    '</script>';
            layer.open({
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['500px', '480px'], //宽高
                content: code
            });
        })
    }, handleDelete: function () {
        $(document).on('click', '.delete', function () {
            var self = $(this);
            layer.confirm('确定删除该人员吗？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                var node = self.parents('tr');
                var id = parseInt(node.find("td:first").text());
                $.ajax({
                    type: "POST",
                    url: MW.server + "/deleteOrgUser",
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
            }, function(){

            });
        })
    }, handleSave:function () {
        $(document).on('click', '#submit', function () {
            layer.confirm('确定修改该人员的信息吗？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                var orgid = $('#orgs').val();
                url = MW.server + "/editOrgUser"
                var userdata = {
                    id : $('#id').val(),
                    realname : $('#realname').val(),
                    loginname : $('#loginname').val(),
                    password : $('#password').val(),
                    telephone : $('#telephone').val(),
                    email : $('#email').val(),
                    enable : $('#enable').val(),
                    orgid : orgid
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
