    // Configuration
    const width=450;
    const height=300;
    const colours=
    {
        background: "#dde3e1",
        middleLine: "#ffffff",
        paddleLeft: "#00ff99",
        paddleRight: "#ff0066",
        ballCentre: "#7f7f7f",
        score: "#ffffff",
        ballFinal: ""
    };
    const paddleWidth = 15;
    const paddleHeight = 80;
    const ballSize=10;
    const difficulty = .5;
    const paddleSpeed = 5;

    let paddleDirection=0;
$(function()
{
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

    // Draw ball
    const ball = draw.circle(ballSize);
    ball.center(width/2,height/2).fill(colours.ballCentre);
    
    // Player scores
    let leftScore = 0;
    let rightScore = 0;

    // Create text for each score
    let scoreLeft = draw.text(leftScore+"").font({
        size: 32,
        family: "Menlo, sans-serif",
        anchor: "end",
        fill: colours.score
    }).move(width/2-10, 10);
    let scoreRight = scoreLeft.clone().text(rightScore+"").font("anchor","start").x(width/2+10);

    // Velocity
    let vx = 0;
    let vy=0;
    // Update called on every animation step
    function update(dt)
    {
        // Move ball by velocity
        ball.dmove(vx*dt, vy*dt);

        // Get current position of ball
        const cx = ball.cx();
        const cy = ball.cy();

        // Get position of computer's paddle
        let paddleLeftCy = paddleLeft.cy();

        // Move paddle in direction of ball
        const dy = Math.min(difficulty, Math.abs(cy - paddleLeftCy));
        paddleLeftCy += cy > paddleLeftCy ? dy : -dy;
        // constraint the move to the canvas area
        paddleLeft.cy(Math.max(paddleHeight/2, Math.min(height-paddleHeight/2, paddleLeftCy)));
        // If ball is off the screen, then bounce it
        if((vy<0 && cy<0) || (vy > 0 && cy >= height))
        {
            vy*=-1;
        }
        let paddleLeftY = paddleLeft.y();
        let paddleRightY = paddleRight.y();
        // Check for paddle collision
        if((vx < 0 && cx <= paddleWidth && cy > paddleLeftY && cy < paddleLeftY + paddleHeight) || (vx > 0 && cx >= width - paddleWidth && cy > paddleRightY && cy < paddleRightY + paddleHeight))
        {
            vy = (cy - ((vx < 0 ? paddleLeftY : paddleRightY) + paddleHeight/2)) * 7 // magic factor
            // Speed up ball
            vx*=-1.05;
        }
        else if ((vx < 0 && cx <= 0) || (vx > 0 && cx >= width))
        {
            // Score a point
            if(vx<0)
            {
                rightScore++;
            }
            else
            {
                leftScore++;
            }
            reset();
            scoreLeft.text(leftScore+"");
            scoreRight.text(rightScore+"");
        }

        // Move player's paddle to match mouse position
        let playerPaddleY = paddleRight.y();
        if(playerPaddleY <= 0 && paddleDirection == -1)
        {
            // Above canvas, stop at top
            paddleRight.cy(paddleHeight/2);
        }
        else if(playerPaddleY >= height - paddleHeight && paddleDirection == 1)
        {
            // Below canvas, stop at bottom
            paddleRight.y(height-paddleHeight);
        }
        else
        {
            // Move towards mouse at paddleSpeed
            paddleRight.dy(paddleDirection * paddleSpeed);
        }
    // update ball color based on position
        ball.fill(ballColour.at(1/width*ball.x()));
    }
    let lastTime, animFrame;
    function callback(ms)
    {
        // Determine time since last frame
        if(lastTime)
        {
            update((ms-lastTime)/1000); // Pass delta time
        }
        lastTime=ms;
        animFrame = requestAnimationFrame(callback);
    }
    // Set up callback
    callback();

    // Event listeners
    SVG.on(document, "keydown",function(e)
    {
        switch(e.keyCode)
        {
            case 40:
                // Pressed up key
                paddleDirection=1;
                break;
            case 38:
                // Pressed down key
                paddleDirection=-1;
                break;
            default:
        }
        // Don't do regular things with key press
        e.preventDefault();
    });
    SVG.on(document, "keyup", function(e)
    {
        paddleDirection=0;
        e.preventDefault();
    });

    draw.on("click",function(){
        if(vx === 0 && vy === 0)
        {
            // Start the game!
            vx = Math.random() * 500 - 150;
            vy = Math.random() * 500 - 150;
        }
    });

    function reset()
    {
        boom();

        // Reset speed
        vx=0;
        vy=0;

        // Put the ball back
        ball.animate(100).center(width/2, height/2);

        // Reset paddles
        paddleLeft.animate(100).cy(height/2);
        paddleRight.animate(100).cy(height/2);
    }

    // Set ball colour
    let ballColour = new SVG.Color(colours.ballInitial);
    ballColour.morph(colours.ballFinal);

    function boom()
    {
        // Detect winning player
        const paddle = ball.cx() > width/2 ? paddleLeft : paddleRight;
        // Create the gradient
        var gradient = draw.gradient('radial', function(stop) {
            stop.at(0, paddle.attr('fill'), 1)
            stop.at(1, paddle.attr('fill'), 0)
          });
        // create circle to carry the gradient
        var blast = draw.circle(300);
        blast.center(ball.cx(), ball.cy()).fill(gradient);

        // animate to invisibility
        blast.animate(1000, '>').opacity(0).after(function() {
            blast.remove()
        });
    }
});