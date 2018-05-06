$(function () {
    init();
    eventHandler();
});

function init() {
    initBtn(flowType);
}

function eventHandler() {
    link();
}

function initBtn(list) {
    for(var obj in list) {
        for (var type in list[obj]) {
            var elementStr = '<a href="javascript:;" id="' + list[obj][type].type + '" class="weui-btn weui-btn_primary fontsize">' + list[obj][type].name + '</a>';
            $(".weui-btn-area").prepend(elementStr);
        }
    }
}

function link() {
    $('.weui-btn').click(function () {
        var $this = $(this);
        var type = $this.eq(0).attr('id');
        // window.location.href="wf.html?type="+type;
        // var data = {"type" : type};
        //
        // $.ajax({
        //     type: "post",
        //     url : "localhost:8080/wf",
        //     dataType:'json',
        //     data: JSON.stringify(data),
        //     success: function(data){
        //         alert('success');
        //     }
        // });
    })
}