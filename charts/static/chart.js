function onBodyLoad() {
    const TRIANGLE_SRC = "../images/triangle.png";
    const RULER_SRC = "../images/ruler.png";

    const TRIANGLE_WIDTH = 807;
    const TRIANGLE_HEIGHT = 407;
    const RULER_WIDTH = 1160;
    const RULER_HEIGHT = 69;

    const HANDLE_WIDTH = 50;

    var triangle = {
        x: 1600,                  /** Center x coordinate. */
        y: 1000,                  /** Center y coordinate. */

        width: TRIANGLE_WIDTH,
        height: TRIANGLE_HEIGHT,
        angle: 0,
        left: null,               /** Left rotate handle x, y */
        right: null,              /** Right rotate handle x, y */
        middle: null,             /** Center point on longest side. */
        top: null                 /** Top 90 degrees corner. */
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
     * Check if the two lines (p0,p1) and (p2,p3) intersects where each
     * p* item is a point. Returns true if intersect.
     */
    var isIntersecting = (function(){
        // function as singleton so that closure can be used

        // working variable are closed over so they do not need creation
        // each time the function is called. This gives a significant
        // performance boost.
        var v1, v2, v3, cross, u1, u2;
        v1 = {x : null, y : null}; // line p0, p1 as vector
        v2 = {x : null, y : null}; // line p2, p3 as vector
        v3 = {x : null, y : null}; // the line from p0 to p2 as vector

        function isIntersecting(p0, p1, p2, p3) {
            v1.x = p1.x - p0.x;
            v1.y = p1.y - p0.y;
            v2.x = p3.x - p2.x;
            v2.y = p3.y - p2.y;
            if((cross = v1.x * v2.y - v1.y * v2.x) === 0){
                return false // cross prod 0 if lines parallel
            }
            v3 = {x : p0.x - p2.x, y : p0.y - p2.y};
            // get unit distance along line p2 p3
            u2 = (v1.x * v3.y - v1.y * v3.x) / cross;
            // is intercept on line p2, p3
            if (u2 >= 0 && u2 <= 1){
                // get unit distance on line p0, p1;
                u1 = (v2.x * v3.y - v2.y * v3.x) / cross;
                // return true if on line else false.
                return (u1 >= 0 && u1 <= 1);
            }
            return false; // no intersect;
        }
        // return function with closure for optimisation.
        return isIntersecting;
    })();

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

    /** Vector addition of two points. */
    function addPoints(p1, p2) {
        return { x: p1.x + p2.x, y: p1.y + p2.y }
    }

    /** Vector subtract p2 from p1 */
    function subPoints(p1, p2 ) {
        return { x: p1.x - p2.x, y: p1.y - p2.y }
    }

    /** Vector multiply points  p1 and p2 */
    function multPoints(p1, p2 ) {
        return { x: p1.x * p2.x, y: p1.y * p2.y }
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

    /** Return true if triangle and ruler collides. */
    function isColliding() {
		return isIntersecting(
            triangle.left, triangle.right, ruler.sw, ruler.se) ||
		isIntersecting(
            triangle.left, triangle.right, ruler.nw, ruler.ne) ||
		isIntersecting(
            triangle.left, triangle.right, ruler.se, ruler.ne) ||
		isIntersecting(
            triangle.left, triangle.right, ruler.sw, ruler.nw) ||
		isIntersecting(
            triangle.left, triangle.top, ruler.sw, ruler.se) ||
		isIntersecting(
            triangle.left, triangle.top, ruler.nw, ruler.ne) ||
		isIntersecting(
            triangle.left, triangle.top, ruler.se, ruler.ne) ||
		isIntersecting(
            triangle.left, triangle.top, ruler.sw, ruler.nw) ||
		isIntersecting(
            triangle.right, triangle.top, ruler.sw, ruler.se) ||
		isIntersecting(
            triangle.right, triangle.top, ruler.nw, ruler.ne) ||
		isIntersecting(
            triangle.right, triangle.top, ruler.se, ruler.ne) ||
		isIntersecting(
            triangle.right, triangle.top, ruler.sw, ruler.nw)
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
        ctx.drawImage(canvas, obj.x - obj.width/2, obj.y - obj.height/2);
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
        getRulerCorners();
        rulerCanvas = document.createElement('canvas');
        rulerCanvas.width = ruler.width;
        rulerCanvas.height = ruler.width;
        var image = new Image();
        image.onload = function () {
            var ctx = rulerCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0)
            draw(ruler, rulerCanvas);
        }
        image.src = RULER_SRC;
    }

    /** Update ruler's corner and handle coordinates. */
    function getRulerCorners() {
        const sin = Math.sin(ruler.angle);
        const cos = Math.cos(ruler.angle);
        const height = { x: sin * ruler.height/2, y: cos * ruler.height/2 };
        const heightUp = addPoints(ruler, multPoints({x: 1, y :-1}, height));
        const heightDown = addPoints(ruler, multPoints({x: -1, y: 1}, height));
        const width = { x: cos * ruler.width/2, y: sin * ruler.width/2 };
        ruler.left = subPoints(ruler, width);
        ruler.right = addPoints(ruler, width);
        ruler.nw = subPoints(heightUp, width);
        ruler.ne = addPoints(heightUp, width );
        ruler.sw = subPoints(heightDown, width);
        ruler.se = addPoints(heightDown, width);
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

    /** Setup the triangle and it's canvas. */
    function initTriangle() {
        getTriangleCorners();
        triangleCanvas = document.createElement('canvas');
        triangleCanvas.width = triangle.width;
        triangleCanvas.height = triangle.width;
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
        // clear() clears the bounding rect which might damage the ruler, so:
        draw(ruler, rulerCanvas);
    }

    /** Rotate triangle according to new handle position. */
    function rotateTriangle(ctx, p, leftHandle = true) {
        const oldAngle = triangle.angle;
        clear(ctx, triangle);
        var angle = leftHandle ?
            getAngle(triangle.middle, p) : getAngle(p, triangle.middle);
        triangle.angle = angle;
        getTriangleCorners();
        if (isColliding()) {
            triangle.angle = oldAngle;
            getTriangleCorners();
        }
        draw(triangle, triangleCanvas);
        draw(ruler, rulerCanvas);
    }

    /** Update triangle's corner coordinates. */
    function getTriangleCorners () {
        const width = triangle.width/2;
        const height = triangle.height/2;
        const cos = Math.cos(triangle.angle);
        const sin = Math.sin(triangle.angle);
        const rotatedWidth = {x: cos *  width, y: sin * width};
        const rotatedHeight = {x: -sin * height, y: cos * height};

        triangle.middle =
            addPoints(triangle, {x: sin * height, y: -cos * height} )
        triangle.left = subPoints(triangle.middle, rotatedWidth);
        triangle.right = addPoints(triangle.middle, rotatedWidth);
        triangle.top = addPoints(triangle, rotatedHeight);
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
        document.getElementById('mapCanvas').style.cursor =
            active ? 'move' : 'default';
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
    var onMousemove = (function() {
        const handlerByTool = {
            'moveRuler': moveRuler,
            'moveTriangle': moveTriangle,
            'rotateRulerLeft': rotateRuler,
            'rotateRulerRight':
                function(c, p) { rotateRuler(c, p, false); },
            'rotateTriangleLeft': rotateTriangle,
            'rotateTriangleRight':
                function(c, p) { rotateTriangle(c, p, false); }
        }
        var canvas = document.getElementById('mapCanvas');
        var ctx = canvas.getContext('2d');

        function onMousemove(e) {
            const p = getMousePos(e, canvas);

            if (findNearbyTool(p, canvas) != null)
                setMoveCursor()
            else if (currentTool == null)
                setMoveCursor(false)
            if (e.buttons != 1 || currentTool == null)
                return;
            handlerByTool[currentTool](ctx, p);
        };

        return onMousemove;
    })();

    window.addEventListener('mousedown', onMousedown);
    window.addEventListener('mouseup', onMouseup);
    window.addEventListener('mousemove', onMousemove);

    initTriangle();
    initRuler();
}
