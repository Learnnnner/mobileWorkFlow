$(function () {
    wfcreate.service.init();
    wfcreate.eventHandler.handleEvents();
})

var wfcreate = {};
var staffSelected = [];
var staffData = {};
var viewData = [];
var modelCounter = 0;
var instance;
var elementCount = 0;
var name2Id = new Array();  //定义一个名称到ID的映射字典
var wfData = {};        //wf数据


var formData = {};
formData.body = {};


//基本连接线样式
var connectorPaintStyle = {
    stroke: "#333",
    strokeWidth: 2
};

//端点样式设置
var hollowCircle = {
    endpoint: ["Dot",{cssClass: "endpointcssClass"}], //端点形状
    connectorStyle: connectorPaintStyle,
    paintStyle: {
        fill: "#333",
        radius: 6
    },		//端点的颜色样式
    isSource: true, //是否可拖动（作为连接线起点）
    connector: ["Flowchart", {stub: 30, gap: 0, coenerRadius: 0, alwaysRespectStubs: true, midpoint: 0.5 }],
    isTarget: true, //是否可以放置（连接终点）
    maxConnections: -1
};

wfcreate.service = {
    init: function () {
        this.initControl();
        this.initstaff();
    }, initControl: function () {
        instance = jsPlumb.getInstance({
            DragOptions: { cursor: "pointer", zIndex: 2000 },
            ConnectionOverlays: [
                ["Arrow", {
                    location: 0.5,
                    visible:true,
                    direction:1,
                    id:"arrow_forwards"
                }],
                [ "Label", {
                    location: 0.5,
                    id: "label",
                    cssClass: "aLabel"
                }]
            ],
            Container: "container"
        });
        instance.importDefaults({
            ConnectionsDetachable:true,
            ReattachConnections:true
        });
        instance.bind("connection", function (connInfo, originalEvent) {
            wfcreate.service.initLine(connInfo.connection);
        });
        instance.bind("dblclick", function (conn, originalEvent) {
            if (confirm("要删除从 " + conn.source.getElementsByTagName("span")[0].innerHTML
                    + " —— " + conn.target.getElementsByTagName("span")[0].innerHTML + " 的连接么?")){
                instance.detach(conn);
            }
        });
        $("#leftMenu li").draggable({
            helper: "clone",
            scope: "plant"
        });
        $("#container").droppable({
            scope: "plant",
            drop: function(event, ui){
                var self = $(this);
                layer.open({
                    type: 2,
                    area: ['700px', '300px'],
                    fixed: false, //不固定
                    maxmin: true,
                    content: 'nodeInfo.html',
                    btn: ['确定', '取消']
                    ,yes: function(index){
                        var val = layer.getChildFrame('#nodeName', index).val();
                        var dealer = [];
                        var checked  = layer.getChildFrame('#dealer', index).find('option:selected').val();
                        dealer.push(checked);
                        wfcreate.service.createModel(ui, self, val, dealer);
                        layer.close(index);
                    }
                });
            }
        });
        localStorage.setItem('formBody', JSON.stringify(formData.body));
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
                            staffData[$data[i][1]].id = $data[i][0];
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
                            tempj.name = staffData[i].value[j][5];
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
    }, addTopic: function (type) {
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
                var title = layer.getChildFrame('#title', index).val();
                var options = [];
                var temp = {
                    type : type,
                    options : options
                };
                formData.body[title] = temp;
                switch (type)
                {
                    case 'single':
                        $('#table').append('<div id="elem_'+ elementCount++ +'" style="border: dotted #c1c1c1; padding: 5px;" class="layui-form-item" data-type="single">\n' +
                            '                                        <div style="margin: 9px 0 8px 18px;" class="layui-col-md1">'+ title +'</div>\n' +
                            '                                        <div class="layui-col-md9">\n' +
                            '                                            <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入标题" class="layui-input">\n' +
                            '                                        </div>\n' +
                            '                                        <div class="layui-col-md1">\n' +
                            '                                            <div style="margin-left: 4vw" class="layui-btn layui-btn-danger delete">删除</div>\n' +
                            '                                        </div>\n' +
                            '                                    </div>');
                        break;
                    case 'muti':
                        $('#table').append('<div id="elem_'+ elementCount++ +'" style="border: dotted #c1c1c1; padding: 5px;" class="layui-form-item layui-form-text" data-type="muti">\n' +
                            '                                        <div style="margin: 9px 0 8px 18px;" class="layui-col-md1">'+ title +'</div>\n' +
                            '                                        <div class="layui-col-md9">\n' +
                            '                                            <textarea placeholder="请输入内容" class="layui-textarea"></textarea>\n' +
                            '                                        </div>\n' +
                            '                                        <div class="layui-col-md1">\n' +
                            '                                            <div style="margin-left: 4vw" class="layui-btn layui-btn-danger delete">删除</div>\n' +
                            '                                        </div>\n' +
                            '                                    </div>');
                        break;
                    case 'city':
                        $('#table').append('<div id="elem_'+ elementCount++ +'" style="border: dotted #c1c1c1; padding: 5px;" class="layui-form-item" data-type="city">\n' +
                            '                                        <div style="margin: 9px 0 8px 18px;" class="layui-col-md1">'+ title +'</div>\n' +
                            '                                        <div class="layui-col-md9">\n' +
                            '                                            <input type="text" name="city" id="city" lay-verify="date" placeholder="请输入地址" autocomplete="off" class="layui-input">\n' +
                            '                                        </div>\n' +
                            '                                        <div class="layui-col-md1">\n' +
                            '                                            <div style="margin-left: 4vw" class="layui-btn layui-btn-danger delete">删除</div>\n' +
                            '                                        </div>\n' +
                            '                                    </div>');
                        break;
                    case 'number':
                        $('#table').append('<div id="elem_'+ elementCount++ +'" style="border: dotted #c1c1c1; padding: 5px;" class="layui-form-item" data-type="number">\n' +
                            '                                        <div style="margin: 9px 0 8px 18px;" class="layui-col-md1">'+ title +'</div>\n' +
                            '                                        <div class="layui-col-md9">\n' +
                            '                                            <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入标题" class="layui-input">\n' +
                            '                                        </div>\n' +
                            '                                        <div class="layui-col-md1">\n' +
                            '                                            <div style="margin-left: 4vw" class="layui-btn layui-btn-danger delete">删除</div>\n' +
                            '                                        </div>\n' +
                            '                                    </div>');
                        break;
                    case 'checkbox':
                        $('#table').append();
                        break;
                    case 'radio':
                        $('#table').append();
                        break;
                }
                localStorage.setItem('formBody', JSON.stringify(formData.body));
                layui.use('form', function(){
                    var form = layui.form;
                    form.render();
                });
                layer.msg('添加成功！', {icon: 1});
                layer.close(index);
            }, btn2: function (index, layero) {
                layer.close(index);
            }
        });
    }, addOption: function (type) {
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
                var title = layer.getChildFrame('#title', index).val();
                var select = layer.getChildFrame('#select', index);
                var options = select.find('.option');
                var optionsArr = [];
                for (var i = 0; i < options.length; ++ i) {
                    optionsArr.push($(options[i]).val());
                }
                var temp = {
                    type : type,
                    options : optionsArr
                };
                formData.body[title] = temp;
                switch (type)
                {
                    case 'single':
                        $('#table').append();
                        break;
                    case 'muti':
                        $('#table').append();
                        break;
                    case 'city':
                        $('#table').append();
                        break;
                    case 'number':
                        $('#table').append();
                        break;
                    case 'checkbox':
                        var str = '<div id="elem_'+ elementCount++ +'" style="border: dotted #c1c1c1; padding: 5px;" class="layui-form-item" data-type="checkbox">\n' +
                            '                                        <div style="margin: 9px 0 8px 18px;" class="layui-col-md1">' + title + '</div>\n' +
                            '                                        <div class="layui-col-md9 options">\n';
                        for(var i = 0; i < options.length; ++ i) {
                            str += '<input type="checkbox" title="'+ $(options[i]).val() +'"><br>\n';
                        }
                        str += '                                        </div>\n' +
                            '                                        <div class="layui-col-md1">\n' +
                            '                                            <div style="margin-left: 4vw" class="layui-btn layui-btn-danger delete">删除</div>\n' +
                            '                                        </div>\n' +
                            '                                    </div>';
                        $('#table').append(str);
                        break;
                    case 'radio':
                        var str = '<div id="elem_'+ elementCount++ +'" style="border: dotted #c1c1c1; padding: 5px;" class="layui-form-item" data-type="radio">\n' +
                             '                                        <div style="margin: 9px 0 8px 18px;" class="layui-col-md1">' + title + '</div>\n' +
                            '                                        <div class="layui-col-md9">\n';
                        for(var i = 0; i < options.length; ++ i) {
                            str += '<input type="radio" name="option" value="' + $(options[i]).val() +'" title="' + $(options[i]).val()+ '"><br>\n'
                        }
                        str += '                                        </div>\n' +
                        '                                        <div class="layui-col-md1">\n' +
                        '                                            <div style="margin-left: 4vw" class="layui-btn layui-btn-danger delete">删除</div>\n' +
                        '                                        </div>\n' +
                        '                                    </div>';
                        $('#table').append(str);
                        break;
                }
                localStorage.setItem('formBody', JSON.stringify(formData.body));
                layui.use('form', function(){
                    var form = layui.form;
                    form.render();
                });
                layer.msg('确定！', {icon: 1});
                layer.close(index);
            }, btn2: function (index, layero) {
                layer.msg('确定！', {icon: 1});
            }
        });
    }, createModel: function (ui, selector, val, dealer) {
        var modelId = $(ui.draggable).attr("id");
        var id = modelId + modelCounter;
        $(selector).append('<div class="model" id="' + id + '">'
            + this.getModelElementStr(val) + '</div>');
        var left = parseInt(ui.offset.left - $(selector).offset().left);
        var top = parseInt(ui.offset.top - $(selector).offset().top);
        $("#"+id).css("position","absolute").css("left",left).css("top",top);
        //添加连接点
        instance.addEndpoint(id, {anchors: "Continuous"}, hollowCircle);
        //注册实体可draggable
        $("#" + id).draggable({
            containment: "parent",
            drag: function (event, ui) {
                instance.repaintEverything();
            },
            stop: function () {
                instance.repaintEverything();
            }
        });

        wfData[val]= {};
        wfData[val].data = [];
        wfData[val].dealer = dealer;
        name2Id[val] = id;
        modelCounter ++;
    }, getModelElementStr: function (val) {
        var list = '<h4><span>' + val + '</span><a href="javascript:void(0)" class="pull-right" onclick="removeElement(this);">╳&nbsp</a>'
            + '</h4>';
        return list;
    }, initLine: function(conn) {
        $("#select_sourceList").empty();
        $("#select_targetList").empty();
        var sourceName = $("#" + conn.sourceId).attr("id");
        var source = $("#" + conn.sourceId).find('span').html();
        var target = $("#" + conn.sourceId).find('span').html();
        var targetName = $("#" + conn.targetId).attr("id");
        $("#select_sourceList").append(sourceName);
        $("#select_targetList").append(targetName);
        $("#submit_label").unbind("click");
        var conditionArr = [];
        var keywordsArr = [];
        var valueArr = [];
        layer.open({
            type: 2,
            area: ['790px', '300px'],
            fixed: false, //不固定
            maxmin: true,
            content: 'linkInfo.html',
            btn: ['确定', '取消']
            , yes: function(index){
                var conditions = layer.getChildFrame('#conditions .term', index);
                wfcreate.service.setlabel(conn, conditions);
                conditions.each(function () {
                    var vals = $(this).find('.layui-input-inline input');
                    if($(vals[0]).attr("value") == '默认') {
                        conditionArr.push('默认');
                        keywordsArr.push('默认');
                        valueArr.push('默认');
                    }else {
                        conditionArr.push($(vals[0]).attr("value"));
                        keywordsArr.push($(vals[1]).val());
                        valueArr.push($(vals[2]).val());

                    }
                });
                var temp = {
                    'keywords' : conditionArr,
                    'rule' : keywordsArr,
                    'value' : valueArr,
                    'nextNode' : target
                }
                wfData[source].data.push(temp);
                layer.close(index);
            }, btn2: function(index, layero){
                instance.detach(conn);
                layer.close(index);
            }
        });
        // $("#myModal").modal();
    }, getOptions: function (obj,head) {
        var str = "";
        for(var v in obj){
            if(obj[v].properties == undefined){
                var val = head + '.' + obj[v].des;
                str += '<option value="' + val + '">'
                    +val
                    +'</option>';
            }else{
                str += arguments.callee(obj[v].properties,head);
            }
        }
        return str;
    }, setlabel: function (conn, conditions) {
        var area;
        var cond;
        var val;
        var label = '';
        conditions.each(function () {
            var vals = $(this).find('.layui-input-inline input');
            if($(vals[0]).attr("value") == '默认') {
                area = '默认';
                cond = '默认';
                val = '默认';
            }else {
                area = $(vals[0]).attr("value");
                cond = $(vals[1]).val();
                val = $(vals[2]).val();
            }
            label += (area +' ' + cond + ' ' + val + ';<br>');
        });
        conn.getOverlay("label").setLabel(label);
        conn.setParameter("twoWay",false);
        conn.hideOverlay("arrow_backwards");
    }, saveForm: function () {
        formData.title = $('#title').val();
        formData.designer = $.cookie('userId');
        formData.timeStamp = new Date().getTime();
        formData.elementCount = elementCount;

        formData.wfSet = wfData;
        formData.nodeCount = modelCounter;
        var userSet = wfcreate.service.getUser();
        formData.userSet = userSet ? userSet : [];
        void $.ajax({
            type: "POST",
            url: MW.server + "/addTemplate",
            data: JSON.stringify(formData),
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    layer.msg('保存成功！', {icon: 1});
                } else layer.msg('保存失败！', {icon: 2});
            }, error: function (data) {
                layer.msg('操作失败!请检查网络情况或与系统管理员联系！！', {icon: 1});
            }
        })
    }, getUser: function () {
        var tree = $.fn.zTree.getZTreeObj("staffTree");
        var checked = tree.getCheckedNodes(true);
        var userData = [];
        for(var i=0; i < checked.length; i++){
            if (checked[i].id == -1 || checked[i].id > 10000) {
                userData.push(checked[i].id);
            }
        }
        return userData;
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
                wfcreate.service.saveForm();
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
                    wfcreate.service.addTopic(type);
                    $('#table').append();
                    break;
                case 'muti':
                    wfcreate.service.addTopic(type);
                    $('#table').append();
                    break;
                case 'city':
                    wfcreate.service.addTopic(type);
                    $('#table').append();
                    break;
                case 'number':
                    wfcreate.service.addTopic(type);
                    $('#table').append();
                    break;
                case 'checkbox':
                    wfcreate.service.addOption(type);
                    $('#table').append();
                    break;
                case 'radio':
                    wfcreate.service.addOption(type);
                    $('#table').append();
                    break;
            }
            $('#modules').css('display', 'none');
        })
    }
}

function removeElement(obj) {
    var element = $(obj).parents(".model");
    if(confirm("确定删除该模型？")) instance.remove(element);
}

