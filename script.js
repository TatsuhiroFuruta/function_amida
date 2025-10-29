const f = [
  { functionName: 'x', xMin: -1, xMax: 1, yMin: -1, yMax: 1, boxColor: '#ffb6c1' },
  { functionName: '-x', xMin: -1, xMax: 1, yMin: -1, yMax: 1, boxColor: '#e0ffff' },
  { functionName: 'expPlus', xMin: -2, xMax: 2, yMin: Math.exp(-2), yMax: Math.exp(2), boxColor: '#ffa500' },
  { functionName: 'expMinus', xMin: -2, xMax: 2, yMin: Math.exp(-2), yMax: Math.exp(2), boxColor: '#87cefa' },
  { functionName: 'log', xMin: 0.01, xMax: 3, yMin: Math.log(0.01), yMax: Math.log(3), boxColor: '#dda0dd' },
  { functionName: 'sin', xMin: 0, xMax: 2 * Math.PI, yMin: -1, yMax: 1, boxColor: '#ffa07a' },
  { functionName: 'cos', xMin: 0, xMax: 2 * Math.PI, yMin: -1, yMax: 1, boxColor: '#daa520' },
  { functionName: 'tan', xMin: Math.atan(-8), xMax: Math.atan(8), yMin: -8, yMax: 8, boxColor: '#b0c4de' },
  { functionName: 'arcsin', xMin: -1, xMax: 1, yMin: -Math.PI / 2, yMax: Math.PI / 2, boxColor: '#e9967a' },
  { functionName: 'arccos', xMin: -1, xMax: 1, yMin: 0, yMax: Math.PI, boxColor: '#fff8dc' },
  { functionName: 'arctan', xMin: -8, xMax: 8, yMin: Math.atan(-8), yMax: Math.atan(8), boxColor: '#48d1cc' },
  { functionName: 'sinh', xMin: -3, xMax: 3, yMin: -11, yMax: 11, boxColor: '#ffe4e1' },
  { functionName: 'cosh', xMin: -3, xMax: 3, yMin: 1, yMax: 10, boxColor: '#fdf5e6' },
  { functionName: 'tanh', xMin: -5, xMax: 5, yMin: -1, yMax: 1, boxColor: '#e6e6fa' }
];

class mathematicalFunction {
  constructor(functionName, xMin, xMax, yMin, yMax, boxColor, xIndex, curveBottomY, drawBottomY) {
    this.functionName = functionName;
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
    this.boxColor = boxColor;
    this.xIndex = xIndex;
    this.curveBottomY = curveBottomY;
    this.drawBottomY = drawBottomY;
    this.functionPoints = [];
    this.functionPassage;
  }

  generateFunctionPoints(columnWidth, canvas) {
    let xGrid;
    if (['arctan'].includes(this.functionName)) {
      xGrid = 0.08;
    } else if (['tanh'].includes(this.functionName)) {
      xGrid = 0.05;
    } else if (['sin', 'cos', 'sinh', 'cosh'].includes(this.functionName)) {
      xGrid = 0.02;
    } else {
      xGrid = 0.01;
    }
    for (let x = this.xMin; x <= this.xMax; x += xGrid) {
      const y = this.functionType(x);
      this.functionPoints.push({ x: this.toCanvasX(x, columnWidth), y: this.toCanvasY(y, columnWidth, canvas) });
    }
  }

  generatePassage() {
    this.functionPassage = { x: { from: this.xIndex, to: this.xIndex + 1 }, y: { from: this.functionPoints[0].y, to: this.functionPoints[this.functionPoints.length - 1].y }, boxVisible: true };
  }

