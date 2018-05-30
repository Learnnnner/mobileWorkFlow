$(function () {
    workFlow.service.init();
    workFlow.eventHandler.handleEvents();}
);

var workFlow = {};
var jspInstance;

var tempNode;        //操作对象字典
var connArr = [];           //连线数组
var name2Id = new Array();  //定义一个名称到ID的映射字典
var optObj = {};            //记录操作的对象
var optList = [];           //操作对象的数据
var nodeCount = 0;          //记录节点数量

var next = ['填写表单', '经理审批', '总经理审批', '获得报销款'];
var keywords = [];
var node = {
    '填写表单': [
        {
            'keywords': ['金额'],
            'rule'    : ['小于'],

            'nextNode': '经理审批',
        }, {
            'keywords': ['金额'],
            'rule'    : ['大于'],
            'value'   : [1000],
            'value'   : [1000],
            'dealer'  : {
                'relation': 'and',
                'dealer': []
            },
            'nextNode': '总经理审批',
        }
    ],

    '经理审批': [
        {
            'keywords': ['默认'],
            'rule'    : ['默认'],
            'value'   : ['默认'],
            'value'   : [1000],
            'dealer'  : {
                'relation': 'and',
                'dealer': []
            },
            'nextNode': '获得报销款',
        }
    ],

    '总经理审批': [
        {
            'keywords': ['默认'],
            'rule'    : ['默认'],
            'value'   : ['默认'],
            'value'   : [1000],
            'dealer'  : {
                'relation': 'and',
                'dealer': []
            },
            'nextNode': '获得报销款',
        }
    ],

    '获得报销款': []
}

// var node = {};

var connectorPaintStyle = {
    strokeWidth: 3,
    stroke: '#5c96bc'
};

