window.onload = startAnim;


/*
        OLD ANIMATION SCRIPT (obsolete)
        
        METHOD:

        1) Make each one WORK (by copying the code from the old js)
        2) Change the variable names to be specific to that function.
        3) Clean up the code if you can.

        4) buttons to start and stop each one
        5) EVERY animation should end with the TV border pasted on.


        NOTES:

        canvasFrame is re-used, but I want it to be re-used.
        SO: declare it in START as a common thing so every function can access it.

*/


/*
            Universal variables
 */

var canvasFrame;
var staticScreen;


/*
        Triangle Canvas Variables
*/

var triangleIterations = 1;
var triangleCanvas;
var triangleContext;
var x;
var y;
var colors = ["black","green","yellow","red","blue"];
var activeTriangles = [];
var baseRadius = 1;
var ratioTicker=0;
var colorTicker=0;



/*
         Crazy Canvas Variables
 */

var points = [];
var points1 = [];
var points2 = [];
var boxPoints = [];
var bonusPoint;

var counter1 = 0;
var counter2 = 0;
var counter3 = 0;

var counter1Max = 60;
var counter2Max = 180;
var counter3Max = 700;

var crazyContext;

var centerX;
var centerY;


/*
            Pentagram Variables
 */

 var pentagramContext;

var pentagramCenterX;
var pentagramCenterY;

/** The x-y coordinates for five pentagram points
*/

var pentagramPoints = [];
var heptagramPoints = [];

var pentagramCounter1 = 0;

var tv;
var tvPat;


/*
            Lines-Curve Variables
 */

 var linesCanvas;
 var linesContext;
 var linesPointPairs = [];
 var oppositePointPairs = []
 var linesDivider = 11;



 /*
            Better Static Variables
  */


var betterStaticContext;
var bgCanvas;

var betterStaticColors = ["#FF0000","#000000","#FFFFFF"];
var staticColorTicker = 0;
var staticBox;
var staticGrid = [];
var firstPoint;

var betterStaticDivider = 4;

var randomIndex = 0;
var bgColor = "#045FB4";


 /*
 
        ColorWave Variables

 */

 var colorWaveCanvas;
 var colorWaveContext;
 var colorWaveToBlackColors = [];
 var colorWaveToWhiteColors = [];

var colorWaveTicker = 0;

var thisWave;
var waveInterval = 30;
var waveIndex = 0;
var waveColor = "#000000";



// FUNCTIONS:


function startAnim()
{
    canvasFrame = document.getElementById("canvasFrame");

    anim_numbers = document.getElementsByClassName('anim_numbers');

    for (var i=0; i<anim_numbers.length; i++)
    {
        if (anim_numbers[i].id==1)
        {
            trianglesGo();
        }else if(anim_numbers[i].id==2)
        {
            colorWaveGo();
        }else if(anim_numbers[i].id==3)
        {
            linesGo();
        }else if(anim_numbers[i].id==4)
        {
            pentagramGo();
        }else if(anim_numbers[i].id==5)
        {
            betterStaticGo();
        }
    }
}

/*
                                                                                                      "GO" Functions
*/

function crazyCanvasGo()
{
    var canvases = document.getElementsByClassName('anim_canvas');
    for (var i=0; i<canvases.length; i++)
    {
        if(canvases[i].innerHTML=='vacant')
        {
            crazyCanvas = canvases[i];
            canvases[i].innerHTML='occupied';
            break;
        }
    }
    crazyContext = crazyCanvas.getContext('2d');
    crazyCanvas.width = crazyCanvas.clientWidth;
    crazyCanvas.height = crazyCanvas.clientHeight;
    crazyCanvas.style.backgroundColor = "#000000";

    centerX = crazyCanvas.width / 2;
    centerY = crazyCanvas.height / 2;

    createCrazyPoints();

    clearInterval(animateCrazy);
    setInterval(animateCrazy, 73);

}


function pentagramGo()
{

    var canvases = document.getElementsByClassName('anim_canvas');
    for (var i=0; i<canvases.length; i++)
    {
        if(canvases[i].innerHTML=='vacant')
        {
            pentagramCanvas = canvases[i];
            canvases[i].innerHTML='occupied';
            break;
        }
    }
    pentagramContext = pentagramCanvas.getContext('2d');
    pentagramCanvas.width = pentagramCanvas.clientWidth;
    pentagramCanvas.height = pentagramCanvas.clientHeight;
    
    pentagramCenterX = pentagramCanvas.width / 2;
    pentagramCenterY = pentagramCanvas.height / 2;

    createPentagramPoints();
    
    /**
    * tvPat is a pattern which we draw to the background.
    * We declare it here so we only have to do it once.
    */
    tv = document.getElementById("tvScreen");
    tvPat = pentagramContext.createPattern(tv,"repeat");
 
    clearInterval(pentagramAnimate);
    setInterval(pentagramAnimate, 37);
}



