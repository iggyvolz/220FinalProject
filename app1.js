// Run js on pageload so this can go in the head
$(function()
{
    // Create SVG
    const svg = SVG("sheetmusic").size(WIDTH,HEIGHT);
    window.svg=svg;
    // Draw viewbox
    svg.viewbox({x:0, y:0, width:WIDTH, height:HEIGHT});
    // Draw background
    const background = svg.rect(WIDTH,HEIGHT).fill(BACKGROUND_COLOUR);
    // Draw staves until there is no more room
    for(let i=0;i<4;i++)
    {
        drawStaff(svg, 50,50+200*i,WIDTH-100,150,2);
    }
    // https://stackoverflow.com/a/42711775
    var pt = svg.node.createSVGPoint();
    function localClickCoordinates(e)
    {
        pt.x=e.clientX;
        pt.y=e.clientY;
    
        // Translate into svg coordinates
        return pt.matrixTransform(svg.node.getScreenCTM().inverse());
    }
    /**
     * Draws a staff
     * @param {SVG} svg SVG.js object
     * @param {number} left Left border of the staff
     * @param {number} top Top border of the staff
     * @param {int} width Width of the staff
     * @param {int} height Height of the staff
     * @param {int} stroke Line stroke of the staff
     */
    function drawStaff(svg, left, top, width, height, stroke)
    {
        // Draw staff
        // Save the line numbers so we can reference their positions later
        const lines=[];
        for(var i=0;i<=4;i++)
        {
            // Draw a line of the staff
            // Go by 1/4.5th of height (plus 1/18th), so we start 1/18th from the top and end 1/18th from the bottom 
            // We also need to subtract half of the stroke, so that the line is centred at the point we want it
            lines.push(top+i*height/4.5+(height/18)-stroke/2);
            svg.line(left, lines[i], left+width, lines[i]).stroke({width:stroke, color: STAFF_COLOUR});
        }
        svg.click(function(e)
        {
            // Get click coordinates relative to the svg
            const clickCoordinates = localClickCoordinates(e);
            // Get coordinates relative to the staff
            clickCoordinates.x-=left;
            clickCoordinates.y-=top;
            if(clickCoordinates.x<0 || clickCoordinates.x>width || clickCoordinates.y<0 || clickCoordinates.y>height)
            {
                // Ignore click, it was not meant for us
                return;
            }
            // Calculate line/space on which we clicked
            // Each line/space has a buffer of 1/9th of the staff, so multiply by 9 and get the floor
            const clickedSpot=Math.floor(clickCoordinates.y/height*9);
            // Place a quarter note at that spot
            const ellipseHeight=10;
            const ellipseWidth=15;

            // SVG's move wants the top-left of the rectangle containing the ellipse
            const ellipseLeft = left + clickCoordinates.x - ellipseWidth/2;
            const ellipseTop = top + height*(clickedSpot + 1/2)/9-stroke/2-ellipseHeight/2;
            svg.ellipse(ellipseWidth, ellipseHeight).move(ellipseLeft, ellipseTop);
            // Draw the stem
            if(clickedSpot<=4)
            {
                // Draw stem pointing down
                // Stem starts at the left of the ellipse and goes down
                const stemTop = ellipseTop + ellipseHeight/2; // Vertical centre of the ellipse
                const stemBottom = ellipseTop + ellipseHeight/2 + STEM_HEIGHT;
                const stemX = ellipseLeft + ellipseWidth*.1; // Put the stem a little into the note so it isn't as obvious
                svg.line(stemX, stemTop, stemX, stemBottom).stroke({width:STEM_STROKE, color: STEM_COLOUR});
            }
            else
            {
                // Draw stem pointing up
                // Stem starts at the right of the ellipse and goes up
                const stemTop = ellipseTop + ellipseHeight/2 - STEM_HEIGHT; // Vertical centre of the ellipse
                const stemBottom = ellipseTop + ellipseHeight/2;
                const stemX = ellipseLeft + ellipseWidth*.9; // Put the stem a little into the note so it isn't as obvious
                svg.line(stemX, stemTop, stemX, stemBottom).stroke({width:STEM_STROKE, color: STEM_COLOUR});
            }
        });
    }
});