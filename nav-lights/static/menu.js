/**
    Copyright (c) Alec Leamas 2017

    Distributed under the GNU Public license, version 2 or any
    more recent of the GPL.

*/

function loadShip(base_url) {
    var query = "";
    lights = get_lights()
    if (lights.length > 0)
        query = '?' + lights[0];
    for (var i= 1; i < lights.length; i += 1)
        query += '&' + lights[i];
    var url = base_url + query;
    window.frames['shipFrame'].location = url;
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
     var style = getIframeElementById(light).style;
     if (style)
         style.display = 'block';
}

function remove_light(light) {
    try {
        var style = getIframeElementById(light).style;
        if (style)
            style.display = 'none'
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
    var body = document.getElementById('pageBody');
    var value = body.getAttribute('data-lights');
    if (value == null || value == "")
        return [];
    else
        return value.split(' ');
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
    set_lights('power-50m');
};

function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
