AOS.init();

// ====================Dropdown Menu Script====================
const hoverTargetsDropDown = document.querySelectorAll('#nav_item');
const changeTargetsDropDown = document.querySelectorAll('#dropdown_menu');
const changeTargetsArrow = document.querySelectorAll('#nav_item_arrow');

hoverTargetsDropDown.forEach((hoverTarget, index) => {
    hoverTarget.addEventListener('mouseover', () => {
        const changeTarget = changeTargetsDropDown[index];
        const changeTargetArrow = changeTargetsArrow[index];
        changeTargetArrow.style.transition = 'transform 0.3s ease-in-out';
        changeTarget.style.display = 'flex';
        hoverTargetsDropDown.forEach((otherTarget, otherIndex) => {
            if (otherIndex !== index) {
                otherTarget.style.backgroundColor = '#294563';
                document.querySelector('.nav_item_special').style.backgroundColor = '#C76378'
            }
        });
        changeTargetsDropDown.forEach((otherTarget, otherIndex) => {
            if (otherIndex !== index) {
                otherTarget.style.display = 'none';
            }
            if (!changeTarget.matches(':hover')) {
                hoverTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                document.querySelector('.nav_item_special').style.backgroundColor = '#C76378'
            }
        });
        changeTargetArrow.style.transform = 'rotate(180deg)';
    });

    hoverTarget.addEventListener('mouseout', () => {
        const changeTarget = changeTargetsDropDown[index];
        hoverTarget.style.backgroundColor = '#294563';
        document.querySelector('.nav_item_special').style.backgroundColor = '#C76378'
        if (!changeTarget.matches(':hover')) {
            changeTarget.style.display = 'none';
        }
        if (changeTarget.matches(':hover')) {
            hoverTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
        }
        changeTargetsArrow[index].style.transform = 'rotate(0deg)';
    });

    changeTargetsDropDown[index].addEventListener('mouseover', () => {
        const changeTargetArrow = changeTargetsArrow[index];
        changeTargetArrow.style.transform = 'rotate(180deg)';
    })

    changeTargetsDropDown[index].addEventListener('mouseleave', () => {
        const changeTarget = changeTargetsDropDown[index];
        changeTarget.style.display = 'none';
        hoverTarget.style.backgroundColor = '#294563';
        document.querySelector('.nav_item_special').style.backgroundColor = '#C76378'
        const changeTargetArrow = changeTargetsArrow[index];
        changeTargetArrow.style.transform = 'rotate(0deg)';
    });
});

// ====================Canvas Script====================
var canvas = document.getElementById('nokey'),
    can_w = parseInt(canvas.getAttribute('width')),
    can_h = parseInt(canvas.getAttribute('height')),
    ctx = canvas.getContext('2d');

var BALL_NUM = 30

var ball = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    r: 0,
    alpha: 1,
    phase: 0
},
    ball_color = {
        r: 23,
        g: 38,
        b: 54
    },
    R = 2,
    balls = [],
    alpha_f = 0.03,
    alpha_phase = 0,

    // Line
    link_line_width = 0.8,
    dis_limit = 260,
    add_mouse_point = true,
    mouse_in = false,
    mouse_ball = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        r: 0,
        type: 'mouse'
    };

