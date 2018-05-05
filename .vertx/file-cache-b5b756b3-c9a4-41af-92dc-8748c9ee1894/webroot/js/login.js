$(function () {
    login.service.init();
    login.eventHandler.handleEvents();
})

var  login = {};

login.data = {
    getData: function () {
        return {
            userName: $("#userName").val(),
            password: $("#password").val(),
        }
    }
}

login.service = {
    init: function () {
        this.login();
    }, login: function () {
        var data = login.data.getData();
        return data.userName && "请输入账号" != data.userName ? data.password && "请输入密码" != data.password? void $.ajax({
            type: "POST",
            url: MW.server + "/login",
            data: data,
            dataType: "json",
            success: function (data) {
                if (200 == data.status) {
                    location.href = "template.html"
                } else $.alert("登录失败，请检查用户名或密码是否正确!")
            },
            error: function () {
                $.alert("登陆失败！")
            }
        }) : void $.alert("请输入密码!") : void $.alert("请输入用户名!")
    }
}


login.eventeventHandler = {
    handleEvents: function () {
        this.handleLogin();
    }, handleLogin: function () {
        $('#login').click(function () {
            login.service.login();
        })
    }
}