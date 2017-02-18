/**
    Copyright (c) Alec Leamas 2017

    Distributed under the GNU Public license, version 2 or any
    more recent of the GPL.

*/

function loadShip(base_url, lights) {
    var url  = base_url +  '?timestamp=' + Date.now();
    if (lights.length > 0)
        url += '&' + lights.join('&');
    window.frames['shipFrame'].location = url;
    window.frames['shipFrame'].src = url;
    //setTimeout(function() {
    //    window.frames['shipFrame'].location.reload(true); }, 1)
}


function getIframeElementById(id_) {
    var iframe = document.getElementById('shipFrame');
    var innerDoc = (iframe.contentDocument) ?
        iframe.contentDocument : iframe.contentWindow.document;
    return innerDoc.getElementById(id_);
}


function clear_lights() {
    var allLights = [
        'running', 'power', 'power-50m', 'fisher', 'trawler',
         'no-command', 'restr-man', 'draft', 'pilot', 'tugboat'
    ];
    for (var i = 0; i < allLights.length; i += 1)
         remove_light(allLights[i]);

}


function add_light(light) {
     var elem = getIframeElementById(light);
     if (elem)
         elem.style.display = 'block';
     else
        console.log("Cannot set light: " + light);
}


function remove_light(light) {
    try {
        var elem = getIframeElementById(light);
        if (elem)
            elem.style.display = 'none'
    } catch(e) {
        console.log("Cannot clear light: " + light);
    }
}


function toggle_light(light) {
    var style = getIframeElementById(light).style;
    style.display = style.display == 'none' ? 'block' : 'none';
}


function do_set_lights(lights) {
    clear_lights();
    for (var i = 0; i < lights.length; i += 1)
        add_light(lights[i]);
}


function get_lights() {
    var allLights = [
        'running', 'power', 'power-50m', 'fisher', 'trawler',
         'no-command', 'restr-man', 'draft', 'pilot', 'tugboat'
    ];
    var lights = [];
    for (var i = 0; i < allLights.length; i += 1) {
        var elem = getIframeElementById(allLights[i]);
        if (elem == null)
            continue;
        if (elem.style.display != 'none')
            lights.push(allLights[i])
    }
    return lights;
}


function set_lights(ship) {
    if (ship == 'power')
        do_set_lights(['running',  'power'])
    else if (ship == 'sailor')
        do_set_lights(['running'])
    else if (ship == 'power-50m')
        do_set_lights(['running', 'power', 'power-50m'])
    else if (ship == 'fisher')
        toggle_light('fisher')
    else if (ship == 'trawler')
        toggle_light('trawler')
    else if (ship == 'draft')
        toggle_light('draft')
    else if (ship == 'pilot')
        toggle_light('pilot')
    else if (ship == 'tugboat')
        toggle_light('tugboat')
    else if (ship == 'no-command')
        do_set_lights(['running', 'no-command'])
    else if (ship == 'restr-man')
        toggle_light('restr-man')
    else if (ship == 'tugboat')
        toggle_light('tugboat');
}


function onBodyLoad() {
    clear_lights();
    var lights = get_lights();
};


function selectView(evt, viewName) {

    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(viewName).style.display = "block";
    evt.currentTarget.className += " active";

    var old_lights = get_lights()
    loadShip(viewName + '.html', old_lights)
    var new_lights = get_lights();
}
