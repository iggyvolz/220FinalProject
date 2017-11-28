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
    drawStaff(svg, 50,50,100,50,2);
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
            // Go by 1/4th of height-stroke, so we start at the top and end at the bottom (less the stroke)
            svg.line(left, top+i*(height-stroke)/4, left+width, top+i*(height-stroke)/4).stroke({width:stroke, color: STAFF_COLOUR});
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
            console.log("Ouch!");
        });
    }
});