  drawFunction(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.functionPoints[0].x, this.functionPoints[0].y);
    for (let i = 1; i < this.functionPoints.length; i++) {
      ctx.lineTo(this.functionPoints[i].x, this.functionPoints[i].y);
    }
    ctx.stroke();
  }

  drawFunctionBox(columnWidth, canvas, ctx) {
    if (this.functionPassage.boxVisible) {
      ctx.fillStyle = this.boxColor;
      const startX = columnWidth * (this.xIndex + 1);
      const drawHeight = canvas.height / canvas.width * columnWidth + 30;
      ctx.fillRect(startX, this.drawBottomY - drawHeight, columnWidth, drawHeight );
      ctx.strokeRect(startX, this.drawBottomY - drawHeight, columnWidth, drawHeight );
      this.drawFunctionType(ctx, columnWidth, startX, drawHeight);
    }
  }

  //通路（曲線）の関数の種類を決める
  functionType(x) {
    if (this.functionName === 'x') {
      return x;

    } else if (this.functionName === '-x') {
      return -x;

    } else if (this.functionName === 'expPlus') {
      return Math.exp(x);

    } else if (this.functionName === 'expMinus') {
      return Math.exp(-x);

    } else if (this.functionName === 'log') {
      return Math.log(x);

    } else if (this.functionName === 'sin') {
      return Math.sin(x);

    } else if (this.functionName === 'cos') {
      return Math.cos(x);

    } else if (this.functionName === 'tan') {
      return Math.tan(x);

    }  else if (this.functionName === 'arcsin') {
      return Math.asin(x);

    } else if (this.functionName === 'arccos') {
      return Math.acos(x);

    } else if (this.functionName === 'arctan') {
      return Math.atan(x);

    }  else if (this.functionName === 'sinh') {
      return Math.sinh(x);

    } else if (this.functionName === 'cosh') {
      return Math.cosh(x);

    } else if (this.functionName === 'tanh') {
      return Math.tanh(x);

    }
  }

  //箱の関数名を決める
  drawFunctionType(ctx, columnWidth, startX, drawHeight) {
    const drawFunctionStartX = startX+0.52*columnWidth;
    const drawFunctionStartY = this.drawBottomY-0.45*drawHeight;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    if (this.functionName === 'x') {

      ctx.font = "36px 'STIX Two Math', serif";
      ctx.fillText(`x`, drawFunctionStartX,drawFunctionStartY);

    } else if (this.functionName === '-x') {

      ctx.font = "36px 'STIX Two Math', serif";
      ctx.fillText(`-x`, drawFunctionStartX,drawFunctionStartY);

    } else if (this.functionName === 'expPlus') {

      ctx.font = "36px 'STIX Two Math', serif";
      ctx.fillText(`e`, drawFunctionStartX,drawFunctionStartY);
      ctx.font = "20px 'STIX Two Math', serif";
      ctx.fillText(`x`, drawFunctionStartX+15, drawFunctionStartY-15);

    } else if (this.functionName === 'expMinus') {

      ctx.font = "36px 'STIX Two Math', serif";
      ctx.fillText(`e`, drawFunctionStartX, drawFunctionStartY);
      ctx.font = "20px 'STIX Two Math', serif";
      ctx.fillText(`-x`, drawFunctionStartX+15, drawFunctionStartY-15);

    } else if (this.functionName === 'log') {

      ctx.font = "24px 'STIX Two Math', serif";
      ctx.fillText(`log(x)`, drawFunctionStartX, drawFunctionStartY);

    } else if (this.functionName === 'sin') {

      ctx.font = "24px 'STIX Two Math', serif";
      ctx.fillText(`sin(x)`, drawFunctionStartX, drawFunctionStartY);

    } else if (this.functionName === 'cos') {

      ctx.font = "24px 'STIX Two Math', serif";
      ctx.fillText(`cos(x)`, drawFunctionStartX, drawFunctionStartY);

    } else if (this.functionName === 'tan') {

      ctx.font = "24px 'STIX Two Math', serif";
      ctx.fillText(`tan(x)`, drawFunctionStartX, drawFunctionStartY);

    }  else if (this.functionName === 'arcsin') {

      ctx.font = "24px 'STIX Two Math', serif";
      ctx.fillText(`arcsin(x)`, drawFunctionStartX, drawFunctionStartY);

    } else if (this.functionName === 'arccos') {

      ctx.font = "24px 'STIX Two Math', serif";
      ctx.fillText(`arccos(x)`, drawFunctionStartX, drawFunctionStartY);

    } else if (this.functionName === 'arctan') {

      ctx.font = "24px 'STIX Two Math', serif";
      ctx.fillText(`arctan(x)`, drawFunctionStartX, drawFunctionStartY);

    }  else if (this.functionName === 'sinh') {

      ctx.font = "24px 'STIX Two Math', serif";
      ctx.fillText(`sinh(x)`, drawFunctionStartX, drawFunctionStartY);

    } else if (this.functionName === 'cosh') {

      ctx.font = "24px 'STIX Two Math', serif";
      ctx.fillText(`cosh(x)`, drawFunctionStartX, drawFunctionStartY);

    } else if (this.functionName === 'tanh') {

      ctx.font = "24px 'STIX Two Math', serif";
      ctx.fillText(`tanh(x)`, drawFunctionStartX, drawFunctionStartY);

    }
  }

  // 変換（座標→canvas ピクセル）
  toCanvasX(drawX, columnWidth) {
    const startX = columnWidth * (this.xIndex + 1);
    return (drawX - this.xMin) / (this.xMax - this.xMin) * columnWidth + startX;
  }

  toCanvasY(drawY, columnWidth, canvas) {
    const drawHeight = canvas.height / canvas.width * columnWidth;
    return - (drawY - this.yMin) / (this.yMax - this.yMin) * drawHeight + this.curveBottomY;
  }

};

