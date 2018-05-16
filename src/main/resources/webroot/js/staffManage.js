$(function () {
    staffManage.service.init();
    staffManage.eventHandler.handleEvents();
});

var staffManage = {};
var org = [];

staffManage.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
        $('input').val('');
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