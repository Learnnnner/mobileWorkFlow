// $(function () {});
var workFlow = {};
var jspInstance;

var wfData = {};        //wf数据
var connArr = [];           //连线数组
var name2Id = new Array();  //定义一个名称到ID的映射字典
var optObj = {};            //记录操作的对象
var optList = [];           //操作对象的数据
var nodeCount = 0;          //记录节点数量

var next = []; //节点名称
var eleName = []; //表单元素名称节点名称
// var next = ['填写表单', '经理审批', '总经理审批', '获得报销款'];
var keywords = [];

// var node = {
//     '填写表单': [
//         {
//             'keywords': ['金额'],
//             'rule'    : ['小于'],
//             'value'   : [1000],
//             'nextNode': '经理审批',
//         }, {
//             'keywords': ['金额'],
//             'rule'    : ['大于'],
//             'value'   : [1000],
//             'nextNode': '总经理审批',
//         }
//     ],
//
//     '经理审批': [
//         {
//             'keywords': ['默认'],
//             'rule'    : ['默认'],
//             'value'   : ['默认'],
//             'value'   : [1000],
//             'dealer'  : {
//                 'relation': 'and',
//                 'dealer': []
//             },
//             'nextNode': '获得报销款',
//         }
//     ],
//
//     '总经理审批': [
//         {
//             'keywords': ['默认'],
//             'rule'    : ['默认'],
//             'value'   : ['默认'],
//             'value'   : [1000],
//             'dealer'  : {
//                 'relation': 'and',
//                 'dealer': []
//             },
//             'nextNode': '获得报销款',
//         }
//     ],
//
//     '获得报销款': []
// };

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
        // wfData =  $.extend(true, {}, node);
        $('#rule-default').parents('.weui-cell__bd').css('display','inline');
        $('#rule-date').parents('.weui-cell__bd').css('display','none');
        $('#rule-number').parents('.weui-cell__bd').css('display','none');
        //工作流数据初始化
        for(var i in wfData) {
            next.push(i);
        }

        eleName = ['默认'];

        for(var i in formData.body) {
            eleName.push(i);
        }

        $(".keywords").picker({
            title: "请选择关键字",
            cols: [{
                    textAlign: 'center',
                    values: eleName
                }]
        });

        $(".rule-default").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['包含','不包含']
                }
            ]
        });

        $(".rule-date").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['早于', '等于', '晚于']
                }
            ]
        });

        $(".rule-number").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['大于', '等于', '小于']
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

        for (var i in wfData) {
            $("#workspace").append("<div id = 'action_" + nodeCount + "' class='action'>"+ i +"</div>\n");
            name2Id[i] =  'action_' + nodeCount;
            nodeCount ++;
        }

        jspInstance.draggable($('.action'), {
            containment: "workspace"
        });

        for (var i in wfData) {
            for (var j in wfData[i].data) {
                workFlow.service.connectModule(name2Id[i], name2Id[wfData[i].data[j].nextNode]);
            }
        }

    }, initCondition: function () {
        $('#condition').find('.conditionItems').empty().append('<div class="conditionItem">\n' +
            '                <div class="weui-cell">\n' +
            '                    <div class="weui-cell__hd"><label class="weui-label" style="width: 70px">关键字</label></div>\n' +
            '                    <div class="weui-cell__bd">\n' +
            '                        <input id="keywords" class="weui-input keywords" type="text" placeholder="请输入关键字">\n' +
            '                    </div>\n' +
            '\n' +
            '                </div>\n' +
            '\n' +
            '                <div class="weui-cell">\n' +
            '                    <div class="weui-cell__hd"><label class="weui-label" style="width: 70px">规则</label></div>\n' +
            '<div class="weui-cell__bd">\n' +
            '                                        <input id="rule-default" class="weui-input rule rule-default" type="text" placeholder="请输入规则">\n' +
            '                                    </div>\n' +
            '                                    <div class="weui-cell__bd" style = "display: none;">\n' +
            '                                        <input id="rule-date" class="weui-input rule rule-date" type="text" placeholder="请输入规则">\n' +
            '                                    </div>\n' +
            '                                    <div class="weui-cell__bd" style = "display: none;">\n' +
            '                                        <input id="rule-number" class="weui-input rule rule-number" type="text" placeholder="请输入规则">\n' +
            '                                    </div>' +
            '                </div>\n' +
            '\n' +
            '                <div class="weui-cell">\n' +
            '                    <div class="weui-cell__hd"><label class="weui-label" style="width: 70px">值</label></div>\n' +
            '                    <div class="weui-cell__bd">\n' +
            '                        <input class="weui-input value" type="text" placeholder="请输入值">\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>');
        $('.nextNode').val('');

        eleName = ['默认'];

        for(var i in formData.body) {
            eleName.push(i);
        }

        $(".keywords").picker({
            title: "请选择关键字",
            cols: [
                {
                    textAlign: 'center',
                    values: eleName
                }
            ]
        });

        $(".rule-default").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['包含','不包含']
                }
            ]
        });

        $(".rule-date").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['早于', '等于', '晚于']
                }
            ]
        });

        $(".rule-number").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['大于', '等于', '小于']
                }
            ]
        });

        // $(".value").picker({
        //     title: "请选择规则",
        //     cols: [
        //         {
        //             textAlign: 'center',
        //             values: ['1000', '3000', '5000']
        //         }
        //     ]
        // });

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
        workFlow.service.initCondition();

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
    wfEmpty: function () {
        $.confirm({
            title: '删除',
            text: '确认删除所有工作流配置吗',
            onOK: function () {
                connArr.splice(0, connArr.length);           //连线数组
                name2Id.splice(0, name2Id.length);  //定义一个名称到ID的映射字典
                optList.splice(0, optList.length);           //操作对象的数据
                nodeCount = 0;

                for(var key in wfData){
                    delete wfData[key];
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
            delete wfData[name];
            jspInstance.remove(optObj);

            for (var i in wfData) {
                for(var j in wfData[i].data) {
                    if (wfData[i].data[j].nextNode == name)
                        wfData[i].data.splice(j, 1);
                }
            }

            for(var i in next) {
                if(next[i] == name) next.splice(i, 1);
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
        $("#dealer").groupRule({title : "关联人员", titleIcon : "&#x3104;", data : viewData, effect: 400});

        if(wfData[optObj.html()].dealer) {
            var $this = $("#dealer");
            for(var i = 0; i < wfData[optObj.html()].dealer.length; ++ i) {
                var id = '#' + wfData[optObj.html()].dealer[i];
                var $chbox = $(id).find(".icon-checkbox");
                $chbox.addClass('checked').html("&#x3127;");
                var $pch = $this.find("[mhref='"+$chbox.attr('phref')+"']");
                var $siblings = $this.find("[phref='"+$chbox.attr('phref')+"']");
                var sum = $siblings.length;
                var curr = $siblings.filter(".checked").length;
                if(sum == curr){
                    $pch.addClass("checked");
                } else if(curr==0){
                    $pch.removeClass("checked");
                }
                $pch.html(sum == curr?"&#x3127;" : curr == 0?"&#x3128;":"&#x3138;");
            }
        }

        $('#staff-list').popup();
    }, //添加一个跳转条件
    addConditionItem: function () {
        $(".conditionItems").append (
            '<div class="conditionItem">\n' +
            '                <div class="weui-cell">\n' +
            '                    <div class="weui-cell__hd"><label class="weui-label" style="width: 70px">关键字</label></div>\n' +
            '                    <div class="weui-cell__bd">\n' +
            '                        <input id="keywords" class="keywords weui-input" type="text" placeholder="请输入关键字">\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <div class="weui-cell">\n' +
            '                    <div class="weui-cell__hd"><label class="weui-label" style="width: 70px">规则</label></div>\n' +
            '<div class="weui-cell__bd">\n' +
            '                                        <input id="rule-default" class="weui-input rule rule-default" type="text" placeholder="请输入规则">\n' +
            '                                    </div>\n' +
            '                                    <div class="weui-cell__bd" style = "display: none;">\n' +
            '                                        <input id="rule-date" class="weui-input rule rule-date" type="text" placeholder="请输入规则">\n' +
            '                                    </div>\n' +
            '                                    <div class="weui-cell__bd" style = "display: none;">\n' +
            '                                        <input id="rule-number" class="weui-input rule rule-number" type="text" placeholder="请输入规则">\n' +
            '                                    </div>'+
            '                </div>\n' +
            '                <div class="weui-cell">\n' +
            '                    <div class="weui-cell__hd"><label class="weui-label" style="width: 70px">值</label></div>\n' +
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
                    values: eleName
                }
            ]
        });

        $(".rule-default").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['包含','不包含']
                }
            ]
        });

        $(".rule-date").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['早于', '等于', '晚于']
                }
            ]
        });

        $(".rule-number").picker({
            title: "请选择规则",
            cols: [
                {
                    textAlign: 'center',
                    values: ['大于', '等于', '小于']
                }
            ]
        });

        // $(".value").picker({
        //     title: "请选择规则",
        //     cols: [
        //         {
        //             textAlign: 'center',
        //             values: ['1000', '3000', '5000']
        //         }
        //     ]
        // });

    }, getData: function(str) {
        return wfData[str].data ;
    }, addData: function () {
        var keyArr =[];
        var rulArr =[];
        var valArr =[];
        var next;

        if($('.keywords').val().length <= 1) {
            var $this = $(this);
            keyArr.push($('.keywords').val());
            if($('.keywords').val() == '默认') {
                rulArr.push('默认');
                valArr.push('默认');
            }else {
                var type = formData.body[$this.val()].type;
                switch (type) {
                    case 'number':
                        rulArr.push($this.parents('.conditionItem').find('.rule-number').val());
                        valArr.push($this.parents('.conditionItem').find('.value').val());
                        break;
                    case 'date':
                        rulArr.push($this.parents('.conditionItem').find('.rule-date').val());
                        valArr.push($this.parents('.conditionItem').find('.value').val());
                        break;
                    default:
                        rulArr.push($this.parents('.conditionItem').find('.rule-default').val());
                        valArr.push($this.parents('.conditionItem').find('.value').val());
                }
            }
            next = $('.nextNode').val();
        } else {
            $('.keywords').each(function () {
                var $this = $(this);
                keyArr.push($this.val());
                if($this.val() == '默认') {
                    rulArr.push('默认');
                    valArr.push('默认');
                }else {
                    var type = formData.body[$this.val()].type;
                    switch (type) {
                        case 'number':
                            rulArr.push($this.parents('.conditionItem').find('.rule-number').val());
                            valArr.push($this.parents('.conditionItem').find('.value').val());
                            break;
                        case 'date':
                            rulArr.push($this.parents('.conditionItem').find('.rule-date').val());
                            valArr.push($this.parents('.conditionItem').find('.value').val());
                            break;
                        default:
                            rulArr.push($this.parents('.conditionItem').find('.rule-default').val());
                            valArr.push($this.parents('.conditionItem').find('.value').val());
                    }
                }
            });
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
        this.handleRule();
    }, handleAddAction: function () {
        $(".module").click(function () {
            $.prompt("请输入模块名称", function(text) {
                if(wfData.hasOwnProperty(text)) {
                    $.toptip('模块添加失败，有重复的模块名称', 'error');
                    return;
                }
                $("#workspace").append("<div id = 'action_" + nodeCount + "' class='action'>"+ text +"</div>\n");
                var $Id = 'action_' + nodeCount;

                jspInstance.draggable($('#' + $Id), {
                    containment: "workspace"
                });

                wfData[text]= {};
                wfData[text].data = [];
                wfData[text].dealer = [];
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
                        formDesign.service.saveData();
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
                if(optObj.html() == '填写表单') {
                    $.actions({
                        actions: [{
                            text: "设置条件",
                            onClick: function() {
                                workFlow.service.showList();
                            }
                        }]
                    });
                } else {
                    $.actions({
                        actions: [{
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
            }
            move = false;
        });
    }, //确认相关联的人员
    handleConfirmStaff: function () {
        $('#dealer-confirm').click(function () {
            var dealer = staffSelect.service.getdealer();
            wfData[optObj.html()].dealer = dealer ? dealer: [];
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
            // node = wfData;
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
            var ruleDefault = $('.rule-default');
            var ruleDate = $('.rule-date');
            var ruleNumber = $('.rule-number');
            var value = $('.value');
            for(var i = 0; i < keywords.length; i++) {
                if(keywords.eq(i).val() == '' ||
                    (ruleDefault.eq(i).val() == '' && ruleDate.eq(i).val() == '' && ruleNumber.eq(i).val() == '')
                    || value.eq(i).val() == '') {
                    $.toptip('有条件栏目为空，无法添加新条件', 'warning');
                    return;
                }
            }
            workFlow.service.addConditionItem();
        });
    }, handleConfirmCondition: function () {
        $('#condition-commit').click(function () {
            var keywords = $('.keywords');
            var ruleDefault = $('.rule-default');
            var ruleDate = $('.rule-date');
            var ruleNumber = $('.rule-number');
            var value = $('.value');
            var nextNode = $('.nextNode').val();
            var str = '';

            for(var i = 0; i < keywords.length; i++) {
                str += keywords.eq(i).val();
                str += '&nbsp';

                if(keywords.eq(i).val() == '默认') {
                    str += '默认';
                    str += '&nbsp';
                    str += '默认';
                    str += '<br>';
                    break;
                }

                var type = formData.body[keywords.eq(i).val()].type;
                switch (type) {
                    case 'number':
                        str += ruleNumber.eq(i).val();
                        break;
                    case 'date':
                        str += ruleDate.eq(i).val();
                        break;
                    default:
                        str += ruleDefault.eq(i).val();
                }
                // str += rule.eq(i).val();
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
    }, handleRule : function () {
        $(document).on('change', '.keywords',function () {
            var $this = $(this).parents('.conditionItem');
            var key = $this.find('.keywords').val();
            if(key == '默认') {
                $this.find('.rule-default').val('默认').attr("disabled","disabled");
                $this.find('.rule-date').val('默认').attr("disabled","disabled");
                $this.find('.rule-number').val('默认').attr("disabled","disabled");
                $this.find('.value').val('默认').attr("disabled","disabled");
                return;
            }

            $this.find('.rule-default').val('').removeAttr("disabled");
            $this.find('.rule-date').val('').removeAttr("disabled");
            $this.find('.rule-number').val('').removeAttr("disabled");
            $this.find('.value').val('').removeAttr("disabled");
            var type = formData.body[key].type;
            switch (type) {
                case 'number':
                    $this.find('.rule-default').parents('.weui-cell__bd').css('display','none');
                    $this.find('.rule-date').parents('.weui-cell__bd').css('display','none');
                    $this.find('.rule-number').parents('.weui-cell__bd').css('display','inline');
                    break;
                case 'date':
                    $this.find('.rule-default').parents('.weui-cell__bd').css('display','none');
                    $this.find('.rule-date').parents('.weui-cell__bd').css('display','inline');
                    $this.find('.rule-number').parents('.weui-cell__bd').css('display','none');
                    break;
                default:
                    $this.find('.rule-default').parents('.weui-cell__bd').css('display','inline');
                    $this.find('.rule-date').parents('.weui-cell__bd').css('display','none');
                    $this.find('.rule-number').parents('.weui-cell__bd').css('display','none');
            }
        })
    }
};
