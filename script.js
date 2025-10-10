// import { func, mathematicalFunction } from "./mathematical_function.js";
const func = [
  { functionName: 'x', xMin: -1, xMax: 1, yMin: -1, yMax: 1, boxColor: 'cyan' },
  { functionName: '-x', xMin: -1, xMax: 1, yMin: -1, yMax: 1, boxColor: 'cyan' },
  { functionName: 'expPlus', xMin: -2, xMax: 2, yMin: Math.exp(-2), yMax: Math.exp(2), boxColor: 'cyan' },
  { functionName: 'expMinus', xMin: -2, xMax: 2, yMin: Math.exp(-2), yMax: Math.exp(2), boxColor: 'cyan' },
  { functionName: 'log', xMin: 0.01, xMax: 3, yMin: Math.log(0.01), yMax: Math.log(3), boxColor: 'cyan' },
  { functionName: 'sin', xMin: 0, xMax: 2 * Math.PI, yMin: -1, yMax: 1, boxColor: 'cyan' },
  { functionName: 'cos', xMin: 0, xMax: 2 * Math.PI, yMin: -1, yMax: 1, boxColor: 'cyan' },
  { functionName: 'tan', xMin: Math.atan(-8), xMax: Math.atan(8), yMin: -8, yMax: 8, boxColor: 'cyan' },
  { functionName: 'arcsin', xMin: -1, xMax: 1, yMin: -Math.PI / 2, yMax: Math.PI / 2, boxColor: 'cyan' },
  { functionName: 'arccos', xMin: -1, xMax: 1, yMin: 0, yMax: Math.PI, boxColor: 'cyan' },
  { functionName: 'arctan', xMin: -8, xMax: 8, yMin: Math.atan(-8), yMax: Math.atan(8), boxColor: 'cyan' },
  { functionName: 'sinh', xMin: -3, xMax: 3, yMin: -11, yMax: 11, boxColor: 'cyan' },
  { functionName: 'cosh', xMin: -3, xMax: 3, yMin: 1, yMax: 10, boxColor: 'cyan' },
  { functionName: 'tanh', xMin: -5, xMax: 5, yMin: -1, yMax: 1, boxColor: 'cyan' }
];

class mathematicalFunction {
  constructor(functionName, xMin, xMax, yMin, yMax, boxColor, xIndex, drawBottomY) {
    this.functionName = functionName;
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
    this.boxColor = boxColor;
    this.xIndex = xIndex;
    this.drawBottomY = drawBottomY;
    this.functionPoints = [];
    this.functionPassage = [];
  }

  generateFunctionPoints(columnWidth, width, height) {
    for (let x = this.xMin; x <= this.xMax; x += 0.01) {
      const y = Math.exp(x);
      // points.push({ x: this.toCanvasX(x, columnWidth), y: this.toCanvasY(y, columnWidth, width, height) });
      this.functionPoints.push({ x: this.toCanvasX(x, columnWidth), y: this.toCanvasY(y, columnWidth, width, height) });
    }
    return this.functionPoints;
  }

  generatePassage(passages) {
    passages.push({ x: { from: this.xIndex, to: this.xIndex + 1 }, y: { from: this.functionPoints[0].y, to: this.functionPoints[this.functionPoints.length - 1].y }, boxVisible: false });
    this.functionPassage.push({ x: { from: this.xIndex, to: this.xIndex + 1 }, y: { from: this.functionPoints[0].y, to: this.functionPoints[this.functionPoints.length - 1].y }, boxVisible: false });
    // console.log('Hello'+this.functionName);
    // console.log(this.xMin);
  }

  drawFunction(columnWidth, ctx) {
    // const startX = columnWidth * (this.functionPassage.from + 1);
    // const endX = columnWidth * (this.functionPassage.to + 1);

    console.log(ctx);
    ctx.beginPath();
    // console.log(this.functionPoints[0].x, this.functionPoints[0].y);

    ctx.moveTo(this.functionPoints[0].x, this.functionPoints[0].y);
    for (let i = 1; i < this.functionPoints.length; i++) {
      ctx.lineTo(this.functionPoints[i].x, this.functionPoints[i].y);
    }

    ctx.stroke();
  }

