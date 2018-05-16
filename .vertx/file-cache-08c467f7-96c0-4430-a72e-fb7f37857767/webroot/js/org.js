$(function () {
    Org.service.init();
    Org.eventHandler.handleEvents();
});

var Org= {};

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
                    console.log(data);
                    for (var i = 0; i< data.orgList.length; ++i) {
                        $('#org-container').append('<div id="'+data.orgList[i][0]+'" class="weui-form-preview" style="margin-bottom: 2vw">\n' +
                            '                <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">\n' +
                            '                    <div class="weui-media-box__bd">\n' +
                            '                        <h4 class="weui-media-box__title">' + data.orgList[i][1] + '</h4>\n' +
                            '                        <p class="weui-media-box__desc">' + data.orgList[i][5] + '</p>\n' +
                            '                    </div>\n' +
                            '                </a>\n' +
                            '                <div class="weui-form-preview__ft">\n' +
                            '                    <a class="weui-form-preview__btn weui-form-preview__btn_default delete" href="javascript:">删除</a>\n' +
                            '                    <button type="submit" class="weui-form-preview__btn weui-form-preview__btn_primary edit" href="javascript:">编辑</button>\n' +
                            '                </div>\n' +
                            '            </div>')
                    }
                } else $.toptip('操作失败，请检查用户名或密码是否正确!', 'error');
            }, error:
                function (data) {
                    console.log(data.status);
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
    }, handleDelete: function () {
        $(document).on('click', '.delete', function () {
            var self = $(this);
            $.confirm("确定要删除该元素吗？", function() {
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
            }, function() {
                //点击取消后的回调函数
            });
        })
    }, handleEdit: function () {
        $(document).on('click', '.edit', function () {

        })
    }, handleAdd: function () {
        $(document).on('click', '#add', function () {
            $("#addList").popup();
        })

    }, handleSave: function () {
        
    }, handleCancel: function () {
        $('#save').click(function () {
            var id = $('#id').valueOf();
            var name = $('#name').valueOf();
            var desciption = $('#desciption').valueOf();
            if(id == '' || id == undefined || id == null || name == '' || name == undefined || name == null) {
                $.toptip('操作失败,请输入部门编号和名称', 'error');
            }else {
                var data = {
                    'id': id,
                    'data' : data,
                    'description': desciption
                }

                $.ajax({
                    type: "POST",
                    url: MW.server + "/login",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function (data) {
                        if (200 == data.status) {
                            var url = MW.server + '/function';
                            location.href = url;
                        } else $.alert("登录失败，请检查用户名或密码是否正确!")
                    }, error:
                        function (data) {
                            console.log(data.status);
                            $.alert("操作失败!请检查网络情况或与系统管理员联系！")
                        }
                })
            }
        })
    }
}