function betterStaticGo()
{

    var canvases = document.getElementsByClassName('anim_canvas');
    for (var i=0; i<canvases.length; i++)
    {
        if(canvases[i].innerHTML=='vacant')
        {
            betterStaticCanvas = canvases[i];
            canvases[i].innerHTML='occupied';
            break;
        }
    }
    betterStaticContext = betterStaticCanvas.getContext('2d');
    betterStaticCanvas.width = betterStaticCanvas.clientWidth;
    betterStaticCanvas.height = betterStaticCanvas.clientHeight;
    
    makeGrid();
    
    clearInterval(makeStatic);
    setInterval(makeStatic, 47);
}


function linesGo()
{

    var canvases = document.getElementsByClassName('anim_canvas');
    for (var i=0; i<canvases.length; i++)
    {
        if(canvases[i].innerHTML=='vacant')
        {
            linesCanvas = canvases[i];
            canvases[i].innerHTML='occupied';
            break;
        }
    }
    linesContext = linesCanvas.getContext('2d');
    linesCanvas.width = linesCanvas.clientWidth;
    linesCanvas.height = linesCanvas.clientHeight;
    linesCanvas.style.backgroundColor="#111111";
    makePointPairs(linesPointPairs, 2);
    
    //makePointPairs(oppositePointPairs, 1);
    clearInterval(animateLines);
    setInterval(animateLines, 25);
}


function trianglesGo()
{
    staticScreen = document.getElementById("staticScreen");

    var canvases = document.getElementsByClassName('anim_canvas');
    for (var i=0; i<canvases.length; i++)
    {
        if(canvases[i].innerHTML=='vacant')
        {
            triangleCanvas = canvases[i];
            canvases[i].innerHTML='occupied';
            break;
        }
    }
    triangleContext = triangleCanvas.getContext('2d');
    triangleCanvas.width = triangleCanvas.clientWidth;
    triangleCanvas.height = triangleCanvas.clientHeight;

    setupTriangles();
    animateTriangles();
    triangleContext.drawImage(staticScreen, 0,0, triangleCanvas.width, triangleCanvas.height);

    clearInterval(animateTriangles);
    setInterval(animateTriangles, 19);
}


/*
    Better Static Functions

*/


function makeGrid()
{
    firstPoint = new Point(0,0,0);

    for (var i=0; i<betterStaticCanvas.width/betterStaticDivider; i++)
    {
        staticGrid[i] = new Point(firstPoint.x + (i * betterStaticDivider), firstPoint.y, 0);
    
    }
    
}


function makeStatic()
{
    for(var k=0; k<(betterStaticCanvas.height)/betterStaticDivider; k++)
    {
        for (var i=0; i< staticGrid.length; i++)
        {   
            betterStaticContext.fillStyle = betterStaticColors[Math.floor(Math.random() * betterStaticColors.length)];

            betterStaticContext.fillRect(staticGrid[i].x, staticGrid[i].y+(k*betterStaticDivider), betterStaticDivider, betterStaticDivider);
        }
    }
    betterStaticContext.drawImage(canvasFrame, 0, 0, betterStaticCanvas.width, betterStaticCanvas.height);
}




/*
    Lines Functions

*/



function makePointPairs(pairArray, condition)
{
    if(condition==1)
        {
                //  THIS ONE is very fucking cool. For a complex animation... use this one too!!!

                for(var i=0; i<linesDivider; i++)
                {

                    var aX = i * (linesCanvas.width/linesDivider);
                    var aY = 0;
                    var bX = linesCanvas.width - (i * (linesCanvas.width/linesDivider));
                    var bY = linesCanvas.height - (i * (linesCanvas.height/linesDivider));

                    var newPointPair = new PointPair(new Point(aX, aY, 0), new Point(bX, bY, 0));
                    pairArray.push(newPointPair);

                }
        }
    else
        {
                // THE STANDARD CURVE

                for(var i=0; i<linesDivider; i++)
                {

                    // Top Row, from left to right, connecting to the right wall.
                    var aX = i * (linesCanvas.width/linesDivider);
                    var aY = 0;
                    var bX = linesCanvas.width;
                    var bY = linesCanvas.height/linesDivider + (i * linesCanvas.height/linesDivider);

                    var newPointPair = new PointPair(new Point(aX, aY, 1), new Point(bX, bY, -1));
                    pairArray.push(newPointPair);

                    // Right wall, from top to bottom, connecting to the bottom row.

                    var cX = linesCanvas.width;
                    var cY = i * (linesCanvas.width/linesDivider);
                    var dX = linesCanvas.width - (linesCanvas.width/linesDivider + (i * linesCanvas.width/linesDivider));
                    var dY = linesCanvas.height;

                    var newPointPair = new PointPair(new Point(cX, cY, 1), new Point(dX, dY, -1));
                    pairArray.push(newPointPair);

                    // Bottom row, from right to left, connecting to the left wall

                    var eX = linesCanvas.width - i*((linesCanvas.width/linesDivider));
                    var eY = linesCanvas.height;
                    var fX = 0;
                    var fY = linesCanvas.height - (linesCanvas.height/linesDivider + (i * linesCanvas.height/linesDivider));

                    var newPointPair = new PointPair(new Point(eX, eY, -1), new Point(fX, fY, -1));
                    pairArray.push(newPointPair);

                    // Left wall, from bottom to top, connecting to the top row

                    var gX = 0;
                    var gY = linesCanvas.height - i*((linesCanvas.height/linesDivider));
                    var hX = linesCanvas.height/linesDivider + (i * (linesCanvas.width/linesDivider));
                    var hY = 0;

                    var newPointPair = new PointPair(new Point(gX, gY, -1), new Point(hX, hY, -1));
                    pairArray.push(newPointPair);

                }
        }
}


