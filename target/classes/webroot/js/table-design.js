$(function () {
    tableDesign.service.init();
    tableDesign.eventHandler.handleEvents();
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

var tableData = {};
tableData.body = {};

var elementCount = 7;
var OptElem;
var edit;
var type;
var tableDesign = {};
var optionCount = 0;
var editCount = 0;
var wfid;

tableDesign.service = {
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
                        // console.log(data.template);

                        // if(data.template.length > 0) {
                        //     for(var i = 0; i < data.templateList.length; ++ i) {
                        //         $('#templates').append('        ' +
                        //             '<a id="'+ data.templateList[i][0] +'" class="weui-media-box weui-media-box_appmsg template">\n' +
                        //             '            <div class="weui-media-box__bd">\n' +
                        //             '                <h4 class="weui-media-box__title">' + data.templateList[i][1] + '</h4>\n' +
                        //             '            </div>\n' +
                        //             '        </a>')
                        //     }
                        // }

                        // else {
                        //     $.toptip("数据异常!", "error");
                        // }
                    } else $.toptip("服务器访问异常!", "error");
                }, error: function (data) {
                    $.toptip("服务器访问异常!", "error");
                }
            });
        }else {}

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
        return(false);
    }
};

tableDesign.eventHandler = {
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
                        tableDesign.service.addSingle();
                    }
                },{
                    text: "多行文字",
                    onClick: function() {
                        tableDesign.service.addMuti();
                    }
                },{
                    text: "单项选择",
                    onClick: function() {
                        tableDesign.service.addRadio();
                    }
                },{
                    text: "多项选择",
                    onClick: function() {
                        tableDesign.service.addCheckbox();
                    }
                },{
                    text: "日期",
                    onClick: function() {
                        tableDesign.service.addDate();
                    }
                },{
                    text: "地点",
                    onClick: function() {
                        tableDesign.service.addCity();
                    }
                },{
                    text: "图片",
                    onClick: function() {
                        tableDesign.service.addPic();
                    }
                },{
                    text: "数字",
                    onClick: function() {
                        tableDesign.service.addNum();
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
                delete tableData.body[deltitle];
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
            tableDesign.service.editTopic(topic);
            var newOptions;
            if(OptElem.data('type') == 'checkbox' || OptElem.data('type') == 'radio') {
                var options = [];
                OptElem.find('.option').each(function () {
                    options.push($(this).html());
                });
                tableDesign.service.editOptions(options);
            } else {}
            tableDesign.service.showList();
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
            tableDesign.service.hideList();
        });
    }, handleCancelEdit: function () {
        $('#bgDiv3').click(function () {
            tableDesign.service.hideList();
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
        $('#table-save').click(function () {
            var title = $('#table-title').val();
            var desiger = $.cookie('userId');
            var timeStamp = new Date().getTime();

            tableData.title = title;
            tableData.designer = desiger;
            tableData.timeStamp = timeStamp;
            tableData.elementCount = elementCount;

            void $.ajax({
                type: "POST",
                url: MW.server + "/addTemplate",
                data: JSON.stringify(tableData),
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
                    tableDesign.service.addOptions($('#elem_'+ elementCount), type);
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
                    tableDesign.service.addOptions($('#elem_'+ elementCount), type);
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
                        '                                <input id="date" class="weui-input float-left date-picker" placeholder="请输入日期" type="text" data-toggle=\'date\' readonly/>\n' +
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
                    $(".date-picker").calendar();
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
                    $(".city-picker").cityPicker({
                        title: ""
                    });
                    break;
                case 'number':
                    $('#container > .weui-cells').append('');
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
            elementCount ++;

            var temp = {
                type : type,
                options : options
            };

            tableData.body[title] = temp;
            tableDesign.service.hideList();
        })
    }
};