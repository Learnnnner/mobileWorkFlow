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
        $.ajax({
            method: "POST",
            url: "/login",
            data: 1,
        }).done(function () {
            alert("success");
        });
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