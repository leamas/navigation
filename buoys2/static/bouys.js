function onBodyLoad() {

    const MARKER_SRC = "../images/marker.png";

    /** Width in pixels of waypoint marker. */
    const MARKER_WIDTH = 12;

    /** List of all user-defined waypoints. */
    waypoints = [];


    /** Distance in pixels between p1 and p2. */
    function distance(p1, p2) {
        var deltaX = p1.x - p2.x;
        var deltaY = p1.y - p2.y;
        return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    }

    /** Position relative canvas of mouse click event e.*/
    function getMousePos(e, canvas) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.floor(
                (e.clientX - rect.left) / (rect.right - rect.left)
                * canvas.width),
            y: Math.floor
                ((e.clientY - rect.top) / (rect.bottom - rect.top)
                    * canvas.height)
        };
    }

    /** Draw the X marker for a user click/waypoint. */
    function drawMarker(p, canvas) {
        var image = new Image();
        image.src = MARKER_SRC;
        var ctx = canvas.getContext('2d')
        ctx.drawImage(image, p.x - MARKER_WIDTH, p.y - MARKER_WIDTH);
    }

    /** Draw lines connecting the global waypoints. */
    function drawLines(canvas) {
        if (waypoints.length  < 2)
            return;
        var ctx = canvas.getContext('2d')
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);
        for (var i = 1; i < waypoints.length; i += 1)
            ctx.lineTo(waypoints[i].x, waypoints[i].y);
        ctx.stroke();
    }

    /** Redraw image, markers and lines. */
    function redraw(canvas) {
        var ctx = canvas.getContext('2d')
        var image = new Image();
        image.src = MAP_SOURCE;
        ctx.drawImage(image, 0, 0);
        for (var i = 0; i < waypoints.length; i += 1)
            drawMarker(waypoints[i], canvas);
        drawLines(canvas);
    }

    /**
     * Check if p is "close" to an existing waypoint; if so, remove it.
     * Return true if a waypoint is removed.
     */
    function checkRemove(p, canvas) {
        for (var i = 0; i < waypoints.length; i += 1) {
            if (distance(p, waypoints[i]) < MARKER_WIDTH) {
                waypoints.splice(i, 1);
                redraw(canvas);
                return true;
            }
        }
        return false;
    }

    /** DOM mouse click event handler: add or remove a waypoint. */
    function onClick(e) {
        if (e.button != 0)
            return;
        var canvas = document.getElementById('mapCanvas');
        var p = getMousePos(e, canvas);
        if (checkRemove(p, canvas))
            return;
        waypoints.push(p);
        drawMarker(p, canvas)
        drawLines(canvas);
    }

    window.addEventListener('click', onClick);
    var canvas = document.getElementById('mapCanvas');
    if (!canvas.getContext)
        return;
    var ctx = canvas.getContext('2d')
    var image = new Image();
    image.src = MAP_SOURCE;
    image.onload = function () { ctx.drawImage(image, 0, 0); }
}
