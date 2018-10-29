$(function () {
    linkInfo.service.init();
    linkInfo.eventHandler.handleEvents();
});

var linkInfo = {};
var count = 0;

var data;

linkInfo.service = {
    init : function () {
        this.initControl();
    },initControl : function () {
        var formBody = JSON.parse(localStorage.getItem('formBody'));
        layui.config({
            base: 'js/',
        })
        layui.use(['interact'],function(){
            var interact = layui.interact;

            var len = Object.keys(formBody).length;
            var data = [];
            var counter = len;

            var i = 1;
            for(var obj in formBody) {
                var condition = {
                    "id" : i,
                    "pid" : 0,
                    "title" : obj
                };
                data.push(condition);
                switch (formBody[obj].type) {
                    case 'single':
                        data.push({"id": ++counter, "pid": i, "title": "包含"});
                        data.push({"id": ++counter, "pid": i, "title": "不包含"});
                        break;
                    case 'muti':
                        data.push({"id": ++counter, "pid": i, "title": "包含"});
                        data.push({"id": ++counter, "pid": i, "title": "不包含"});
                        break;
                    case 'city':
                        data.push({"id": ++counter, "pid": i, "title": "包含"});
                        data.push({"id": ++counter, "pid": i, "title": "不包含"});
                        break;
                    case 'number':
                        data.push({"id": ++counter, "pid": i, "title": "大于"});
                        data.push({"id": ++counter, "pid": i, "title": "等于"});
                        data.push({"id": ++counter, "pid": i, "title": "小于"});
                        break;
                    case 'checkbox': break;
                    case 'radio': break;
                }
                ++ i;
            }
            interact.render({
                elem : '.condition0',
                title : '设置条件',
                data : data,
                name : 'region1',
                hint : ['请选择判断域','请选择判断条件'],
            });
        })
    }
}
linkInfo.eventHandler = {
    handleEvents : function () {
        this.addItem();
    }, addItem: function () {
        $('#addItem').click(function () {
            var condition = 'condition' + ++count;
            $('#conditions').append('<div class="term" style="clear: both">\n' +
                '            <div class="layui-form-inline" style="float: left">\n' +
                '                <div class="layui-form-item ' + condition + '"></div>\n' +
                '            </div>\n' +
                '            <div class="layui-input-inline" style="float: left">\n' +
                '                <input type="text"  class="layui-input" placeholder="请输入值">\n' +
                '            </div>\n' +
                '            <div class="layui-input-inline" >\n' +
                '                <i class="layui-icon layui-icon-close-fill remove" style="margin-left: 10px;font-size: 40px;color: #d9534f"></i>\n' +
                '            </div>\n' +
                '        </div>');

            layui.use(['interact'], function() {
                var interact = layui.interact;
                interact.render({
                    elem : '.' + condition,
                    title : '设置条件',
                    data : data,
                    name : 'region1',
                    hint : ['请选择省份','请选择城市'],
                });
            })
        })
    }
}
