<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="css/weui.css">
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="../resource/templates/css/login.css">
    <link rel="stylesheet" href="templates/css/login.css">

    <script src="templates/js/jquery.js"></script>
    <script src="templates/js/jquery-weui.min.js"></script>
    <script src="templates/js/login.js"></script>
</head>
<body>
<div class="demo-head">
    登陆界面
</div>
<div class="weui-cells weui-cells_form">
    <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">账号</label></div>
        <div class="weui-cell__bd">
            <input class="weui-input" id="account" type="number" pattern="[0-9]*" placeholder="请输入账号">
        </div>
    </div>

    <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">密码</label></div>
        <div class="weui-cell__bd">
            <input class="weui-input" id="password" type="password" pattern=".*" placeholder="请输入密码">
        </div>
    </div>

    <div class="weui-cell">
    </div>

    <div class="btn">
        <a href="javascript:;" class="weui-btn weui-btn_primary">登陆</a>
    </div>
</div>


</body>
</html>