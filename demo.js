$(function()
{
    const width=450;
    const height=300;
    const colours=
    {
        background: "#dde3e1",
        middleLine: "#ffffff",
        paddleLeft: "#00ff99",
        paddleRight: "#ff0066"
    };
    const paddleWidth = 15;
    const paddleHeight = 80;

    // Create SVG from pong element
    const draw = SVG("pong").size(width,height);
    // Set viewbox for user
    draw.viewbox({x: 0, y:0, width, height});

    const background = draw.rect(width,height).fill(colours.background);
    
    // Draw middle line
    const line = draw.line(width/2, 0, width/2, height);
    line.stroke({width: 5, color: colours.middleLine, dasharray: "5,5"});

    const paddleLeft = draw.rect(paddleWidth, paddleHeight);
    paddleLeft.x(0).cy(height/2).fill(colours.paddleLeft);

    const paddleRight = paddleLeft.clone();
    paddleRight.x(width-paddleWidth).fill(colours.paddleRight);
});