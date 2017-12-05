// Run js on pageload so this can go in the head
$(function()
{
    console.log(WIDTH);
    // Create SVG
    const svg = SVG("sheetmusic").size(WIDTH,HEIGHT);
    window.svg=svg;
    // Draw viewbox
    svg.viewbox({x:0, y:0, width:WIDTH, height:HEIGHT});
    // Draw background
    const background = svg.rect(WIDTH,HEIGHT).fill(BACKGROUND_COLOUR);
    // Draw staff
    drawStaff(svg, 50,50,100,200,2);
    // https://stackoverflow.com/a/42711775
    var pt = svg.node.createSVGPoint();
    function localClickCoordinates(e)
    {
        pt.x=e.clientX;
        pt.y=e.clientY;
    
        // Translate into svg coordinates
        return pt.matrixTransform(svg.node.getScreenCTM().inverse());
    }
    function drawStaff(svg, left, top, width, height, stroke)
    {
        // Draw staff
        for(var i=0;i<=4;i++)
        {
            // Draw a line of the staff
            // Go by 1/4.5th of height (plus 1/18th), so we start 1/18th from the top and end 1/18th from the bottom 
            // We also need to subtract half of the stroke, so that the line is centred at the point we want it
            svg.line(left, top+i*height/4.5+(height/18)-stroke/2, left+width, top+i*height/4.5+(height/18)-stroke/2).stroke({width:stroke, color: STAFF_COLOUR});
        }
        svg.click(function(e)
        {
            // Get click coordinates relative to the svg
            const coordinates = localClickCoordinates(e);
            // Get coordinates relative to the staff
            coordinates.x-=left;
            coordinates.y-=top;
            if(coordinates.x<0 || coordinates.x>width || coordinates.y<0 || coordinates.y>height)
            {
                // Ignore click, it was not meant for us
                return;
            }
            // Calculate line/space on which we clicked
            // Each line/space has a buffer of 1/9th of the staff, so multiply by 9 and get the floor
            const clickedSpot=Math.floor(coordinates.y/height*9);
            // Place a quarter note at that spot
            const ellipseHeight=10;
            const ellipseWidth=15;
            svg.ellipse(ellipseWidth, ellipseHeight).move(left + coordinates.x - ellipseWidth/2, top + height*(clickedSpot + 1/2)/9-stroke/2-ellipseHeight/2);
            // Draw the stem
            if(clickedSpot<=4)
            {
                // TODO Draw stem pointing down
            }
            else
            {
                // TODO Draw stem pointing up
            }
        });
    }
});