  // 変換（座標→canvas ピクセル）
  toCanvasX(draw_x, columnWidth) {
    const startX = columnWidth * (this.xIndex + 1);
    // const width = x2 - x1;
    return (draw_x - this.xMin) / (this.xMax - this.xMin) * columnWidth + startX;
  }
  toCanvasY(draw_y, columnWidth, width, height) {
    const height_hat = height / width * columnWidth;
    return - (draw_y - this.yMin) / (this.yMax - this.yMin) * height_hat + this.drawBottomY;
  }
};

// exp = new mathematicalFunction(func[2].functionName, func[2].xMin, func[2].xMax, func[2].yMin, func[2].yMax, func[2].boxColor);
// exp.generatePassage();

let playerNames = [];
let numPlayers = 3;
let numPassages = 5;
let points = [];
let passages = [];
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
  numPassages = parseInt(document.getElementById('numPassages').value);
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
  passages = [];
  //   for (let i = 0; i < numPassages; i++) {
  //     // const x = Math.floor(Math.random()*(numPlayers-1)) + 1; //列間
  //     const xIndex = Math.floor(Math.random() * (numPlayers - 1));
  //     // const y = Math.random() * (canvas.height - 50) + 25;
  //     const y = Math.floor(Math.random() * (bottomY - 60)) + 40;
  //     // passages.push({col:x, y:y});
  //     passages.push({ y, from: xIndex, to: xIndex + 1 });
  //   }
  // テスト用
  // 横線
  //   let xIndex = 0;
  //   let y = 41;
  //   passages.push({ y, from: xIndex, to: xIndex + 1 });

  //   // xIndex = Math.floor(Math.random() * (numPlayers - 1));
  //   y = 43;
  //   passages.push({ y, from: xIndex, to: xIndex + 1 });

  points = [];
  let xIndex = 0;
  let drawBottomY = 180;
  // x1 = columnWidth * (xIndex + 1);
  // x2 = columnWidth * (xIndex + 2);
  // console.log(`x2-x1:${x2-x1}`);
  // console.log(`columnWidth:${columnWidth}`);

  exp1 = new mathematicalFunction(func[2].functionName, func[2].xMin, func[2].xMax, func[2].yMin, func[2].yMax, func[2].boxColor, xIndex, drawBottomY);
  // console.log(drawBottomY);
  const functionPoints1 = exp1.generateFunctionPoints(columnWidth, canvas.width, canvas.height);
  points.push(functionPoints1);
  exp1.generatePassage(passages);

  drawBottomY = 360;
  exp2 = new mathematicalFunction(func[2].functionName, func[2].xMin, func[2].xMax, func[2].yMin, func[2].yMax, func[2].boxColor, xIndex, drawBottomY);
  const functionPoints2 = exp2.generateFunctionPoints(columnWidth, canvas.width, canvas.height);
  points.push(functionPoints2);
  exp2.generatePassage(passages);
  console.log(exp2.functionPoints.length);
  console.log(exp2.functionPassage);

  xIndex = 1;
  drawBottomY = 180;
  arctan3 = new mathematicalFunction(func[10].functionName, func[10].xMin, func[10].xMax, func[10].yMin, func[10].yMax, func[10].boxColor, xIndex, drawBottomY);
  const functionPoints3 = arctan3.generateFunctionPoints(columnWidth, canvas.width, canvas.height);
  // console.log(functionPoints3.length);
  points.push(functionPoints3);

  function passageExponential(xIndex, drawBottomY) {
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
      points.push({ x: toCanvasX(x, xMin, xMax, x1, x2), y: toCanvasY(y, yMin, yMax, drawBottomY, x1, x2) });
    }
  }
  // let xIndex = 0;
  // let y = 180;
  // passageExponential(xIndex, drawBottomY);
  // exp と cos 確認済み。drawBottomY は始点のy座標でなく、グラフの幅の終点（左下部分）のy座標であることに注意。
  // passages.push({ x: {from: xIndex, to: xIndex + 1 }, y: {from: drawBottomY, to: points[points.length-1].y} });
  // passages.push({ x: { from: xIndex, to: xIndex + 1 }, y: { from: points[0].y, to: points[points.length - 1].y }, boxVisible: false });

  // xIndex = 0;
  // y = 80;
  // passages.push({ y, from: xIndex, to: xIndex + 1 });

  // xIndex = 0;
  // y = 120;
  // passages.push({ y, from: xIndex, to: xIndex + 1 });

  // xIndex = 0;
  // y = 200;
  // passages.push({ y, from: xIndex, to: xIndex + 1 });

  // xIndex = 0;
  // y = 500;
  // passages.push({ y, from: xIndex, to: xIndex + 1 });

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
  // for (const passage of passages) {
  //   ctx.beginPath();
  //   // drawExponentialFunction(passage);
  //   exp1.drawFunction(columnWidth, ctx);
  //   exp2.drawFunction(columnWidth, ctx);
  //   // const x1 = columnWidth * (passage.from + 1);
  //   // const x2 = columnWidth * (passage.to + 1);
  //   // // ctx.moveTo(columnWidth*passage.col, passage.y);
  //   // // ctx.lineTo(columnWidth*(passage.col+1), passage.y);
  //   // ctx.moveTo(x1, passage.y);
  //   // ctx.lineTo(x2, passage.y);
  //   ctx.stroke();
  //   // stroke の外側に書いたらうまくいった。
  //   // drawFunctionBox(canvas, columnWidth,'tanh');
  //   drawFunctionBox(canvas, columnWidth, 'log', passage.boxVisible);
  // }

  // ctx.beginPath();
  exp1.drawFunction(columnWidth, ctx);
  exp2.drawFunction(columnWidth, ctx);
  // ctx.stroke();

  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(0, 180, 8, 0, Math.PI * 2);
  ctx.fill();

  function drawExponentialFunction(passage) {
    // 軸のスケール設定
    const x1 = columnWidth * (passage.from + 1);
    const x2 = columnWidth * (passage.to + 1);
    // const xMin = -2;
    // const xMax = 2;
    // const yMin = 0;
    // const yMax = Math.exp(xMax); // e^x の最大値
    // passages.push({ x: { from: xIndex, to: xIndex + 1 },
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
    //   const py = toCanvasY(draw_y, yMin, yMax, passage.y, x1, x2);
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

// // 変換（座標→canvas ピクセル）
// function toCanvasX(draw_x, xMin, xMax, x1, x2) {
//   // return (x - xMin) / (xMax - xMin) * width;
//   width = x2 - x1;
//   // width = canvas.width;
//   // width = x1 + 40;
//   // return (draw_x - xMin) / (xMax - xMin) * width + x1;
//   return (draw_x - xMin) / (xMax - xMin) * width + x1;
// }
// function toCanvasY(draw_y, yMin, yMax, y, x1, x2) {
//   // height = 140;
//   // height = canvas.height/(6 + 1);
//   height = canvas.height;
//   height_hat = canvas.height / canvas.width * (x2 - x1);
//   // return height - (draw_y - yMin) / (yMax - yMin) * height;
//   // return height * (1.0 - (draw_y - yMin) / (yMax - yMin)) + y;
//   // return height * (1.0 - (draw_y - yMin) / (yMax - yMin));
//   // return height - (draw_y - yMin) / (yMax - yMin) * height_hat - (height-y);
//   return - (draw_y - yMin) / (yMax - yMin) * height_hat + y;
// }

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
  let passage_Y;
  let idx = 0;
  // console.log(callback);

  const interval = setInterval(() => {
    if (state === "down") {
      // 横線チェック
      // const nearLadder = passages.find(l=>Math.abs(l.y - y) < 2 && (l.col===xIndex||l.col===xIndex-1));
      const nearLadder = passages.find(l =>
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
        // passage_Y = nearLadder.y;
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
        // y += toCanvasY(Math.exp(x), yMin, yMax, passage_Y, x1, x2);
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