function animateLines()
{
    linesContext.clearRect(0, 0, linesCanvas.width, linesCanvas.height);
    drawLines(linesPointPairs, '#ff7700');
    moveLines(linesPointPairs,1);
    
}

function moveLines(pairArray, direction)
{
    for(var i=0; i<pairArray.length; i++)
        {
            
            moveOnePoint(pairArray[i].a, direction);
            moveOnePoint(pairArray[i].b, direction);
            
        }
}

function moveOnePoint(moving_point, direction)
{
    if(direction>0)
    {
                if(moving_point.x<linesCanvas.width && moving_point.y<=0)
                {
                    moving_point.x ++;
                    moving_point.y=0;
                }
                else if(moving_point.x<linesCanvas.width+1 && moving_point.y>=linesCanvas.height && moving_point.x>=0)
                {
                    moving_point.x --;
                }
                else if(moving_point.y<linesCanvas.height && moving_point.x >= linesCanvas.width)
                {
                    moving_point.y ++;
                }
                else
                {
                    moving_point.y --;
                }
    }
    else
    {
                if(moving_point.x<linesCanvas.width && moving_point.y<=0 && moving_point.x >=0)
                {
                    moving_point.x --;
                }
                else if(moving_point.x<=linesCanvas.width && moving_point.y>=linesCanvas.height)
                {
                    moving_point.x ++;
                }
                else if(moving_point.y<linesCanvas.height+1 && moving_point.x >= linesCanvas.width && moving_point.y >0)
                {
                    moving_point.y --;
                }
                else
                {
                    moving_point.y ++;
                }
    }
}


function drawLines(pairArray, color)
{

    for(var i=0; i<pairArray.length; i++)
        {
            
            linesContext.strokeStyle=color;
            linesContext.beginPath();
            
            linesContext.moveTo(pairArray[i].a.x,pairArray[i].a.y);
            linesContext.lineTo(pairArray[i].b.x,pairArray[i].b.y);
            linesContext.stroke();

        }
        linesContext.drawImage(canvasFrame, 0, 0, linesCanvas.width, linesCanvas.height);
}




/*
                                                                                                      Triangle Functions

*/




/*
    This function creates the first "Triangle" object to be drawn to the canvas.
*/
function setupTriangles()
{
    x = triangleCanvas.width / 2;
    y = triangleCanvas.height / 2;

    activeTriangles.push(new Triangle(getRatio(),baseRadius));
}

/*
    Triangle animation logic is delegated here. The triangles grow and spin until they're too big.
    The growing, drawing, creation and deletion of triangles is decided here.
*/
function animateTriangles()
{

    //triangleContext.clearRect(0,0,triangleCanvas.width,triangleCanvas.height);

    for (var i=0; i<activeTriangles.length; i++)
    {

        var currentTriangle = activeTriangles[i];
        drawOneTriangle(currentTriangle.radius, Math.PI*currentTriangle.piRatio, currentTriangle.timer, currentTriangle.color);

        changeTriangle(currentTriangle);

    }
                
    if (activeTriangles[activeTriangles.length-1].radius > 1)
    {
        activeTriangles.push(new Triangle(getRatio(), activeTriangles[activeTriangles.length-1].radius/2));
    }
                
    if (activeTriangles[0].radius>triangleCanvas.width*5)
    {
        activeTriangles.splice(0,1);
    }

    triangleIterations++;
}

/*
    For each iteration of the animation, this function will be called for every single triangle.
*/
function drawOneTriangle(currentRadius, currentAngle, thisTimer, triangleColor)
    {
        var radius = currentRadius/3;
        var diameter = radius * 2;

        triangleContext.strokeStyle = triangleColor;
        triangleContext.fillStyle = triangleColor;
        triangleContext.lineWidth=1;
        
        var tx1= x+diameter*Math.sin(Math.PI*(2/3)+triangleIterations/50+currentAngle);
        var ty1= y+diameter*Math.cos(Math.PI*(2/3)+triangleIterations/50+currentAngle);
        
        var tx2= x+diameter*Math.sin(Math.PI*(4/3)+triangleIterations/50+currentAngle);
        var ty2= y+diameter*Math.cos(Math.PI*(4/3)+triangleIterations/50+currentAngle);
        
        var tx3= x+diameter*Math.sin(Math.PI*(6/3)+triangleIterations/50+currentAngle);
        var ty3= y+diameter*Math.cos(Math.PI*(6/3)+triangleIterations/50+currentAngle);
                        
        triangleContext.beginPath();
        triangleContext.moveTo(tx1,ty1);
        triangleContext.lineTo(tx2,ty2);
        triangleContext.lineTo(tx3,ty3);
        triangleContext.lineTo(tx1,ty1);
        triangleContext.stroke();
        triangleContext.fill();
        triangleContext.closePath();
        triangleContext.drawImage(canvasFrame, 0, 0, triangleCanvas.width, triangleCanvas.height);
    }
    
    
