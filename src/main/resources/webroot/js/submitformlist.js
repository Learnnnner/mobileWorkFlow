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
                    if(data.data.mysubmit.length > 0) {
                        for(var i = 0; i < data.data.mysubmit.length; ++ i) {
                            var code = '<a class="weui-media-box weui-media-box_appmsg formItem" data-type="detail" data-dataId="'+ data.data.mysubmit[i][5] +'">\n' +
                                '                <div class="weui-media-box__bd">\n' +
                                '                    <h4 class="weui-media-box__title">' + data.data.mysubmit[i][2] + data.data.mysubmit[i][4] + data.data.mysubmit[i][7] + '</h4>\n' +
                                '                    <p class="weui-media-box__desc">\n' +
                                '                        <table>\n' +
                                '                            <tr class="form-item">\n';
                            if(data.data.mysubmit[i][9]=='审批中') {
                                code += '<td><div class="tag tag-size color-b">'+ data.data.mysubmit[i][9] +'</div></td>';
                            }else if(data.data.mysubmit[i][9]=='已退审') {
                                code += '<td><div class="tag tag-size color-r">'+ data.data.mysubmit[i][9] +'</div></td>';
                            }else if(data.data.mysubmit[i][9]=='已关闭'){
                                code += '<td><div class="tag tag-size color-grey">'+ data.data.mysubmit[i][9] +'</div></td>';
                            }else {
                                code += '<td><div class="tag tag-size color-g">'+ data.data.mysubmit[i][9] +'</div></td>';
                            }
                            var date = approvalForm.service.myDate(data.data.mysubmit[i][7]);
                            code += '                                <td><div class="exp-size">审批单•'+ date +'</div></td>\n' +
                                '                            </tr>\n' +
                                '                        </table>\n' +
                                '                    </p>\n' +
                                '                </div>\n' +
                                '            </a>';
                            $('#myforms').append(code);
                        }
                        $('#submitnum').html(data.data.mysubmit.length).css('display','inline');
                    }

                    if(data.data.tosubmit.length > 0) {
                        for(var i = 0; i < data.data.tosubmit.length; ++ i) {
                            var code = '<a class="weui-media-box weui-media-box_appmsg formItem" data-type="verify" data-dataId="'+ data.data.tosubmit[i][5] +'">\n' +
                                '                <div class="weui-media-box__bd">\n' +
                                '                    <h4 class="weui-media-box__title">' + data.data.tosubmit[i][2] + data.data.tosubmit[i][4] + data.data.tosubmit[i][7] + '</h4>\n' +
                                '                    <p class="weui-media-box__desc">\n' +
                                '                        <table>\n' +
                                '                            <tr class="form-item">\n'
                            if(data.data.tosubmit[i][9]=='审批中') {
                                code += '<td><div class="tag tag-size color-b">'+ data.data.tosubmit[i][9] +'</div></td>';
                            }else if(data.data.tosubmit[i][9]=='已退审') {
                                code += '<td><div class="tag tag-size color-r">'+ data.data.tosubmit[i][9] +'</div></td>';
                            }else if(data.data.tosubmit[i][9]=='已关闭'){
                                code += '<td><div class="tag tag-size color-grey">'+ data.data.tosubmit[i][9] +'</div></td>';
                            }else {
                                code += '<td><div class="tag tag-size color-g">'+ data.data.tosubmit[i][9] +'</div></td>';
                            }
                            var date = approvalForm.service.myDate(data.data.tosubmit[i][7]);
                            code += '                                <td><div class="exp-size">审批单•'+ date +'</div></td>\n' +
                                '                            </tr>\n' +
                                '                        </table>\n' +
                                '                    </p>\n' +
                                '                </div>\n' +
                                '            </a>';
                            $('#todo-forms').append(code);
                        }
                        $('#todonum').html(data.data.tosubmit.length).css('display','inline');
                    }
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
        $(document).on('click', '.formItem', function () {
            var self = $(this);
            var dataId = self.data('dataid');
            var type = self.data('type');
            location.href= MW.server + '/submitDetail?dataId=' + dataId + "&type=" + type;
        })
    }
};