/** global: list of all user-defined waypoints. */
waypoints = [];


function onKeypress(e) {
    alert("Code: " + e.keyCode);
}


function distance(p1, p2) {
    var deltaX = p1.x - p2.x;
    var deltaY = p1.y - p2.y;
    return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
}


function getMousePos(e, canvas) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor(
            (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
        y: Math.floor
            ((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
    };
}


function drawMarker(p, canvas) {
    var image = new Image();
    image.src = "../images/marker.png";
    var ctx = canvas.getContext('2d')
    ctx.drawImage(image, p.x - 12, p.y - 12);
}


function redraw(canvas) {
    var ctx = canvas.getContext('2d')
    var image = new Image();
    image.src = "../images/hitta-hamnen-1.png";
    ctx.drawImage(image, 0, 0);
    for (var i = 0; i < waypoints.length; i += 1)
        drawMarker(waypoints[i], canvas);
}


function checkRemove(p, canvas) {
    for (var i = 0; i < waypoints.length; i += 1) {
        if (distance(p, waypoints[i]) < 12) {
            waypoints.splice(i, 1);
            redraw(canvas);
            return true;
        }
    }
    return false;
}


function onClick(e) {
    if (e.button != 0)
        return;
    var canvas = document.getElementById('mapCanvas');
    var p = getMousePos(e, canvas);
    if (checkRemove(p, canvas))
        return;
    waypoints.push(p);
    drawMarker(p, canvas)
}


function onBodyLoad() {
    window.addEventListener('keypress', onKeypress);
    window.addEventListener('click', onClick);

    var canvas = document.getElementById('mapCanvas');
    if (!canvas.getContext)
        return;
    var ctx = canvas.getContext('2d')
    var image = new Image();
    image.src = "../images/hitta-hamnen-1.png";
    image.onload = function () {
        ctx.drawImage(image, 0, 0);
    }
}
