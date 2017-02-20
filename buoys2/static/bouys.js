/** global: list of all user-defined waypoints. */
waypoints = [];

function onKeypress(e) {
    alert("Code: " + e.keyCode);
}

function getMousePos(e, canvas) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}


function onClick(e) {
    if (e.button != 0)
        return;
    var canvas = document.getElementById('mapCanvas');
    var where = getMousePos(e, canvas);
    waypoints.push(where);

    var image = new Image();
    image.src = "../images/marker.png";

    var ctx = canvas.getContext('2d')
    ctx.drawImage(image, where['x'] - 12, where['y'] - 12);
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
