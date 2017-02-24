function onBodyLoad() {

    const TRIANGLE_SRC = "../images/triangle.png";
    const RULER_SRC = "../images/ruler.png";

    const TRIANGLE_WIDTH = 1614;
    const TRIANGLE_HEIGHT = 814;
    const RULER_WIDTH = 2320;
    const RULER_HEIGHT = 138;

    const HANDLE_WIDTH = 100;

    var triangle = {
        x: 1600,                  /** Center x coordinate. */
        y: 1000,                  /** Center y coordinate. */
        width: TRIANGLE_WIDTH,
        height: TRIANGLE_HEIGHT,
        angle: 0,
        left: null,         /** Left rotate handle x, y */
        right: null,        /** Right rotate handle x, y */
        top: null           /** Top 90 degrees corner. */
    };

    var ruler = {
        'x': 1600,
        'y': 400,
        width: RULER_WIDTH,
        height: RULER_HEIGHT,
        angle: 0,
        left: null,
        right: null,
        middle: null,
        ne: null,
        se: null,
        sw: null,
        nw: null
    };


    /** Active tool: reflects a currently dragged handle. */
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
        return Math.atan2(dy, dx);
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

    /** Draw object (ruler or triangle) on canvas. */
    function draw(obj, canvas) {
        var ctx = document.getElementById('mapCanvas').getContext('2d');
        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.angle);
        ctx.translate(-obj.x, -obj.y);
        ctx.drawImage(canvas,
                      obj.x - obj.width/2,
                      obj.y - obj.height/2);
        ctx.restore();
    }

    /** Clear object (ruler or triangle) on canvas. */
    function clear(ctx, obj) {
        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.angle);
        ctx.translate(-obj.x, -obj.y);
        ctx.clearRect(obj.x - obj.width/2,
                      obj.y - obj.height/2,
                      obj.width,
                      obj.height);
        ctx.restore();
    }

    /** Setup the ruler object. */
    function initRuler() {
        rulerCanvas = document.createElement('canvas');
        rulerCanvas.width = RULER_WIDTH;
        rulerCanvas.height = RULER_WIDTH;
        var image = new Image();
        image.onload = function () {
            var ctx = rulerCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0)
            draw(ruler, rulerCanvas);
        }
        image.src = RULER_SRC;
    }

    function rotate(cx, cy, x, y, angle) {
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx
        const ny = (cos * (y - cy)) + (sin * (x - cx)) + cy;
        return {x: nx, y: ny};
    }

    /** Middle point on rulers's top side. */
    function getRulerTopMiddle() {
        return {
            x : ruler.x + Math.sin(ruler.angle) * ruler.height/2,
            y : ruler.y - Math.cos(ruler.angle) * ruler.height/2
        }
     }

    /** Middle point on rulers's bottom side. */
    function getRulerBottomMiddle() {
        return {
            x : ruler.x - Math.sin(ruler.angle) * ruler.height/2,
            y : ruler.y + Math.cos(ruler.angle) * ruler.height/2
        }
     }



    /** Upate ruler's handle coordinates. */
    function getRulerCorners() {
        const offset = RULER_WIDTH / 2;
        const sin = Math.sin(ruler.angle);
        const cos = Math.cos(ruler.angle);
        const topMiddle = getRulerTopMiddle();
        const bottomMiddle = getRulerBottomMiddle();

ruler.middle = bottomMiddle;

        ruler.left = {
            x: ruler.x - (cos * offset),
            y: ruler.y - (sin * offset)
        }
        ruler.right = {
            x: ruler.x + (cos * offset),
            y: ruler.y + (sin * offset)
        }
        ruler.nw = {
            x: topMiddle.x - (cos * ruler.width/2),
            y: topMiddle.y - (sin * ruler.width/2)
        }
        ruler.ne = {
            x: topMiddle.x + (cos * ruler.width/2),
            y: topMiddle.y + (sin * ruler.width/2)
        }
        ruler.sw = {
            x: bottomMiddle.x - (cos * ruler.width/2),
            y: bottomMiddle.y - (sin * ruler.width/2)
        }
        ruler.se = {
            x: bottomMiddle.x + (cos * ruler.width/2),
            y: bottomMiddle.y + (sin * ruler.width/2)
        }
       }
    /** Move ruler to new position p.*/
    function moveRuler(ctx, p) {
        clear(ctx, ruler);
        ruler.x = p.x;
        ruler.y = p.y;
        getRulerCorners();
        draw(ruler, rulerCanvas);
    }

    /** Rotate ruler according to new handle position. */
    function rotateRuler(ctx, p, leftHandle = true) {
        clear(ctx, ruler);
        var angle = leftHandle ? getAngle(ruler, p) : getAngle(p, ruler);
        ruler.angle = angle;
        getRulerCorners();
        draw(ruler, rulerCanvas);
    }

    /** Setup the triangle. */
    function initTriangle() {
        triangleCanvas = document.createElement('canvas');
        triangleCanvas.width = TRIANGLE_WIDTH;
        triangleCanvas.height = TRIANGLE_WIDTH;
        var image = new Image();
        image.onload = function () {
            var ctx = triangleCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0)
            draw(triangle, triangleCanvas);
        }
        image.src = TRIANGLE_SRC;
    }

    /** Move triangle to new position p. */
    function moveTriangle(ctx, p) {
        clear(ctx, triangle);
        triangle.x = p.x;
        triangle.y = p.y;
        getTriangleCorners()
        draw(triangle, triangleCanvas);
        //drawCircle(ctx, triangle.left)
        //drawCircle(ctx, triangle.right)
        //drawCircle(ctx, triangle.top)
    }

    /** Middle point on triangle's longest side. */
    function getTriangleMiddle() {
        const half_y = TRIANGLE_HEIGHT/2;
        return {
            x : triangle.x + Math.sin(triangle.angle) * half_y,
            y : triangle.y - Math.cos(triangle.angle) * half_y
        }

     }

    /** Rotate triangle according to new handle position. */
    function rotateTriangle(ctx, p, leftHandle = true) {
        clear(ctx, triangle);
        const middle = getTriangleMiddle();
        var angle =
            leftHandle ? getAngle(middle, p) : getAngle(p, middle);
        triangle.angle = angle;
        getTriangleCorners();
        draw(triangle, triangleCanvas);
        drawCircle(ctx, triangle.left)
        drawCircle(ctx, triangle.right)
        //drawCircle(ctx, triangle.top)
     }

    /** Upate triangle's handle coordinates. */
    function getTriangleCorners () {
        const offset = TRIANGLE_WIDTH / 2;
        const middle = getTriangleMiddle();
        const cos = Math.cos(triangle.angle);
        const sin = Math.sin(triangle.angle);

        triangle.left = {
            x: middle.x - (cos * offset),
            y: middle.y - (sin * offset)
        }
        triangle.right = {
            x: middle.x + (cos * offset),
            y: middle.y + (sin * offset)
        }
        triangle.top = {
            x: middle.x - (sin * triangle.height),
            y: middle.y + (cos * triangle.height),
        }
    }

    /** Return reflecting possible handle "near" to p, or null. */
    function findNearbyTool(p, canvas) {
        if (distance(p, ruler) < HANDLE_WIDTH)
            return 'moveRuler';
        if (distance(p, ruler.left) < HANDLE_WIDTH)
            return 'rotateRulerLeft';
        if (distance(p, ruler.right) < HANDLE_WIDTH)
            return 'rotateRulerRight';
        if (distance(p, triangle) < HANDLE_WIDTH)
            return 'moveTriangle';
        if (distance(p, triangle.left) < HANDLE_WIDTH)
            return 'rotateTriangleLeft';
        if (distance(p, triangle.right) < HANDLE_WIDTH)
            return 'rotateTriangleRight';
        return null;
    }

    /** Set the hand cursor on/off- */
    function setMoveCursor(active = true) {
        var elem = document.getElementById('mapCanvas');
        elem.style.cursor = active ? 'move' : 'default';
    }

    /** DOM mousedown event: possibly initiate drag- */
    function onMousedown(e) {
        if (e.buttons != 1)
            return;
        var canvas = document.getElementById('mapCanvas');
        var p = getMousePos(e, canvas);
        currentTool = findNearbyTool(p, canvas);
        if (currentTool != null)
            setMoveCursor();
    }

    /** DOM mouseup event:  stop drag-*/
    function onMouseup(e) {
        setMoveCursor(false);
        currentTool = null;
    }

    /** DOM mousemove event: possibly drag current tool. */
    function onMousemove(e) {
        const handlerByString = {
            'moveRuler': moveRuler,
            'moveTriangle': moveTriangle,
            'rotateRulerLeft': rotateRuler,
            'rotateRulerRight': function(c, p) { rotateRuler(c, p, false); },
            'rotateTriangleLeft': rotateTriangle,
            'rotateTriangleRight':
                function(c, p) { rotateTriangle(c, p, false); }
        }
        var canvas = document.getElementById('mapCanvas');
        var ctx = canvas.getContext('2d');
        const p = getMousePos(e, canvas);

        if (findNearbyTool(p, canvas) != null)
            setMoveCursor()
        else if (currentTool == null)
            setMoveCursor(false)
        if (e.buttons != 1 || currentTool == null)
            return;
        handlerByString[currentTool](ctx, p);
    }

    window.addEventListener('mousedown', onMousedown);
    window.addEventListener('mouseup', onMouseup);
    window.addEventListener('mousemove', onMousemove);

    getRulerCorners();
    getTriangleCorners();
    initTriangle();
    initRuler();
}
