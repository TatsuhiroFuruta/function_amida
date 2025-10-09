// import { func, mathematicalFunction } from "./mathematical_function.js";
const func = [
  {functionName: 'x', Xmin: -1, Xmax: 1, Ymin: -1, Ymax: 1, box_color: 'cyan'},
  {functionName: '-x', Xmin: -1, Xmax: 1, Ymin: -1, Ymax: 1, box_color: 'cyan'},
  {functionName: 'expPlus', Xmin: -2, Xmax: 2, Ymin: Math.exp(-2), Ymax: Math.exp(2), box_color: 'cyan'},
  {functionName: 'expMinus', Xmin: -2, Xmax: 2, Ymin: Math.exp(-2), Ymax: Math.exp(2), box_color: 'cyan'},
  {functionName: 'log', Xmin: 0.01, Xmax: 3, Ymin: Math.log(0.01), Ymax: Math.log(3), box_color: 'cyan'},
  {functionName: 'sin', Xmin: 0, Xmax: 2*Math.PI, Ymin: -1, Ymax: 1, box_color: 'cyan'},
  {functionName: 'cos', Xmin: 0, Xmax: 2*Math.PI, Ymin: -1, Ymax: 1, box_color: 'cyan'},
  {functionName: 'tan', Xmin: Math.atan(-8), Xmax: Math.atan(8), Ymin: -8, Ymax: 8, box_color: 'cyan'},
  {functionName: 'arcsin', Xmin: -1, Xmax: 1, Ymin: -Math.PI/2, Ymax: Math.PI/2, box_color: 'cyan'},
  {functionName: 'arccos', Xmin: -1, Xmax: 1, Ymin: 0, Ymax: Math.PI, box_color: 'cyan'},
  {functionName: 'arctan', Xmin: -8, Xmax: 8, Ymin: Math.atan(-8), Ymax: Math.atan(8), box_color: 'cyan'},
  {functionName: 'sinh', Xmin: -3, Xmax: 3, Ymin: -11, Ymax: 11, box_color: 'cyan'},
  {functionName: 'cosh', Xmin: -3, Xmax: 3, Ymin: 1, Ymax: 10, box_color: 'cyan'},
  {functionName: 'tanh', Xmin: -5, Xmax: 5, Ymin: -1, Ymax: 1, box_color: 'cyan'}
];

class mathematicalFunction {
  constructor(functionName, Xmin, Xmax, Ymin, Ymax, box_color){
    this.functionName = functionName;
    this.Xmin = Xmin;
    this.Xmax = Xmax;
    this.Ymin = Ymin;
    this.Ymax = Ymax;
    this.box_color = box_color;
  }

  generate_passage () {
    console.log('Hello'+this.functionName);
    console.log(this.Xmin);
  }
};

// exp = new mathematicalFunction(func[2].functionName, func[2].Xmin, func[2].Xmax, func[2].Ymin, func[2].Ymax, func[2].box_color);
// exp.generate_passage();

let playerNames = [];
let numPlayers = 3;
let numLadders = 5;
let points = [];
let ladders = [];
let currentIndex = 0;
let results = [];
let choices = []; //各プレイヤーの選んだ列
let chosen_col;
let ctx, canvas;
let columnWidth;
let topY = 20;
let bottomY = 480;
const xMin = 0.01;//-5;//-3;//-3;//-5;//-1;//-1;//Math.atan(-8);//0.01;//-1;//-1;//-2;//0;//-8.0;//0.0;//-2.0;
const xMax = 3;//5;//3;//3;//5;//1;//1;//Math.atan(8);//3;//1;//1;//2;//2*Math.PI;//8.0;//2.0*Math.PI; //2.0;
// const yMin = 0;
const yMin = Math.log(xMin);//-1;//1;//-11;//-1;//0;//-Math.PI/2;//-8;//Math.log(xMin);//-1;//Math.exp(xMin);//Math.atan(xMin);//-1.0;//Math.exp(xMin);
const yMax = Math.log(xMax);//1;//10;//11;//1;//Math.PI;//Math.PI/2;//8;//Math.log(xMax);//1;//Math.exp(xMax);//Math.atan(xMax);//1.0;//Math.exp(xMax); // e^x の最大値

