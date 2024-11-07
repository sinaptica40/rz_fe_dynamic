$(document).ready(function () {

    var HeadH = $('#header').outerHeight();
    //  $('body').css('padding-top', HeadH);

    var scrollWindow = function() {
        $(window).on('load scroll',function() {
            var navbar = $('#header');
            
            // if ($(this).scrollTop() > HeadH) {
            if ($(this).scrollTop() > 250) {
                if (!navbar.hasClass('is-sticky')) {
                    navbar.addClass('is-sticky');
                     $('body').css('padding-top', HeadH);
                }
            }
            // if ($(this).scrollTop() < HeadH) {
            if ($(this).scrollTop() < 250) {
                if (navbar.hasClass('is-sticky')) {
                    navbar.removeClass('is-sticky');
                    //$('body').css('padding-top', 0);
                }
            }
            // if ($(this).scrollTop() > HeadH*2) {
            if ($(this).scrollTop() > 250) {
                if (!navbar.hasClass('awake')) {
                    navbar.addClass('awake');
                }
            }
            // if ($(this).scrollTop() < HeadH*2) {
            if ($(this).scrollTop() < 50) {
                if (navbar.hasClass('awake')) {
                    navbar.removeClass('awake');
                }
            }
            // if ($(this).scrollTop() >= 400) { 
            //     $('.back_top').addClass('active');
            // }
            // else {
            //     $('.back_top').removeClass('active');
            // }
        });
    };
    // scrollWindow();


    var btn = $('#top-button');

    $(window).scroll(function() {
      if ($(window).scrollTop() > 300) {
        btn.addClass('show');
      } else {
        btn.removeClass('show');
      }
    });
    
    btn.on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({scrollTop:0}, '300');
    });


    $(".navbar-toggler").click(function () {
        $(this).toggleClass("menu-opened");
        $("#header .navcollapse:not(.show)").toggleClass("menu-show");
        $("body").toggleClass("scroll-off");
        $(".overlay").fadeToggle();
    });

    $(".overlay").click(function () {
        $(this).fadeToggle();
        $("#header .navcollapse:not(.show)").toggleClass("menu-show");
        $("body").toggleClass("scroll-off");
        $(".navbar-toggler").toggleClass("menu-opened");
    });


    $(window).on("resize", function (e) {
        checkScreenSize();
    });
    var logo = $(".navbar-brand img").attr("src");

    checkScreenSize();
    function checkScreenSize() {
        var newWindowWidth = $(window).width();
        if (newWindowWidth <= 991) {
            $("#header .navcollapse:not(.show)").find(".mobile_logo").remove();
            $("#header .navcollapse:not(.show)").append("<div class='mobile_logo'>" + "<img src=" + logo + " alt=''>" + "</div>");
        }
    }


    /* ======= Scroll back to top ======= */
    var progressPath = document.querySelector('.progress-wrap .progress-circle path');
    var pathLength = progressPath?.getTotalLength();
    progressPath?.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath?.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath?.style.strokeDashoffset = pathLength;
    progressPath?.getBoundingClientRect();
    progressPath?.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
    var updateProgress = function () {
        var scroll = $(window).scrollTop();
        var height = $(document).height() - $(window).height();
        var progress = pathLength - (scroll * pathLength / height);
        progressPath?.style.strokeDashoffset = progress;
    }
    updateProgress();
    $(window).scroll(updateProgress);
    var offset = 150;
    var duration = 550;
    jQuery(window).on('scroll', function () {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.progress-wrap').addClass('active-progress');
        } else {
            jQuery('.progress-wrap').removeClass('active-progress');
        }
    });
    jQuery('.progress-wrap').on('click', function (event) {
        event.preventDefault();
        jQuery('html, body').animate({
            scrollTop: 0
        }, duration);
        return false;
    })   
    // End

    // $('.box-loader').fadeOut('slow');
    var Wheight = $(window).height();
    var Hheight = $('#header').outerHeight();
    //var Fheight = $('.footer_wrapper').outerHeight();
    var Innheight = Wheight -  Hheight;
    $('.webcontent-wrapper').css('min-height', Innheight);
});