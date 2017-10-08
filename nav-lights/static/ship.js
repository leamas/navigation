/**
    Copyright (c) Alec Leamas 2017

    Distributed under the GNU Public license, version 2 or any
    more recent of the GPL.

*/

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
            return param[1] ? param[1] : '1';
        }
    }
    return null;
}

function handleLightParameter(param) {
    var elem = document.getElementById(param);
    if (elem == null)
        return;
    if (getParameterByName(param) == null)
        elem.style.display = 'none';
    else
        elem.style.display = 'block';
}

function setNight() {
    document.getElementsByTagName('body')[0].style['background-color'] = '#212122';
}

function setDusk() {
    document.getElementsByTagName('body')[0].style['background-color'] = '#020a4b';
}

function onBodyLoad() {
    var lights = [
        'running', 'power', 'power-50m', 'running', 'no-command',
        'restr-man', 'draft', 'fisher', 'trawler', 'pilot', 'tugboat',
        'max7m-7knots', 'obstruction'
    ];
    for (var i = 0; i < lights.length; i += 1)
        handleLightParameter(lights[i]);
    if (getParameterByName('night') != null)
        setNight();
    if (getParameterByName('dusk') != null)
        setDusk();
    console.log("foo");
}

