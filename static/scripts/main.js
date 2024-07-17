AOS.init();

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
        r: 51,
        g: 51,
        b: 51
    },
    R = 4,
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

jQuery(document).ready(function ($) {
    var owl = $("#owl-demo-2");
    owl.owlCarousel({
        loop: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 2500,
        autoplayHoverPause: true,
        items: 4,
        center: false,
        rewind: false,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        freeDrag: false,
        margin: 0,
        stagePadding: 0,
        merge: false,
        mergeFit: true,
        autoWidth: false,
        startPosition: 0,
        rtl: false,
        smartSpeed: 1000,
        fluidSpeed: false,
        dragEndSpeed: false,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2,
                nav: false
            },
            768: {
                items: 3,
            },
            992: {
                items: 3,
            }
        },
        responsiveRefreshRate: 200,
        responsiveBaseElement: window,
        fallbackEasing: "swing",
        info: false,
        nestedItemSelector: false,
        itemElement: "div",
        stageElement: "div",
        refreshClass: "owl-refresh",
        loadedClass: "owl-loaded",
        loadingClass: "owl-loading",
        rtlClass: "owl-rtl",
        responsiveClass: "owl-responsive",
        dragClass: "owl-drag",
        itemClass: "owl-item",
        stageClass: "owl-stage",
        stageOuterClass: "owl-stage-outer",
        grabClass: "owl-grab",
        autoHeight: false,
        lazyLoad: false,
    });

    $(".next").click(function () {
        owl.trigger("owl.next");
    });
    $(".prev").click(function () {
        owl.trigger("owl.prev");
    });
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

async function setRatingValue(value, rating) {
    if (!rating.classList.contains('rating_sending')) {
        rating.classList.add('rating_sending');

        // ========= Reting JSON HOZIRCHA YO`Q SHUNGA ISHLAMIDI =========
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

// ==================== Form Script ====================
const userRoleSelect = document.getElementById('user_role');
let userRolesContainer = document.querySelector('.user_roles_block')
let subRoleSelect = document.querySelector('#subrole_select')

userRoleSelect.addEventListener('change', () => {
    const selectedValue = userRoleSelect.value;
    if (selectedValue == 'Student') {
        subRoleSelect.innerHTML = `
                <select id="student_select" style="margin-top: 30px">
                    <option value selected="selected" style="display: none;" >-- About to --</option>
                    <option id="role" value="Custom lesson package">Custom lesson package</option>
                    <option id="role" value="Report mistake/bug">Report mistake/bug</option>
                    <option id="role" value="Payment problem">Payment problem</option>
                    <option id="role" value="Suggestion">Suggestion</option>
                    <option id="role" value="Others">Others</option>
                </select>
        `
    }
    else if (selectedValue == 'IELTS Teacher/Examiner') {
        subRoleSelect.innerHTML = `
                <select id="teacher_select" style="margin-top: 30px">
                    <option id="role" value="Custom lesson package">Looking for freelance work</option>
                    <option id="role" value="Report mistake/bug">Provide Content</option>
                    <option id="role" value="Payment problem">Other</option>
                </select>
`
    }
    else {
        subRoleSelect.innerHTML = ``
    }
});

// Form`s captcha script
const numberOne = Math.round(Math.random() * 9)
const numberTwo = Math.round(Math.random() * 9)
let result = numberOne + numberTwo

document.getElementById('num_one').textContent = numberOne
document.getElementById('num_two').textContent = numberTwo

// ========== Server JS (Account system) Script ==========
$(document).ready(function () {
    $("#show-register").click(function () {
        $("#login-form").hide();
        $("#register-form").show();
    });

    $("#show-login").click(function () {
        $("#register-form").hide();
        $("#login-form").show();
    });

    // Обработка формы входа
    $("#login-form-data").submit(function (event) {
        event.preventDefault();

        var email = $("#login-email").val();
        var password = $("#login-password").val();

        $.ajax({
            url: 'http://localhost:3000/login', // Адрес сервера Node.js
            method: "POST",
            data: {
                email: email,
                password: password
            },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    // Успешный вход
                    alert("Вход выполнен успешно!");
                } else {
                    // Ошибка входа
                    alert(response.message);
                }
            }
        });
    });

    // Обработка формы регистрации
    $("#register-form-data").submit(function (event) {
        event.preventDefault();

        var email = $("#register-email").val();
        var password = $("#register-password").val();

        $.ajax({
            url: 'http://localhost:3000/register', // Адрес сервера Node.js
            method: "POST",
            data: {
                email: email,
                password: password
            },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    // Успешная регистрация
                    alert("Регистрация успешна!");
                    $("#show-login").click(); // Переключаем форму на вход
                } else {
                    // Ошибка регистрации
                    alert(response.message);
                }
            }
        });
    });
});