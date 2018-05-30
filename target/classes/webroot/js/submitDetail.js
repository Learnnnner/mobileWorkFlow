$(function () {
   submitDetail.service.init();
   submitDetail.eventHandler.handleEvents();
});

var submitDetail = {};
submitDetail.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
        var dataId = this.getQueryVariable('dataId');
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

                        var formdata = JSON.parse(data.data[0][6]);
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
        return(null);
    }
};

submitDetail.eventHandler = {
    handleEvents: function () {
        this.handleRetire();
        this.handleApproval();
    }, handleRetire: function () {
        $('#retire').click(function () {
            
        })
    }, handleApproval: function () {
        $('#approval').click(function () {

        })
    }
};