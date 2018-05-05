$(function () {
    init();
    eventHandler();
});

function init() {
    initBtn(btnType);
}

function eventHandler() {
    link();
}

function initBtn(list) {
    for(var obj in list) {
        for (var type in list[obj]) {
            var elementStr = '<a href="javascript:;" id="' + list[obj][type].type + '" class="weui-btn weui-btn_primary fontsize">' + list[obj][type].name + '</a>';
            $(".weui-btn-area").append(elementStr);
        }
    }
}

function link() {
    $('.weui-btn').click(function () {
        var $this = $(this);
        var type = $this.eq(0).attr('id');
        window.location.href="wf.html?type="+type;
    })
}