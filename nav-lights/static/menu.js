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


function add_light(light) {
    var body = document.getElementById('pageBody');
    var value = body.getAttribute('data-lights');
    value = value == null ? light : value + " " + light;
    body.setAttribute('data-lights', value);
}

function remove_light(light) {
    var body = document.getElementById('pageBody');
    var value = body.getAttribute('data-lights');
    value = value.replace(light, "");
    value = value.replace("  ", " ");
    body.setAttribute('data-lights', value);
}

function toggle_light(light) {
    var body = document.getElementById('pageBody');
    var value = body.getAttribute('data-lights');
    if (value.inndexOf(light) == -1)
        remove_light(light)
    else
        add_light(light)
}

function do_set_lights(lights) {
    var body = document.getElementById('pageBody');
    body.setAttribute('data-lights', lights);
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
        do_set_lights("running power")
    else if (ship == 'sailor')
        do_set_lights("running")
    else if (ship == 'power-50m')
        do_set_lights("running power power-50m")
    else if (ship == 'fisher')
        toggle_lights('fisher')
    else if (ship == 'trawler')
        toggle_lights('trawler')
    else if (ship == 'no-commmand')
        do_set_lights('running no-command')
    else if (ship == 'restr-man')
        toggle_lights('restr-man')
    else if (ship == 'tugboat')
        toggle_lights('tugboat');
    loadShip('ship-sb.html');
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