/*
    This is the function which actually increases the radius of a triangle. It's called for every triangle, during every iteration.
*/
function changeTriangle(becomingTriangle)
{

    becomingTriangle.radius = becomingTriangle.radius*1.05;
    becomingTriangle.timer++;

}

/*
    When you make a new triangle you need a new ratio.
    The ratio refers to how much we slice up the circle, to draw points which are the corners of the triangle.
    A triangle has three points, but we want two phases, so we need two sets of three points.
*/
function getRatio()
{

    var ratioList = [10/3, 9/3, 8/3, 7/3, 6/3, 5/3, 4/3, 3/3, 2/3, 1/3];
    var nextRatio = ratioList[ratioTicker];
    ratioTicker++;
    if (ratioTicker >= ratioList.length)
    {ratioTicker = 0;}
    return nextRatio;
}

/*
    This is the Triangle "class."
*/
function Triangle(piRatio, radius)
{

    this.radius = radius;
    this.piRatio = piRatio;
    this.color = colors[colorTicker];
    this.timer = 1;
    increaseColorTicker();

}

function increaseColorTicker()
{
    colorTicker++;
    if (colorTicker >= colors.length)
    {colorTicker = 0;}
}






/*
 
                                                                                              Crazy Colors Functions
                                                                                      I MIGHT use this with the mouse-tracker.

 */






    /*
        Let's create some "Point" objects with coordinates on the canvas, so we can manipulate them later.
    */
function createCrazyPoints()
{
    points[0] = new Point(45, 37, 10);
    points[1] = new Point(155, crazyCanvas.height-3, -10);
    points[2] = new Point(59, 77, 10);
    points[3] = new Point(41, 50, -10);
    points[4] = new Point(crazyCanvas.width-10, crazyCanvas.height-19, 10);
    
    points1[0] = new Point(45, 117, -10);
    points1[1] = new Point(55, 65, -10);
    points1[2] = new Point(59, 77, 10);
    points1[3] = new Point(crazyCanvas.width - 5, 50, -10);
    points1[4] = new Point(10, 40, 10);
    points1[5] = new Point(41, crazyCanvas.height-55, -10);
    points1[6] = new Point(205, 95, -10);
    
    points2[0] = new Point(crazyCanvas.width -10, 117, -10);
    points2[1] = new Point(10, 165, -10);
    points2[2] = new Point(159, crazyCanvas.height, -10);
    
    bonusPoint = new Point(crazyCanvas.width -10, crazyCanvas.height - 10, -10);
    bonusPoint.xDirection = 0;
    
    boxPoints[0] = new Point(10, 10, 10);
    boxPoints[1] = new Point(55, 10, 10);
    boxPoints[2] = new Point(55, 55, 10);
    boxPoints[3] = new Point(10, 55, 10);
    
    for (var i=0; i<boxPoints.length; i++)
    {
        boxPoints[i].yDirection = 0;    
    }
}


    /**
     * This function recalculates the position of all the points.
        The points basically just bounce around randomly, but later we "connect the dots" of certain groups of Points
        to make boxes that move around crazily.
     */
