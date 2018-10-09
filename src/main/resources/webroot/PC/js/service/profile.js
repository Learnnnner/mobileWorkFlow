$(function () {
    profile.service.init();
    profile.eventHandler.handleEvents();
})

var profile = {};

profile.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {

        var id = $.cookie('userId');
        if(loginname == null || loginname == '') {
            window.href = MW.server + '/index';
        }  else {
            $.ajax({
                type: "POST",
                url: MW.server + "/fetchProfile",
                data: JSON.stringify({
                    id: id
                }),
                dataType: "json",
                success: function (data) {
                    if (200 == data.status) {
                        var $data = data.user;
                        var $orgs =  data.orgs;
                        if($data.length > 0) {
                            $('#id').val($data[0][2]);
                            $('#loginname').val($data[0][3]);
                            $('#realname').val($data[0][5]);
                            $('#password').val($data[0][4]);
                            $('#telephone').val($data[0][6]);
                            $('#email').val($data[0][7]);
                            var org = $data[0][1];
                        }else {
                            layer.open({
                                title: '异常'
                                ,content: '未查询到相应人员数据！'
                            });
                            return;
                        }
                        if($orgs.length > 0) {
                            for(var i = 0; i < $orgs.length; ++ i) {
                                if($orgs[i][1] == org) {
                                    $('#orgs').append('<option value="'+ $orgs[i][0] +'" selected="">' + $orgs[i][1] + '</option>\n');
                                } else {
                                    $('#orgs').append('<option value="'+ $orgs[i][0] +'">' + $orgs[i][1] + '</option>\n')
                                }
                            }
                            layui.use('form', function(){
                                var form = layui.form;
                                form.render();
                            });
                        }else {
                            layer.open({
                                title: '异常'
                                ,content: '未查询到组织数据！'
                            });
                            return;
                        }
                    }
                }, error: function (data) {
                    layer.open({
                        title: '错误'
                        ,content: '服务器访问异常！'
                    });
                }
            })
        }
        $('#user').html(loginname);
    }
}

profile.eventHandler = {
    handleEvents: function () {
        this.handleSubmit();
    }, handleSubmit:function () {
        $('#submit').click(function () {
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
                        layer.msg('用户信息已修改', {icon: 1});
                    } else
                        layer.msg('用户信息修改失败', {icon: 2});
                }, error: function (data) {
                    $.toptip("操作失败!请检查网络情况或与系统管理员联系！", 'error')
                }
            })
        })
    }
}
