$(function () {
    Org.service.init();
    Org.eventHandler.handleEvents();
});

var Org= {};
var optObj;
var authList;

Org.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
        $.ajax({
            type: "POST",
            url: MW.server + "/fetchOrgs",
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    for (var i = 0; i< data.orgList.length; ++ i) {
                        $('#org-container').append('<div id="'+data.orgList[i][0]+'" class="weui-form-preview" style="margin-bottom: 2vw">\n' +
                            '                <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">\n' +
                            '                    <div class="weui-media-box__bd">\n' +
                            '                        <h4 class="weui-media-box__title">' + data.orgList[i][1] + '</h4>\n' +
                            '                        <p class="weui-media-box__desc">' + data.orgList[i][2] + '</p>\n' +
                            '                    </div>\n' +
                            '                </a>\n' +
                            '                <div class="weui-form-preview__ft">\n' +
                            '                    <a class="weui-form-preview__btn weui-form-preview__btn_default delete" href="javascript:">删除</a>\n' +
                            '                    <button type="submit" class="weui-form-preview__btn weui-form-preview__btn_primary edit" href="javascript:">编辑</button>\n' +
                            '                </div>\n' +
                            '            </div>')
                    }

                    authList = data.authList;
                    for (var i = 0; i< authList.length; ++ i) {
                        $('#authorization').append('<div class="authority-option" style="margin-top: 0">\n' +
                            '                        <table>\n' +
                            '                            <tr>\n' +
                            '                                <td>\n' +
                            '                                    <div class="weui-grid__icon">\n' +
                            '                                        <svg class="icon-30px" style="color: #551A8B" aria-hidden="true">\n' +
                            '                                            <use xlink:href="'+ authList[i][4] +'"></use>\n' +
                            '                                        </svg>\n' +
                            '                                    </div>\n' +
                            '                                </td>\n' +
                            '                                <td>\n' +
                            '                                    <input id="'+ authList[i][0] +'" class="weui-switch" type="checkbox">\n' +
                            '                                </td>\n' +
                            '                            </tr>\n' +
                            '                        </table>\n' +
                            '                    </div>')
                    }
                } else $.toptip('操作失败，请检查用户名或密码是否正确!', 'error');
            }, error:
                function (data) {
                    $.toptip('操作失败!请检查网络情况或与系统管理员联系！', 'error');
                }
        })
    }
};

Org.eventHandler = {
    handleEvents: function () {
        this.handleDelete();
        this.handleEdit();
        this.handleAdd();
        this.handleSave();
        this.handleCancel();
        this.handleEditCommit();
    }, handleDelete: function () {
        $(document).on('click', '.delete', function () {
            var self = $(this);
            $.confirm("确定要删除该部门吗？", function() {
                var node = self.parents('.weui-form-preview');
                var id = node.attr('id');
                var data = {'id' : id};
                $.ajax({
                    type: "POST",
                    url: MW.server + "/deleteOrg",
                    dataType: "json",
                    data: JSON.stringify(data),
                    success: function (data) {
                        if (200 == data.status) {
                            node.remove();
                            $.toptip('操作成功', 'success');
                        } else $.toptip('操作失败，请检查用户名或密码是否正确!', 'error');
                    }, error:
                        function (data) {
                            $.toptip('操作失败!请检查网络情况或与系统管理员联系！', 'error');
                        }
                })
            }, function() {});
        })
    }, handleEdit: function () {
        $(document).on('click', '.edit', function () {
            var self = $(this);
            var node = self.parents('.weui-form-preview');
            optObj = node;
            var obj = node.attr('id');
            var name = node.find('.weui-media-box__title').html();
            var description = node.find('.weui-media-box__desc').html();
            $('#edit-name').val(name);
            $('#edit-description').val(description);
            $.ajax({
                type: "POST",
                url: MW.server + "/fetchAuthList",
                data: JSON.stringify({id: obj}),
                dataType: "json",
                success: function (data) {
                    if (200 == data.status) {
                        for(var i = 0; i< data.data.length; ++ i) {
                            $('#'+data.data[i][0]).attr("checked","true");
                        }
                        $("#editPop").popup();
                    } else $.toptip('操作失败，请检查用户名或密码是否正确!', 'error');
                }, error:
                    function (data) {
                        $.toptip('操作失败!请检查网络情况或与系统管理员联系！', 'error');
                    }
            })
        })
    }, handleAdd: function () {
        $(document).on('click', '#add', function () {
            $('#id').val();
            $('#name').val();
            $('#description').val();
            $('#auth-Container').empty();
            for (var i = 0; i< authList.length; ++ i) {
                $('#auth-Container').append('<div class="authority-option" style="margin-top: 0">\n' +
                    '                        <table>\n' +
                    '                            <tr>\n' +
                    '                                <td>\n' +
                    '                                    <div class="weui-grid__icon">\n' +
                    '                                        <svg class="icon-30px" style="color: #551A8B" aria-hidden="true">\n' +
                    '                                            <use xlink:href="'+ authList[i][4] +'"></use>\n' +
                    '                                        </svg>\n' +
                    '                                    </div>\n' +
                    '                                </td>\n' +
                    '                                <td>\n' +
                    '                                    <input data-id="'+ authList[i][0] +'" class="weui-switch" type="checkbox">\n' +
                    '                                </td>\n' +
                    '                            </tr>\n' +
                    '                        </table>\n' +
                    '                    </div>');
            }
            $("#addList").popup();
        })
    }, handleSave: function () {
        $('#save').click(function () {
            var id = $('#id').val();
            var name = $('#name').val();
            var desciption = $('#desciption').val();
            if(id == '' || id == undefined || id == null || name == '' || name == undefined || name == null) {
                $.toptip('操作失败,请输入部门编号和名称', 'error');
            }else {
                var authorization = [];
                $('#auth-Container').find('input:checked').each(function () {
                    authorization.push($(this).data('id'));
                });

                var data = {
                    'id': id,
                    'name' : name,
                    'description': desciption,
                    'authorization':authorization
                }

                $.ajax({
                    type: "POST",
                    url: MW.server + "/addOrg",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function (data) {
                        if (200 == data.status) {
                            var url = MW.server + '/function';
                            location.href = url;
                        } else $.toptip("登录失败，请检查用户名或密码是否正确!", 'error')
                    }, error:
                        function (data) {
                            $.toptip("操作失败!请检查网络情况或与系统管理员联系！", 'error')
                        }
                })
            }
        })
    }, handleCancel: function () {

    }, handleEditCommit: function () {
        $(document).on('click', '#edit-save', function () {
            var id = optObj.attr('id');
            var name = $('#edit-name').val();
            var description = $('#edit-description').val();

            var authorization = [];
            $('#authorization').find('input:checked').each(function () {
                authorization.push($(this).attr('id'));
            });

            var data = {
                'id': id,
                'name': name,
                'description': description,
                'authorization': authorization
            };

            $.ajax({
                type: "POST",
                url: MW.server + "/editOrg",
                data: JSON.stringify(data),
                dataType: "json",
                success: function (data) {
                    if (200 == data.status) {
                        optObj.find('.weui-media-box__title').html(name);
                        optObj.find('.weui-media-box__desc').html(description);
                        $.toptip("修改成功!", "success");
                        $.closePopup();
                    } else $.toptip("修改异常!", "error");
                }, error: function (data) {
                    // console.log(data);
                    $.toptip("修改异常!", "error")
                }
            })
        })
    }
}