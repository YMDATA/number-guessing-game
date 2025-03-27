// ゲームの状態を管理するオブジェクト
const game = {
    answer: '',
    attempts: 0,
    isGameOver: false
};

// DOM要素
const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const resultArea = document.getElementById('result-area');
const attemptsDisplay = document.getElementById('attempts');

// ゲームの初期化
function initGame() {
    // 0-9の数字から重複なしで3つ選ぶ
    const digits = [];
    while (digits.length < 3) {
        const num = Math.floor(Math.random() * 10).toString();
        if (!digits.includes(num)) {
            digits.push(num);
        }
    }
    game.answer = digits.join('');
    game.attempts = 0;
    game.isGameOver = false;
    updateAttemptsDisplay();
    resultArea.innerHTML = '';
    guessInput.value = '';
    guessInput.focus();
}

// 試行回数を更新
function updateAttemptsDisplay() {
    attemptsDisplay.textContent = `試行回数: ${game.attempts}`;
}

// ヒット＆ブローの判定
function checkGuess(guess) {
    let hits = 0;
    let blows = 0;

    for (let i = 0; i < 3; i++) {
        if (guess[i] === game.answer[i]) {
            hits++;
        } else if (game.answer.includes(guess[i])) {
            blows++;
        }
    }

    return { hits, blows };
}

// 入力バリデーション
function validateInput(input) {
    if (input.length !== 3) {
        return '3桁の数字を入力してください';
    }

    if (!/^\d{3}$/.test(input)) {
        return '数字のみ入力してください';
    }

    if (new Set(input.split('')).size !== 3) {
        return '数字は重複しないでください';
    }

    return null;
}

// 結果を表示
function displayResult(guess, result) {
    const resultElement = document.createElement('div');
    resultElement.className = 'result-item';
    resultElement.innerHTML = `
        <span class="guess">${guess}</span>:
        <span class="hits">${result.hits}ヒット</span>,
        <span class="blows">${result.blows}ブロー</span>
    `;
    resultArea.prepend(resultElement);
}

// ゲームクリア時の処理
function handleGameClear() {
    game.isGameOver = true;
    resultArea.innerHTML = `
        <div class="success">正解です！答えは ${game.answer} でした</div>
        <button id="restart-btn">もう一度プレイ</button>
    `;
    document.getElementById('restart-btn').addEventListener('click', initGame);
}

// イベントリスナー
submitBtn.addEventListener('click', () => {
    if (game.isGameOver) return;

    const guess = guessInput.value.trim();
    const error = validateInput(guess);

    if (error) {
        resultArea.innerHTML = `<div class="error">${error}</div>`;
        return;
    }

    game.attempts++;
    updateAttemptsDisplay();

    const result = checkGuess(guess);
    displayResult(guess, result);

    if (result.hits === 3) {
        handleGameClear();
    } else {
        guessInput.value = '';
        guessInput.focus();
    }
});

// エンターキーでも送信できるようにする
guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitBtn.click();
    }
});

// ゲーム開始
initGame();
