const canvas = document.querySelector("#myCanvas");
const turnshow = document.querySelector("#turnshow");
const blank = document.querySelector("#blank");
const ctx = canvas.getContext("2d");
let time = 0;
let position = [50, 50];
let data = Array.from(new Array(10), () => new Array(10).fill(0));
let turn = 1; //ターン
const turnmatch = [null, "white", "red", "green", "blue"];
const checkdirection = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
]; //チェックベクトル
turnshow.innerHTML = `${turnmatch[1]}のターン`
    //初期化
for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        switch (j % 2) {
            case 0:
                data[i + 3][j + 3] = (i + j) % 4;
                if (data[i + 3][j + 3] === 0) data[i + 3][j + 3] = 4;
                break;
            case 1:
                data[i + 3][j + 3] = 4 - ((i + j) % 4);
                break;
        };
    };
};
//リサイズ時の処理
window.addEventListener("resize", () => {
    if (window.innerHeight < window.innerWidth) {
        canvas.style.transform = `Scale(${window.innerHeight * 0.8 / canvas.height})`;
        blank.style.height = `${500 * window.innerHeight * 0.8 / canvas.height}px`;
        blank.style.width = `${500 * window.innerHeight * 0.8 / canvas.height}px`
    } else {
        canvas.style.transform = `Scale(${window.innerWidth * 0.8 / canvas.width})`;
        blank.style.width = `${500 * window.innerWidth * 0.8 / canvas.width}px`;
        blank.style.height = `${500 * window.innerWidth * 0.8 / canvas.width}px`;
    }
});
window.dispatchEvent(new Event("resize"));

//データ描画
function drawdata() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (data[i][j] === 0) continue;
            switch (data[i][j]) {
                case 1:
                    ctx.fillStyle = turnmatch[1];
                    break;
                case 2:
                    ctx.fillStyle = turnmatch[2];
                    break;
                case 3:
                    ctx.fillStyle = turnmatch[3];
                    break;
                case 4:
                    ctx.fillStyle = turnmatch[4];
                    break;
            };
            ctx.beginPath();
            ctx.arc(50 * i + 25, 50 * j + 25, 20, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.stroke();
            ctx.closePath();
        }
    }
};
//盤面描画
function drawcanvas() {
    ctx.fillStyle = "black"
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            ctx.strokeRect(50 * i, 50 * j, 50, 50);
        }
    }
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
};
//裏返す判定
function check(column, row) {
    let completecheck = false;
    checkdirection.forEach((element) => {
        dx = element[0];
        dy = element[1];
        if (data[column][row] != 0) return;
        if (data[column + dx][row + dy] == turn) return;
        for (let checkx = column + dx, checky = row + dy; 0 <= checkx && checkx <= 9 && 0 <= checky && checky <= 9 && data[checkx][checky] != 0; checkx += dx, checky += dy) {
            if (data[checkx][checky] == turn) {
                for (let x = checkx, y = checky; x != column || y != row; x -= dx, y -= dy) {
                    data[x][y] = turn;
                    completecheck = true;
                };
                break;
            };
        };
    });
    if (completecheck) {
        data[column][row] = turn;
        turn = turn % 4 + 1;
        turnshow.innerHTML = `${turnmatch[turn]}のターン`
    };
};
//クリック時処理
canvas.addEventListener("click", (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    const row = Math.floor(y / 50);
    const column = Math.floor(x / 50);
    check(column, row);
});
//アニメーション
function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawcanvas();
    drawdata();
    ctx.closePath();
    time += 1;
};
setInterval(draw, 100);