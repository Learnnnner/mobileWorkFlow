$(function () {
    reEdit.service.init();
    reEdit.eventHandler.handleEvents();
});

var reEdit = {};
var eleCount = 0;
var optCount = 0;
reEdit.service = {
    init: function () {
        this.initControl();
    }, initControl : function () {
        var id= this.getQueryVariable('id');
        var dataId= this.getQueryVariable('dataId');
        if(id != null && id != undefined && dataId != null && dataId != undefined) {
            $.ajax({
                type: "POST",
                url: MW.server + "/fetchReEditData",
                data: JSON.stringify({
                    id: id,
                    dataId: dataId
                }),
                dataType: "json",
                success: function (data) {
                    if (200 == data.status) {
                        if(data.data.length == 1 && data.data.length == data.template.length) {
                            var jsonData = JSON.parse(data.data[0]);
                            var title = data.template[0][0];
                            var jsonTemplate = JSON.parse(data.template[0][1]);
                            if(title != undefined && title != '' && title != null) {
                                $('#form').append('        <div id="title" class="weui-cell table-border-bottom" style="text-align:center; background-color: #FFFFFF">\n' +
                                    '            <div class="weui-cell__hd" style="width:100%;text-align: center;">\n' +
                                    '                <label>' + title + '</label>\n' +
                                    '            </div>\n' +
                                    '        </div>')
                            }

                            if(jsonTemplate != undefined && jsonTemplate != '' && jsonTemplate != null) {
                                for(var ele in jsonTemplate) {
                                    var type = jsonTemplate[ele].type;
                                    var code = '        <div id="elem_'+ eleCount++ +'" class="weui-form-preview table-margin-top" data-type="' + type + '">\n' +
                                        '            <div class="weui-form-preview__bd" style="padding-left: 0;padding-right: 0">\n' +
                                        '                <div class="weui-form-preview__item table-border-bottom " >\n' +
                                        '                    <label class="weui-form-preview__label table-margin-left title-bottom title">'+ ele +'</label>\n' +
                                        '                </div>\n'
                                    switch (type) {
                                        case 'single':
                                            code += '                <div class="weui-form-preview__item">\n' +
                                                '                <span class="weui-form-preview__label" style="margin-top: 10px">\n' +
                                                '                     <input class="weui-input singleline-width table-margin-left" value="' +jsonData[ele][0] +'" type="text" placeholder="请输入内容">\n' +
                                                '                </span>\n' +
                                                '                </div>';
                                            break;
                                        case 'muti':
                                            code += '                <div class="weui-cells weui-cells_form no-margin-top">\n' +
                                                '                    <div class="weui-form-preview__item">\n' +
                                                '                        <div class="weui-cell">\n' +
                                                '                            <div class="weui-cell__bd">\n' +
                                                '                                <textarea class="weui-textarea textarea-font-family" value="' +jsonData[ele][0] +'" placeholder="请输入内容" rows="4"></textarea>\n' +
                                                '                            </div>\n' +
                                                '                        </div>\n' +
                                                '                    </div>\n' +
                                                '                </div>';
                                            break;
                                        case 'radio':
                                            code += '                <div class="weui-form-preview__item">\n' +
                                                '                    <div class="weui-cells weui-cells_radio no-margin-top option-container">';
                                            for(var i = 0; i < jsonTemplate[ele].options.length; ++ i) {
                                                if(jsonData[ele].indexOf(jsonTemplate[ele].options[i]) >= 0) {
                                                    code += '                        <label class="weui-cell weui-check__label" for="o'+ optCount +'">\n' +
                                                        '                            <div class="weui-cell__bd">\n' +
                                                        '                                <p class="float-left option">'+ jsonTemplate[ele].options[i] +'</p>\n' +
                                                        '                            </div>\n' +
                                                        '                            <div class="weui-cell__ft">\n' +
                                                        '                                <input type="radio" class="weui-check" name="radio1" id="o'+ optCount++ +'" checked="checked"/>\n' +
                                                        '                                <span class="weui-icon-checked checked"></span>\n' +
                                                        '                            </div>\n' +
                                                        '                        </label>';
                                                } else {
                                                    code += '                        <label class="weui-cell weui-check__label" for="o'+ optCount +'">\n' +
                                                        '                            <div class="weui-cell__bd">\n' +
                                                        '                                <p class="float-left option">'+ jsonTemplate[ele].options[i] +'</p>\n' +
                                                        '                            </div>\n' +
                                                        '                            <div class="weui-cell__ft">\n' +
                                                        '                                <input type="radio" class="weui-check" name="radio1" id="o'+ optCount++ +'"/>\n' +
                                                        '                                <span class="weui-icon-checked"></span>\n' +
                                                        '                            </div>\n' +
                                                        '                        </label>';
                                                }
                                            }
                                            code +='</div></div>';
                                            break;
                                        case 'checkbox':
                                            code += '                <div class="weui-form-preview__item">\n' +
                                                '                    <div class="weui-cells weui-cells_checkbox no-margin-top option-container">';

                                            for(var i = 0; i< jsonTemplate[ele].options.length; ++ i) {
                                                if(jsonData.indexOf(jsonTemplate[ele].options[i] >= 0)) {
                                                    code += '                        <label class="weui-cell weui-check__label" style="left: 0" for="o'+ optCount +'">\n' +
                                                        '                            <div class="weui-cell__hd ">\n' +
                                                        '                                <input type="checkbox" class="weui-check" name="checkbox1" id="o'+ optCount++ +'"/>\n' +
                                                        '                                <i class="weui-icon-checked checked"></i>\n' +
                                                        '                            </div>\n' +
                                                        '                            <div class="weui-cell__bd">\n' +
                                                        '                                <p class="float-left option">'+ json[ele].options[i] +'</p>\n' +
                                                        '                            </div>\n' +
                                                        '                        </label>';
                                                }else {
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
                                            }
                                            code +='</div></div>';
                                            break;
                                        case 'date':
                                            code += '                <div class="weui-form-preview__item">\n' +
                                                '                    <div class="weui-cells weui-cells_form no-margin-top">\n' +
                                                '                        <div class="weui-cell">\n' +
                                                '                            <div class="weui-cell__bd" >\n' +
                                                '                                <input id="date" class="weui-input float-left date-picker" value="' +jsonData[ele][0] +'" placeholder="请输入日期" type="text" data-toggle=\'date\' readonly/>\n' +
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
                                                '                                <input type="text" class="weui-input float-left city-picker" value="' +jsonData[ele][0] +'" id="city-picker" />\n' +
                                                '                            </div>\n' +
                                                '                        </div>\n' +
                                                '                    </div>\n' +
                                                '                </div>';
                                            break;
                                        case 'number':
                                            code += '                <div class="weui-form-preview__item">\n' +
                                                '                    <div class="weui-cells weui-cells_form no-margin-top">\n' +
                                                '                        <div class="weui-cell">\n' +
                                                '                            <div class="weui-cell__bd" >\n' +
                                                '                                <input type="number" pattern="[0-9]*" class="weui-input float-left" value="' +jsonData[ele][0] +'" placeholder="请输入内容"/>\n' +
                                                '                            </div>\n' +
                                                '                        </div>\n' +
                                                '                    </div>\n' +
                                                '                </div>';
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

                                    code += '</div></div>';
                                    $('#form').append(code);
                                    $(".date-picker").calendar();
                                    $(".city-picker").cityPicker({
                                        title: "请选择地址"
                                    });
                                }
                            }

                        }else {
                            $.toptip("数据异常", 'error')
                        }
                    } else $.toptip("数据获取失败", 'error');
                }, error: function (data) {
                    $.toptip("数据获取失败", 'error');
                }
            })
        }else $.toptip('访问出错', 'error');
    }, getQueryVariable: function(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable) {
                return pair[1];
            }
        }
        return(null);
    }, getData: function () {
        var eles = $('[id^=ele]');
        var data = {};

        for(var i = 0 ; i < eles.length; ++ i) {
            var title =  $(eles[i]).find('.title').html();
            data[title] = [];
            if($(eles[i]).data('type') == 'radio') {
                var checkedeles = $(eles[i]).find(':radio:checked');
                for (var j = 0; j < checkedeles.length; ++ j) {
                    var opt = $(checkedeles[j]).parents('.weui-cell__ft').prev().find('.option').html();
                    data[title].push(opt);
                }
            }else if($(eles[i]).data('type') == 'checkbox') {
                var checkedeles = $(eles[i]).find(':checkbox:checked');
                for (var j = 0; j < checkedeles.length; ++ j) {
                    var opt = $(checkedeles[j]).parents('.weui-cell__hd').next().find('.option').html();
                    data[title].push(opt);
                }
            }else if($(eles[i]).data('type') == 'muti') {
                var textEle =  $(eles[i]).find('textarea');
                var text = textEle.val();
                data[title].push(text);
            } else {
                var value = $(eles[i]).find('input').val();
                data[title].push(value);
            }
        }
        return data;
    }
};

reEdit.eventHandler = {
    handleEvents: function () {
        this.handleSubmit();
    }, handleSubmit: function () {
        $('#submit').click(function () {
            var data = reEdit.service.getData();
            var timeStamp = new Date().getTime();
            var templateId = reEdit.service.getQueryVariable('id');
            var dataId = reEdit.service.getQueryVariable('dataId');
            $.ajax({
                type: "POST",
                url: MW.server + "/updateFormData",
                data: JSON.stringify({
                    data : JSON.stringify(data),
                    timeStamp: timeStamp,
                    templateId: templateId,
                    dataId: dataId
                }),
                dataType: "json",
                success: function (data) {
                    if (200 == data.status) {
                        var url = MW.server + '/fillForm';
                        location.href = url;
                    } else $.alert("申请成功!");
                }, error:
                    function (data) {
                        $.alert("操作失败!请检查网络情况或与系统管理员联系！");
                    }
            })
        })
    }
};