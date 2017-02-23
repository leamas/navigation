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
    var triangleCanvas;
    var rulerCanvas;

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

    function initRuler() {
        rulerCanvas = document.createElement('canvas');
        rulerCanvas.width = RULER_WIDTH;
        rulerCanvas.height = RULER_WIDTH;
        var image = new Image();
        image.onload = function () {
            var ctx = rulerCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0)
            drawRuler();
        }
        image.src = RULER_SRC;
    }

    function drawRuler() {
        var mapCtx = document.getElementById('mapCanvas').getContext('2d');
        mapCtx.drawImage(rulerCanvas, ruler.x - RULER_WIDTH/2,
                ruler.y - RULER_HEIGHT/2);
    }

    function clearRuler(ctx) {
        ctx.clearRect(ruler.x - RULER_WIDTH/2,
                  ruler.y - RULER_HEIGHT/2,
                  RULER_WIDTH,
                  RULER_HEIGHT);
    }

    function moveRuler(ctx, p) {
        clearRuler(ctx);
        ruler = p;
        drawRuler();
    }

    function initTriangle() {
        triangleCanvas = document.createElement('canvas');
        triangleCanvas.width = TRIANGLE_WIDTH;
        triangleCanvas.height = TRIANGLE_WIDTH;
        var image = new Image();
        image.onload = function () {
            var ctx = triangleCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0)
            drawTriangle();
        }
        image.src = TRIANGLE_SRC;
    }

    function drawTriangle() {
        var ctx = document.getElementById('mapCanvas').getContext('2d');
        ctx.drawImage(triangleCanvas,
                      triangle.x - TRIANGLE_WIDTH/2,
                      triangle.y - TRIANGLE_HEIGHT/2);
    }

    function clearTriangle(ctx) {
        ctx.clearRect(triangle.x - TRIANGLE_WIDTH/2,
                  triangle.y - TRIANGLE_HEIGHT/2,
                  TRIANGLE_WIDTH,
                  TRIANGLE_HEIGHT);
    }

    function moveTriangle(ctx, p) {
        clearTriangle(ctx);
        triangle = p;
        drawTriangle();
    }

    function findNearbyTool(p, canvas) {
        if (distance(p, triangle) < HANDLE_WIDTH)
            return 'moveTriangle';
        if (distance(p, ruler) < HANDLE_WIDTH)
            return 'moveRuler';
        return null;
    }

    function setMoveCursor(reset = false) {
        var elem = document.getElementById('mapCanvas');
        elem.style.cursor = reset ? 'default' : 'move';
    }


    /** DOM mousedown event:  */
    function onMousedown(e) {
        if (e.buttons != 1)
            return;
        var canvas = document.getElementById('mapCanvas');
        var p = getMousePos(e, canvas);
        currentTool = findNearbyTool(p, canvas);
        mousedownAt = Date.now()
        if (currentTool != null)
            setMoveCursor();
    }

    /** DOM mouseup event: */
    function onMouseup(e) {
        setMoveCursor(true);
        currentTool = null;
    }

    /** DOM mousemove event: possibly drag current tool. */
    function onMousemove(e) {
        var canvas = document.getElementById('mapCanvas');
        var ctx = canvas.getContext('2d');
        var p = getMousePos(e, canvas);
        if (findNearbyTool(p, canvas) != null)
            setMoveCursor()
        else if (currentTool == null)
            setMoveCursor(true)
        if (e.buttons != 1 || currentTool == null)
            return;
        if (currentTool == 'moveRuler')
            moveRuler(ctx, p)
        else if (currentTool == 'moveTriangle')
            moveTriangle(ctx, p);
    }

    window.addEventListener('mousedown', onMousedown);
    window.addEventListener('mouseup', onMouseup);
    window.addEventListener('mousemove', onMousemove);
    initTriangle();
    initRuler();
}
