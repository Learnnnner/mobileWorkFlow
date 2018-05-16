(function(root,factory){
    factory(root.jQuery);
})(window, function($) {
    var __DEF__ = {
        title : "管理用户组",
        titleIcon : "&#x3104;",
        spreadRoot: false,
        effect: 200,
        data : []
    };

    var __PROTOTYPE__ = {
        _init : function() {
            this.addClass("auth-list");
            this.code = '';
            this.code += this._render();
            this.html(this.code);
        }, _render : function() {
            var code = "";
            $.each(this.data, function(i, data) {
                var _data = data;
                code += '<li class="auth-li" data-id="' + data.id + '">' +
                    '<p class="authitem auth2 pr">' +
                    '<span class="btn-toggle">' +
                    '<span>' +
                    '<i class="iconfont icon-checkbox" style="color: #1aad19" mhref="'+data.id+'">&#x3128;</i>' +
                    '</span>' +
                    data.text +
                    '</span>' +
                    '<i class="iconfont icon-right-down">&#x3125;</i>' +
                    '</p>' +
                    '<ul class="'+(data.spread?"":"hide")+'">';
                $.each(data.childs,function(j, data) {
                    code+='<li>'+
                        '<p class="authitem auth3 pr" data-id="' + data.id + '">' +
                        '<span class="btn-toggle">' +
                        '<span>' +
                        '<i class="iconfont icon-checkbox" style="color: #1aad19" mhref="'+data.id+'" phref="'+_data.id+'">&#x3128;</i>' +
                        '</span>' +
                        data.text +
                        '</span>' +
                        '</p>';
                    code+='</li></li>';
                });
                code += '</ul></li>';
            });
            return code;
        }, _handle : function() {
            var $this = this;
            this.find(".icon-right-down").on('click',function() {
                $(this).toggleClass("icon-close").parent().next().slideToggle(effect);
            });
            this.find(".btn-toggle").on('click',function() {
                var $chbox = $(this).find(".icon-checkbox");
                if(!$this.bubble){
                    var isChecked = $chbox.toggleClass("checked").hasClass("checked");
                    $chbox.html(isChecked?"&#x3127;":"&#x3128;");
                    if(isChecked){
                        $this.find("[phref='"+$chbox.attr('mhref')+"']").addClass('checked').html("&#x3127;");
                    }else{
                        $this.find("[phref='"+$chbox.attr('mhref')+"']").removeClass('checked').html("&#x3128;");
                    }
                }
                var $pch = $this.find("[mhref='"+$chbox.attr('phref')+"']");
                var $siblings = $this.find("[phref='"+$chbox.attr('phref')+"']");
                var sum = $siblings.length;
                var curr = $siblings.filter(".checked").length;
                if(sum==curr){
                    $pch.addClass("checked");
                }else if(curr==0){
                    $pch.removeClass("checked");
                }
                $pch.html(sum == curr?"&#x3127;" : curr == 0?"&#x3128;":"&#x3138;");
                $this.bubble = true;
                $pch.trigger('click');
                window.setTimeout(function() {
                    $this.bubble = false;
                },200);
            });
        }
    };

    $.fn.groupRule = function(options) {
        this.extend(__DEF__);
        this.extend(options);
        this.extend(__PROTOTYPE__);
        this._init();
        this._handle();
    }
});