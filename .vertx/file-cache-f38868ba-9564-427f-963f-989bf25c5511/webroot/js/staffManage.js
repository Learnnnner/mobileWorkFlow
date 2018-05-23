$(function () {
    staffManage.service.init();
    staffManage.eventHandler.handleEvents();
});

var staffManage = {};
var org = [];

var jsonData ={};

staffManage.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
        $('input').val('');
        $.ajax({
            type: "POST",
            url: MW.server + "/fetchOrgUser",
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    var $data = data.data;
                    for(var i = 0; i < $data.length; ++ i) {
                        if(jsonData[$data[i][1]] == undefined) {
                            jsonData[$data[i][1]] = [];
                            jsonData[$data[i][1]].push($data[i]);
                        }else {
                            jsonData[$data[i][1]].push($data[i]);
                        }
                    }

                    $.each(jsonData, function(name, value) {
                        $('#staffs').append('<div class="weui-cells__title">' + name + '</div>');
                        var code = ' <div class="weui-cells">';
                        for(var i = 0; i < value.length; ++ i) {
                            code += '<a class="weui-cell weui-cell_access" href="javascript:;">\n' +
                                '            <div class="weui-cell__bd">\n' +
                                '                <p>' + value[i][3] + '</p>\n' +
                                '            </div>\n' +
                                '            <div class="weui-cell__ft">\n' +
                                '            </div>\n' +
                                '        </a>'
                        }
                        code += '</div>';
                        $('#staffs').append(code);
                    });

                } else $.toptip('操作失败，请检查用户名或密码是否正确!', 'error');
            }, error:
                function (data) {
                    $.toptip('操作失败!请检查网络情况或与系统管理员联系！', 'error');
                }
        });
        $("#department").select({
            title: "选择手机",
            items: [
                {
                    title: "财务部",
                    value: "4",
                },
                {
                    title: "研发部",
                    value: "1001",
                },
                {
                    title: "学生会",
                    value: "1002",
                }
            ]
        });
    }
};

staffManage.eventHandler = {
    handleEvents: function () {
        this.handleAdd();
    }, handleAdd: function () {
        $('#add').click(function () {
            $('input').val('');
            $("#info").popup();
        })
    }
};