workFlow.service = {
    init: function () {
        this.jspInitial();
        this.initControl();
        this.initAction();
    }, //初始化工作流组件
    jspInitial: function () {
        jsPlumb.bind("ready",function() {});
    }, initControl: function () {
        tempNode =  $.extend(true, {}, node);
        $(".keywords").picker({
            title: "请选择关键字",
            cols: [{
                    textAlign: 'center',
                    values: ['默认', '金额', '日期']
                }]
        });

        $(".rule").picker({
            title: "请选择规则",
            cols: [{
                    textAlign: 'center',
                    values: ['大于', '小于']
                }]
        });

        $(".value").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['1000', '3000', '5000']
                }
            ]
        });

        $(".nextNode").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: next
                }
            ]
        });
    }, initAction: function () {

        jspInstance = jsPlumb.getInstance(
            {
                Anchor: 'Continuous',
                Connector: 'Flowchart',
                Endpoint: ["Dot", {radius: 2}],
                ConnectionOverlays: [
                    [ 'Arrow', { location: 0.9, width: 20, length: 20, foldback: 0.8}],
                ],
                PaintStyle: connectorPaintStyle
            });

        for (var i in tempNode) {
            $("#workspace").append("<div id = 'action_" + nodeCount + "' class='action'>"+ i +"</div>\n");
            name2Id[i] =  'action_' + nodeCount;
            nodeCount ++;
        }

        jspInstance.draggable($('.action'), {
            containment: "workspace"
        });

        for (var i in tempNode) {
            for (var j in tempNode[i]) {
                workFlow.service.connectModule(name2Id[i], name2Id[tempNode[i][j].nextNode]);
            }
        }

    }, initCondition: function () {
        $('#condition').find('.conditionItems').empty().append('<div class="conditionItem">\n' +
            '                <div class="weui-cell">\n' +
            '                    <div class="weui-cell__hd"><label class="weui-label">关键字</label></div>\n' +
            '                    <div class="weui-cell__bd">\n' +
            '                        <input id="keywords" class="weui-input keywords" type="text" placeholder="请输入关键字">\n' +
            '                    </div>\n' +
            '\n' +
            '                </div>\n' +
            '\n' +
            '                <div class="weui-cell">\n' +
            '                    <div class="weui-cell__hd"><label class="weui-label">规则</label></div>\n' +
            '                    <div class="weui-cell__bd">\n' +
            '                        <input id="rule" class="weui-input rule" type="text" placeholder="请输入规则">\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '\n' +
            '                <div class="weui-cell">\n' +
            '                    <div class="weui-cell__hd"><label class="weui-label">值</label></div>\n' +
            '                    <div class="weui-cell__bd">\n' +
            '                        <input class="weui-input value" type="text" placeholder="请输入值">\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>');
        $('.nextNode').val('');

        $(".keywords").picker({
            title: "请选择关键字",
            cols: [
                {
                    textAlign: 'center',
                    values: ['金额', '日期']
                }
            ]
        });

        $(".rule").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['大于', '小于']
                }
            ]
        });

        $(".value").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['1000', '3000', '5000']
                }
            ]
        });

        $(".nextNode").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: next
                }
            ]
        });
    }, //条件列表

    showList: function() {
        $('#list').find('.listItem').remove();

        if( optList != null ) {
            for (var i in optList) {
                var str = '';
                for (var j = 0; j < optList[i].keywords.length; j++) {
                    str += optList[i].keywords[j] +'&nbsp'+ optList[i].rule[j] +'&nbsp'+ optList[i].value[j]+'<br>';
                }
                str += '跳转至&nbsp';
                str += optList[i].nextNode;
                $('#list').find('.listItems').append('<div class="weui-cells listItem">\n' +
                    '            <div class="weui-cell weui-cell_swiped">\n' +
                    '                <div class="weui-cell__bd">\n' +
                    '                    <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">\n' +
                    '                        <div class="weui-media-box__bd">\n' +
                    '                            <h4 class="weui-media-box__title">条件</h4>\n' +
                    '                            <p class="weui-media-box__desc" style="display: block; ">' + str + '<br></p>\n' +
                    '                        </div>\n' +
                    '                    </a>\n' +
                    '                </div>\n' +
                    '                <div class="weui-cell__ft">\n' +
                    '                    <a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout item-delete" href="javascript:">删除</a>\n' +
                    '                </div>\n' +
                    '            </div>\n' +
                    '        </div>');
            }
        }

        $('.weui-cell_swiped').swipeout();

        $('#bgDiv').css({
            display: "block",
            transition: "opacity .5s"
        });

        $('#list').css({
            right: "0px",
            transition: "right 1s"
        });
    }, hideList: function () {
        $('#bgDiv').css({
            display: "none",
            transition: "display 1s"
        });

        $('#list').css({
            right: "-50%",
            transition: "right .5s"
        });
    }, //条件配置
    showConditionSet: function () {
        $('#bgDiv2').css({
            display: "block",
            transition: "opacity .5s"
        });

        $('#condition').css({
            right: "0px",
            transition: "right 1s"
        });
    }, hideConditionSet: function() {
        $('#bgDiv2').css({
            display: "none",
            transition: "display 1s"
        });

        $('#condition').css({
            right: "-50%",
            transition: "right .5s"
        });
    }, //发布
    wfDistribute: function() {
        $.toptip('工作流已发布', 'success');
    }, //保存操作
    wfSave: function () {

        var data = {

        };

        $.ajax({
            type: "POST",
            url: MW.server + "/savewf",
            data: JSON.stringify(userdata),
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    $.toptip('工作流已保存', 'success');
                } else {

                }
            }, error: function (data) {
                $.toptip("操作失败!请检查网络情况或与系统管理员联系！", 'error')
            }
        });


    }, //清空操作
    wfEmpty: function () {
        $.confirm({
            title: '删除',
            text: '确认删除所有工作流配置吗',
            onOK: function () {
                connArr.splice(0, connArr.length);           //连线数组
                name2Id.splice(0, name2Id.length);  //定义一个名称到ID的映射字典
                optList.splice(0, optList.length);           //操作对象的数据
                nodeCount = 0;

                for(var key in tempNode){
                    delete tempNode[key];
                }

                $('#workspace').empty();
            },
            onCancel: function () {
                return;
            }
        });
    }, //删除一个action
    delAction: function () {
        $.confirm("确定要删除该模块吗", function() {
            var name = optObj.html();
            delete tempNode[name];
            jspInstance.remove(optObj);

            for (var i in tempNode) {
                for(var j in tempNode[i]) {
                    if (tempNode[i][j].nextNode == name)
                        tempNode[i].splice(j, 1);
                }
            }
            $.toptip('删除成功', 'success');
        }, function() {
            return;
        });
    }, //设置模板
    setTemplate: function () {
        $.toptip('模板已设置', 'success');
    }, //设置关联人员
    setStaff: function () {
        $('#staff-list').popup();
    }, //添加一个跳转条件
    addConditionItem: function () {
        $(".conditionItems").append (
            '<div class="conditionItem">\n' +
            '                <div class="weui-cell">\n' +
            '                    <div class="weui-cell__hd"><label class="weui-label">关键字</label></div>\n' +
            '                    <div class="weui-cell__bd">\n' +
            '                        <input id="keywords" class="keywords weui-input" type="text" placeholder="请输入关键字">\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '\n' +
            '                <div class="weui-cell">\n' +
            '                    <div class="weui-cell__hd"><label class="weui-label">规则</label></div>\n' +
            '                    <div class="weui-cell__bd">\n' +
            '                        <input id="rule" class="rule weui-input" type="text" placeholder="请输入规则">\n' +
            '                    </div>\n' +
            '\n' +
            '                </div>\n' +
            '\n' +
            '                <div class="weui-cell">\n' +
            '                    <div class="weui-cell__hd"><label class="weui-label">值</label></div>\n' +
            '                    <div class="weui-cell__bd">\n' +
            '                        <input id="value" class="value weui-input" type="text" placeholder="请输入值">\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>'
        );

        $(".keywords").picker({
            title: "请选择关键字",
            cols: [
                {
                    textAlign: 'center',
                    values: ['金额', '日期']
                }
            ]
        });

        $(".rule").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['大于', '小于']
                }
            ]
        });

        $(".value").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['1000', '3000', '5000']
                }
            ]
        });

    }, getData: function(str) {
        return tempNode[str] ;
    }, addData: function () {
        var keyArr =[];
        var rulArr =[];
        var valArr =[];
        var next;

        if($('.keywords').val().length <= 1) {
            keyArr.push($('.keywords').val());
            rulArr.push($('.rule').val());
            valArr.push($('.value').val());
            next = $('.nextNode').val();
        } else {
            $('.keywords').each(function () {
                keyArr.push($(this).val());
            }), $('.rule').each(function () {
                rulArr.push($(this).val());
            }), $('.value').each(function () {
                valArr.push($(this).val());
            }),
            next = $('.nextNode').val();
        }

        if(keyArr.length > 1) {
            for (var i in keyArr) {
                if( keyArr[i] == '' ||  rulArr[i] == '' || valArr[i] == '' || next == '') {
                    $.toptip('判断条件不能为空','error');
                    return false;
                }
            }
        }

        for (var i in optList) {
            if( this.ArrayEquals(optList[i].keywords, keyArr)
                && this.ArrayEquals(optList[i].rule, rulArr)
                && this.ArrayEquals(optList[i].value, valArr)
                && optList[i].nextNode == next) {
                $.toptip('添加条件有重复','error');
                return false;
            }
        }

        optList.push({
            'keywords' : keyArr,
            'rule' : rulArr,
            'value' : valArr,
            'nextNode' : next,
        });
        return true;
    }, ArrayEquals: function (a, b) {
        if(a.length != b.length) return false;
        for ( var i = 0; i < a.length; i++) {
            if (a[i] != b[i] ) return false;
        }
        return true;
    }, connectModule: function (source, destination) {
        var conn =  jspInstance.connect({
            source: source,
            target: destination,
        });
        connArr.push(conn);
    }, dispatchModule: function (sourceId, targetId) {
        for(var i = 0; i < connArr.length; i++) {
            if(connArr[i].sourceId == sourceId && connArr[i].targetId == targetId) {
                jspInstance.deleteConnection(connArr[i]);
                connArr.splice(i, 1);
                return;
            }
        }
    }
};

