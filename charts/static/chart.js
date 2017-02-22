function onBodyLoad() {

    const TRIANGLE_SRC = "../images/triangle.png";
    const RULER_SRC = "../images/ruler.png";

    const TRIANGLE_WIDTH = 1614;
    const TRIANGLE_HEIGHT = 814;
    const RULER_WIDTH = 2320;
    const RULER_HEIGHT = 138;

    const HANDLE_WIDTH = 100;

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


    /** Redraw image, ruler and triangle. */
    function redraw(canvas) {
        var ctx = canvas.getContext('2d')
        var image = new Image();
        image.src = MAP_SOURCE;
        ctx.drawImage(image, 0, 0);
        drawRuler(ruler);
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

        var imagesCount;
        var ctx;
        var images = [];

        function setupImages(onLoad) {
            images.push(new Image());
            images.push(new Image());
            images[0].src = TRIANGLE_SRC;
            images[1].src = RULER_SRC;
            images[0].onload = onLoad;
            images[1].onload = onLoad;
        }


        function loadImages() {
            imagesCount -= 1;
            //if (imagesCount >= 0)
            //    return;
            var canvas = document.getElementById('mapCanvas');
            ctx.drawImage(images[0], triangle.x - TRIANGLE_WIDTH/2,
                triangle.y - TRIANGLE_HEIGHT/2);
            ctx.drawImage(images[1], ruler.x - RULER_WIDTH/2,
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
