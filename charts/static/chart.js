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

    function drawRuler() {
        var mapCanvas = document.getElementById('mapCanvas');
        var mapCtx = mapCanvas.getContext('2d');
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width =  RULER_WIDTH;
        canvas.height = RULER_HEIGHT;
        var image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0);
            mapCtx.drawImage(canvas, ruler.x - RULER_WIDTH/2,
                ruler.y - RULER_HEIGHT/2);
        }
        image.src = RULER_SRC;
    }

    function drawTriangle() {
        var mapCanvas = document.getElementById('mapCanvas');
        var mapCtx = mapCanvas.getContext('2d');
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width =  TRIANGLE_WIDTH;
        canvas.height = TRIANGLE_WIDTH;
        var image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0)
            mapCtx.drawImage(canvas, triangle.x - TRIANGLE_WIDTH/2,
                triangle.y - TRIANGLE_HEIGHT/2);
        }
        image.src = TRIANGLE_SRC;
    }

    /** Redraw ruler and triangle. */
    function redraw(canvas) {
        drawRuler();
        drawTriangle();
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
        var ctx = canvas.getContext('2d');
        var p = getMousePos(e, canvas);
        if (currentTool == 'ruler') {
            ctx.clearRect(ruler.x - RULER_WIDTH/2,
                          ruler.y - RULER_HEIGHT/2,
                          RULER_WIDTH,
                          RULER_HEIGHT);
            ruler.x = p.x
            ruler.y = p.y
        } else if (currentTool == 'triangle') {
            ctx.clearRect(ruler.x - TRIANGLE_WIDTH/2,
                          ruler.y - TRIANGLE_HEIGHT/2,
                          TRIANGLE_WIDTH,
                          TRIANGLE_HEIGHT);
            triangle.x = p.x
            triangle.y = p.y
        }

        redraw(canvas);
    }

    function initiateImages() {

        var canvas = document.getElementById('mapCanvas');
        if (!canvas.getContext)
            return;
        drawTriangle();
        drawRuler();
    }

    window.addEventListener('mousedown', onMousedown);
    window.addEventListener('mouseup', onMouseup);
    window.addEventListener('mousemove', onMousemove);
    initiateImages();
}
