function onBodyLoad() {

    const TRIANGLE_SRC = "../images/triangle.png";
    const RULER_SRC = "../images/ruler.png";

    const TRIANGLE_WIDTH = 1614;
    const TRIANGLE_HEIGHT = 814;
    const RULER_WIDTH = 2320;
    const RULER_HEIGHT = 138;

    const HANDLE_WIDTH = 100;

    /** Max length of click to not be a pull (ms). */
    const CLICK_THRESHOLD = 200;

    /** List of all user-defined waypoints. */
    var triangle = {'x': 2225, 'y': 1300};
    var ruler = {'x': 2225, 'y': 500};
    var currentTool = null;


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
        drawRuler(ruler);
        drawTriangle(triangle);
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

    /** Return index in waypoints to an element "close" to p or -1. */
    function findNearbyTool(p, canvas) {
        if (distance(p, triangle) < HANDLE_WIDTH)
            return 'triangle';
        if (distance(p, ruler) < HANDLE_WIDTH)
            return 'ruler';
        return null;
    }

    function drawRuler(p) {
        var canvas = document.getElementById('mapCanvas');
        var ctx = canvas.getContext('2d')
        var image = new Image();
        image.src = RULER_SRC;
        ctx.drawImage(image, p.x - RULER_WIDTH/2, p.y - RULER_HEIGHT/2);
    }

    function drawTriangle(p) {
        var canvas = document.getElementById('mapCanvas');
        var ctx = canvas.getContext('2d')
        var image = new Image();
        image.src = TRIANGLE_SRC;
        ctx.drawImage(image, p.x - TRIANGLE_WIDTH/2, p.y - TRIANGLE_HEIGHT/2);
    }


    /** DOM mousedown event: initiate currentWaypoint and mousedownAt. */
    function onMousedown(e) {
        if (e.buttons != 1)
            return;
        var canvas = document.getElementById('mapCanvas');
        var p = getMousePos(e, canvas);
        currentTool = findNearbyTool(p, canvas);
        mousedownAt = Date.now()
    }

    /** DOM mouseup event: possibly fire a click() */
    function onMouseup(e) {
        currentTool = null;
    }

    /** DOM mousemove event: possibly drag current waypoint. */
    function onMousemove(e) {
        if (e.buttons != 1 || currentTool == null)
            return;
        var canvas = document.getElementById('mapCanvas');
        var p = getMousePos(e, canvas);
        if (currentTool == 'ruler') {
            ruler.x = p.x
            ruler.y = p.y
        } else if (currentTool == 'triangle') {
            triangle.x = p.x
            triangle.y = p.y
        }
        redraw(canvas);
    }

    function initiateImages() {

        var imagesCount;
        var ctx;
        var images = [];

        function setupImages(onLoad) {
            images.push(new Image());
            images.push(new Image());
            images.push(new Image());
            images[0].src = MAP_SOURCE
            images[1].src = TRIANGLE_SRC;
            images[2].src = RULER_SRC;
            images[0].onload = onLoad;
            images[1].onload = onLoad;
            images[2].onload = onLoad;
        }


        function loadImages() {
            imagesCount -= 1;
            //if (imagesCount >= 0)
            //    return;
            var canvas = document.getElementById('mapCanvas');
            ctx.drawImage(images[0], 0, 0);
            ctx.drawImage(images[1], triangle.x - TRIANGLE_WIDTH/2,
                triangle.y - TRIANGLE_HEIGHT/2);
            ctx.drawImage(images[2], ruler.x - RULER_WIDTH/2,
                ruler.y - RULER_HEIGHT/2);
        }

        var canvas = document.getElementById('mapCanvas');
        if (!canvas.getContext)
            return;
        ctx = canvas.getContext('2d')
        setupImages(loadImages);
        imagesCount = images.length;
    }


    window.addEventListener('mousedown', onMousedown);
    window.addEventListener('mouseup', onMouseup);
    window.addEventListener('mousemove', onMousemove);
    initiateImages();
}
