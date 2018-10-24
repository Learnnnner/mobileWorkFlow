$(function () {
    formDesign.service.init();
    formDesign.eventHandler.handleEvents();
});

//type: single：单行文字，muti：多行文字，radio：单选，
//checkbox：复选，date：日期，place：地点，number：数字，picture：图片
//如果元素的标题名称相同则覆盖
// var data = {
//     'title' : '人员信息表',
//     'body' : {
//         '姓名': {'type' : 'single', 'val' : ['']},
//         '性别': {'type' : 'radio', 'val' : ['man', 'women']},
//         '爱好': {'type' : 'checkbox', 'val' : ['书法','钢琴','篮球','足球']},
//         '个人说明': {'type' : 'muti', 'val' : ['']},
//         '日期': {'type' : 'date', 'val' : ['']},
//         '住址': {'type' : 'place', 'val' : ['']},
//         '电话': {'type' : 'number', 'val' : ['']},
//         '图片': {'type' : 'picture', 'val' : ['']}
//     },
//     'timestamp': [],
//     'designer': []
// };

var formData = {};
formData.body = {};

var elementCount = 0;
var OptElem;
var edit;
var type;
var formDesign = {};
var optionCount = 0;
var editCount = 0;
var wfid;
var optCount = 0;


formDesign.service = {
    init : function () {
        this.initControl();
    }, initControl: function () {
        $(".date-picker").calendar();
        $(".city-picker").cityPicker({
            title: ""
        });

        wfid = this.getQueryVariable('id');

        if(wfid) {
            $.ajax({
                type: "POST",
                url: MW.server + "/fetchTemplate",
                data: JSON.stringify({id: wfid}),
                dataType: "json",
                success: function (data) {
                    if (200 == data.status) {
                        if(data.data.length == 1) {
                            if(data.data[0][1] != undefined && data.data[0][1] != '' && data.data[0][1] != null) {
                                $('#table-title').val(data.data[0][1]);
                            }

                            if(data.data[0][2] != undefined && data.data[0][2] != '' && data.data[0][2] != null) {
                                var json = JSON.parse(data.data[0][2]);

                                //工作流中变量，初始化时用
                                wfData = JSON.parse(data.data[0][6]) ? JSON.parse(data.data[0][6]) : {};
                                staffSelected = JSON.parse(data.data[0][8]) ? JSON.parse(data.data[0][8]) : [];

                                formData.body = json;
                                for(var ele in json) {
                                    //工作流中变量，初始化时用
                                    eleName.push(ele);

                                    var type = json[ele].type;
                                    var code = '        <div id="elem_'+ elementCount++ +'" class="weui-form-preview table-margin-top" data-type="' + type + '">\n' +
                                        '            <div class="weui-form-preview__bd" style="padding-left: 0;padding-right: 0">\n' +
                                        '                <div class="weui-form-preview__item table-border-bottom " >\n' +
                                        '                    <label class="weui-form-preview__label table-margin-left title-bottom title">'+ ele +'</label>\n' +
                                        '                </div>\n'
                                    switch (type) {
                                        case 'single':
                                            code += '                <div class="weui-form-preview__item">\n' +
                                                '                <span class="weui-form-preview__label" style="margin-top: 10px">\n' +
                                                '                     <input class="weui-input singleline-width table-margin-left" type="text" placeholder="请输入内容">\n' +
                                                '                </span>\n' +
                                                '                </div>';
                                            break;
                                        case 'muti':
                                            code += '                <div class="weui-cells weui-cells_form no-margin-top">\n' +
                                                '                    <div class="weui-form-preview__item">\n' +
                                                '                        <div class="weui-cell">\n' +
                                                '                            <div class="weui-cell__bd">\n' +
                                                '                                <textarea class="weui-textarea textarea-font-family" placeholder="请输入内容" rows="4"></textarea>\n' +
                                                '                            </div>\n' +
                                                '                        </div>\n' +
                                                '                    </div>\n' +
                                                '                </div>';
                                            break;
                                        case 'radio':
                                            code += '                <div class="weui-form-preview__item">\n' +
                                                '                    <div class="weui-cells weui-cells_radio no-margin-top option-container">';
                                            for(var i = 0; i < json[ele].options.length; ++ i) {
                                                code += '                        <label class="weui-cell weui-check__label" for="o'+ optCount +'">\n' +
                                                    '                            <div class="weui-cell__bd">\n' +
                                                    '                                <p class="float-left option">'+ json[ele].options[i] +'</p>\n' +
                                                    '                            </div>\n' +
                                                    '                            <div class="weui-cell__ft">\n' +
                                                    '                                <input type="radio" class="weui-check" name="radio1" id="o'+ optCount++ +'"/>\n' +
                                                    '                                <span class="weui-icon-checked"></span>\n' +
                                                    '                            </div>\n' +
                                                    '                        </label>';
                                            }
                                            break;
                                        case 'checkbox':
                                            code += '                <div class="weui-form-preview__item">\n' +
                                                '                    <div class="weui-cells weui-cells_checkbox no-margin-top option-container">';

                                            for(var i = 0; i< json[ele].options.length; ++ i) {
                                                code += '                        <label class="weui-cell weui-check__label" style="left: 0" for="o'+ optCount +'">\n' +
                                                    '                            <div class="weui-cell__hd ">\n' +
                                                    '                                <input type="checkbox" class="weui-check" name="checkbox1" id="o'+ optCount++ +'"/>\n' +
                                                    '                                <i class="weui-icon-checked"></i>\n' +
                                                    '                            </div>\n' +
                                                    '                            <div class="weui-cell__bd">\n' +
                                                    '                                <p class="float-left option">'+ json[ele].options[i] +'</p>\n' +
                                                    '                            </div>\n' +
                                                    '                        </label>';
                                            }
                                            break;
                                        case 'date':
                                            code += '                <div class="weui-form-preview__item">\n' +
                                                '                    <div class="weui-cells weui-cells_form no-margin-top">\n' +
                                                '                        <div class="weui-cell">\n' +
                                                '                            <div class="weui-cell__bd" >\n' +
                                                '                                <input id="date" class="weui-input float-left date-picker" placeholder="请输入日期" type="text" data-toggle=\'date\' readonly/>\n' +
                                                '                            </div>\n' +
                                                '                        </div>\n' +
                                                '                    </div>\n' +
                                                '                </div>';
                                            break;
                                        case 'city':
                                            code += '                <div class="weui-form-preview__item">\n' +
                                                '                    <div class="weui-cells weui-cells_form no-margin-top">\n' +
                                                '                        <div class="weui-cell">\n' +
                                                '                            <div class="weui-cell__bd" >\n' +
                                                '                                <input type="text" class="weui-input float-left city-picker" id=\'city-picker\' />\n' +
                                                '                            </div>\n' +
                                                '                        </div>\n' +
                                                '                    </div>\n' +
                                                '                </div>';
                                            break;
                                        case 'number':
                                            code += '                <div class="weui-form-preview__item">\n' +
                                            '                <span class="weui-form-preview__label" style="margin-top: 10px">\n' +
                                            '                     <input class="weui-input singleline-width table-margin-left" type="number" pattern="[0-9]*" placeholder="请输入内容">\n' +
                                            '                </span>\n' +
                                            '                </div>\n'
                                            break;
                                        case 'picture':
                                            code += '                <div class="weui-form-preview__item">\n' +
                                                '                    <div class="weui-cells weui-cells_form no-margin-top">\n' +
                                                '                        <div class="weui-cell" style="padding-right: 2vw; padding-left: 2vw">\n' +
                                                '                            <div class="weui-cell__bd">\n' +
                                                '                                <div class="weui-uploader">\n' +
                                                '                                    <div class="weui-uploader__bd">\n' +
                                                '                                        <ul class="weui-uploader__files" id="uploaderFiles">\n' +
                                                '                                        </ul>\n' +
                                                '                                        <div class="weui-uploader__input-box">\n' +
                                                '                                            <input id="uploaderInput" class="weui-uploader__input" type="file" accept="image/*" multiple="">\n' +
                                                '                                        </div>\n' +
                                                '                                    </div>\n' +
                                                '                                </div>\n' +
                                                '                            </div>\n' +
                                                '                        </div>\n' +
                                                '                    </div>\n' +
                                                '                </div>'
                                            break;
                                    }

                                    code += '</div>' +
                                        '            <div class="weui-form-preview__ft">\n' +
                                        '                <a class="weui-form-preview__btn weui-form-preview__btn_default delete" href="javascript:">删除</a>\n' +
                                        '                <button type="submit" class="weui-form-preview__btn weui-form-preview__btn_primary edit" href="javascript:">\n' +
                                        '                    编辑\n' +
                                        '                </button>\n' +
                                        '            </div>'+
                                        '</div>';
                                    $('#container > .weui-cells').append(code);
                                }
                            }

                            workFlow.service.init();
                            workFlow.eventHandler.handleEvents();
                        }else {
                            $.toptip("数据异常", 'error')
                        }
                    } else $.toptip("服务器访问异常!", "error");
                }, error: function (data) {
                    $.toptip("服务器访问异常!", "error");
                }
            });
        }else {
            workFlow.service.init();
            workFlow.eventHandler.handleEvents();
        }
    }, showList: function() {
        if(edit == true) {
            $('#edit-commit').parents('.weui-msg__opr-area').show();
            $('#add-commit').parents('.weui-msg__opr-area').hide();
        } else {
            $('#edit-commit').parents('.weui-msg__opr-area').hide();
            $('#add-commit').parents('.weui-msg__opr-area').show();
        }

        $('#bgDiv3').css({
            display: "block",
            transition: "opacity .5s"
        });
        $('#elemEdit').css({
            right: "0px",
            transition: "right 1s"
        });
    }, hideList: function () {
        $('#bgDiv3').css({
            display: "none",
            transition: "display 1s"
        });

        $('#elemEdit').css({
            right: "-50%",
            transition: "right .5s"
        });
    }, editTopic: function (topic) {
        $('#editContainer').append('    <div class="weui-form-preview">\n' +
            '        <div class="weui-form-preview__bd">\n' +
            '            <div class="weui-form-preview__item">\n' +
            '                <label class="weui-form-preview__label">标题</label>\n' +
            '            </div>\n' +
            '            <div class="weui-form-preview__item">\n' +
            '                <span class="weui-form-preview__label">\n' +
            '                     <input class="weui-input title" id="topic" type="text" placeholder="请输入表单标题" value="'+ topic +'">\n' +
            '                </span>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>');
        var newTopic = $('#topic').val();
        return newTopic;
    }, editOptions: function (options) {
        $('#editContainer').append('        <div class="weui-form-preview">\n' +
            '            <div class="weui-form-preview__bd table-margin-top" id="option-container">\n' +
            '                <div class="weui-form-preview__item ">\n' +
            '                    <label class="weui-form-preview__label">选项</label>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </div>');

        for(var i = 0; i < options.length; ++ i) {
            $('#option-container').append(
                '                <div class="weui-form-preview__item table-border table-margin-top">\n' +
                '                <span class="weui-form-preview__label input-width">\n' +
                '                     <input class="weui-input " type="text" placeholder="请输入选项" value = "' + options[i] + '">\n' +
                '                </span>\n' +
                '                </div>\n');
        }
        editCount = options.length;
        var newOptions = [];
        $('#option-container').find('input').each(function () {
            newOptions.push($(this). val());
        });
        return newOptions;
    }, addTopic: function () {
        $('#editContainer').append('    <div class="weui-form-preview">\n' +
            '        <div class="weui-form-preview__bd" >\n' +
            '            <div class="weui-form-preview__item table-border-bottom">\n' +
            '                <label class="weui-form-preview__label" style="margin-left: 15px">标题</label>\n' +
            '            </div>\n' +
            '            <div class="weui-form-preview__item">\n' +
            '                <span class="weui-form-preview__label" style="margin-left: 15px">\n' +
            '                     <input class="weui-input title" id="topic" type="text" placeholder="请输入表单标题">\n' +
            '                </span>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>');
    }, addSelection: function () {
        $('#editContainer').append('        <div class="weui-form-preview">\n' +
            '            <div class="weui-form-preview__bd table-margin-top" id="option-container">\n' +
            '                <div class="weui-form-preview__item table-border-bottom">\n' +
            '                    <label class="weui-form-preview__label">选项</label>\n' +
            '                </div>\n' +
            '                <div class="weui-form-preview__item table-border option-margin-top">\n' +
            '                <span class="weui-form-preview__label input-width">\n' +
            '                     <input class="weui-input" type="text" placeholder="请输入选项">\n' +
            '                </span>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            <div class="weui-form-preview__item ">\n' +
            '                <svg class="icon icon-font-size-3 icon-active icon-pos add-option" aria-hidden="true">\n' +
            '                    <use xlink:href="#icon-tianjia"></use>\n' +
            '                </svg>\n' +
            '            </div>\n' +
            '        </div>');
    }, addSingle: function () {
        $('#editContainer').empty();
        this.addTopic();
        this.showList();
        type = 'single';
    }, addMuti: function () {
        $('#editContainer').empty();
        this.addTopic();
        this.showList();
        type = 'muti';
    }, addRadio: function () {
        $('#editContainer').empty();
        this.addTopic();
        this.addSelection();
        this.showList();
        type = 'radio';
    }, addCheckbox: function () {
        $('#editContainer').empty();
        this.addTopic();
        this.addSelection();
        this.showList();
        type = 'checkbox';
    }, addDate: function () {
        $('#editContainer').empty();
        this.addTopic();
        this.showList();
        type = 'date';
    }, addCity: function () {
        $('#editContainer').empty();
        this.addTopic();
        this.showList();
        type = 'city';
    }, addPic: function () {
        $('#editContainer').empty();
        this.addTopic();
        this.showList();
        type = 'picture';
    }, addNum: function () {
        $('#editContainer').empty();
        this.addTopic();
        this.showList();
        type = 'number';
    }, addOptions: function (selector, type) {
        var options = [];
        $('#option-container').find('input').each(function () {
            options.push($(this). val());
        });
        if(type == 'radio') {
            for(var i = 0; i < options.length; ++ i) {
                selector.find('.option-container').append(
                    '                        <label class="weui-cell weui-check__label" for="o'+ optionCount +'">\n' +
                    '                            <div class="weui-cell__bd">\n' +
                    '                                <p class="float-left option">' + options[i] + '</p>\n' +
                    '                            </div>\n' +
                    '                            <div class="weui-cell__ft">\n' +
                    '                                <input type="radio" class="weui-check" name="radio1" id="o'+ optionCount +'"/>\n' +
                    '                                <span class="weui-icon-checked"></span>\n' +
                    '                            </div>\n' +
                    '                        </label>');
                optionCount ++;
            }
        }

        if(type == 'checkbox') {
            for(var i = 0; i < options.length; ++ i) {
                selector.find('.option-container').append(
                    '                        <label class="weui-cell weui-check__label" style="left: 0" for="o'+ optionCount +'">\n' +
                    '                            <div class="weui-cell__hd ">\n' +
                    '                                <input type="checkbox" class="weui-check" name="checkbox1" id="o'+ optionCount +'">\n' +
                    '                                <i class="weui-icon-checked"></i>\n' +
                    '                            </div>\n' +
                    '                            <div class="weui-cell__bd">\n' +
                    '                                <p class="float-left option">' + options[i] + '</p>\n' +
                    '                            </div>\n' +
                    '                        </label>');
                    optionCount ++;
            }
        }

        return options;
    }, getQueryVariable: function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0; i<vars.length; i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }, saveData : function () {
        formData.title = $('#table-title').val();
        formData.designer = $.cookie('userId');
        formData.timeStamp = new Date().getTime();
        formData.elementCount = elementCount;

        formData.wfSet = wfData;
        formData.nodeCount = nodeCount;
        var userSet = staffSelect.service.getUser();
        formData.userSet = userSet ? userSet : [];



        if(wfid != '' && wfid != undefined && wfid != null) {
            void $.ajax({
                type: "POST",
                url: MW.server + "/updateTemplate",
                data: JSON.stringify({
                    id: wfid,
                    data: JSON.stringify(formData)
                }),
                dataType: "json",
                success: function (data) {
                    if (200 == data.status) {
                        $.toptip("修改成功!", "success");
                        window.history.back(-1);
                    } else $.toptip("保存失败!", "error");
                }, error: function (data) {
                    $.toptip("操作失败!请检查网络情况或与系统管理员联系！", "error")
                }
            })
        } else {
            void $.ajax({
                type: "POST",
                url: MW.server + "/addTemplate",
                data: JSON.stringify(formData),
                dataType: "json",
                success: function (data) {
                    if (200 == data.status) {
                        $.toptip("保存成功!", "success");
                        window.history.back(-1);
                    } else $.toptip("保存失败!", "error");
                }, error: function (data) {
                    $.toptip("操作失败!请检查网络情况或与系统管理员联系！", "error")
                }
            })
        }
    }
};

