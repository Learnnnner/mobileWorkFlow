$(function () {
    staffSelect.service.init();
    staffSelect.eventHandler.handleEvents();
});

var staffSelect = {};
var staffData ={};
var viewData = [];
var staffSelected = [];

staffSelect.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
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
                            staffData[$data[i][1]].id = $data[i][0]
                            staffData[$data[i][1]].value = [];
                            staffData[$data[i][1]].value.push($data[i]);
                        }else {
                            staffData[$data[i][1]].value.push($data[i]);
                        }
                    }

                    for(var i in staffData) {
                        var temp = {};
                        temp.id = '' + staffData[i].id;
                        temp.text = i;
                        temp.spread = true;
                        temp.checked = false;
                        temp.childs = [];
                        for(var j in staffData[i].value) {
                            var tempj = {};
                            tempj.id = '' + staffData[i].value[j][2];
                            tempj.text = staffData[i].value[j][3];
                            temp.childs.push(tempj);
                        }
                        viewData.push(temp);
                    }

                    $("#groupRule").groupRule({title : "填单人", titleIcon : "&#x3104;", data : viewData, effect: 200});

                    staffSelect.service.initSelected();
                } else $.toptip('操作失败，请检查用户名或密码是否正确!', 'error');
            }, error: function (data) {
                    $.toptip('操作失败!请检查网络情况或与系统管理员联系！', 'error');
                }
        });
    }, initSelected: function () {
        if(staffSelected.length > 0) {
            var $this=$('#groupRule');
            for(var i = 0; i < staffSelected.length; i++) {
                var id = '#' + staffSelected[i];
                var $chbox = $(id).find(".icon-checkbox");
                $chbox.addClass('checked').html("&#x3127;");
                var $pch = $this.find("[mhref='"+$chbox.attr('phref')+"']");
                var $siblings = $this.find("[phref='"+$chbox.attr('phref')+"']");
                var sum = $siblings.length;
                var curr = $siblings.filter(".checked").length;
                if(sum == curr){
                    $pch.addClass("checked");
                } else if(curr==0){
                    $pch.removeClass("checked");
                }
                $pch.html(sum == curr?"&#x3127;" : curr == 0?"&#x3128;":"&#x3138;");
            }
        }
    }, getUser: function () {
        var userData = [];
        var checkedUser = $('#groupRule').find('.auth3').find('.checked');
        for(var i = 0; i < checkedUser.length; ++ i) {
            userData.push($(checkedUser[i]).attr('mhref'))
        }
        return userData;
    }, getdealer: function () {
        var userData = [];
        var checkedUser = $('#dealer').find('.auth3').find('.checked');
        for(var i = 0; i < checkedUser.length; ++ i) {
            userData.push($(checkedUser[i]).attr('mhref'))
        }
        return userData;
    }
};

staffSelect.eventHandler = {
    handleEvents: function () {
        this.handleSave();
        // this.handleTest();
    }, handleSave: function () {
        $('#save').click(function () {
            formDesign.service.saveData();
        })
    }
}
