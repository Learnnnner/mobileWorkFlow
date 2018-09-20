$(function () {
   submitDetail.service.init();
   submitDetail.eventHandler.handleEvents();
});

var submitDetail = {};
var formdata
submitDetail.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
        var dataId = submitDetail.service.getQueryVariable('dataId');
        $.ajax({
            type: "POST",
            url: MW.server + "/fetchUserData",
            data: JSON.stringify({dataId: dataId}),
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    if(data.data.length == 1) {
                        var title = '' + data.data[0][2] + data.data[0][4] + data.data[0][7];
                        $('#tag').html(data.data[0][9]);
                        $('#title').html(title);
                        $('#statusNow').html(data.data[0][8]);

                        formdata = JSON.parse(data.data[0][6]);

                        $.each(formdata,function(name, value) {
                            var code = '';
                            code += '        <div class="weui-cells__title">'+ name +'</div>\n' +
                                '        <div class="weui-cells">';
                            for(var j = 0; j < value.length; ++ j) {
                                code += '<div class="weui-cell">\n' +
                                    '                <div class="weui-cell__bd">\n' +
                                    '                    <div class="weui-media-box_appmsg">' + value[j] + '</div>'+
                                    '                </div>\n' +
                                    '            </div>';
                            }
                            code += '</div>';
                            $('#dataList').append(code);
                        });

                        var type = submitDetail.service.getQueryVariable("type");
                        if(type == 'detail') {
                            if(data.data[0][9] == "已退审"){
                                $('#detail').css('display','');
                            } else {
                                $('#node').css('display','');
                            }
                        }else {
                            $('#verify').css('display','');
                        }
                    } else {
                        $.toptip('数据错误', 'error');
                    }
                }
            }, error: function (data) {
                $.toptip("数据获取失败", 'error');
            }
        })
    }, getQueryVariable: function(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable) {
                return pair[1];
            }
        }
        return (null);
    }
};

submitDetail.eventHandler = {
    handleEvents: function () {
        this.handleRetire();
        this.handleApproval();
        this.handleCancel();
        this.handleReEdit();
    }, handleRetire: function () {
        $('#recall').click(function () {
            var dataId = submitDetail.service.getQueryVariable('dataId');
            $.confirm({
                title: '审批拒绝',
                text: '确认拒绝审批吗？',
                onOK: function () {
                    $.ajax({
                        type: "POST",
                        url: MW.server + "/RecallForm",
                        data: JSON.stringify({dataId: dataId}),
                        dataType: "json",
                        success: function (data) {
                            if (200 == data.status) {
                                $.toptip("审核完成", 'success');
                                window.location = history.back();
                            }
                        }, error: function (data) {
                            $.toptip("数据获取失败", 'error');
                        }
                    })
                },
                onCancel: function () {}
            });
        })
    }, handleApproval: function () {
        $('#approval').click(function () {
            var dataId = submitDetail.service.getQueryVariable('dataId');
            $.confirm({
                title: '审批通过',
                text: '确定通过审批吗？',
                onOK: function () {
                    $.ajax({
                        type: "POST",
                        url: MW.server + "/ApprovalForm",
                        data: JSON.stringify({dataId: dataId}),
                        dataType: "json",
                        success: function (data) {
                            if (200 == data.status) {
                                $.toptip("审核完成", 'success');
                                window.location = history.back();
                            }
                        }, error: function (data) {
                            $.toptip("数据获取失败", 'error');
                        }
                    })
                },
                onCancel: function () {}
            });
        })
    }, handleCancel: function () {
        $('#cancel').click(function () {
            var dataId = submitDetail.service.getQueryVariable('dataId');
            $.confirm({
                title: '关闭申请',
                text: '确定关闭申请吗？',
                onOK: function () {
                    $.ajax({
                        type: "POST",
                        url: MW.server + "/CancelAudit",
                        data: JSON.stringify({dataId: dataId}),
                        dataType: "json",
                        success: function (data) {
                            if (200 == data.status) {
                                $.toptip("申请已关闭", 'success');
                                window.location = history.back();
                            }
                        }, error: function (data) {
                            $.toptip("申请已关闭失败", 'error');
                        }
                    })
                },
                onCancel: function () {}
            });
        })
    }, handleReEdit: function () {
        $('#reEdit').click(function () {
            var dataId = submitDetail.service.getQueryVariable('dataId');
            $.ajax({
                type: "POST",
                url: MW.server + "/fetchTemplateId",
                data: JSON.stringify({dataId: dataId}),
                dataType: "json",
                success: function (data) {
                    if (200 == data.status) {
                        window.location = MW.server + '/reEdit?id=' + data.data[0][0] + '&dataId=' + dataId;
                    }
                }, error: function (data) {
                    $.toptip("数据获取失败", 'error');
                }
            });
        })
    }
};