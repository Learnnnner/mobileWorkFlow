$(function () {
    approvalForm.service.init();
    approvalForm.eventHandler.handleEvents();
});

var approvalForm = {};

approvalForm.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
        $.ajax({
            type: "POST",
            url: MW.server + "/fetchSubmitForms",
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    if(data.data.length > 0) {
                        for(var i = 0; i < data.data.length; ++ i) {
                            var code = '<a class="weui-media-box weui-media-box_appmsg" data-dataId="'+ data.data[i][2] +'">\n' +
                                '                <div class="weui-media-box__bd">\n' +
                                '                    <h4 class="weui-media-box__title">' + data.data[i][0] + data.data[i][1] + data.data[i][3] + '</h4>\n' +
                                '                    <p class="weui-media-box__desc">\n' +
                                '                        <table>\n' +
                                '                            <tr class="form-item">\n'
                            if(data.data[i][4]=='审批中') {
                                code += '<td><div class="tag tag-size color-b">'+ data.data[i][4] +'</div></td>';
                            }else if(data.data[i][4]=='退审') {
                                code += '<td><div class="tag tag-size color-r">'+ data.data[i][4] +'</div></td>';
                            }else {
                                code += '<td><div class="tag tag-size color-g">'+ data.data[i][4] +'</div></td>';
                            }
                            var date = approvalForm.service.myDate(data.data[i][3]);
                            code += '                                <td><div class="exp-size">审批单•'+ date +'</div></td>\n' +
                                '                            </tr>\n' +
                                '                        </table>\n' +
                                '                    </p>\n' +
                                '                </div>\n' +
                                '            </a>';
                            $('#forms').append(code);
                        }
                    } else {}
                } else $.toptip("服务器访问异常!", "error");
            }, error: function (data) {
                $.toptip("服务器访问异常!", "error");
            }
        })
    }, add0: function(m) {
        return m < 10 ? '0' + m : m
    }, myDate: function(timestamp) {
        var time = new Date(parseInt(timestamp));
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
    }
};

approvalForm.eventHandler = {
    handleEvents: function () {
        this.handleDetail();
    }, handleDetail: function () {
        $(document).on('click', 'a', function () {
            var self = $(this);
            var dataId = self.data('dataid');
            location.href= MW.server + '/submitDetail?dataId=' + dataId;
        })
    }
};