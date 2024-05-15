document.addEventListener('DOMContentLoaded', () => {
    // ゲーム盤の初期化
    const gameBoard = Array.from({ length: 25 }, (_, i) => i);
  
    // 現在のターンを追跡するための変数
    let turn = 0;
  
    // プレイヤーの記号を定義する配列
    const players = ['o', 'x', '△'];
  
    // HTMLのゲーム盤要素を取得
    const boardElement = document.getElementById('gameBoard');
  
    // メッセージ表示エリアの要素を取得
    const messageElement = document.getElementById('message');
  
    // リセットボタンの要素を取得
    const resetButton = document.getElementById('resetButton');
  
    // ルール表示エリアの要素を取得
    const rulesElement = document.getElementById('rules');
  
    // ゲーム盤を作成する関数
    function createBoard() {
      gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', () => handleCellClick(index));
        cellElement.textContent = typeof cell === 'number' ? '' : cell;
        boardElement.appendChild(cellElement);
      });
    }
  
    function handleCellClick(index) {
        // 勝者が決まっている場合は処理を無視する
        if (messageElement.textContent.includes('勝ち') || messageElement.textContent.includes('引き分け')) {
          return;
        }
      
        if (typeof gameBoard[index] === 'number') {
          const player = players[turn % 3];
      
          // 1周目のoとxは中心の9マスは選択することができません
          if (turn < 3 && player !== '△' && (5 < index && index < 10 || 10 < index && index < 15 || 15 < index && index < 20)) {
            return;
          }
      
          // 1周目の△は真ん中のマスを選択することはできません
          if (turn < 3 && player === '△' && index === 12) {
            return;
          }
      
          gameBoard[index] = player;
          const cellElement = document.querySelector(`.cell[data-index='${index}']`);
          cellElement.textContent = player;
          cellElement.classList.add(player); // プレイヤーの記号に応じたクラスを追加
          turn++;
          checkWinner();
        }
      }
      
      function checkWinner() {
        const winPatterns = [
          [0, 1, 2], [1, 2, 3], [2, 3, 4], [5, 6, 7], [6, 7, 8], [7, 8, 9],
          [10, 11, 12], [11, 12, 13], [12, 13, 14], [15, 16, 17], [16, 17, 18], [17, 18, 19],
          [20, 21, 22], [21, 22, 23], [22, 23, 24], [0, 5, 10], [5, 10, 15], [10, 15, 20],
          [1, 6, 11], [6, 11, 16], [11, 16, 21], [2, 7, 12], [7, 12, 17], [12, 17, 22],
          [3, 8, 13], [8, 13, 18], [13, 18, 23], [4, 9, 14], [9, 14, 19], [14, 19, 24],
          [2, 8, 14], [1, 7, 13], [7, 13, 19], [0, 6, 12], [6, 12, 18], [12, 18, 24],
          [5, 11, 17], [11, 17, 23], [10, 16, 22], [2, 6, 10], [3, 7, 11], [7, 11, 15],
          [4, 8, 12], [8, 12, 16], [12, 16, 20], [9, 13, 17], [13, 17, 21], [14, 18, 22]
        ];
      
        for (const pattern of winPatterns) {
          const [a, b, c] = pattern;
          if (gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            messageElement.textContent = `${gameBoard[a]}の勝ちです!!`;
            boardElement.removeEventListener('click', handleCellClick); // ゲームを終了するためイベントリスナーを削除
            return;
          }
        }
      
        if (turn === 25) {
          messageElement.textContent = '引き分けです!';
          boardElement.removeEventListener('click', handleCellClick); // ゲームを終了するためイベントリスナーを削除
        }
      }

    // メッセージを更新する関数
    function updateTurnMessage() {
      const currentPlayer = players[turn % 3];
      messageElement.textContent = `次は${turn % 3 + 1}人目(${currentPlayer})の方です。`;
    }
  
    // ゲーム盤をリセットする関数
    function resetBoard() {
      // ゲーム盤を初期化
      gameBoard.forEach((_, i) => gameBoard[i] = i);
      turn = 0;
      boardElement.innerHTML = '';
      messageElement.textContent = '';
      createBoard();
      updateTurnMessage();
    }
  
    // リセットボタンにイベントリスナーを追加
    resetButton.addEventListener('click', resetBoard);
  
    // ルールを表示
    rulesElement.innerHTML = `
      <h3>【ルール】</h3>
      <ul>
        <li>1ターン目のoとxの方は中心の9マスは選択することができません</li>
        <li>1ターン目の△の方は真ん中のマスを選択することはできません</li>
        <li>縦、横、斜めのいずれかに同じ記号が3マス並んだら勝ちです</li>
        <li>勝者が決定せずに全マス埋まった場合は引き分けです</li>
      </ul>
    `;
  
    // ゲーム盤を作成
    createBoard();
    updateTurnMessage();
  });