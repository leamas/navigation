function onBodyLoad() {

    const TRIANGLE_SRC = "../images/triangle.png";
    const RULER_SRC = "../images/ruler.png";

    const TRIANGLE_WIDTH = 1614;
    const TRIANGLE_HEIGHT = 814;
    const RULER_WIDTH = 2320;
    const RULER_HEIGHT = 138;

    const HANDLE_WIDTH = 100;

    /** Current triangle center position. */
    var triangle = {'x': 1600, 'y': 1000};

    /** Current ruler center position. */
    var ruler = {'x': 1600, 'y': 400};

    /** Angle of longest side in ruler, -PI ..PI radians, initially 0 */
    var rulerAngle = 0;
    var rulerRotateHandleLeft;
    var rulerRotateHandleRight

    /** Angle of longest triangle side, -PI ..PI radians, initially 0 */
    var triangleAngle = 0;
    var triangleHandleLeft;
    var triangleHandleRight

    /** Active tool: moveRuler, moveTriangle, rotateRuler, rotateTriangle. */
    var currentTool = null;
    var triangleCanvas;
    var rulerCanvas;

    /** Distance in pixels between p1 and p2. */
    function distance(p1, p2) {
        var deltaX = p1.x - p2.x;
        var deltaY = p1.y - p2.y;
        return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    }

    /** Angle in radians for line from p1 to p2. */
    function getAngle(p1, p2) {
        var dy = p1.y - p2.y;
        var dx = p1.x - p2.x;
        var angle = Math.atan2(dy, dx);
        return angle;
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

    /*** Draw a circle (debug) */
    function drawCircle(ctx, p) {
        const radius = 30;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
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

    function getRulerRotateHandle (leftHandle = true) {
        const offset = (RULER_WIDTH - HANDLE_WIDTH) / 2;
        if (leftHandle) {
            return {
                x: ruler.x - (Math.cos(rulerAngle) * offset),
                y: ruler.y - (Math.sin(rulerAngle) * offset)
            }
        }
        return {
                x: ruler.x + (Math.cos(rulerAngle) * offset),
                y: ruler.y + (Math.sin(rulerAngle) * offset)
        }
    }

    function getTriangleRotateHandle (leftHandle = true) {
        const offset = (TRIANGLE_WIDTH - HANDLE_WIDTH) / 2;
        const middle = getTriangleMiddle();
        if (leftHandle) {
            return {
                x: middle.x - (Math.cos(triangleAngle) * offset),
                y: middle.y - (Math.sin(triangleAngle) * offset)
            }
        }
        return {
                x: middle.x + (Math.cos(triangleAngle) * offset),
                y: middle.y + (Math.sin(triangleAngle) * offset)
        }
    }

    function drawRuler() {
        var ctx = document.getElementById('mapCanvas').getContext('2d');
        ctx.save();
        ctx.translate(ruler.x, ruler.y);
        ctx.rotate(rulerAngle);
        ctx.translate(-ruler.x, -ruler.y);
        ctx.drawImage(rulerCanvas,
                      ruler.x - RULER_WIDTH/2,
                      ruler.y - RULER_HEIGHT/2);
        ctx.restore();
    }

    function clearRuler(ctx) {
        ctx.save();
        ctx.translate(ruler.x, ruler.y);
        ctx.rotate(rulerAngle);
        ctx.translate(-ruler.x, -ruler.y);
        ctx.clearRect(ruler.x - RULER_WIDTH/2,
                      ruler.y - RULER_HEIGHT/2,
                      RULER_WIDTH,
                      RULER_HEIGHT);
        ctx.restore();
    }

    function moveRuler(ctx, p) {
        clearRuler(ctx);
        ruler = p;
        drawRuler();
        rulerRotateHandleLeft = getRulerRotateHandle();
        rulerRotateHandleRight= getRulerRotateHandle(false);
    }

    function rotateRuler(ctx, p, leftHandle = true) {
        clearRuler(ctx);
        var angle = leftHandle ? getAngle(ruler, p) : getAngle(p, ruler);
        rulerAngle = angle;
        drawRuler();
        rulerRotateHandleLeft = getRulerRotateHandle();
        rulerRotateHandleRight= getRulerRotateHandle(false);
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
        ctx.save();
        ctx.translate(triangle.x, triangle.y);
        ctx.rotate(triangleAngle);
        ctx.translate(-triangle.x, -triangle.y);
        ctx.drawImage(triangleCanvas,
                      triangle.x - TRIANGLE_WIDTH/2,
                      triangle.y - TRIANGLE_HEIGHT/2);
        ctx.restore();
        //drawCircle(ctx, triangleHandleRight)
        ////drawCircle(ctx, triangleHandleLeft)
        //drawCircle(ctx, getTriangleMiddle())
   }

    function clearTriangle(ctx) {
        ctx.save();
        ctx.translate(triangle.x, triangle.y);
        ctx.rotate(triangleAngle);
        ctx.translate(-triangle.x, -triangle.y);
        ctx.clearRect(triangle.x - TRIANGLE_WIDTH/2,
                      triangle.y - TRIANGLE_HEIGHT/2,
                      TRIANGLE_WIDTH,
                      TRIANGLE_HEIGHT);
        ctx.restore();
    }

    function moveTriangle(ctx, p) {
        clearTriangle(ctx);
        triangle = p;
        drawTriangle();
        triangleHandleLeft = getTriangleRotateHandle();
        triangleHandleRight = getTriangleRotateHandle(false);
    }

    function getTriangleMiddle() {
        const half_y = TRIANGLE_HEIGHT/2;
        return {
            x : triangle.x + Math.sin(triangleAngle) * half_y,
            y : triangle.y - Math.cos(triangleAngle) * half_y
        }

     }

    function rotateTriangle(ctx, p, leftHandle = true) {
        clearTriangle(ctx);
        const middle = getTriangleMiddle();
        var angle =
            leftHandle ? getAngle(middle, p) : getAngle(p, middle);
        triangleAngle = angle;
        triangleHandleLeft = getTriangleRotateHandle();
        triangleHandleRight = getTriangleRotateHandle(false);
        drawTriangle();
     }

    function findNearbyTool(p, canvas) {
        if (distance(p, ruler) < HANDLE_WIDTH)
            return 'moveRuler';
        if (distance(p, rulerRotateHandleLeft) < HANDLE_WIDTH)
            return 'rotateRulerLeft';
        if (distance(p, rulerRotateHandleRight) < HANDLE_WIDTH)
            return 'rotateRulerRight';
        if (distance(p, triangle) < HANDLE_WIDTH)
            return 'moveTriangle';
        if (distance(p, triangleHandleLeft) < HANDLE_WIDTH)
            return 'rotateTriangleLeft';
        if (distance(p, triangleHandleRight) < HANDLE_WIDTH)
            return 'rotateTriangleRight';
        return null;
    }


    function setMoveCursor(active = true) {
        var elem = document.getElementById('mapCanvas');
        elem.style.cursor = active ? 'move' : 'default';
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
        setMoveCursor(false);
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
            setMoveCursor(false)
        if (e.buttons != 1 || currentTool == null)
            return;
        if (currentTool == 'moveRuler')
            moveRuler(ctx, p)
        else if (currentTool == 'moveTriangle')
            moveTriangle(ctx, p);
        else if (currentTool == 'rotateRulerLeft')
            rotateRuler(ctx, p);
        else if (currentTool == 'rotateRulerRight')
            rotateRuler(ctx, p, false);
        else if (currentTool == 'rotateTriangleLeft')
            rotateTriangle(ctx, p);
        else if (currentTool == 'rotateTriangleRight')
            rotateTriangle(ctx, p, false);
    }

    window.addEventListener('mousedown', onMousedown);
    window.addEventListener('mouseup', onMouseup);
    window.addEventListener('mousemove', onMousemove);
    rulerRotateHandleLeft = getRulerRotateHandle();
    rulerRotateHandleRight = getRulerRotateHandle(false);
    triangleHandleLeft = getTriangleRotateHandle();
    triangleHandleRight = getTriangleRotateHandle(false);

    initTriangle();
    initRuler();
}
