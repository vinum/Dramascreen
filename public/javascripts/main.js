$(function(){
    function pad(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    function ordinal_suffix_of(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    var audio = {
        error: new Audio('sounds/drama.mp3'),
        warning: new Audio('sounds/alarm.mp3'),
        notice: new Audio('sounds/beep.mp3')
    };

    var prevTime = null;
    setInterval(function(){
        var date = new Date();
        var timeString = date.getHours() + ":" + pad(date.getMinutes(), 2);
        if(timeString != prevTime){
            prevTime = timeString;
            $(".time").text(timeString);
            $(".date").text(ordinal_suffix_of(date.getDate()) + " " + months[date.getMonth()] + " " + date.getFullYear());
        }
    });

    var socket = io();
    var turnOffTimeout;


    socket.on("message", function(message){
        setScreenDisplay(message);
        playSound(message);
        initFlipbackTimeout();
    });

    function initFlipbackTimeout() {
        if (turnOffTimeout) {
            clearTimeout(turnOffTimeout);
        }
        turnOffTimeout = setTimeout(function () {
            turnOffTimeout = null;
            $("#screen").removeClass("flipped");
        }, 20000);
    }

    function playSound(message){
        if(audio[message.type]){
            audio[message.type].play();
        }
    }

    function setScreenDisplay(message) {
        $(".title").text(message.title);
        $(".message").text(message.message);
        $("#screen")
            .removeClass("error")
            .removeClass("notice")
            .removeClass("warning")
            .removeClass("info")
            .addClass("flipped")
            .addClass(message.type);
    }

});