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
        ne: null,
        se: null,
        sw: null,
        nw: null
    };


    /** Active tool: reflects a currently dragged handle. */
    var currentTool = null;

    var triangleCanvas;
    var rulerCanvas;

    /**
     * Check if two line intersects.
     */
    // point object: {x:, y:}
    // p0 & p1 form one segment, p2 & p3 form the second segment
    // Returns true if lines segments are intercepting
    var lineSegmentsIntersect = (function(){
        // function as singleton so that closure can be used

        var v1, v2, v3, cross, u1, u2;
            // working variable are closed over so they do not need creation
            // each time the function is called. This gives a significant performance boost.
        v1 = {x : null, y : null}; // line p0, p1 as vector
        v2 = {x : null, y : null}; // line p2, p3 as vector
        v3 = {x : null, y : null}; // the line from p0 to p2 as vector

        function lineSegmentsIntersect(p0, p1, p2, p3) {
            v1.x = p1.x - p0.x; // line p0, p1 as vector
            v1.y = p1.y - p0.y;
            v2.x = p3.x - p2.x; // line p2, p3 as vector
            v2.y = p3.y - p2.y;
            if((cross = v1.x * v2.y - v1.y * v2.x) === 0){
                return false // cross prod 0 if lines parallel
            }
            v3 = {x : p0.x - p2.x, y : p0.y - p2.y};  // the line from p0 to p2 as vector
            u2 = (v1.x * v3.y - v1.y * v3.x) / cross; // get unit distance along line p2 p3
            // code point B
            if (u2 >= 0 && u2 <= 1){                   // is intercept on line p2, p3
                u1 = (v2.x * v3.y - v2.y * v3.x) / cross; // get unit distance on line p0, p1;
                // code point A
                return (u1 >= 0 && u1 <= 1);           // return true if on line else false.
                // code point A end
            }
            return false; // no intercept;
            // code point B end
        }
        return lineSegmentsIntersect;  // return function with closure for optimisation.
    })();

    function isColliding() {
		return lineSegmentsIntersect(
            triangle.left, triangle.right, ruler.sw, ruler.se) ||
		lineSegmentsIntersect(
            triangle.left, triangle.right, ruler.nw, ruler.ne) ||
		lineSegmentsIntersect(
            triangle.left, triangle.right, ruler.se, ruler.ne) ||
		lineSegmentsIntersect(
            triangle.left, triangle.right, ruler.sw, ruler.nw) ||
		lineSegmentsIntersect(
            triangle.left, triangle.top, ruler.sw, ruler.se) ||
		lineSegmentsIntersect(
            triangle.left, triangle.top, ruler.nw, ruler.ne) ||
		lineSegmentsIntersect(
            triangle.left, triangle.top, ruler.se, ruler.ne) ||
		lineSegmentsIntersect(
            triangle.left, triangle.top, ruler.sw, ruler.nw) ||
		lineSegmentsIntersect(
            triangle.right, triangle.top, ruler.sw, ruler.se) ||
		lineSegmentsIntersect(
            triangle.right, triangle.top, ruler.nw, ruler.ne) ||
		lineSegmentsIntersect(
            triangle.right, triangle.top, ruler.se, ruler.ne) ||
		lineSegmentsIntersect(
            triangle.right, triangle.top, ruler.sw, ruler.nw)
    }

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
        const oldpos = {x: ruler.x, y: ruler.y};
        clear(ctx, ruler);
        ruler.x = p.x;
        ruler.y = p.y;
        getRulerCorners();
        if (isColliding()) {
            ruler.x = oldpos.x
            ruler.y = oldpos.y
            getRulerCorners();
        }
        draw(ruler, rulerCanvas);
    }

    /** Rotate ruler according to new handle position. */
    function rotateRuler(ctx, p, leftHandle = true) {
        const oldAngle = ruler.angle;
        clear(ctx, ruler);
        const angle = leftHandle ? getAngle(ruler, p) : getAngle(p, ruler);
        ruler.angle = angle;
        getRulerCorners();
        if (isColliding()) {
            ruler.angle = oldAngle;
            getRulerCorners();
        }
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
        var oldpos = {x: triangle.x, y: triangle.y };
        clear(ctx, triangle);
        triangle.x = p.x;
        triangle.y = p.y;
        getTriangleCorners()
        if (isColliding()) {
            triangle.x = oldpos.x
            triangle.y = oldpos.y
            getTriangleCorners()
        }
        draw(triangle, triangleCanvas);
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
        const oldAngle = triangle.angle;
        clear(ctx, triangle);
        const middle = getTriangleMiddle();
        var angle =
            leftHandle ? getAngle(middle, p) : getAngle(p, middle);
        triangle.angle = angle;
        getTriangleCorners();
        if (isColliding()) {
            triangle.angle = oldAngle;
            getTriangleCorners();
        }
        draw(triangle, triangleCanvas);
    }

    /** Update triangle's corner coordinates. */
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
