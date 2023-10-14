$(document).ready(function () {
    const star = $('.star');
    const maxX = $(window).width();
    const maxY = $(window).height();

    let animationStarted = false;

    $('button').on('click', function (event) {
        event.preventDefault();

        if (!animationStarted) {
            // Calculate initial position in the top-left cell (1/4 of the screen width and height)
            const initialX = Math.floor(Math.random() * (maxX / 2)); // Random X position in the top-left cell
            const initialY = Math.floor(Math.random() * (maxY / 2)); // Random Y position in the top-left cell

            // Calculate final position in the bottom-right cell (3/4 of the screen width and height)
            const finalX = Math.floor(Math.random() * (maxX / 2) + maxX / 2); // Random X position in the bottom-right cell
            const finalY = Math.floor(Math.random() * (maxY / 2) + maxY / 2); // Random Y position in the bottom-right cell

            // Set initial position
            star.css({
                'visibility': 'visible',
                'position': 'absolute',
                'left': initialX + 'px',
                'top': initialY + 'px'
            });

            // Set animation properties for falling from initial to final position
            star.animate({
                'left': finalX + 'px',
                'top': finalY + 'px'
            }, 800, 'linear', function () {
                // Animation complete.
                $(this).addClass('falling-star');
                $(this).css('visibility', 'hidden');
            });

            animationStarted = true;
        }
    });
});
