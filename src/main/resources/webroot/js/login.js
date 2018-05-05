$(function () {
    login.service.init();
    login.eventHandler.handleEvents();
})

var  login = {};

login.data = {
    getData: function () {
        return {
            username: $('#username').val(),
            password: $('#password').val()
        }
    }
}

login.service = {
    init: function () {

    }, login: function () {
        var data = login.data.getData();
        return data.username && "请输入账号" != data.username ? data.password && "请输入密码" != data.username? void $.ajax({
            type: "POST",
            url: MW.server + "/login",
            data: JSON.stringify(data),
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                } else $.alert("登录失败，请检查用户名或密码是否正确!")
            }, error:
                function (data) {
                    console.log(data.status);
                    $.alert("操作失败!请检查网络情况或与系统管理员联系！")
                }
        }) : void $.alert("请输入密码!") : void $.alert("请输入用户名!")
    }
}


login.eventHandler = {
    handleEvents: function () {
        this.handleLogin();
    }, handleLogin: function () {
        $('#login').click(function () {
            login.service.login();
        })
    }
}