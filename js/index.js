let currentColor;
if (localStorage.getItem('currentcolor')) {
    currentColor = localStorage.getItem('currentcolor');
} else {
    currentColor = '#00ff00';
}

let widthMatrix;

if (localStorage.getItem('widthMatrix')) {
    widthMatrix = localStorage.getItem('widthMatrix')
} else {
    widthMatrix = 4;
}

let heightMatrix;

if (localStorage.getItem('heightMatrix')) {
    heightMatrix = localStorage.getItem('heightMatrix');
} else {
    heightMatrix = 4;
}


let currentBucketColor;
document.querySelector('.color .label span').style.background = currentColor;
let prevColor;
let prevPrevColor = '#ffffff';

const color = document.querySelector('#choose-color');
const pencil = document.querySelector('#pencil');
const bucket = document.querySelector('#bucket');
const labelForBucket = document.querySelector('.label.b');
const labelForChooseColor = document.querySelector('.label.c');

const arrOfAction = [labelForBucket, pencil, labelForChooseColor];

const canvas = document.getElementById('pixel');
const ctx = canvas.getContext('2d');


function drawInitCanvas(w, h, color) {
    widthMatrix = w;
    heightMatrix = h;
    localStorage.setItem('widthMatrix', widthMatrix);
    localStorage.setItem('heightMatrix', heightMatrix);

    const pixel = document.getElementById('pixel');
    const ctx = pixel.getContext('2d');
    const dataURL = localStorage.getItem('canvasName');

    if (dataURL) {
        const img = new Image;
        img.src = dataURL;
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
        }

    } else {
        const { width } = pixel;
        const { height } = pixel;
        const xStep = width / w;
        const yStep = height / h;
        for (let i = 0; i <= w; i++) {
            for (let j = 0; j <= h; j++) {
                ctx.fillStyle = color;
                ctx.fillRect(xStep * i, yStep * j, xStep, yStep);
            }
        }

    }
}


document.querySelector('body').addEventListener('load', drawInitCanvas(widthMatrix, heightMatrix, 'white'));

// ///////////Change color////////////////////////////////////
const previous = document.querySelector('#previous');
const redColor = document.querySelector('#red');
const blueColor = document.querySelector('#blue');
const current = document.querySelector('#current');

function changeColor() {
    for (let i = 0; i < arrOfAction.length; i++) {
        if (arrOfAction[i].classList.contains('active')) {
            arrOfAction[i].classList.remove('active');
        }
    }
    labelForChooseColor.classList.add('active');
    prevPrevColor = prevColor;
    prevColor = currentColor;
    currentColor = this.value;
    document.querySelector('.color .label span').style.background = this.value;
    document.querySelector('.color #previous span').style.background = prevColor;
    localStorage.setItem('currentcolor', currentColor);
}

color.addEventListener('change', changeColor);
color.addEventListener('click', () => {
    for (let i = 0; i < arrOfAction.length; i++) {
        if (arrOfAction[i].classList.contains('active')) {
            arrOfAction[i].classList.remove('active');
        }
    }
    labelForChooseColor.classList.add('active');
})

previous.addEventListener('click', () => {
    if (prevColor == '#ffffff') {
        currentColor = '#00ff00';
    } else {
        currentColor = prevColor;
    }
    document.querySelector('.color .label span').style.background = currentColor;
    prevColor = prevPrevColor;
    document.querySelector('.color #previous span').style.background = prevColor;
    localStorage.setItem('currentcolor', currentColor);
})

redColor.addEventListener('click', () => {
    prevPrevColor = prevColor;
    prevColor = currentColor;
    currentColor = '#ff0000';
    document.querySelector('.color .label span').style.background = currentColor;
    document.querySelector('.color #previous span').style.background = prevColor;
    localStorage.setItem('currentcolor', currentColor);
})

blueColor.addEventListener('click', () => {
    prevPrevColor = prevColor;
    prevColor = currentColor;
    currentColor = '#0000ff';
    document.querySelector('.color .label span').style.background = currentColor;
    document.querySelector('.color #previous span').style.background = prevColor;
    localStorage.setItem('currentcolor', currentColor);
})