workFlow.eventHandler = {
    handleEvents: function () {
        this.handleAddAction();
        this.handleWfOp();
        this.handleSetAction();
        this.handleConfirmStaff();
        this.handleSelectStaff();
        this.handleCancelStaff();
        this.handleAddItem();
        this.handleConfirmItems();
        this.handleConfigureCondition();
        this.handleConfirmCondition();
        this.handleCancelCondition();
        this.handleCancelItems();
        this.handleItemDelete();
        this.handleConditionCancel();
    }, handleAddAction: function () {
        $(".module").click(function () {
            $.prompt("请输入模块名称", function(text) {
                if(tempNode.hasOwnProperty(text)) {
                    $.toptip('模块添加失败，有重复的模块名称', 'error');
                    return;
                }
                $("#workspace").append("<div id = 'action_" + nodeCount + "' class='action'>"+ text +"</div>\n");
                var $Id = 'action_' + nodeCount;

                jspInstance.draggable($('#' + $Id), {
                    containment: "workspace"
                });

                tempNode[text] = [];
                next.push(text);
                name2Id[text] = $Id;
                nodeCount ++;
            }, function() {
                return;
            });
        })
    }, handleWfOp: function () {
        $('#operation').click(function () {
            $.actions({
                actions: [{
                    text: "发布",
                    onClick: function() {
                        workFlow.service.wfDistribute();
                    }
                }, {
                    text: "保存",
                    onClick: function() {
                        workFlow.service.wfSave();
                    }
                }, {
                    text: "清除",
                    onClick: function() {
                        workFlow.service.wfEmpty();
                    }
                }]
            });

        })
    }, handleSetAction: function () {
        var move = false;
        $(document).on("touchmove", '.action', function() {
            move = true;
        });

        $(document).on('touchend', '.action', function() {

            optObj = $(this);
            optList = workFlow.service.getData(optObj.html());

            if(!move) {
                $.actions({
                    actions: [{
                        text: "设置模板",
                        onClick: function() {
                            workFlow.service.setTemplate();
                        }
                    }, {
                        text: "设置条件",
                        onClick: function() {
                            workFlow.service.showList();
                        }
                    }, {
                        text: "关联人员",
                        onClick: function() {
                            workFlow.service.setStaff();
                        }
                    }, {
                        text: "删除",
                        onClick: function() {
                            workFlow.service.delAction();
                        }
                    }]
                });
            }
            move = false;
        });
    }, //确认相关联的人员
    handleConfirmStaff: function () {
        $('#staff-confirm').click(function () {
            $.closePopup();
            $.toptip('人员已设置', 'success');
        });
    }, //取消关联人员操作
    handleCancelStaff: function () {
        $('#staff-cancel').click(function () {
            $.closePopup();
        });
    }, //添加一个跳转条目
    handleAddItem: function () {
        $('#newItem').click(function () {
            workFlow.service.showConditionSet();
        });
    }, //确认跳转条目
    handleConfirmItems: function () {
        $('#list-commit').click(function () {
            node = tempNode;
            workFlow.service.hideList();
        });
    }, handleCancelItems: function () {
        $('#bgDiv').click(function () {
            workFlow.service.hideList();
        });
    }, //配置一个跳转条件
    handleConfigureCondition: function () {
        $('#newCondition').click(function () {
            var keywords = $('.keywords');
            var rule = $('.rule');
            var value = $('.value');
            for(var i = 0; i < keywords.length; i++) {
                if(keywords.eq(i).val() == '' || rule.eq(i).val() == '' || value.eq(i).val() == '') {
                    $.toptip('有条件栏目为空，无法添加新条件', 'warning');
                    return;
                }
            }
            workFlow.service.addConditionItem();
        });
    }, handleConfirmCondition: function () {
        $('#condition-commit').click(function () {
            var keywords = $('.keywords');
            var rule = $('.rule');
            var value = $('.value');
            var nextNode = $('.nextNode').val();
            var str = '';

            for(var i = 0; i < keywords.length; i++) {
                str += keywords.eq(i).val();
                str += '&nbsp';
                str += rule.eq(i).val();
                str += '&nbsp';
                str += value.eq(i).val();
                str += '<br>';
            }

            str = str + '流转至' + '&nbsp' + nextNode;
            if(!workFlow.service.addData()) return;
            $('#list').children('.listItems').append('<div class="weui-cells listItem">\n' +
                '            <div class="weui-cell weui-cell_swiped">\n' +
                '                <div class="weui-cell__bd">\n' +
                '                    <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">\n' +
                '                        <div class="weui-media-box__bd">\n' +
                '                            <h4 class="weui-media-box__title">条件</h4>\n' +
                '                            <p class="weui-media-box__desc" style="display: block;">'+ str +'</p>\n' +
                '                        </div>\n' +
                '                    </a>\n' +
                '                </div>\n' +
                '                <div class="weui-cell__ft">\n' +
                '                    <a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout item-delete" href="javascript:">删除</a>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>');

            $('.weui-cell_swiped').swipeout();
            workFlow.service.hideConditionSet();
            workFlow.service.initCondition();

            var sourceId = optObj.attr('id');
            var node =  $('#workspace').find('.action');
            var destinationId = null;
            for (var i in node) {
                if(node.eq(i).html() == nextNode) {
                    destinationId = node.eq(i).attr('id');
                }
            }
            workFlow.service.connectModule(sourceId, destinationId);
            return null;
        })
    }, handleCancelCondition: function () {
        $('#condition-cancel, #bgDiv2').click(function () {
            workFlow.service.hideConditionSet();
        })
    }, handleSelectStaff: function () {
        $('.staff').click(function () {
            var $obj = $(this);
            var i = $obj.find('i');
            if(i.hasClass('weui-icon-circle')) {
                i.removeClass('weui-icon-circle');
                i.addClass('weui-icon-success');
            }else {
                i.removeClass('weui-icon-success');
                i.addClass('weui-icon-circle');
            }
        })
    }, //删除条目
    handleItemDelete: function () {
        $(document).on('click', '.item-delete',  function () {
            var $this = $(this);
            $.confirm("删除该跳转条目吗？", function() {
                var $Item = $this.parents('.listItem');
                var str = $Item.find('.weui-media-box__desc').html();
                var strArr = str.split('<br>');
                if(strArr[strArr.length - 1] == '') {
                    strArr.splice(strArr.length - 1, 1);
                }

                var deflag = false;
                for (var i in optList) {
                    if(optList[i].keywords.length != strArr.length - 1) { continue; }

                    for(var j = 0; j < optList[i].keywords.length; j ++) {
                        var keys = strArr[j].split('&nbsp;');
                        if(optList[i].keywords[j] == keys[0] && optList[i].rule[j] == keys[1] && optList[i].value[j] == keys[2]) {
                            if (optList[i].keywords.length == j + 1) deflag = true;
                            continue;
                        } else {
                            break;
                        }
                    }

                    if(deflag && optList[i].nextNode == strArr[strArr.length-1].split('&nbsp;')[1]) {
                        $this.parents('.listItem').remove();
                        var a = optList[i].nextNode;
                        var target = name2Id[a]
                        workFlow.service.dispatchModule(optObj.attr('id'), target);
                        optList.splice(i, 1);
                        $.toptip('删除成功', 'success');
                        break;
                    }
                }
            }, function() {
                return;
            });

        })
    }, handleConditionCancel: function () {
        $('#condition-cancel').click(function () {
            workFlow.service.hideConditionSet();
            workFlow.service.initCondition();
        })
    }
};