formDesign.eventHandler = {
    handleEvents : function () {
        this.handleAddModule();
        this.handleDelete();
        this.handleEdit();
        this.handleConfirmEdit();
        this.handleCancelEdit();
        this.handleAddOption();
        this.handleConfirmAdd();
        this.handleSave();
    }, handleAddModule : function () {
        $('#addmodule').click(function () {
            edit = false;
            $.actions({
                actions: [{
                    text: "单行文字",
                    onClick: function() {
                        formDesign.service.addSingle();
                    }
                },{
                    text: "多行文字",
                    onClick: function() {
                        formDesign.service.addMuti();
                    }
                },{
                    text: "单项选择",
                    onClick: function() {
                        formDesign.service.addRadio();
                    }
                },{
                    text: "多项选择",
                    onClick: function() {
                        formDesign.service.addCheckbox();
                    }
                },{
                    text: "日期",
                    onClick: function() {
                        formDesign.service.addDate();
                    }
                },{
                    text: "地点",
                    onClick: function() {
                        formDesign.service.addCity();
                    }
                },{
                    text: "图片",
                    onClick: function() {
                        formDesign.service.addPic();
                    }
                },{
                    text: "数字",
                    onClick: function() {
                        formDesign.service.addNum();
                    }
                }]
            });
        })
    }, handleDelete: function () {
        $(document).on('click', '.delete',function () {
            var self = $(this);
            $.confirm("确定要删除该元素吗？", function() {
                var node = self.parents('.weui-form-preview');
                var deltitle = node.find('.title').html();
                delete formData.body[deltitle];
                if(formData.body.length <=0) {
                    formData.body = {};
                }
                node.remove();
            }, function() {
                //点击取消后的回调函数
            });

        })
    }, handleEdit: function () {
        $(document).on('click', '.edit', function () {
            var self = $(this);
            edit = true;
            OptElem = self.parents('.weui-form-preview');
            $('#editContainer').empty();
            var topic = OptElem.find('.title').html();
            formDesign.service.editTopic(topic);
            var newOptions;
            if(OptElem.data('type') == 'checkbox' || OptElem.data('type') == 'radio') {
                var options = [];
                OptElem.find('.option').each(function () {
                    options.push($(this).html());
                });
                formDesign.service.editOptions(options);
            } else {}
            formDesign.service.showList();
        })
    }, handleConfirmEdit: function () {
        $('#edit-commit').click(function () {
            var title = '';
            var options = [];
            $('#editContainer input').each(function () {
                if($(this).hasClass('title')){
                    title = $(this).val();
                    if(title == null || title == '' || title == undefined) {
                        $.toptip('请输入标题', 'error');
                        return;
                    }else {
                        OptElem.find('.title').html(title);
                    }
                } else if($(this).val() !== null && $(this).val() !== '' && $(this).val() !== undefined){
                    options.push($(this).val());
                }
            });
            var i = 0;
            if(options.length == editCount) {
                OptElem.find('.option').each(function () {
                    $(this).html(options[i ++]);
                })
            }else {
                $.toptip('请输入选项', 'error');
            }
            formDesign.service.hideList();
        });
    }, handleCancelEdit: function () {
        $('#bgDiv3').click(function () {
            formDesign.service.hideList();
        });
    },handleAddOption: function () {
        $(document).on('click', '.add-option',function () {
            $('#option-container').append(
                '<div class="weui-form-preview__item table-border table-margin-top ">\n' +
                '                <span class="weui-form-preview__label input-width">\n' +
                '                     <input class="weui-input" type="text" placeholder="请输入选项">\n' +
                '                </span>\n' +
                '            </div>');
        });
    }, handleSave: function () {
        $('#save, #form-save').click(function () {
            formDesign.service.saveData();
        })
    }, handleConfirmAdd: function () {
        $('#add-commit').click(function () {
            var options = [];
            var title;
            $('#editContainer input').each(function () {
                if($(this).attr('id') == 'topic') {
                    title = $(this).val();
                    if(title == null || title == '' || title == undefined) {
                        $.toptip('请输入标题', 'error');
                        return;
                    }else {
                        title = $('#topic').val();
                    }
                } else if($(this).val() !== null && $(this).val() !== '' && $(this).val() !== undefined) {
                    options.push($(this).val());
                }
            });
            switch (type){
                case 'single':
                    $('#container > .weui-cells').append('        <div id="elem_'+ elementCount +'"  class="weui-form-preview table-margin-top" data-type="single">\n' +
                        '            <div class="weui-form-preview__bd" style="padding-left: 0;padding-right: 0">\n' +
                        '                <div class="weui-form-preview__item table-border-bottom " >\n' +
                        '                    <label class="weui-form-preview__label table-margin-left title-bottom title">' + title + '</label>\n' +
                        '                </div>\n' +
                        '                <div class="weui-form-preview__item">\n' +
                        '                <span class="weui-form-preview__label" style="margin-top: 10px">\n' +
                        '                     <input class="weui-input singleline-width table-margin-left" type="text" placeholder="请输入表单标题">\n' +
                        '                </span>\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '            <div class="weui-form-preview__ft">\n' +
                        '                <a class="weui-form-preview__btn weui-form-preview__btn_default delete" href="javascript:">删除</a>\n' +
                        '                <button type="submit" class="weui-form-preview__btn weui-form-preview__btn_primary edit" href="javascript:">\n' +
                        '                    编辑\n' +
                        '                </button>\n' +
                        '            </div>\n' +
                        '        </div>');
                    break;
                case 'muti':
                    $('#container > .weui-cells').append('<div id="elem_' + elementCount + '" class="weui-form-preview table-margin-top" data-type="muti">\n' +
                        '            <div class="weui-form-preview__bd" style="padding-left: 0; padding-right: 0; padding-bottom: 0">\n' +
                        '                <div class="weui-form-preview__item">\n' +
                        '                    <label class="weui-form-preview__label table-margin-left title-bottom title">'+ title +'</label>\n' +
                        '                </div>\n' +
                        '\n' +
                        '                <div class="weui-cells weui-cells_form no-margin-top">\n' +
                        '                    <div class="weui-form-preview__item">\n' +
                        '                        <div class="weui-cell">\n' +
                        '                            <div class="weui-cell__bd">\n' +
                        '                                <textarea class="weui-textarea textarea-font-family" placeholder="请输入文本" rows="4"></textarea>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '            <div class="weui-form-preview__ft">\n' +
                        '                <a class="weui-form-preview__btn weui-form-preview__btn_default delete" href="javascript:">删除</a>\n' +
                        '                <button type="submit" class="weui-form-preview__btn weui-form-preview__btn_primary edit" href="javascript:">\n' +
                        '                    编辑\n' +
                        '                </button>\n' +
                        '            </div>\n' +
                        '        </div>');
                    break;
                case 'radio':
                    $('#container > .weui-cells').append(
                        '<div id="elem_'+ elementCount +'" class="weui-form-preview table-margin-top" data-type="radio">\n' +
                        '                        <div class="weui-form-preview__bd" style="padding-left: 0; padding-bottom: 0; padding-right: 0">\n' +
                        '                            <div class="weui-form-preview__item">\n' +
                        '                                <label class="weui-form-preview__label table-margin-left title-bottom">'+ title +'</label>\n' +
                        '                            </div>\n' +
                        '                            <div class="weui-form-preview__item">\n' +
                        '                                <div class="weui-cells weui-cells_radio no-margin-top option-container">\n' +

                        '                                </div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                        <div class="weui-form-preview__ft">\n' +
                        '                            <a class="weui-form-preview__btn weui-form-preview__btn_default delete" href="javascript:">删除</a>\n' +
                        '                            <button type="submit" class="weui-form-preview__btn weui-form-preview__btn_primary edit" href="javascript:">\n' +
                        '                                编辑\n' +
                        '                            </button>\n' +
                        '                        </div>\n' +
                        '                    </div>'
                        );
                    formDesign.service.addOptions($('#elem_'+ elementCount), type);
                    break;
                case 'checkbox':
                    $('#container > .weui-cells').append('        <div id="elem_' + elementCount + '" class="weui-form-preview table-margin-top" data-type="checkbox">\n' +
                        '            <div class="weui-form-preview__bd" style="padding-left: 0; padding-bottom: 0; padding-right: 0">\n' +
                        '                <div class="weui-form-preview__item">\n' +
                        '                    <label class="weui-form-preview__label table-margin-left title-bottom title">' + title + '</label>\n' +
                        '                </div>\n' +
                        '\n' +
                        '                <div class="weui-form-preview__item">\n' +
                        '                    <div class="weui-cells weui-cells_checkbox no-margin-top option-container">\n' +

                        '                    </div>\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '\n' +
                        '            <div class="weui-form-preview__ft">\n' +
                        '                <a class="weui-form-preview__btn weui-form-preview__btn_default delete" href="javascript:">删除</a>\n' +
                        '                <button type="submit" class="weui-form-preview__btn weui-form-preview__btn_primary edit" href="javascript:">\n' +
                        '                    编辑\n' +
                        '                </button>\n' +
                        '            </div>\n' +
                        '        </div>');
                    formDesign.service.addOptions($('#elem_'+ elementCount), type);
                    break;
                case 'date':
                    $('#container > .weui-cells').append('        <div id="elem_' + elementCount + '" class="weui-form-preview table-margin-top" data-type="date">\n' +
                        '            <div class="weui-form-preview__bd" style="padding-left: 0;padding-bottom: 0; padding-right: 0">\n' +
                        '                <div class="weui-form-preview__item">\n' +
                        '                    <label class="weui-form-preview__label table-margin-left title-bottom title">' + title + '</label>\n' +
                        '                </div>\n' +
                        '\n' +
                        '                <div class="weui-form-preview__item">\n' +
                        '                    <div class="weui-cells weui-cells_form no-margin-top">\n' +
                        '                        <div class="weui-cell">\n' +
                        '                            <div class="weui-cell__bd" >\n' +
                        '                                <input id="date" class="weui-input float-left date-picker" placeholder="请输入日期" type="text" data-toggle="date" readonly/>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '\n' +
                        '            <div class="weui-form-preview__ft">\n' +
                        '                <a class="weui-form-preview__btn weui-form-preview__btn_default delete" href="javascript:">删除</a>\n' +
                        '                <button type="submit" class="weui-form-preview__btn weui-form-preview__btn_primary edit" href="javascript:">\n' +
                        '                    编辑\n' +
                        '                </button>\n' +
                        '            </div>\n' +
                        '        </div>');
                    break;
                case 'city':
                    $('#container > .weui-cells').append('        <div id="elem_' + elementCount + '" class="weui-form-preview table-margin-top" data-type="place">\n' +
                        '            <div class="weui-form-preview__bd" style="padding-left: 0;padding-bottom: 0; padding-right: 0">\n' +
                        '                <div class="weui-form-preview__item">\n' +
                        '                    <label class="weui-form-preview__label table-margin-left title-bottom title">' + title + '</label>\n' +
                        '                </div>\n' +
                        '\n' +
                        '                <div class="weui-form-preview__item">\n' +
                        '                    <div class="weui-cells weui-cells_form no-margin-top">\n' +
                        '                        <div class="weui-cell">\n' +
                        '                            <div class="weui-cell__bd" >\n' +
                        '                                <input type="text" class="weui-input float-left city-picker" />\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '\n' +
                        '            <div class="weui-form-preview__ft">\n' +
                        '                <a class="weui-form-preview__btn weui-form-preview__btn_default delete" href="javascript:">删除</a>\n' +
                        '                <button type="submit" class="weui-form-preview__btn weui-form-preview__btn_primary edit" href="javascript:">\n' +
                        '                    编辑\n' +
                        '                </button>\n' +
                        '            </div>\n' +
                        '        </div>');
                    break;
                case 'number':
                    $('#container > .weui-cells').append('        <div id="elem_'+ elementCount +'"  class="weui-form-preview table-margin-top" data-type="single">\n' +
                        '            <div class="weui-form-preview__bd" style="padding-left: 0;padding-right: 0">\n' +
                        '                <div class="weui-form-preview__item table-border-bottom " >\n' +
                        '                    <label class="weui-form-preview__label table-margin-left title-bottom title">' + title + '</label>\n' +
                        '                </div>\n' +
                        '                <div class="weui-form-preview__item">\n' +
                        '                <span class="weui-form-preview__label" style="margin-top: 10px">\n' +
                        '                     <input class="weui-input singleline-width table-margin-left" type="number" pattern="[0-9]*" placeholder="请输入内容">\n' +
                        '                </span>\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '            <div class="weui-form-preview__ft">\n' +
                        '                <a class="weui-form-preview__btn weui-form-preview__btn_default delete" href="javascript:">删除</a>\n' +
                        '                <button type="submit" class="weui-form-preview__btn weui-form-preview__btn_primary edit" href="javascript:">\n' +
                        '                    编辑\n' +
                        '                </button>\n' +
                        '            </div>\n' +
                        '        </div>');
                    break;
                case 'picture':
                    $('#container > .weui-cells').append('        <div id="elem_' + elementCount + '" class="weui-form-preview table-margin-top" data-type="picture">\n' +
                        '            <div class="weui-form-preview__bd" style="padding-left: 0;padding-bottom: 0; padding-right: 0">\n' +
                        '                <div class="weui-form-preview__item">\n' +
                        '                    <label class="weui-form-preview__label table-margin-left title-bottom title">' + title + '</label>\n' +
                        '                </div>\n' +
                        '\n' +
                        '                <div class="weui-form-preview__item">\n' +
                        '                    <div class="weui-cells weui-cells_form no-margin-top">\n' +
                        '                        <div class="weui-cell" style="padding-right: 2vw; padding-left: 2vw">\n' +
                        '                            <div class="weui-cell__bd">\n' +
                        '                                <div class="weui-uploader">\n' +
                        '                                    <div class="weui-uploader__bd">\n' +
                        '                                        <ul class="weui-uploader__files" id="uploaderFiles"></ul>\n' +
                        '                                        <div class="weui-uploader__input-box">\n' +
                        '                                            <input id="uploaderInput" class="weui-uploader__input" type="file" accept="image/*" multiple="">\n' +
                        '                                        </div>\n' +
                        '                                    </div>\n' +
                        '                                </div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '\n' +
                        '            <div class="weui-form-preview__ft">\n' +
                        '                <a class="weui-form-preview__btn weui-form-preview__btn_default delete" href="javascript:">删除</a>\n' +
                        '                <button type="submit" class="weui-form-preview__btn weui-form-preview__btn_primary edit" href="javascript:">\n' +
                        '                    编辑\n' +
                        '                </button>\n' +
                        '            </div>\n' +
                        '        </div>');
                    break;
            }
            $(".date-picker").calendar();
            $(".city-picker").cityPicker({
                title: "请选择地址"
            });

            elementCount ++;

            var temp = {
                type : type,
                options : options
            };

            formData.body[title] = temp;
            formDesign.service.hideList();
        })
    }
};