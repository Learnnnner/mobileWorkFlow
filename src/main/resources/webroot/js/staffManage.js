$(function () {
    staffManage.service.init();
    staffManage.eventHandler.handleEvents();
    $('.weui-cell_swiped').swipeout();
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
                            org.push(
                                {
                                    title: $data[i][1],
                                    value: $data[i][0],
                                });
                            jsonData[$data[i][1]] = [];
                            jsonData[$data[i][1]].push($data[i]);
                        }else {
                            jsonData[$data[i][1]].push($data[i]);
                        }
                    }
                    $.each(org, function(name, value) {
                        $('#staffs').append('<div id="' +  value.value + '" class="weui-cells__title">' + value.title + '</div>');
                        var code = ' <div class="weui-cells">';
                        for(var i = 0; i < jsonData[value.title].length; ++ i) {
                            code += '<div class="weui-cell weui-cell_swiped" data-id="'+jsonData[value.title][i][2]+'">\n' +
                                '            <div class="weui-cell__bd">\n' +
                                '                <a class="weui-media-box weui-media-box_appmsg">\n' +
                                '                    '+ jsonData[value.title][i][3] +'\n' +
                                '                </a>\n' +
                                '            </div>\n' +
                                '            <div class="weui-cell__ft">\n' +
                                '                <a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout item-delete" href="javascript:">删除</a>\n' +
                                '            </div>\n' +
                                '        </div>';
                        }
                        code += '</div>';
                        $('#staffs').append(code);
                    });

                    $('.weui-cell_swiped').swipeout();
                    $("#department").select({
                        title: "选择部门",
                        items: org,
                    });
                } else $.toptip('操作失败，请检查用户名或密码是否正确!', 'error');
            }, error:
                function (data) {
                    $.toptip('操作失败!请检查网络情况或与系统管理员联系！', 'error');
                }
        });
    }
};

staffManage.eventHandler = {
    handleEvents: function () {
        this.handleAdd();
        this.handleSave();
        this.handleDelete();
        this.handleEdit();
    }, handleAdd: function () {
        $('#add').click(function () {
            $('input').val('');
            $("#info").popup();
        })
    }, handleSave: function () {
        $('#save').click(function () {
            var orgid = $('#department').data('values');
            var orgname = $('#department').val();

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
                url: MW.server + "/addOrgUser",
                data: JSON.stringify(userdata),
                dataType: "json",
                success: function (data) {
                    if (200 == data.status) {
                        var s = '#'+ orgid;
                        var obj = $('#staffs').children(s).next();
                        var classname = obj.attr('class');
                        if($.inArray("weui-cells", classname)){
                            obj.append('<div class="weui-cell weui-cell_swiped" data-id="' + $('#id').val() + '">\n' +
                                '            <div class="weui-cell__bd">\n' +
                                '                <a class="weui-media-box weui-media-box_appmsg">\n' +
                                '                    '+ $('#loginname').val() +'\n' +
                                '                </a>\n' +
                                '            </div>\n' +
                                '            <div class="weui-cell__ft">\n' +
                                '                <a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout item-delete" href="javascript:">删除</a>\n' +
                                '            </div>\n' +
                                '        </div>');
                        } else {
                            $('#staffs').insertAfter(s).append('<div class="weui-cell weui-cell_swiped" data-id="' + $('#id').val() + '">\n' +
                                '            <div class="weui-cell__bd">\n' +
                                '                <a class="weui-media-box weui-media-box_appmsg">\n' +
                                '                    '+ $('#loginname').val() +'\n' +
                                '                </a>\n' +
                                '            </div>\n' +
                                '            <div class="weui-cell__ft">\n' +
                                '                <a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout item-delete" href="javascript:">删除</a>\n' +
                                '            </div>\n' +
                                '        </div>');
                        }

                        jsonData[orgname].push([orgid, orgname,  $('#id').val(), $('#realname').val()
                            , $('#password').val(), $('#telephone').val(), $('#email').val(), $('#enable').val(), 0])
                        $.toptip("用户添加成功", 'success');
                        $.closePopup();
                    } else $.toptip("添加失败，请检查网络情况或与系统管理员联系!", 'error')
                }, error: function (data) {
                    $.toptip("操作失败!请检查网络情况或与系统管理员联系！", 'error')
                }
            })
        })
    }, handleDelete: function () {
        $(document).on('click', '.item-delete', function () {
            var self = $(this);
            var node = self.parents('.weui-cell');
            $.confirm("删除该条目吗？", function() {
                var id = node.data('id');
                $.ajax({
                    type: "POST",
                    url: MW.server + "/deleteOrgUser",
                    dataType: "json",
                    data: JSON.stringify({id : id}),
                    success: function (data) {
                        if (200 == data.status) {
                            node.remove();
                            $.toptip('删除成功', 'success');
                        } else $.toptip("添加失败，请检查网络情况或与系统管理员联系!", 'error');
                    }, error: function (data) {
                        $.toptip("操作失败!请检查网络情况或与系统管理员联系！", 'error');
                    }
                })
            }, function() {
                return;
            })
        })
    }, handleEdit : function () {
        
    }
};