function animateCrazy()
{
    counter1++;
    counter2++;
    counter3++;
    
    /**
    *calculate new locations for the first set of points
    */
    for (var i=0; i<points.length; i++)
    {
        points[i].x += Math.floor(Math.random() * 7) * points[i].xDirection;
        points[i].y += Math.floor(Math.random() * 17) * points[i].yDirection;
        
        if (points[i].x > crazyCanvas.width - 10)
        {
            points[i].xDirection = -1;
            points[i].x = crazyCanvas.width - 11;
            
        }
        else if (points[i].x < 10)
        {
            points[i].xDirection = 1;
            points[i].x = 11;
        }
        
        if (points[i].y > crazyCanvas.height - 10)
        {
            points[i].yDirection = -1;
            points[i].y = crazyCanvas.height-11;
        }
        else if (points[i].y < 10)
        {
            points[i].yDirection = 1;
            points[i].y = 11;
        }
    }
    
    /**
    *calculate new locations for the second set of points
    */
    for (var i=0; i<points1.length; i++)
    {   
    
        points1[i].x += Math.floor(Math.random() * 15) * points1[i].xDirection;
        points1[i].y += Math.floor(Math.random() * 5) * points1[i].yDirection;
        
        if (points1[i].x > crazyCanvas.width - 10)
        {
            points1[i].xDirection = -1;
            points1[i].x = crazyCanvas.width - 11;
            
        }
        else if (points1[i].x < 10)
        {
            points1[i].xDirection = 1;
            points1[i].x = 11;
        }
        
        if (points1[i].y > crazyCanvas.height - 10)
        {
            points1[i].yDirection = -1;
            points1[i].y = crazyCanvas.height-11;
        }
        else if (points1[i].y < 10)
        {
            points1[i].yDirection = 1;
            points1[i].y = 11;
        }
    }
    
    /**
    *calculate new locations for the third set of points
    */
    
    for (var i=0; i<points2.length; i++)
    {
        points2[i].x += Math.floor(Math.random() * 19) * points2[i].xDirection;
        points2[i].y += Math.floor(Math.random() * 9) * points2[i].yDirection;
        
        if (points2[i].x > crazyCanvas.width - 10)
        {
            points2[i].xDirection = -1;
            points2[i].x = crazyCanvas.width - 11;
            
        }
        else if (points2[i].x < 10)
        {
            points2[i].xDirection = 1;
            points2[i].x = 11;
        }
        
        if (points2[i].y > crazyCanvas.height - 10)
        {
            points2[i].yDirection = -1;
            points2[i].y = crazyCanvas.height-11;
        }
        else if (points2[i].y < 10)
        {
            points2[i].yDirection = 1;
            points2[i].y = 11;
        }
        
    }
    
    
    /**
    *calculate new locations for the boxPoints
    */
    for (var i=0; i<boxPoints.length; i++)
    {
        boxPoints[i].x += boxPoints[i].xDirection;
        boxPoints[i].y += boxPoints[i].yDirection;
    }
    
    /**
    Move the bonusPoint
    */
    bonusPoint.x += bonusPoint.xDirection;
    bonusPoint.y += bonusPoint.yDirection;
    
    
    
    ifStatements();
    

    paintCrazy();

}

/*
    After changing the Point locations, draw some stuff based on those locations.
    */
function paintCrazy()
{   
    /**
    Draw the first set of Points
    */
    crazyContext.fillStyle = "#FF0300";
    crazyContext.strokeStyle = "#000000";
    crazyContext.beginPath();
    crazyContext.moveTo(points[0].x, points[0].y);
    for (var i=0; i< points.length-1; i++)
    {
        crazyContext.lineTo(points[i+1].x, points[i+1].y);
    }
    
    crazyContext.lineTo(crazyCanvas.width, 0);
    
    crazyContext.lineTo(points[0].x, points[0].y);
    
    crazyContext.closePath();
    crazyContext.fill();

    /**
    Draw the second set of Points
    */
    
    crazyContext.fillStyle = "#FFFFFF";
    crazyContext.strokeStyle = "#FFD700";
    crazyContext.beginPath();
    crazyContext.moveTo(points1[0].x, points1[0].y);
    for (var i=0; i< points1.length-1; i++)
    {
        crazyContext.lineTo(points1[i+1].x, points1[i+1].y);
    }
    crazyContext.lineTo(bonusPoint.x, bonusPoint.y);
    crazyContext.lineTo(points1[0].x, points1[0].y);
    
    crazyContext.closePath();
    crazyContext.fill();

    
    
    /**
    Draw the  box Points
    */
    
    crazyContext.fillStyle = "#000000";
    crazyContext.strokeStyle = "#F8F8FF";
    crazyContext.beginPath();
    crazyContext.moveTo(boxPoints[0].x, boxPoints[0].y);
    for (var i=0; i< boxPoints.length-1; i++)
    {
        crazyContext.lineTo(boxPoints[i+1].x, boxPoints[i+1].y);
    }
    crazyContext.lineTo(boxPoints[0].x, boxPoints[0].y);
    
    crazyContext.closePath();
    crazyContext.fill();
    
    
    /**
    Draw the  third of Points
    */
    
    crazyContext.fillStyle = "#2E64FE";
    crazyContext.strokeStyle = "#F8F8FF";
    crazyContext.beginPath();
    crazyContext.moveTo(points2[0].x, points2[0].y);
    for (var i=0; i< points2.length-1; i++)
    {
        crazyContext.lineTo(points2[i+1].x, points2[i+1].y);
    }
    crazyContext.lineTo(points2[0].x, points2[0].y);
    
    crazyContext.closePath();
    crazyContext.fill();

    crazyContext.drawImage(canvasFrame, 0, 0, crazyCanvas.width, crazyCanvas.height);

}

    /*
        These conditionals stem from the "animate" function.
        I put them here for clarity in that function.
    */