// 設定画面への遷移
document.getElementById('toSettings').onclick = () => {
  showSection('settings');
  updateNameInputs();
};
document.getElementById('numPlayers').oninput = updateNameInputs;
// 人数入力後
function updateNameInputs() {
  numPlayers = parseInt(document.getElementById('numPlayers').value);
  const div = document.getElementById('nameInputs');
  div.innerHTML = '';
  for (let i = 0; i < numPlayers; i++) {
    // div.innerHTML += `<label>名前${i + 1}: <input type="text" id="name${i}" value="名前${i + 1}"></label><br>`;
    div.innerHTML += `<label>名前${i + 1}: <input type="text" id="name${i}" value="", placeholder="プレイヤー${i + 1}" ></label><br>`;
  }
}

// 阿弥陀籤画面への遷移
document.getElementById('startGame').onclick = () => {
  document.getElementById('endButton').style.display = 'none';
  numPlayers = parseInt(document.getElementById('numPlayers').value);
  numLadders = parseInt(document.getElementById('numLadders').value);
  playerNames = [];
  for (let i = 0; i < numPlayers; i++) {
    playerNames.push(document.getElementById(`name${i}`).value || `プレイヤー${i + 1}`);
  }
  currentIndex = 0;
  results = [];
  choices = [];
  chosen_col = new Array(numPlayers); // 選ばれた列番号に対応するプレイヤーの名前
  showSection('amida');
  setupAmida();
};

document.getElementById('endButton').onclick = () => {
  showSection('title');
};

