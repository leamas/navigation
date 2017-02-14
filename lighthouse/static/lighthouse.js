/** The color displayed: 'white', 'red' or 'green'-*/
color = "white";


/** Update color, and hide not used ones.. */
function set_color(c) {
    color = c;
    document.getElementById('red').style.display = 'none';
    document.getElementById('white').style.display = 'none';
    document.getElementById('green').style.display = 'none';
    document.getElementById(color).style.display = 'block';
}


/** Turn on the global color for given time. */
function blink(ms) {
    elem = document.getElementById(color).style;
    elem.display = 'block';
    setTimeout(function() { elem.display = 'none'; }, ms);
}


function blinks(ms, count, next_func = null) {
    for (var i = 0; i < count; i += 1) {
        setTimeout(blink, i * 2 * ms, ms);
    }
    if (next_func) {
        setTimeout(next_func, count * 2 * ms)
    }
}


function long_flash() {
    blink(2500);
}


/** Turn off the global color for given time. */
function occult(ms) {
    elem = document.getElementById(color).style;
    elem.display = 'none';;
    setTimeout(function() { elem.display = 'block'; }, ms);
}


function occults(ms, count) {
    for (var i = 0; i < count; i += 1) {
        setTimeout(occult, i * 2 * ms, ms);
    }
}


/** Return query parameter from current url. */
function getParameterByName(name) {
    var url = window.location.href;
    url = decodeURIComponent(url);
    if (url.indexOf('?') == -1)
        return null;
    var query = url.split('?')[1]
    var params = query.split('&');
    for (var i = 0; i < params.length; i += 1) {
        var param = params[i].split('=');
        if (param[0] == name) {
            return param[1];
        }
    }
    return null;
}


/** Show the legend info. */
function showLegend() {
    document.getElementById("legend").style.width = '70%';
    document.getElementById("legend").style.display = 'block';
    document.getElementById("showLegend").style.display = 'none';
}


/** Hide the legend info. */
function hideLegend() {
    document.getElementById("legend").style.width = '1';
    document.getElementById("legend").style.display = 'none';
    document.getElementById("showLegend").style.display = 'block';
}


/**
* Possibly update global color on 'g', 'r' or other keys: red, green.
* white.
*/
function check_keypress(e) {
    if (e.key == 'R' || e.key == 'r') {
        color = 'red';
    } else if (e.key == 'G' || e.key == 'g') {
        color = 'green'
    } else  {
        color = 'white'
    }
}


function set_legend(img, text){
    document.getElementById("legendImg").src= img;
    document.getElementById("legendText").textContent = '\u23f5 ' + text;
}


function fixed_red() {
    set_legend("FR.png", "FR");
    color='red';
    document.getElementById(color).style.display = 'block';
}


function occult_5s() {
    set_legend("occult-5s.png", "Oc 5s");
    color='white';
    blink(4000);
    setInterval(blink, 5000, 4000);
}


function occult_2_5s() {
    set_legend("occult-2-5s.png", "Oc(2) 5s");
    color='white';
    document.getElementById(color).style.display = 'block';
    occults(1000, 2);
    setInterval(occults, 5000, 1000, 2);
}


function iso_5s() {
    set_legend("iso-5s.png", "ISO 5s");
    blink(2500);
    setInterval(blink, 5000, 2500);
}


function long_flash_10s() {
    set_legend("long-flash-10s.png", "L Fl 10s");
    long_flash();
    setInterval(blink, 10000, 2500);
}


function long_flash_2_20s() {
    set_legend("long-flash-2-20s.png", "L Fl(2) 20s");
    blinks(2500, 2);
    setInterval(blinks, 20000, 2500, 2);
}


function flashing_3s() {
    set_legend("flash-3s.png", "Fl 3s");
    blink(1000);
    setInterval(blink, 3000, 1000);
}


function flash_2_6s() {
    set_legend("flash-2-6s.png", "Fl(2) 6s");
    blinks(1000, 2);
    setInterval(blinks, 6000, 1000, 2);
}


function quick() {
    set_legend("quick.png", "Q");
    setInterval(blink, 1000, 400);
}


function quick_3_10s() {
    set_legend("quick-3-10s.png", "Q(3) 10s");
    blinks(400, 3)
    setInterval(blinks, 10000, 400, 3);
}


function quick_9_15s() {
    set_legend("quick-9-15s.png", "Q(9) 15s");
    blinks(400, 9)
    setInterval(blinks, 15000, 400, 9);
}


function quick_6_long_flash_15s() {
    set_legend("quick-6-long-flash-15s.png", "Q(6) L Fl 15s");
    blinks(400, 5, long_flash);
    setInterval(blinks, 15000, 400, 6, long_flash);
}