function ifStatements()
{


    if (counter1 >= counter1Max)
    {
        var randomIndex = Math.floor(Math.random() * points1.length);
        points1[randomIndex].xDirection = points1[randomIndex].xDirection * -2;
        
        randomIndex = Math.floor(Math.random() * points.length);
        
        points[randomIndex].yDirection = points[randomIndex].yDirection * -2;
        
        counter1Max = Math.floor(Math.random() * 500);
        
        counter1 = 0;
    }
    
    if (counter2 >= counter2Max)
    {
        var randomIndex = Math.floor(Math.random() * points2.length);
        points2[randomIndex].xDirection = points2[randomIndex].xDirection * -2;
        
        randomIndex = Math.floor(Math.random() * points1.length);
        
        points1[randomIndex].yDirection = points1[randomIndex].yDirection * -2;
        
        counter2Max = Math.floor(Math.random() * 500);
        counter2 = 0;
    }
    
    if (counter3 >= counter3Max)
    {
        var randomIndex = Math.floor(Math.random() * points2.length);
        points2[randomIndex].yDirection = points2[randomIndex].yDirection * -2;
        
        randomIndex = Math.floor(Math.random() * points1.length);
        
        points[randomIndex].xDirection = points[randomIndex].xDirection * -2;
        
        counter3Max = Math.floor(Math.random() * 550);
        counter3 = 0;
    }
    
    if (boxPoints[1].x >= crazyCanvas.width - 8 || boxPoints[2].x >= crazyCanvas.width - 8)
    {
        for (var i=0; i<boxPoints.length; i++)
        {
            boxPoints[i].x--;
            boxPoints[i].y++;
            boxPoints[i].xDirection=0;
            boxPoints[i].yDirection=1;
        }
    }
    else if (boxPoints[2].y >= crazyCanvas.height - 7 || boxPoints[3].y >= crazyCanvas.height - 7)
    {
        for (var i=0; i<boxPoints.length; i++)
        {
            boxPoints[i].y--;
            boxPoints[i].x--;
            boxPoints[i].xDirection=-1;
            boxPoints[i].yDirection=0;
        }
    }
    else if (boxPoints[3].x <= 10 || boxPoints[0].x <= 10)
    {
        for (var i=0; i<boxPoints.length; i++)
        {
            boxPoints[i].x++;
            boxPoints[i].y--;
            boxPoints[i].xDirection=0;
            boxPoints[i].yDirection=-1;
        }
    }
    else if (boxPoints[0].y <= 10 || boxPoints[1].y <= 10)
    {
        for (var i=0; i<boxPoints.length; i++)
        {
            boxPoints[i].y++;
            boxPoints[i].x++;
            boxPoints[i].xDirection=1;
            boxPoints[i].yDirection=0;
        }
    }

    if(bonusPoint.y <=10)
    {
        bonusPoint.xDirection = -1;
        bonusPoint.yDirection = 0;
        bonusPoint.y++;
        bonusPoint.x--;
    }
    else if (bonusPoint.x <= 10)
    {
        bonusPoint.xDirection = 0;
        bonusPoint.yDirection = 1;
        bonusPoint.x++;
        bonusPoint.y++;
    }
    else if (bonusPoint.y >= crazyCanvas.height- 10)
    {
        bonusPoint.yDirection = 0;
        bonusPoint.xDirection = 1;
        bonusPoint.y--;
        bonusPoint.x++;
    }
    else if (bonusPoint.x >= crazyCanvas.width - 10)
    {
        bonusPoint.xDirection = 0;
        bonusPoint.yDirection = -1;
        bonusPoint.x--;
        bonusPoint.y--;
    }
    
}



/*
                                                                                    Pentagram Functions 
 */




    /*
        We'll make a bunch of Point objects to be corners of polygons.
    */
function createPentagramPoints()
{
    for (var i=0; i<5; i++)
    {
        pentagramPoints[i] = new Point(pentagramCenterX, pentagramCenterY, 0);
    }
    
    for (var i=0; i<7; i++)
    {
        heptagramPoints[i] = new Point(pentagramCenterX, pentagramCenterY, 0);
    }
}

    /**
     * This function recalculates the position of all the points for the pentagram and heptagram.
     Makes 'em spin.
     */