function showSection(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function setupAmida() {
  canvas = document.getElementById('amidaCanvas');
  // canvas.style.writingMode = 'vertical-rl';
  ctx = canvas.getContext('2d');
  columnWidth = canvas.width / (numPlayers + 1);

  // 横線生成
  ladders = [];
  //   for (let i = 0; i < numLadders; i++) {
  //     // const x = Math.floor(Math.random()*(numPlayers-1)) + 1; //列間
  //     const xIndex = Math.floor(Math.random() * (numPlayers - 1));
  //     // const y = Math.random() * (canvas.height - 50) + 25;
  //     const y = Math.floor(Math.random() * (bottomY - 60)) + 40;
  //     // ladders.push({col:x, y:y});
  //     ladders.push({ y, from: xIndex, to: xIndex + 1 });
  //   }
  // テスト用
  // 横線
  //   let xIndex = 0;
  //   let y = 41;
  //   ladders.push({ y, from: xIndex, to: xIndex + 1 });

  //   // xIndex = Math.floor(Math.random() * (numPlayers - 1));
  //   y = 43;
  //   ladders.push({ y, from: xIndex, to: xIndex + 1 });

  points = [];
  let xIndex = 0;
  let y_from = 180;
  x1 = columnWidth * (xIndex + 1);
  x2 = columnWidth * (xIndex + 2);
  function ladderExponential(xIndex, y_from) {
    // 曲線の座標配列
    for (let x = xMin; x <= xMax; x += 0.01) {
      // const y = Math.exp(x);
      // const y = Math.cos(x);
      // const y = Math.atan(x);
      // const y = Math.sin(x);
      // const y = Math.exp(-x);
      // const y = -x;
      // const y = x;
      const y = Math.log(x);
      // const y = Math.tan(x);
      // const y = Math.asin(x);
      // const y = Math.acos(x);
      // const y = Math.tanh(x);
      // const y = Math.sinh(x);
      // const y = Math.cosh(x);
      points.push({ x: toCanvasX(x, xMin, xMax, x1, x2), y: toCanvasY(y, yMin, yMax, y_from, x1, x2) });
    }
  }
  // let xIndex = 0;
  // let y = 180;
  ladderExponential(xIndex, y_from);
  // exp と cos 確認済み。y_from は始点のy座標でなく、グラフの幅の終点（左下部分）のy座標であることに注意。
  // ladders.push({ x: {from: xIndex, to: xIndex + 1 }, y: {from: y_from, to: points[points.length-1].y} });
  ladders.push({ x: { from: xIndex, to: xIndex + 1 }, y: { from: points[0].y, to: points[points.length - 1].y }, boxVisible: true });

  // xIndex = 0;
  // y = 80;
  // ladders.push({ y, from: xIndex, to: xIndex + 1 });

  // xIndex = 0;
  // y = 120;
  // ladders.push({ y, from: xIndex, to: xIndex + 1 });

  // xIndex = 0;
  // y = 200;
  // ladders.push({ y, from: xIndex, to: xIndex + 1 });

  // xIndex = 0;
  // y = 500;
  // ladders.push({ y, from: xIndex, to: xIndex + 1 });

  drawAmida();
  // drawFunctionBox(canvas, columnWidth,'tanh');

  // for (let i = 0; i < numPlayers; i++) {
  //   ctx.fillStyle = 'blue';
  //   ctx.font = '14px sans-serif';
  //   // ctx.fillText(r.player, columnWidth * (r.goal + 1) - 20, canvas.height - 5);
  //   ctx.fillText(`列${i + 1}`, columnWidth * (i + 1) -15, topY -5 );
  // }

  showCurrentPlayer();
  setupStartButtons();
}

function drawAmida() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;

  for (let i = 0; i < numPlayers; i++) {
    ctx.fillStyle = 'blue';
    ctx.font = '14px sans-serif';
    // ctx.fillText(r.player, columnWidth * (r.goal + 1) - 20, canvas.height - 5);
    // playerIndex = choices[i]
    // ctx.fillText(playerNames[playerIndex] || `列${i + 1}`, columnWidth * (i + 1) -15, topY -5 );
    // ctx.fillText(chosen_col[i] || `列${i + 1}`, columnWidth * (i + 1) - 15, topY - 5);
    ctx.textAlign = 'center';
    // ctx.fillText(chosen_col[i] || `列${i + 1}`, columnWidth * (i + 1) - 15, topY - 5);
    ctx.fillText(chosen_col[i] || `列${i + 1}`, columnWidth * (i + 1), topY - 5);
  }

  // 縦線
  for (let i = 0; i < numPlayers; i++) {
    ctx.beginPath();
    // ctx.moveTo(columnWidth*i, 20);
    // ctx.lineTo(columnWidth*i, canvas.height-20);
    const x = columnWidth * (i + 1);
    ctx.moveTo(x, topY);
    ctx.lineTo(x, bottomY);
    ctx.stroke();
  }

  // 横線
  for (const ladder of ladders) {
    ctx.beginPath();
    drawExponentialFunction(ladder);
    // const x1 = columnWidth * (ladder.from + 1);
    // const x2 = columnWidth * (ladder.to + 1);
    // // ctx.moveTo(columnWidth*ladder.col, ladder.y);
    // // ctx.lineTo(columnWidth*(ladder.col+1), ladder.y);
    // ctx.moveTo(x1, ladder.y);
    // ctx.lineTo(x2, ladder.y);
    ctx.stroke();
    // stroke の外側に書いたらうまくいった。
    // drawFunctionBox(canvas, columnWidth,'tanh');
    drawFunctionBox(canvas, columnWidth, 'log', ladder.boxVisible);
  }

  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(0, 180, 8, 0, Math.PI * 2);
  ctx.fill();

  function drawExponentialFunction(ladder) {
    // 軸のスケール設定
    const x1 = columnWidth * (ladder.from + 1);
    const x2 = columnWidth * (ladder.to + 1);
    // const xMin = -2;
    // const xMax = 2;
    // const yMin = 0;
    // const yMax = Math.exp(xMax); // e^x の最大値
    // ladders.push({ x: { from: xIndex, to: xIndex + 1 },
    //   y: { from: yMin, to: yMax }
    // });

    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    // ctx.beginPath();
    // let started = false;
    // for (let draw_x = xMin; draw_x <= xMax; draw_x += 0.01) {
    //   const draw_y = Math.exp(draw_x);
    //   const px = toCanvasX(draw_x, xMin, xMax, x1, x2);
    //   const py = toCanvasY(draw_y, yMin, yMax, ladder.y, x1, x2);
    //   if (!started) {
    //     ctx.moveTo(px, py);
    //     started = true;
    //   } else {
    //     ctx.lineTo(px, py);
    //   }
    // }
    // ctx.stroke();

  }

  // ゴール名
  for (const r of results) {
    ctx.fillStyle = 'blue';
    ctx.font = '14px sans-serif';
    // ctx.fillText(r.player, columnWidth * (r.goal + 1) - 20, canvas.height - 5);
    // ctx.fillText(r.player, r.goal - 20, canvas.height - 5);
    ctx.fillText(r.player, r.goal, canvas.height - 5);
  }
}

