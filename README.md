# 230FinalProject
Final class project for IGME-230

# Content And Technology Plan

I will be making a Javascript sheet music editor.  My first application will be a simple editor using SVG.js, which can create sheet music with only quarter notes (clicking at a position on the page will add a quarter note there).  The second application will include multiple types of notes (eighth notes, half notes, et cetera) which can be dragged- and dropped into the music editor, which will animate them when dragged and dropped.  The third application will include several instruments which can be "played" (clicked or touched) to add music to the sheet music.

I will be using SVG.js in order to create my project.  I feel this is a better alternative to Canvas because all music is line- and curve-based, and I also need to be able to move elements on the page so they cannot be drawn.
The animations for the third application will use Anime.js.

I would not like this project to replace my Project 1 & Project 2 grades.

# Post Mortem of Content & Technology Plan

My final project was very similar to my initial plan.  I decided to go with clicking to add notes for all versions instead of dragging and dropping because that behaviour felt more intuitive (and more efficient).  In addition, I decided that in lieu of animating the notes upon adding them, I would instead add a preview of the notes on hovering.  This is much more useful and less gratuitous.

I decided, for the third application, to instead start with the same app #2 but add the ability to play the music using the spacebar.  I felt this was a much more useful application than playing instruments.