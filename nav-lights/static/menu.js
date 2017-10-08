/**
    Copyright (c) Alec Leamas 2017

    Distributed under the GNU Public license, version 2 or any
    more recent of the GPL.

*/

function loadShip(base_url, lights, bgcolor) {
    var url  = base_url +  '?timestamp=' + Date.now();
    if (lights.length > 0)
        url += '&' + lights.join('&');
    if (bgcolor == 'rgb(2, 10, 75)')
        url += '&dusk'
    if (bgcolor == 'rgb(33, 33, 34)')
        url += '&night'
    window.frames['shipFrame'].location = url;
    console.log("loadSHip, url: " + url);
    //window.frames['shipFrame'].src = url;
    // setTimeout(function() {
    //     window.frames['shipFrame'].location.reload(true); }, 1)
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
        'no-command', 'restr-man', 'draft', 'pilot', 'tugboat',
        'max7m-7knots', 'obstruction'
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
    console.log("toggling: " + light);
    var style = getIframeElementById(light).style;
    console.log("got: " + style.display);
    style.display = style.display == 'none' ? 'block' : 'none';
    console.log("settinng to: " + style.display);
}


function do_set_lights(lights) {
    clear_lights();
    for (var i = 0; i < lights.length; i += 1)
        add_light(lights[i]);
}


function get_lights() {
    var allLights = [
        'running', 'power', 'power-50m', 'fisher', 'trawler',
        'no-command', 'restr-man', 'draft', 'pilot', 'tugboat',
        'max7m-7knots', 'obstruction'
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


function getIframeBody() {
    var iframe = document.getElementById('shipFrame');
    var innerDoc = (iframe.contentDocument) ?
        iframe.contentDocument : iframe.contentWindow.document;
    return innerDoc.getElementsByTagName('body')[0];
}


function set_lights(ship) {
    if (ship == 'power')
        do_set_lights(['running',  'power'])
    else if (ship == 'max7m-7knots')
        do_set_lights(['max7m-7knots'])
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
    else if (ship == 'obstruction')
        toggle_light('obstruction');
}

function accelerator(key) {

    const shipByKey = {
        '7': 'max7m-7knots',
        'S': 'sailor',
        'P': 'power',
        '5': 'power-50m',
        'C': 'no-command',
        'R': 'restr-man',
        'F': 'fisher',
        'T': 'trawler',
        'D': 'draft',
        'I': 'pilot',
        'U': 'tugboat',
        'O': 'obstruction'
    }

    key = key.toUpperCase();
    if (key in shipByKey) {
        var ship = shipByKey[key];
        set_lights(ship);
    }
}


function onBodyLoad() {
    clear_lights();
    var lights = get_lights();
};


function selectView(evt, viewName) {

    function setIframeBackground(color) {
        var body = getIframeBody();
        if (body)
            body.style['background-color'] = color;
    }

    var body = getIframeBody();
    var bgcolor = body.style['background-color'] || 'black';

    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
        tablinks[i].style['background-color'] = '';
    }

    document.getElementById(viewName).style.display = "block";
    evt.currentTarget.className += " active";
    evt.currentTarget.style['background-color'] = bgcolor;

    var old_lights = get_lights()
    loadShip(viewName + '.html', old_lights, bgcolor)
    var new_lights = get_lights();
    setTimeout(function() { setIframeBackground(bgcolor); }, 10);
}


function setNight() {
    getIframeBody().style['background-color'] = '#212122';
}

function setDusk() {
    getIframeBody().style['background-color'] = '#020a4b';
}

function onKeypress(e) {
    accelerator(e.key);
}
