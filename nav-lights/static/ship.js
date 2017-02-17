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
    if (getParameterByName(param) == null)
        return null;
    var style = document.getElementById(param).style;
    if (style != null)
        style.display = 'block';
    else
        console.log("No such element to display: " + param);
}


function onBodyLoad() {
    var lights = [
        'running', 'power', 'power-50m', 'running', 'no-command',
        'restr-man', 'draft', 'fisher', 'trawler', 'pilot', 'tugboat'
    ];
    for (var i = 0; i < lights.length; i += 1)
        handleLightParameter(lights[i]);
}

