$(function () {
    wfcreate.service.init();
    wfcreate.eventHandler.handleEvents();
})

var wfcreate = {};
var staffSelected = [];
var staffData = {};
var viewData = [];

wfcreate.service = {
    init: function () {
        this.initControl();
        this.initstaff();
    }, initControl: function () {

    }, initstaff: function () {
        var setting = {
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: { "Y": "ps", "N": "ps" }
            },
            view: {
                showIcon: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };

        $.ajax({
            type: "POST",
            url: MW.server + "/fetchOrgUser",
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    var $data = data.data;

                    for(var i = 0; i < $data.length; ++ i) {
                        if(staffData[$data[i][1]] == undefined) {
                            staffData[$data[i][1]] = {};
                            staffData[$data[i][1]].id = $data[i][0]
                            staffData[$data[i][1]].value = [];
                            staffData[$data[i][1]].value.push($data[i]);
                        }else {
                            staffData[$data[i][1]].value.push($data[i]);
                        }
                    }

                    for(var i in staffData) {
                        var temp = {};
                        temp.id = '' + staffData[i].id;
                        temp.name = i;
                        temp.open = true;
                        temp.children = [];
                        for(var j in staffData[i].value) {
                            var tempj = {};
                            tempj.id = '' + staffData[i].value[j][2];
                            tempj.name = staffData[i].value[j][3];
                            temp.children.push(tempj);
                        }
                        viewData.push(temp);
                    }
                    $(document).ready(function() {
                        $.fn.zTree.init($("#staffTree"), setting, viewData);
                    });

                } else layer.msg('操作失败!请检查网络情况或与系统管理员联系！！', {icon: 2});
            }, error: function (data) {
                layer.msg('操作失败!请检查网络情况或与系统管理员联系！！', {icon: 2});
            }
        });
    }, addTopic: function () {
        layer.open({
            type: 2,
            title: '表单元素设置',
            closeBtn: 1,
            shadeClose: true,
            skin: 'layui-layer-molv',
            area: '600px',
            content: 'topicInfo.html',
            btn: ['确定', '取消'],
            btnAlign: 'c',
            yes: function (index, layero) {
                layer.msg('确定！', {icon: 1});
                layer.close(index);
            }, btn2: function (index, layero) {
                layer.msg('确定！', {icon: 1});
            }
        });
    }, addOption: function () {
        layer.open({
            type: 2,
            title: '表单元素设置',
            closeBtn: 1,
            shadeClose: true,
            skin: 'layui-layer-molv',
            area: ['600px', '400px'],
            content: 'topicInfo2.html',
            btn: ['确定', '取消'],
            btnAlign: 'c',
            yes: function (index, layero) {
                layer.msg('确定！', {icon: 1});
                layer.close(index);
            }, btn2: function (index, layero) {
                layer.msg('确定！', {icon: 1});
            }
        });
    }
};

wfcreate.eventHandler = {
    handleEvents: function () {
        this.handleSubmit();
        this.handleDelete();
        this.handleAddModule();
        this.handleModules();
        this.handleModule();
    }, handleSubmit: function () {
        $('.submit').click(function () {
            layer.confirm('确定保存该申流程吗？', {
                btn: ['确定','取消'] //按钮
            }, function() {
                layer.msg('添加成功！', {icon: 1});
            }, function() {});
        })
    }, handleDelete: function () {
        $('.delete').click(function () {
            var self = $(this);
            var node = self.parents(".layui-form-item");
            var i = 1;
            layer.confirm('确定删除该模块吗？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                node.remove();
                layer.msg('删除成功！', {icon: 1});
            }, function(){});
        })
    }, handleAddModule: function () {

    }, handleModules: function () {
        $('#addmodule').click(function () {
            $('#modules').css('display', 'block');
        })
    }, handleModule:function () {
        $('.module').click(function () {
            var self = $(this);
            var type = self.data('type');

            switch (type)
            {
                case 'single':
                    wfcreate.service.addTopic();
                    $('#table').append();
                    break;
                case 'muti':
                    wfcreate.service.addTopic();
                    $('#table').append();
                    break;
                case 'city':
                    wfcreate.service.addTopic();
                    $('#table').append();
                    break;
                case 'number':
                    wfcreate.service.addTopic();
                    $('#table').append();
                    break;
                case 'checkbox':
                    wfcreate.service.addOption();
                    $('#table').append();
                    break;
                case 'radio':
                    wfcreate.service.addOption();
                    $('#table').append();
                    break;
            }
            $('#modules').css('display', 'none');
        })
    }
}