function pentagramAnimate()
{

        //Pentagram
        
        pentagramPoints[0].x = pentagramCenterX+30*Math.sin(Math.PI*0.4+(pentagramCounter1/17));
        pentagramPoints[0].y = pentagramCenterY+30*Math.cos(Math.PI*0.4+(pentagramCounter1/17));
        
        pentagramPoints[1].x = pentagramCenterX+30*Math.sin(Math.PI*1.6+(pentagramCounter1/17));
        pentagramPoints[1].y = pentagramCenterY+30*Math.cos(Math.PI*1.6+(pentagramCounter1/17));
        
        pentagramPoints[2].x = pentagramCenterX+30*Math.sin(Math.PI*0.8+(pentagramCounter1/17));
        pentagramPoints[2].y = pentagramCenterY+30*Math.cos(Math.PI*0.8+(pentagramCounter1/17));
        
        pentagramPoints[3].x = pentagramCenterX+30*Math.sin(Math.PI*2.0+(pentagramCounter1/17));
        pentagramPoints[3].y = pentagramCenterY+30*Math.cos(Math.PI*2.0+(pentagramCounter1/17));
        
        pentagramPoints[4].x = pentagramCenterX+30*Math.sin(Math.PI*1.2+(pentagramCounter1/17));
        pentagramPoints[4].y = pentagramCenterY+30*Math.cos(Math.PI*1.2+(pentagramCounter1/17));
        
        
        //heptagram
        
        heptagramPoints[0].x = pentagramCenterX+61*Math.sin(Math.PI*(2/7)+(-pentagramCounter1/14));
        heptagramPoints[0].y = pentagramCenterY+61*Math.cos(Math.PI*(2/7)+(-pentagramCounter1/14));
        
        heptagramPoints[1].x = pentagramCenterX+61*Math.sin(Math.PI*(6/7)+(-pentagramCounter1/14));
        heptagramPoints[1].y = pentagramCenterY+61*Math.cos(Math.PI*(6/7)+(-pentagramCounter1/14));
        
        heptagramPoints[2].x = pentagramCenterX+61*Math.sin(Math.PI*(10/7)+(-pentagramCounter1/14));
        heptagramPoints[2].y = pentagramCenterY+61*Math.cos(Math.PI*(10/7)+(-pentagramCounter1/14));
        
        heptagramPoints[3].x = pentagramCenterX+61*Math.sin(Math.PI*(14/7)+(-pentagramCounter1/14));
        heptagramPoints[3].y = pentagramCenterY+61*Math.cos(Math.PI*(14/7)+(-pentagramCounter1/14));
        
        heptagramPoints[4].x = pentagramCenterX+61*Math.sin(Math.PI*(4/7)+(-pentagramCounter1/14));
        heptagramPoints[4].y = pentagramCenterY+61*Math.cos(Math.PI*(4/7)+(-pentagramCounter1/14));
        
        heptagramPoints[5].x = pentagramCenterX+61*Math.sin(Math.PI*(8/7)+(-pentagramCounter1/14));
        heptagramPoints[5].y = pentagramCenterY+61*Math.cos(Math.PI*(8/7)+(-pentagramCounter1/14));
        
        heptagramPoints[6].x = pentagramCenterX+61*Math.sin(Math.PI*(12/7)+(-pentagramCounter1/14));
        heptagramPoints[6].y = pentagramCenterY+61*Math.cos(Math.PI*(12/7)+(-pentagramCounter1/14));
        
        pentagramCounter1 = pentagramCounter1 + 0.5;
        
        pentagramPaint();
}

    /*
        Connect the dots on a canvas after the logic has been performed.
    */
function pentagramPaint()
{

    pentagramContext.rect(0,0,pentagramCanvas.width, pentagramCanvas.height);
    pentagramContext.fillStyle=tvPat;
    pentagramContext.fill();

    pentagramContext.strokeStyle="#000000";
    pentagramContext.lineWidth=4;
    pentagramContext.beginPath();
    pentagramContext.moveTo(heptagramPoints[0].x, heptagramPoints[0].y);



    for (var i=1; i< heptagramPoints.length; i++)
    {
        pentagramContext.lineTo(heptagramPoints[i].x, heptagramPoints[i].y);

    }
    
    pentagramContext.lineTo(heptagramPoints[0].x, heptagramPoints[0].y);
    pentagramContext.lineTo(heptagramPoints[1].x, heptagramPoints[1].y);
    pentagramContext.stroke();
    pentagramContext.closePath();

    
    pentagramContext.beginPath();
    pentagramContext.moveTo(pentagramPoints[0].x, pentagramPoints[0].y);

    for (var i=1; i< pentagramPoints.length; i++)
    {
        pentagramContext.lineTo(pentagramPoints[i].x, pentagramPoints[i].y);
    }
    pentagramContext.lineTo(pentagramPoints[0].x, pentagramPoints[0].y);
    pentagramContext.lineTo(pentagramPoints[1].x, pentagramPoints[1].y);
    pentagramContext.stroke();
    pentagramContext.closePath();
    
    pentagramContext.drawImage(canvasFrame, 0, 0, pentagramCanvas.width, pentagramCanvas.height);
}





/*
        Color Wave functions

 */


