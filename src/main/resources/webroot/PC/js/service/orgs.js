$(function () {
    orgs.service.init();
    orgs.eventHandler.handleEvents();
})

var orgs = {};
var department = [];

orgs.service = {
    init: function () {
        this.initControl();
    }, initControl: function () {
        $.ajax({
            type: "POST",
            url: MW.server + "/fetchOrgs",
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    for (var i = 0; i < data.orgList.length; ++ i) {
                        department.push(data.orgList[i]);
                    }
                };
                $(document).ready(function(){$(".dataTables-example").dataTable();})
            }, error: function (data) {
            }
        })
    }
}

orgs.eventHandler = {
    handleEvents: function () {}
}