current.addEventListener('change', function() {
    prevPrevColor = prevColor;
    prevColor = currentColor;
    currentColor = this.value;
    document.querySelector('.color .label span').style.background = this.value;
    document.querySelector('.color #previous span').style.background = prevColor;
    localStorage.setItem('currentcolor', currentColor);
})

// /////////////Draw canvas////////////////////////////////

function controlPixel(arr, x) {
    for (let i = 0; i < arr.length; i++) {
        if (x < arr[0]) {
            x = 0;
            break
        }
        if (x >= arr[i] && x < arr[i + 1]) {
            x = arr[i];
        }
        if (x >= arr[arr.length - 1]) {
            x = arr[arr.length - 1];
            break
        }
    }
    return x
}

function createArrOFWidthMatrix() {
    const arrOFWidthMatrix = [];
    for (let i = canvas.width / widthMatrix; i <= canvas.width - canvas.width / widthMatrix; i += canvas.width / widthMatrix) {
        arrOFWidthMatrix.push(i);
    }

    return arrOFWidthMatrix;
}

function createArrOFHeightMatrix() {
    const arrOFHeightMatrix = [];
    for (let i = canvas.height / heightMatrix; i <= canvas.height - canvas.width / heightMatrix; i += canvas.height / heightMatrix) {
        arrOFHeightMatrix.push(i);
    }
    return arrOFHeightMatrix;
}


let draw = false;
const mouse = {
    x: 0,
    y: 0,
};

function startDraw(event) {
    let arrOFWidthMatrix = createArrOFWidthMatrix();
    let arrOFHeightMatrix = createArrOFHeightMatrix();

    if (canvas.width == canvas.width / widthMatrix) {
        mouse.x = 0;
        mouse.y = 0;

    } else {
        mouse.x = event.pageX - this.offsetLeft;
        mouse.x = controlPixel(arrOFWidthMatrix, mouse.x);

        mouse.y = event.pageY - this.offsetTop;
        mouse.y = controlPixel(arrOFHeightMatrix, mouse.y);
    }


    draw = true;
    ctx.beginPath();
    ctx.fillStyle = currentColor;
    ctx.fillRect(mouse.x, mouse.y, canvas.width / widthMatrix, canvas.height / heightMatrix);
    localStorage.setItem('canvasName', canvas.toDataURL());
}

function drawCanvas(event) {
    let arrOFWidthMatrix = createArrOFWidthMatrix();
    let arrOFHeightMatrix = createArrOFHeightMatrix();
    if (draw === true) {
        if (canvas.width == canvas.width / widthMatrix) {
            mouse.x = 0;
            mouse.y = 0
        } else {
            mouse.x = event.pageX - this.offsetLeft;
            mouse.x = controlPixel(arrOFWidthMatrix, mouse.x);

            mouse.y = event.pageY - this.offsetTop;
            mouse.y = controlPixel(arrOFHeightMatrix, mouse.y);
        }

        ctx.fillStyle = currentColor;
        ctx.fillRect(mouse.x, mouse.y, canvas.width / widthMatrix, canvas.height / heightMatrix);
        localStorage.setItem('canvasName', canvas.toDataURL());
    }
}

function stopDrow() {
    draw = false;
}

pencil.addEventListener('click', () => {
    for (let i = 0; i < arrOfAction.length; i++) {
        if (arrOfAction[i].classList.contains('active')) {
            arrOfAction[i].classList.remove('active');
        }
    }
    pencil.classList.add('active');
    canvas.addEventListener('mousedown', startDraw, {
        once: true
    });
    canvas.addEventListener('mousemove', drawCanvas, {
        once: true
    });
    canvas.addEventListener('mouseup', stopDrow);
});

window.addEventListener('load', () => {
    pencil.classList.add('active');
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', drawCanvas);
    canvas.addEventListener('mouseup', stopDrow);
});

// /////////Change bucket////////////////////////////////////