function interrupted_quick_15s() {
    set_legend("interrupted-quick-15s.png", "IQ 15s");
    blinks(400,7);
    setInterval(blinks, 15000, 400, 7);
}


function very_quick() {
    set_legend("very-quick.png", "VQ");
    setInterval(blink, 500, 250);
}


function very_quick_3_5s() {
    set_legend("very-quick-3-5s.png", "VQ(3) 5s");
    blinks(250, 3)
    setInterval(blinks, 5000, 250, 3);
}


function very_quick_9_10s() {
    set_legend("very-quick-9-10s.png", "VQ(9) 10s");
    blinks(250, 9)
    setInterval(blinks, 10000, 250, 9);
}


function very_quick_6_long_flash_10s() {
    set_legend("very-quick-6-long-flash.png", "VQ(6) L Fl 10s");
    blinks(250, 6, long_flash);
    setInterval(blinks, 10000, 250, 6, long_flash);
}


function morse_k() {

    function k() {
        long_flash();
        setTimeout(blink, 3200, 1000)
        setTimeout(long_flash, 5000)
    }

    set_legend("morse-k.png", "Mo (-.-) 10s");
    k();
    setInterval(k, 10000);
}


function alternate_white_red() {

    function alternate () {
        set_color('red');
        setTimeout(function() { set_color('white'); }, 2500);
    }

    document.getElementById(color).style.display = 'block';
    set_color('white');
    set_legend("alternate-white-red.png", "Al W R 5s");
    setInterval(alternate, 5000);
}


function flash_2_2_white_green() {

    function greens() {
        set_color('green');
        blinks(1000, 2);
    }

    function whites() {
        set_color('white');
        blinks(1000, 2);
        setTimeout(greens, 5000);
    }

    set_legend('flash-2-2-white-green.png', 'Al Fl (2+2) W G 10s');
    whites();
    setInterval(whites, 10000);
}


/* Change location.href i. e., reload page with other parameters. */
function set_location(kind, ix)
{
    var url = window.location.href
    url = url.split('?')[0]
    url = url.split('#')[0]
    url += '?kind=' + kind;
    url += '&title=Example ' + ix;
    window.location.href = url
}


command_by_id = {
    "flash-3s": [flashing_3s, "Fl 3s"],
    "FR": [fixed_red, "FR"],
    "occult-5s": [occult_5s, "Oc 5s"],
    "occult-2-5s": [occult_2_5s, "Oc(2) 5s"],
    "iso-5s": [iso_5s, "ISO 5s"],
    "long-flash-10s": [long_flash_10s, "L Fl 10s"],
    "long-flash-2-20s": [long_flash_2_20s, "L Fl(2) 20s"],
    "flash-2-6s": [flash_2_6s, "Fl(2) 6s"],
    "quick": [quick, "Q"],
    "quick-3-10s": [quick_3_10s, "Q(3) 10s"],
    "quick-9-15s": [quick_9_15s, "Q(9) 15s"],
    "quick-6-long-flash-15s":[quick_6_long_flash_15s, "Q(6) L Fl 15s"],
    "interrupted-quick-15s": [interrupted_quick_15s, "IQ 15s"],
    "very-quick": [very_quick, "VQ"],
    "very-quick-3-5s": [very_quick_3_5s, "VQ(3) 5s"],
    "very-quick-9-10s": [very_quick_9_10s, "VQ(9) 10s"],
    "very-quick-6-long-flash-10s":
        [very_quick_6_long_flash_10s, "VQ(6) L Fl 10s"],
    "morse-k": [morse_k, "Mo (-.-) 10s"],
    "alternate-white-red": [alternate_white_red, "Al W R 5s"],
    "flash-2-2-white-green": [flash_2_2_white_green, 'Al Fl (2+2) W G 10s']
}


function loadIframe(scheme) {
    descr = command_by_id[scheme][1];
    document.getElementById('header').textContent = descr;
    url = "index.html?nolegend=1&kind=" + scheme + "&title=" + descr;
    window.frames['demoFrame'].location = url;

}


function dispatch() {
    hideLegend();
    var noLegend = getParameterByName('nolegend');
    if (noLegend) {
        document.getElementById('menu').style.display = 'none';
    }
    var title = getParameterByName("title");
    if (title) {
        if (title.endsWith('#'))
            title = title.slice(0,-1);
        document.getElementById('menuText').textContent = title;
    }
    var kind = getParameterByName("kind");
    if (kind in command_by_id)
        command_by_id[kind][0]()
    else if (kind)
        alert("Cannot display scheme: " + kind);
}

