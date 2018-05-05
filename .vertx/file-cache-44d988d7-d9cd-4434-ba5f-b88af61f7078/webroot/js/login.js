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
            data: JSON.stringify({name: "Jack", origin: "start"}),
        }).done(function () {
            alert(JSON.stringify({name: "Jack", origin: "start"}));
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