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

    var triangleImg;
    var triangleCanvas;
    var rulerCanvas;

    /** Distance in pixels  p1 and p2. */
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

    function drawRuler() {
        var mapCanvas = document.getElementById('mapCanvas');
        var mapCtx = mapCanvas.getContext('2d');
        mapCtx.drawImage(rulerCanvas, ruler.x - RULER_WIDTH/2,
                ruler.y - RULER_HEIGHT/2);
    }

    function drawTriangle() {
        var mapCanvas = document.getElementById('mapCanvas');
        var mapCtx = mapCanvas.getContext('2d');
        mapCtx.drawImage(triangleCanvas,
                         triangle.x - TRIANGLE_WIDTH/2,
                         triangle.y - TRIANGLE_HEIGHT/2);
    }

    function clearRuler(ctx) {
        ctx.clearRect(ruler.x - RULER_WIDTH/2,
                  ruler.y - RULER_HEIGHT/2,
                  RULER_WIDTH,
                  RULER_HEIGHT);
    }

    function clearTriangle(ctx) {
        ctx.clearRect(triangle.x - TRIANGLE_WIDTH/2,
                  triangle.y - TRIANGLE_HEIGHT/2,
                  TRIANGLE_WIDTH,
                  TRIANGLE_HEIGHT);
    }

    /** Redraw ruler and triangle. */

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
        var ctx = canvas.getContext('2d');
        var p = getMousePos(e, canvas);
        if (currentTool == 'ruler') {
            clearRuler(ctx);
            ruler = p;
            drawRuler();
        } else if (currentTool == 'triangle') {
            clearTriangle(ctx);
            triangle = p;
            drawTriangle();
        }
    }

    function initiateImages() {

        var mapCanvas = document.getElementById('mapCanvas');
        if (!mapCanvas.getContext)
            return;

        triangleCanvas = document.createElement('canvas');
        triangleCanvas.width = TRIANGLE_WIDTH;
        triangleCanvas.height = TRIANGLE_WIDTH;
        var triangleImage = new Image();
        triangleImage.onload = function () {
            var ctx = triangleCanvas.getContext('2d');
            ctx.drawImage(triangleImage, 0, 0)
            drawTriangle();
        }
        triangleImage.src = TRIANGLE_SRC;
        drawTriangle();

        rulerCanvas = document.createElement('canvas');
        rulerCanvas.width = RULER_WIDTH;
        rulerCanvas.height = RULER_WIDTH;
        var rulerImage = new Image();
        rulerImage.onload = function () {
            var ctx = rulerCanvas.getContext('2d');
            ctx.drawImage(rulerImage, 0, 0)
            drawRuler();
        }
        rulerImage.src = RULER_SRC;
    }

    window.addEventListener('mousedown', onMousedown);
    window.addEventListener('mouseup', onMouseup);
    window.addEventListener('mousemove', onMousemove);
    initiateImages();
}