// 変換（座標→canvas ピクセル）
function toCanvasX(draw_x, xMin, xMax, x1, x2) {
  // return (x - xMin) / (xMax - xMin) * width;
  width = x2 - x1;
  // width = canvas.width;
  // width = x1 + 40;
  // return (draw_x - xMin) / (xMax - xMin) * width + x1;
  return (draw_x - xMin) / (xMax - xMin) * width + x1;
}
function toCanvasY(draw_y, yMin, yMax, y, x1, x2) {
  // height = 140;
  // height = canvas.height/(6 + 1);
  height = canvas.height;
  height_hat = canvas.height / canvas.width * (x2 - x1);
  // return height - (draw_y - yMin) / (yMax - yMin) * height;
  // return height * (1.0 - (draw_y - yMin) / (yMax - yMin)) + y;
  // return height * (1.0 - (draw_y - yMin) / (yMax - yMin));
  // return height - (draw_y - yMin) / (yMax - yMin) * height_hat - (height-y);
  return - (draw_y - yMin) / (yMax - yMin) * height_hat + y;
}

function drawFunctionBox(canvas, columnWidth, functionName, boxVisible) {
  if (boxVisible) {
    ctx.fillStyle = 'cyan';
    const drawHeight = canvas.height / canvas.width * columnWidth;
    ctx.fillRect(columnWidth, 180 - drawHeight, columnWidth, drawHeight);
    ctx.strokeRect(columnWidth, 180 - drawHeight, columnWidth, drawHeight);
    if (functionName === 'tanh') {
      // renderKatexToCanvas('y = \\tanh(x)', columnWidth,180-drawHeight,columnWidth,drawHeight);
      // renderKatexToCanvas('e^{x}', columnWidth,180-drawHeight,columnWidth,drawHeight);
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.font = "24px 'STIX Two Math', serif";
      ctx.fillText(`tanh(x)`, 1.52 * columnWidth, 180 - 0.45 * drawHeight);
      //  ctx.fillText(`cosh(x)`, 1.52*columnWidth,180-0.45*drawHeight);
      // ctx.fillText(`sinh(x)`, 1.52*columnWidth,180-0.45*drawHeight);
      // ctx.fillText(`tan(x)`, 1.52*columnWidth,180-0.45*drawHeight);
      // ctx.fillText(`cos(x)`, 1.52*columnWidth,180-0.45*drawHeight);
      // ctx.fillText(`sin(x)`, 1.52*columnWidth,180-0.45*drawHeight);
      // ctx.fillText(`arctan(x)`, 1.52*columnWidth,180-0.45*drawHeight);
      // ctx.fillText(`arccos(x)`, 1.52*columnWidth,180-0.45*drawHeight);
      // ctx.fillText(`arcsin(x)`, 1.52*columnWidth,180-0.45*drawHeight);
      // ctx.fillText(`log(x)`, 1.52*columnWidth,180-0.45*drawHeight);
      // ctx.font = "36px 'STIX Two Math', serif";
      // ctx.fillText(`e`, 1.52*columnWidth,180-0.45*drawHeight);
      // ctx.fillText(`x`, 1.52*columnWidth,180-0.45*drawHeight);
      // ctx.fillText(`-x`, 1.52*columnWidth,180-0.45*drawHeight);
      // ctx.font = "20px 'STIX Two Math', serif";
      // ctx.fillText(`x`, 1.52*columnWidth+15,180-0.45*drawHeight-15);
      // ctx.fillText(`-x`, 1.52*columnWidth,180-0.45*drawHeight);
    } else if (functionName === 'log') {
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.font = "24px 'STIX Two Math', serif";
      ctx.fillText(`log(x)`, 1.52 * columnWidth, 180 - 0.45 * drawHeight);
    }
  }
}