// Random speed
function getRandomSpeed(pos) {
    var min = -1,
        max = 1;
    switch (pos) {
        case 'top':
            return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
            break;
        case 'right':
            return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
            break;
        case 'bottom':
            return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
            break;
        case 'left':
            return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
            break;
        default:
            return;
            break;
    }
}
function randomArrayItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomNumFrom(min, max) {
    return Math.random() * (max - min) + min;
}
// Random Ball
function getRandomBall() {
    var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch (pos) {
        case 'top':
            return {
                x: randomSidePos(can_w),
                y: -R,
                vx: getRandomSpeed('top')[0],
                vy: getRandomSpeed('top')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'right':
            return {
                x: can_w + R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('right')[0],
                vy: getRandomSpeed('right')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'bottom':
            return {
                x: randomSidePos(can_w),
                y: can_h + R,
                vx: getRandomSpeed('bottom')[0],
                vy: getRandomSpeed('bottom')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'left':
            return {
                x: -R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('left')[0],
                vy: getRandomSpeed('left')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
    }
}
function randomSidePos(length) {
    return Math.ceil(Math.random() * length);
}

// Draw Ball
function renderBalls() {
    Array.prototype.forEach.call(balls, function (b) {
        if (!b.hasOwnProperty('type')) {
            ctx.fillStyle = 'rgba(' + ball_color.r + ',' + ball_color.g + ',' + ball_color.b + ',' + b.alpha + ')';
            ctx.beginPath();
            ctx.arc(b.x, b.y, R, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    });
}

// Update balls
function updateBalls() {
    var new_balls = [];
    Array.prototype.forEach.call(balls, function (b) {
        b.x += b.vx;
        b.y += b.vy;

        if (b.x > -(50) && b.x < (can_w + 50) && b.y > -(50) && b.y < (can_h + 50)) {
            new_balls.push(b);
        }

        // alpha change
        b.phase += alpha_f;
        b.alpha = Math.abs(Math.cos(b.phase));
        // console.log(b.alpha);
    });

    balls = new_balls.slice(0);
}

// loop alpha
function loopAlphaInf() {

}

// Draw lines
function renderLines() {
    var fraction, alpha;
    for (var i = 0; i < balls.length; i++) {
        for (var j = i + 1; j < balls.length; j++) {

            fraction = getDisOf(balls[i], balls[j]) / dis_limit;

            if (fraction < 1) {
                alpha = (1 - fraction).toString();

                ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
                ctx.lineWidth = link_line_width;

                ctx.beginPath();
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(balls[j].x, balls[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

// calculate distance between two points
function getDisOf(b1, b2) {
    var delta_x = Math.abs(b1.x - b2.x),
        delta_y = Math.abs(b1.y - b2.y);

    return Math.sqrt(delta_x * delta_x + delta_y * delta_y);
}

// add balls if there a little balls
function addBallIfy() {
    if (balls.length < BALL_NUM) {
        balls.push(getRandomBall());
    }
}

// Render
function render() {
    ctx.clearRect(0, 0, can_w, can_h);

    renderBalls();

    renderLines();

    updateBalls();

    addBallIfy();

    window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num) {
    for (var i = 1; i <= num; i++) {
        balls.push({
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        });
    }
}
// Init Canvas
function initCanvas() {
    canvas.setAttribute('width', window.innerWidth - 17);
    canvas.setAttribute('height', 520);

    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));
}
window.addEventListener('resize', function (e) {
    initCanvas();
});

function goMovie() {
    initCanvas();
    initBalls(BALL_NUM);
    window.requestAnimationFrame(render);
}

goMovie();

// ====================Slider script====================
new Swiper('#main_swiper', {
    slideEffect: {
        duration: 1000,
    },
    navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    autoplay: {
        delay: 6000,
        disableOnInteraction: false
    },
    speed: 1000,
    loop: true,
    slidesPerView: 1,
    effect: 'slide',
});

// ====================Rating System Script====================
const ratings = document.querySelectorAll('.rating');

if (ratings.length > 0) {
    initRatings();
}

function initRatings() {
    let retingActive, ratingValue;

    for (i = 0; i < ratings.length; i++) {
        const rating = ratings[i];
        initRating(rating);

    }

    function initRating(rating) {
        initRatingVars(rating);
        setRatingActiveWidth();

        if (rating.classList.contains('rating_set')) {
            setRating(rating);
        }
    }

    function initRatingVars(rating) {
        ratingActive = rating.querySelector('.rating__active');
        ratingValue = rating.querySelector('.rating__value');
    }

    function setRatingActiveWidth(index = ratingValue.innerHTML) {
        const ratingActiveWidth = index / 0.05;
        ratingActive.style.width = `${ratingActiveWidth}%`;
    }

    function setRating(rating) {
        const ratingItems = rating.querySelectorAll('.rating__item');
        for (let i = 0; i < ratingItems.length; i++) {
            const ratingItem = ratingItems[i];
            ratingItem.addEventListener('mouseenter', function (e) {
                initRatingVars(rating);
                setRatingActiveWidth(ratingItem.value);
            });
            ratingItem.addEventListener('mouseleave', function (e) {
                initRatingVars(rating);
                setRatingActiveWidth();
            });

            ratingItem.addEventListener('click', function (e) {
                initRatingVars(rating);

                if (rating.dataset.ajax) {
                    setRatingValue(ratingItem.value, rating);
                } else {
                    ratingValue.innerHTML = i + 1;
                    setRatingActiveWidth();
                }
            });

        }
    }

}

/* ajax */
async function setRatingValue(value, rating) {
    if (!rating.classList.contains('rating_sending')) {
        rating.classList.add('rating_sending');

        // Reting JSON HOZIRCHA YO`Q SHUNGA ISHLAMIDI
        let response = await fetch('rating.json', {
            method: 'GET',

            //body: JSON.stringify({
            //userRating: value
            // }),
            //headers:{
            //'content-type': 'application/json'
            //}
        });

        if (response.ok) {
            const result = await response.json();

            const newRating = result.newRating;
            ratingValue.innerHTML = newRating;
            setRatingActiveWidth();
            rating.classList.remove('rating_sending');
        } else {
            rating.classList.remove('rating_sending');
        }
    }
}
