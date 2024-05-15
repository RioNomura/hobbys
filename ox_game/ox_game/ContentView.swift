import SwiftUI

struct ContentView: View {
    @State private var gameBoard = Array(0...24).map { "\($0)" }
    @State private var currentPlayer = "o"
    @State private var winner: String? = nil
    @State private var turn = 0
    @State private var showAlert = false

    let winningLines: [[Int]] = [
        // 横列の勝ち手
        [0, 1, 2],[1, 2, 3],[2, 3, 4],
        [5, 6, 7],[6, 7, 8],[7, 8, 9],
        [10, 11, 12],[11, 12, 13],[12, 13, 14],
        [15, 16, 17],[16, 17, 18],[17, 18, 19],
        [20, 21, 22],[21, 22, 23],[22, 23, 24],
        // 縦列の勝ち手
        [0, 5, 10],[5, 10, 15],[10, 15, 20],
        [1, 6, 11],[6, 11, 16],[11, 16, 21],
        [2, 7, 12],[7, 12, 17],[12, 17, 22],
        [3, 8, 13],[8, 13, 18],[13, 18, 23],
        [4, 9, 14],[9, 14, 19],[14, 19, 24],
        // 右下斜め列の勝ち手
        [2, 8, 14],[1, 7, 13],[7, 13, 19],
        [0, 6, 12],[6, 12, 18],[12, 18, 24],
        [5, 11, 17],[11, 17, 23],[10, 16, 22],
        // 左下斜め列の勝ち手
        [2, 6, 10],[3, 7, 11],[7, 11, 15],
        [4, 8, 12],[8, 12, 16],[12, 16, 20],
        [9, 13, 17],[13, 17, 21],[14, 18, 22]
    ]

    var body: some View {
        VStack {
            Text("現在のプレイヤー: \(currentPlayer)")
                .font(.title)
                .padding()
            ForEach(0..<5) { row in
                HStack {
                    ForEach(0..<5) { column in
                        let index = row * 5 + column
                        Button(action: {
                            makeMove(at: index)
                        }) {
                            Text(gameBoard[index])
                                .frame(width: 50, height: 50)
                                .background(Color.gray.opacity(0.2))
                                .border(Color.black)
                                .foregroundColor(colorForSymbol(symbol: gameBoard[index]))
                        }
                    }
                }
            }
            if let winner = winner {
                Text("\(winner)の勝ちです!!")
                    .font(.largeTitle)
                    .padding()
            }
        }
        .alert(isPresented: $showAlert) {
            Alert(
                title: Text("ゲーム終了"),
                message: Text(winner != nil ? "\(winner!)の勝ちです!!" : "引き分けです"),
                primaryButton: .default(Text("再スタート"), action: resetGame),
                secondaryButton: .cancel(Text("キャンセル"))
            )
        }
    }

    func makeMove(at index: Int) {
        guard gameBoard[index] != "o" && gameBoard[index] != "x" && gameBoard[index] != "△", winner == nil else {
            return
        }

        if turn < 3 {
            if !isValidMove(index: index, player: currentPlayer) {
                return
            }
        }

        gameBoard[index] = currentPlayer

        if checkWinner() {
            winner = currentPlayer
            showAlert = true
        } else if turn == 24 {
            showAlert = true
        } else {
            turn += 1
            switch currentPlayer {
            case "o":
                currentPlayer = "x"
            case "x":
                currentPlayer = "△"
            default:
                currentPlayer = "o"
            }
        }
    }

    func isValidMove(index: Int, player: String) -> Bool {
        if turn == 0 && player == "o" {
            return index <= 4 || index % 5 == 0 || index % 5 == 4 || index == 20 || index == 24 || index == 21 || index == 22 || index == 23
        } else if turn == 1 && player == "x" {
            return index <= 4 || index % 5 == 0 || index % 5 == 4 || index == 20 || index == 24 || index == 21 || index == 22 || index == 23
        } else if turn == 2 && player == "△" {
            return index != 12
        }
        return true
    }

    func checkWinner() -> Bool {
        for line in winningLines {
            let a = line[0], b = line[1], c = line[2]
            if gameBoard[a] == gameBoard[b] && gameBoard[a] == gameBoard[c] {
                return true
            }
        }
        return false
    }

    func resetGame() {
        gameBoard = Array(0...24).map { "\($0)" }
        currentPlayer = "o"
        winner = nil
        turn = 0
    }

    func colorForSymbol(symbol: String) -> Color {
        switch symbol {
        case "o":
            return .red
        case "x":
            return .blue
        case "△":
            return .green
        default:
            return .black
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