async function renderKatexToCanvas(latexString, x, y, width, height) {
  // const canvas = document.getElementById('myCanvas');
  // const ctx = canvas.getContext('2d');

  // ctx.fillStyle='cyan';
  // const drawHeight = canvas.height/canvas.width*columnWidth;
  // ctx.fillRect(x, y, width, height);
  // ctx.strokeRect(x, y, width, height);
  // ctx.clearRect(x, y, width, height);
  // 一時的なコンテナを作成
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0px';
  // tempDiv.style.background = 'white';
  tempDiv.style.padding = '10px';
  tempDiv.style.border = '2px solid';
  // tempDiv.style.display = 'none';
  // tempDiv.style.visibility = 'hidden';
  document.body.appendChild(tempDiv);

  try {
    // KaTeXで数式をレンダリング
    katex.render(latexString, tempDiv, {
      throwOnError: false,
      displayMode: true
    });

    // html2canvasを使ってcanvasに描画
    const canvasElement = await html2canvas(tempDiv, {
      backgroundColor: 'cyan',
      scale: 2
    });

    // 生成されたcanvasをメインcanvasに描画
    ctx.drawImage(canvasElement, x, y, width, height);

  } catch (error) {
    console.error('レンダリングエラー:', error);
  } finally {
    // 一時要素を削除
    document.body.removeChild(tempDiv);
  }
}

function showCurrentPlayer() {
  if (currentIndex < playerNames.length) {
    document.getElementById('currentPlayerTitle').textContent =
      `現在のプレイヤー: ${playerNames[currentIndex]} さん 列を選んでください`;
  }
}

// 列を選択するボタン
function setupStartButtons() {
  const startButtons = document.getElementById('start-buttons');
  startButtons.innerHTML = '';
  for (let i = 0; i < numPlayers; i++) {
    const btn = document.createElement('button');
    btn.textContent = `列${i + 1}`;
    btn.id = `column-${i}`;
    // btn.onclick = () => chooseColumn(i);
    btn.addEventListener('click', () => {
      chooseColumn(i);
      removeColumnButton(i);
    });
    // btn.addEventListener('click', () => {
    //   removeColumnButton(i);
    // });
    // btn.addEventListener('load', () => {
    //   removeColumnButton(i);
    // });
    // btn.addEventListener('DOMContentLoaded', () => {
    //   removeColumnButton(i);
    // });
    startButtons.appendChild(btn);
  }
}

function chooseColumn(colIndex) {
  choices[currentIndex] = colIndex; //選んだ列だけ記録
  // chosen_col[colIndex] = playerNames[currentIndex].length < 6 ? playerNames[currentIndex] : `P${currentIndex + 1}`;
  chosen_col[colIndex] = playerNames[currentIndex];
  currentIndex++;
  drawAmida();
  if (currentIndex < playerNames.length) {
    // drawAmida();
    showCurrentPlayer();
  } else {
    //全員選び終わり
    // document.getElementById('start-buttons').innerHTML = '';
    // document.getElementById('currentPlayerTitle').textContent = '全員の選択完了！順に結果を表示します';
    startSequentialAnimation(0);
  }
}

function removeColumnButton(colIndex) {
  const col_btn = document.getElementById(`column-${colIndex}`);
  // col_btn.style.display = 'none';
  // if(col_btn !== null) col_btn.remove();
  if (col_btn !== null) col_btn.style.display = 'none';
}

// 阿弥陀籤の結果確認
function startSequentialAnimation(i) {
  const startButtons = document.getElementById('start-buttons');
  startButtons.innerHTML = '';
  if (i >= playerNames.length) {
    document.getElementById('endButton').style.display = 'block';
    return;
  }
  // // goal は関数名ではなく、引数。下記の animateAmida 関数の引数の関数において、無名関数を引数としている。
  // animateAmida(choices[i], goal => {
  //   results.push({ player: playerNames[i], goal: goal });
  //   drawAmida();
  //   startSequentialAnimation(i + 1); //次の人
  // });
  document.getElementById('currentPlayerTitle').textContent = `${playerNames[i]}さんの番です！`;
  const btn = document.createElement('button');
  btn.textContent = `スタート`;
  btn.addEventListener('click', (e) => {
    // goal は関数名ではなく、引数。下記の animateAmida 関数の引数の関数において、無名関数を引数としている。
    e.target.style.display = 'none';
    animateAmida(choices[i], goal => {
      results.push({ player: playerNames[i], goal: goal });
      drawAmida();
      startSequentialAnimation(i + 1); //次の人
    });
  });
  startButtons.appendChild(btn);
}