function changeBucketColor() {

    currentBucketColor = this.value;
    canvas.addEventListener('click', () => {
        const pixel = document.getElementById('pixel');
        const ctx = pixel.getContext('2d');
        const { width } = pixel;
        const { height } = pixel;
        const xStep = width / widthMatrix;
        const yStep = height / heightMatrix;
        for (let i = 0; i <= widthMatrix; i++) {
            for (let j = 0; j <= heightMatrix; j++) {
                ctx.fillStyle = currentBucketColor;
                ctx.fillRect(xStep * i, yStep * j, xStep, yStep);
            }
        }
        localStorage.setItem('canvasName', pixel.toDataURL());

    }, {
        once: true
    })
}

bucket.addEventListener('change', changeBucketColor);


bucket.addEventListener('click', () => {
    for (let i = 0; i < arrOfAction.length; i++) {
        if (arrOfAction[i].classList.contains('active')) {
            arrOfAction[i].classList.remove('active');
        }
    }
    labelForBucket.classList.add('active');
})

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyB':
            bucket.click();
            break;
        case 'KeyC':
            color.click();
            break;
        case 'KeyP':
            pencil.click();
            break;
        default:

    }
})

// /////////Image////////////////////////////////////
const accessKey = 'c49b673129b28a54f550d1accdf5f937f141de03f9175a0b492cd349a1b652be';
// const secretKey = 'd34234e095cc2454759f91970707e37d7e6cfa66e253f261fa4e871b093dcdc2';

const city = document.querySelector('#city');
let url;

async function getLinkToImage() {
    url = 'https://api.unsplash.com/photos/random?query=town,' + city.value + '&client_id=' + accessKey;
    let res = await fetch(url);
    let data = await res.json();
    return data.urls.small;
}

function makeColorCanvas() {
    const pixel = document.getElementById('pixel');
    const ctx = pixel.getContext('2d');
    const { width } = pixel;
    const { height } = pixel;
    const xStep = width / widthMatrix;
    const yStep = height / heightMatrix;
    for (let i = 0; i <= widthMatrix; i++) {
        for (let j = 0; j <= heightMatrix; j++) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(xStep * i, yStep * j, xStep, yStep);
        }
    }
}


function drawCanvasImage() {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    url = 'https://api.unsplash.com/photos/random?query=town,' + city.value + '&client_id=' + accessKey;

    getLinkToImage().then(item => { img.src = item });

    img.onload = function() {
        if (img.width == img.height) {
            makeColorCanvas()
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            localStorage.setItem('canvasName', canvas.toDataURL());
            localStorage.setItem('photo', canvas.toDataURL());

        } else if (img.width != img.height) {
            if (img.width > img.height) {
                makeColorCanvas()
                ctx.drawImage(img, 0, (canvas.height - img.height * canvas.width / img.width) / 2, canvas.width, img.height * canvas.width / img.width);
                localStorage.setItem('canvasName', canvas.toDataURL());
                localStorage.setItem('photo', canvas.toDataURL());
            } else if (img.width < img.height) {
                makeColorCanvas()
                ctx.drawImage(img, (canvas.width - img.width * canvas.height / img.height) / 2, 0, img.width * canvas.height / img.height, canvas.height);
                localStorage.setItem('canvasName', canvas.toDataURL());
                localStorage.setItem('photo', canvas.toDataURL());
            }
        }
    };
}


document.getElementById('loader').addEventListener('click', () => {
    drawCanvasImage()
})

// /////////Cnahgesize////////////////////////////////////

// const arrOfSize = [document.querySelector('#small-size'), document.querySelector('#medium-size'), document.querySelector('#large-size')];

document.querySelector('#small-size').addEventListener('click', function() {
    drawInitCanvas(4, 4, 'white')
});

document.querySelector('#medium-size').addEventListener('click', function() {
    drawInitCanvas(2, 2, 'white')
});

document.querySelector('#large-size').addEventListener('click', function() {
    drawInitCanvas(1, 1, 'white')
});

document.querySelector('#white-blake').addEventListener('click', function() {
    const dataURL = localStorage.getItem('photo');
    const dataURLWithoutImage = localStorage.getItem('canvasName');

    if (dataURL && dataURL == dataURLWithoutImage) {
        canvas.classList.toggle('wb');
        if (canvas.classList.contains("wb")) {
            document.querySelector('#white-blake').style.opacity = '0.2'
        } else {
            document.querySelector('#white-blake').style.opacity = '1'
        }
    } else {
        alert('Download Image')
    }

})