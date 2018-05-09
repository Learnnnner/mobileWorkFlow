$(function () {
    Org.service.init();
    Org.eventHandler.handleEvents();
});

var Org= {};

Org.service = {
    init: function () {
        
    }, initControl: function () {
        $.ajax({
            type: "POST",
            url: MW.server + "/fetchOrgs",
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    console.log(data);
                } else $.alert("操作失败，请检查用户名或密码是否正确!")
            }, error:
                function (data) {
                    console.log(data.status);
                    $.alert("操作失败!请检查网络情况或与系统管理员联系！")
                }
        })
    }
};

Org.eventHandler = {
    handleEvents: function () {
        this.handleDelete();
        this.handleEdit();
    },handleDelete: function () {
        $(document).on('click', '.delete', function () {
            var self = $(this);
            $.confirm("确定要删除该元素吗？", function() {
                var node = self.parents('.weui-form-preview');
                node.remove();
            }, function() {
                //点击取消后的回调函数
            });
        })
    },handleEdit: function () {
        $(document).on('click', '.edit', function () {

        })
    }
}