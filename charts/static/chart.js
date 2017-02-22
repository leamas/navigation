function onBodyLoad() {

    const TRIANGLE_SRC = "../images/triangle.png";
    const RULER_SRC = "../images/ruler.png";

    const TRIANGLE_WIDTH = 1614;
    const TRIANGLE_HEIGHT = 814;
    const RULER_WIDTH = 2320;
    const RULER_HEIGHT = 138;

    const HANDLE_WIDTH = 100;

    var triangle = {'x': 1600, 'y': 1000};
    var ruler = {'x': 1600, 'y': 400};
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

    function drawRuler(p, ctx) {
        var canvas = document.createElement('canvas');
        canvas.width =  RULER_WIDTH;
        canvas.height = RULER_WIDTH;
        var rulerCtx = canvas.getContext('2d');
        var image = new Image();
        image.onload = function () {
            rulerCtx.drawImage(image, 0, (RULER_WIDTH - RULER_HEIGHT)/2);
            ctx.drawImage(canvas, p.x - RULER_WIDTH/2,
                p.y - RULER_WIDTH/2);
        }
        image.src = RULER_SRC;
    }

    function drawTriangle(p, ctx) {
        var canvas = document.createElement('canvas');
        canvas.width =  TRIANGLE_WIDTH;
        canvas.height = TRIANGLE_WIDTH;
        var triangleCtx = canvas.getContext('2d');
        var image = new Image();
        image.onload = function () {
            triangleCtx.drawImage(
                image, 0, (TRIANGLE_WIDTH - TRIANGLE_HEIGHT)/2
            )
            ctx.drawImage(canvas, p.x - TRIANGLE_WIDTH/2,
                p.y - TRIANGLE_WIDTH/2);
        }
        image.src = TRIANGLE_SRC;
    }

    /** Redraw image, ruler and triangle. */
    function redraw(canvas) {
        var ctx = canvas.getContext('2d')
        var image = new Image();
        image.src = MAP_SOURCE;
        ctx.drawImage(image, 0, 0);
        drawRuler(ruler, ctx);
        drawTriangle(triangle);
    }

    function findNearbyTool(p, canvas) {
        if (distance(p, triangle) < HANDLE_WIDTH)
            return 'triangle';
        if (distance(p, ruler) < HANDLE_WIDTH)
            return 'ruler';
        return null;
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

        var mapCtx;

        function setupRuler() {
            drawRuler(ruler, mapCtx);
        }

        function setupTriangle() {
            drawTriangle(triangle, mapCtx);
        }

        function setupMap() {
            var mapImage = new Image()
            mapImage.onload = function() {
                mapCtx.drawImage(mapImage, 0, 0);
                setupTriangle();
                setupRuler();
            }
            mapImage.src = MAP_SOURCE;
        }

        var canvas = document.getElementById('mapCanvas');
        if (!canvas.getContext)
            return;
        mapCtx = canvas.getContext('2d')
        setupMap();

    }

    window.addEventListener('mousedown', onMousedown);
    window.addEventListener('mouseup', onMouseup);
    window.addEventListener('mousemove', onMousemove);
    initiateImages();
}
