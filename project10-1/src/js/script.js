var $ = require("jquery");

$(document).ready(function() {
    //鼠标移动侧边栏消失或隐藏 
    $(".s_bri").mouseenter(function() {
        wH = $(window).height();
        $(".bdbri").fadeIn(300);
        $(".bdbri").css("height", wH);
    });
    $(".bdbri").mouseleave(function() {
        $(".bdbri").fadeOut(300);
    });
    //tab栏切换
    $(".menu_container .m").each(function(index) {
        var tabOn = $(this);
        $(this).click(function() {
            $(".menu_container .tabin").removeClass("tabin");
            $(".s_contents .contentin").removeClass("contentin");
            $(".s_contents>div").eq(index).addClass("contentin");
            tabOn.addClass("tabin");
        })
    });

    //屏幕滚动事件
    $(window).scroll(function() {
        var scrollHeight = $(window).scrollTop();
        //当屏幕向下滚动时
        if (scrollHeight > 0) {
            //向上按钮显示
            $(".to-top").show();
            //滚动加载
            $(".news-wrapper").each(function(index) {
                var content = $(".news-wrapper").eq(index).find(".news-item").eq(0);
                $(".news-wrapper").eq(index).append(content.clone());
            });
        } else {
            $(".to-top").hide();
        }

        //当屏幕滚动高度大于370时，改变css
        if (scrollHeight > 370) {
            $(".news-rank").css({
                "position": "absolute",
                "top": scrollHeight - 370 + "px",
                "right": "-21px"
            });
        } else if (scrollHeight <= 370) {
            $(".news-rank").css({
                "position": "absolute",
                "top": "0px",
                "right": "-21px"
            });
        }
    });

    //当点击跳转链接后，回到页面顶部位置  
    $(".to-top").click(function() {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
        return false;
    });



    $(".news-wrapper").each(function(index) {
        var content = $(".news-wrapper").eq(index).find(".news-item");
        var item = $(".news-rank-content li").eq(0);
        for (var i = 0; i < 3; i++) {
            $(".news-wrapper").eq(index).append(content.clone());
        }
        for (var i = 0; i < 11; i++) {
            $(".news-rank-content").eq(index).append(item.clone());
        }
    })
});