function animateAmida(col, callback) {
  let xIndex = col;
  let x = columnWidth * (xIndex + 1);
  let y = 20;
  let state = "down"; // down or horizontal
  let targetX = x;
  const step = 2; // 下り速度
  let x1;
  let x2;
  let ladder_Y;
  let idx = 0;
  // console.log(callback);

  const interval = setInterval(() => {
    if (state === "down") {
      // 横線チェック
      // const nearLadder = ladders.find(l=>Math.abs(l.y - y) < 2 && (l.col===xIndex||l.col===xIndex-1));
      const nearLadder = ladders.find(l =>
        // Math.abs(l.y - y) < 2 && (l.from === xIndex || l.to === xIndex));
        // Math.abs(l.y.from - y) < 2 && (l.x.from === xIndex || l.x.to === xIndex));
        // Math.abs(l.y.from - y) < 2 && l.x.from === xIndex );
        (l.x.from === xIndex && Math.abs(l.y.from - y) < 2) || (l.x.to === xIndex && Math.abs(l.y.to - y) < 2)
      );
      // if (nearLadder) {
      //   // 横移動
      //   // if (nearLadder.col===xIndex) xIndex++;
      //   // else if (nearLadder.col===xIndex-1) xIndex--;
      // }
      if (nearLadder) {
        nearLadder.boxVisible = false;
        // 横移動に切り替え
        if (nearLadder.x.from === xIndex) {
          xIndex = nearLadder.x.to;
          idx = 0;
          // targetX = columnWidth * (xIndex + 1);
        } else if (nearLadder.x.to === xIndex) {
          xIndex = nearLadder.x.from;
          idx = points.length - 1;
          // targetX = columnWidth * (xIndex + 1);
        }
        targetX = columnWidth * (xIndex + 1);
        // x1 = columnWidth * (nearLadder.from + 1);
        // x2 = columnWidth * (nearLadder.to + 1);
        // ladder_Y = nearLadder.y;
        state = "horizontal";
      } else {
        y += step; // 縦移動
        // y += 1; // 縦移動
        // y += 3; // 縦移動
        // y += 5; // 縦移動
      }
    } else if (state === "horizontal") {
      // 横線を徐々に移動
      let dx = targetX - x;
      // console.log('targetX:'+targetX);
      // console.log(x);
      // console.log(dx);
      // console.log('xIndex:'+xIndex);
      // if (Math.abs(dx) < 1) {
      // console.log(Math.sign(dx));
      // console.log(idx);
      if ((Math.sign(dx) > 0 && idx >= points.length) || (Math.sign(dx) <= 0 && idx <= -1)) {
        // if ((Math.sign(dx) > 0 && idx >= points.length) || (Math.sign(dx) < 0 && idx <= 0)) {
        state = "down"; // 横移動終わり
        // console.log(idx);
        // console.log('dx:'+dx);
        // console.log('y:'+y);
        // console.log(horizontalLines[0].y-y);
        y += step + 1;
        // y += step + 2;
        // y += step;
        // y += 2;
        // y += 3;
        // y += 9;
        // y += 1;
        // console.log(y);
        // console.log(l.y-y);
        // idx = 0;
      } else {
        // console.log('y:'+y);
        // x += dx / 5;
        // x += dx / 10;
        // console.log(Math.sign(dx));
        // x += Math.sign(dx);
        // y -= Math.sign(dx);
        // y -= Math.exp(x);
        // y += toCanvasY(Math.exp(x), yMin, yMax, ladder_Y, x1, x2);
        // console.log(x);
        // console.log('idx:'+idx);
        // idx += 1;
        p = points[idx];
        x = p.x;
        y = p.y;
        idx += Math.sign(dx);
      }
      // y += step;
    }
    drawAmida();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();

    if (y > canvas.height - 20) {
      clearInterval(interval);
      // results オブジェクトの goal に x が登録される。
      callback(x);
    }
  }, 16);
}