function colorWaveGo()
{
     var canvases = document.getElementsByClassName('anim_canvas');
    for (var i=0; i<canvases.length; i++)
    {
        if(canvases[i].innerHTML=='vacant')
        {
            colorWaveCanvas = canvases[i];
            canvases[i].innerHTML='occupied';
            break;
        }
    }


    waveInterval = 77;

    var wave_00 = ['#000000','#3C1D35','#711A5D','#6B1B7F','#6724A4','#553CCF','#395FBC','#418EBD','#41B7BD','#75C19E','#89D393','#C7E3A7','#ECEBCA'];
    var wave_01 = ['#000000','#0F003A','#321683','#4E24C8','#8863F3','#AA97E2','#D5CEEB']; //black to blue
    var wave_02 = ['#000000','#420303','#990F0F','#DC1111','#FF0000','#F53D3D','#E68D8D'];  // black to red
    var wave_03 = ['#000000','#343434','#5B5555','#7A7A7A','#959393','#BDBABA','#D9D9D9'];  // black to white
    var wave_04 = ['#000000','#00270C','#01571B','#047A27','#06A535','#25DF4F','#64E181'];  // black to green
    var wave_05 = ['#000000','#302D02','#5D580D','#7E7609','#A99E0A','#E5D71F','#EBE051','#EEE898'];  // black to yellow
    var wave_06 = ['#000000','#440724','#68103A','#950A4C','#C81168','#EA0E3E','#FF1300','#FF3E00','#FF5817','#FB792A','#FA9A53','#F9B079','#FCCAA5'];  // black to pink to orange
    var wave_07 = ['#000000','#061440','#241A8F','#530E9A','#8C0E9A','#B10B87','#B10B33','#C20A04','#D03806','#D06506','#D09406','#D0C106','#E7F500','#EDF458','#FBFF9A'];  // black to blue to yellow

    var wave_08 = ['#ffffff','#FFC6C6','#FF9191','#FF5B5B','#FF3535','#FF0000','#AC0404','#790000','#43050B'];  // white to red
    var wave_09 = ['#ffffff','#C9BDFF','#937FED','#7E65EE','#6040EF','#3C18E1','#2C13A2','#1C0E5C'];  // white to blue
    var wave_10 = ['#ffffff','#8CFFAC','#47F54B','#12E526','#29D01B','#2DA81C','#80A81C','#9FA318','#C4A83A','#BF730A','#925909','#6A380E','#432002'];  // white to green to orange
    var wave_11 = ['#ffffff','#CCCCCC','#A3A2A2','#777777','#505050','#302F2F'];  // white to black
    var wave_12 = ['#ffffff','#FFC8EC','#FFA6E0','#FF7AD1','#FF4EC2','#FF22B3','#FF00B7','#BF007C','#98005B','#670063','#42003F','#330631'];  // white to purple
    var wave_13 = ['#ffffff','#FEFFA6','#FEFF61','#FEFF00','#D9D904','#BFC708','#99A000','#7A7F00','#666A04','#4F5204','#343607'];  // white to yellow
    var wave_14 = ['#ffffff','#C3FFD5','#7EFCA4','#45FF7D','#00FF4D','#06D043','#00B135','#008F2A','#006A1F','#013D13'];  // white to green
    var wave_15 = ['#ffffff','#CADDE0','#95C5CD','#78ABC6','#5096CE','#327FCC','#3254CC','#3832CC','#6527CB','#B927CB','#CB276E','#CB272A','#BC4C1E','#84602A','#6B682A','#303E1C','#202E12'];


     colorWaveToBlackColors = [wave_00, wave_01, wave_02, wave_03, wave_04, wave_05, wave_06, wave_07];
     colorWaveToWhiteColors = [wave_08, wave_09, wave_10, wave_11, wave_12, wave_13, wave_14, wave_15];

    colorWaveContext = colorWaveCanvas.getContext('2d');

    colorWaveCanvas.width = colorWaveCanvas.clientWidth;
    colorWaveCanvas.height = colorWaveCanvas.clientHeight;

    thisWave = colorWaveToBlackColors[Math.floor(Math.random() * colorWaveToBlackColors.length)];

    clearInterval(paintAWave);
    setInterval(paintAWave, waveInterval);
}


function paintAWave()
{

    waveColor = thisWave[waveIndex];
    colorWaveContext.fillStyle= waveColor;

    colorWaveContext.fillRect(0,0,colorWaveCanvas.width,colorWaveCanvas.height);
    colorWaveContext.drawImage(canvasFrame, 0, 0, colorWaveCanvas.width, colorWaveCanvas.height);

    waveIndex++;

    if(waveIndex >= thisWave.length)
    {
        thisWave = getNewWave();
        waveIndex = 0;
    }


}




function getNewWave()
{
     if(colorWaveTicker == 0)
    {
        colorWaveTicker = 1;
        return colorWaveToWhiteColors[Math.floor(Math.random() * colorWaveToWhiteColors.length)];
       
    }
    else
    {
        colorWaveTicker = 0;
        return colorWaveToBlackColors[Math.floor(Math.random() * colorWaveToBlackColors.length)];

    }

}





/*
                                                                                            Common Functions
 */


function Box(x,y,w,h)
{
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
}



function PointPair(pointA, pointB)
{
    this.a = pointA;
    this.b = pointB;
}


/*
 * "Point" is the class for point objects in the crazy colors animation. (and maybe other animations???)
 */
function Point(newPointX, newPointY, direction)
{
    this.x = newPointX;
    this.y = newPointY;
    this.xDirection = direction;
    this.yDirection = -direction;

}