let course;
let playerNames = [];
let numPlayers;
let numPassages;
let currentIndex = 0;
let results = [];
let choices = []; //各プレイヤーの選んだ列
let chosen_col;
let ctx, canvas;
let columnWidth;
let topY = 20;
let bottomY = 480;
let mathematicalFunctions = [];

// コース選択画面への遷移
document.getElementById('toCourseSelection').onclick = () => {
  showSection('course');
  updateNameInputs();
};

// 設定画面への遷移
const toSettings = document.getElementsByClassName('toSettings');
for (let i = 0; i < toSettings.length; i++) {
  toSettings[i].onclick = (e) => {
    course = e.target.textContent;
    showSection('settings');
    updateNameInputs();
  };
}

document.getElementById('numPlayers').oninput = updateNameInputs;
// 人数入力後
function updateNameInputs() {
  inputNumPlayers = parseInt(document.getElementById('numPlayers').value);
  if (inputNumPlayers >= 2 && inputNumPlayers <= 6) {
    numPlayers = inputNumPlayers;
  } else {
    numPlayers = 0;
  }
  const div = document.getElementById('nameInputs');
  div.innerHTML = '';
  for (let i = 0; i < numPlayers; i++) {
    div.innerHTML += `<label>名前${i + 1}: <input type="text" id="name${i}" value="", placeholder="プレイヤー${i + 1}" ></label><br>`;
  }
}

// 入力検証
function validateSettings() {
  let valid = true;
  const flash = document.getElementById('flash');

  while (flash.firstChild) {
      flash.removeChild(flash.firstChild);
  }

  const numPlayersValue = document.getElementById('numPlayers').value;
  numPlayers = parseInt(numPlayersValue);

  // 人数未入力
  if (!numPlayersValue || !numPlayersValue.match(/\S/g)){
    valid = false;
    createValidationMessages (flash, 'validBlank', '人数を入力してください。');
  } else {
    removeValidationMessages(flash, 'validBlank');
  }

  // 人数チェック
  if(numPlayers < 2 || numPlayers > 6){
    valid = false;
    createValidationMessages (flash, 'validNumPlayers', '人数は2〜6にしてください。');
  } else {
    removeValidationMessages(flash, 'validNumPlayers');
  }

  // 名前チェック
  for(let i=0;i<numPlayers;i++){
    const name = document.getElementById('name'+i).value.trim();
    if(name.length > 6){
      valid = false;
      createValidationMessages (flash, `validName${i}`, `名前${i+1}が6文字を超えています。`);
    } else {
      removeValidationMessages(flash, `validName${i}`);
    }
  }

  if (!valid) {
    flash.style.display = 'block';
    return false;
  } else {
    while (flash.firstChild) {
      flash.removeChild(flash.firstChild);
    }
    flash.style.display = 'none';
    return true;
  }

}

