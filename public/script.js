$(document).ready(function () {

    const star = $('.star');
    const maxX = $(window).width() / 2; // Adjusted for the top half of the screen
    const maxY = $(window).height() / 2; // Adjusted for the top half of the screen

    let animationStarted = false;

    var wishes = [
        "Make A Wish",
        "הביעו משאלה",
        "تمنى أمنية",
        "许个愿",
        "Faites un vœu",
        "Haz un deseo",
        "願い事をする",
        "Fai un desiderio",
        "एक इच्छा करें",
        "bir Dilek Tut",
        "Κάνε μια ευχή",
        "doe een Wens",
        "آرزو کن",
        "faça um desejo",
        "загадать желание"
    ];

    var currentIndex = 0;


    function changeWishText() {
        $('#wish-label').animate({
            'opacity': 0
        }, 2000, function () {
            $(this).text(wishes[currentIndex]);
        }).animate({
            'opacity': 1
        }, 2000);

        currentIndex = (currentIndex + 1) % wishes.length;

        $.ajax({
            url: '/wishes',
            method: 'GET',
            success: function (response) {
                const wishText = response.wish.text;
                const words = wishText.split(' '); // Split wish text into words
                let formattedText = ''; // Formatted text with line breaks
                for (let i = 0; i < words.length; i++) {
                    if (i > 0 && i % 3 === 0) {
                        formattedText += '<br>'; // Insert line break every 5 words
                    }
                    formattedText += words[i] + ' ';
                }

                const wishElement = $('<div class="wish"></div>').html(formattedText.trim());
                const fontSize = Math.floor(Math.random() * 21) + 10; // Font size between 20 and 30 pixels
                const leftPosition = Math.min(Math.floor(Math.random() * maxX) + maxX, maxX - fontSize); // Limit to stay within viewport width
                const topPosition = Math.min(Math.floor(Math.random() * maxY), maxY - fontSize); // Limit to stay within viewport height

                wishElement.css({
                    'position': 'absolute',
                    'left': leftPosition + 'px',
                    'top': topPosition + 'px',
                    'font-size': fontSize + 'px',
                    'font-family': 'Verdana, Geneva, Tahoma, sans-serif',
                    'text-align': 'center',
                    'color': '#a6bfc2',
                    'opacity': 0,
                    'text-shadow': '0 0 10px #a6bfc2', // Add white glow box shadow effect
                });

                $('body').append(wishElement);

                wishElement.animate({
                    'opacity': 1
                }, 2000, function () {
                    $(this).animate({
                        'opacity': 0
                    }, 2000, function () {
                        $(this).remove();
                    });
                });
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
    }

    setInterval(changeWishText, 5000);


    $('button').on('click', function (event) {
        console.log('Button clicked!');
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

            // Get the value from the input field
            const submittedText = $('input[name="text"]').val();

            // AJAX request to handle form submission
            $.ajax({
                type: 'POST',
                url: '/submit',
                data: { text: submittedText }, // Send the input field value as the 'text' parameter
                success: function (response) {
                    console.log(response.message);
                },
                error: function (error) {
                    console.error('Error:', error);
                }
            });

            setTimeout(function () {
                location.reload();
            }, 1000);

            animationStarted = true;
        }
    });
});