function createValidationMessages(flash, id, message) {
  const div = document.createElement('div');
  div.id = id;
  div.textContent = message;
  div.style.margin = '5px';
  flash.appendChild(div);
}

function removeValidationMessages(flash, id) {
  const removeElement = document.getElementById(id);
  if (removeElement){
    flash.removeChild(removeElement);
  }
}

// 阿弥陀籤画面への遷移
document.getElementById('startGame').onclick = () => {
  if(!validateSettings()) return;
  document.getElementById('endButton').style.display = 'none';
  numPlayers = parseInt(document.getElementById('numPlayers').value);
  playerNames = [];
  for (let i = 0; i < numPlayers; i++) {
    playerNames.push(document.getElementById(`name${i}`).value.trim() || `プレイヤー${i + 1}`);
  }
  currentIndex = 0;
  results = [];
  choices = [];
  chosen_col = new Array(numPlayers); // 選ばれた列番号に対応するプレイヤーの名前
  showSection('amida');
  setupAmida();
};

document.getElementById('endButton').onclick = () => {
  //終了ボタンを押した後でも boxVisible を true にできる！
  mathematicalFunctions = [];
  showSection('title');
};

function showSection(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

const horizontalBoxNumbers = [
  [247, 454], [225, 430], [170, 310, 450], [164, 298, 432], [142, 249, 356, 463]
];

const shiftY = [5, 15, 25];

function setupAmida() {
  canvas = document.getElementById('amidaCanvas');
  ctx = canvas.getContext('2d');
  columnWidth = canvas.width / (numPlayers + 1);

  let horizontalBoxNumber = horizontalBoxNumbers[numPlayers-2];
  numPassages = horizontalBoxNumber.length * (numPlayers - 1);
  let RandomFunctionNumbers = [];
  let RandomXIndex;
  let RandomDrawBottomY = [];
  let RandomCurveBottomY = [];

  for (let i = 0; i < numPassages; i++) {
    let RandomFunctionNumber;
    // ジグザグコース
    if (course === 'ジグザグコース') {
      RandomFunctionNumber = Math.floor(Math.random()*2);
    } else if (course === '標準コース') {
      // 標準コース
      RandomFunctionNumber = Math.floor(Math.random()*8);
    } else {
      // お楽しみコース
      RandomFunctionNumber = Math.floor(Math.random()*14);
      // RandomFunctionNumber = 11;//13;//10
    }
    RandomFunctionNumbers.push(RandomFunctionNumber);
  }

  let XIndexArray = [];
  for (let i = 0; i < numPlayers-1; i++) {
    XIndexArray.push(i);
  }

  let XIndexMat = [];
  for (let i = 0; i < horizontalBoxNumber.length; i++) {
    XIndexMat.push(XIndexArray);
  }
  RandomXIndex = XIndexMat.flat();

  let eliminatedShiftY1;
  let eliminatedShiftY2;
  for (let i = 0; i < horizontalBoxNumber.length; i++) {
    for (let j = 0; j < numPlayers-1; j++) {
      if (j === 0){
        let initEliminatedYIndex = Math.floor(Math.random()*3);
        eliminatedShiftY1 = shiftY.splice(initEliminatedYIndex, 1).pop();
      }
      RandomDrawBottomY.push(horizontalBoxNumber[i]);
      let RandomYIndex = Math.floor(Math.random()*2);
      RandomCurveBottomY.push(horizontalBoxNumber[i]-shiftY[RandomYIndex]);
      eliminatedShiftY2 = shiftY.splice(RandomYIndex, 1).pop();
      shiftY.push(eliminatedShiftY1);
      eliminatedShiftY1 = eliminatedShiftY2;
    }
    shiftY.push(eliminatedShiftY1);
  }

  for (let i = 0; i < numPassages; i++) {
    const mF = new mathematicalFunction(f[RandomFunctionNumbers[i]].functionName, f[RandomFunctionNumbers[i]].xMin, f[RandomFunctionNumbers[i]].xMax, f[RandomFunctionNumbers[i]].yMin, f[RandomFunctionNumbers[i]].yMax, f[RandomFunctionNumbers[i]].boxColor, RandomXIndex[i], RandomCurveBottomY[i] , RandomDrawBottomY[i]);
    mF.generateFunctionPoints(columnWidth, canvas);
    mF.generatePassage();
    mathematicalFunctions.push(mF);
  }

  drawAmida();
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
    ctx.textAlign = 'center';
    ctx.fillText(chosen_col[i] || `列${i + 1}`, columnWidth * (i + 1), topY - 5);
  }

  // 縦線
  for (let i = 0; i < numPlayers; i++) {
    ctx.beginPath();
    const x = columnWidth * (i + 1);
    ctx.moveTo(x, topY);
    ctx.lineTo(x, bottomY);
    ctx.stroke();
  }

  for (let i = 0; i < numPassages; i++) {
    mathematicalFunctions[i].drawFunction(ctx);
    mathematicalFunctions[i].drawFunctionBox(columnWidth, canvas, ctx);
  }

  // ゴール名
  for (const r of results) {
    ctx.fillStyle = 'blue';
    ctx.font = '14px sans-serif';
    ctx.fillText(r.player, r.goal, canvas.height - 5);
  }
}

function showCurrentPlayer() {
  if (currentIndex < playerNames.length) {
    document.getElementById('currentPlayerTitle').textContent =
      `${playerNames[currentIndex]} さん 列を選んでください`;
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
    btn.classList.add('column-button');
    btn.addEventListener('click', () => {
      chooseColumn(i);
      removeColumnButton(i);
    });
    startButtons.appendChild(btn);
  }
}

function chooseColumn(colIndex) {
  choices[currentIndex] = colIndex; //選んだ列だけ記録
  chosen_col[colIndex] = playerNames[currentIndex];
  currentIndex++;
  drawAmida();
  if (currentIndex < playerNames.length) {
    showCurrentPlayer();
  } else {
    //全員選び終わり
    startSequentialAnimation(0);
  }
}

function removeColumnButton(colIndex) {
  const col_btn = document.getElementById(`column-${colIndex}`);
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
  document.getElementById('currentPlayerTitle').textContent = `${playerNames[i]} さんの番です！`;
  const btn = document.createElement('button');
  btn.textContent = `スタート`;
  btn.classList.add('start-button');
  btn.addEventListener('click', (e) => {
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
  let idx = 0;
  let horizontalPassageFunction;

  const interval = setInterval(() => {
    if (state === "down") {
      // 横線チェック
      const nearPassageFunction = mathematicalFunctions.find(mF =>
        (mF.functionPassage.x.from === xIndex && Math.abs(mF.functionPassage.y.from - y) < 2) || (mF.functionPassage.x.to === xIndex && Math.abs(mF.functionPassage.y.to - y) < 2)
      );
      if (nearPassageFunction) {
        nearPassageFunction.functionPassage.boxVisible = false;
        // 横移動に切り替え
        if (nearPassageFunction.functionPassage.x.from === xIndex) {
          xIndex = nearPassageFunction.functionPassage.x.to;
          idx = 0;
        } else if (nearPassageFunction.functionPassage.x.to === xIndex) {
          xIndex = nearPassageFunction.functionPassage.x.from;
          idx = nearPassageFunction.functionPoints.length - 1;
        }
        targetX = columnWidth * (xIndex + 1);
        horizontalPassageFunction = nearPassageFunction;
        state = "horizontal";
      } else {
        y += step; // 縦移動
      }
    } else if (state === "horizontal") {
      // 横線を徐々に移動
      let dx = targetX - x;
      if ((Math.sign(dx) >= 0 && idx >= horizontalPassageFunction.functionPoints.length) || (Math.sign(dx) <= 0 && idx <= -1)) {
        state = "down"; // 横移動終わり
        y += step + 1;
      } else {
        p = horizontalPassageFunction.functionPoints[idx];
        x = p.x;
        y = p.y;
        idx += Math.sign(dx);
      }
    }
    drawAmida();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();

    if (y > canvas.height - 20) {
      clearInterval(interval);
      callback(x);
    }
  }, 16);
}