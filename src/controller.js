
const controller = (socket, gameData) => {
    const emitValueByTurn = () => {
        socket.to(gameData.turn).emit("value", { value: gameData.value, won: gameData.won })
    }
    const resetGameForPlayer = () => {
        gameData.value = null
        gameData.won = null
        gameData.turn = null

        socket.emit("value", { value: gameData.value, won: gameData.won })
    }
    const otherPlayerConnected = () => socket.emit("other-player-connected")
    const otherPlayerdDisconnected = (player) => socket.to(player).emit("other-player-disconnected")
    const restartGame = () => {
        if (gameData.player1 && gameData.player2) {
            gameData.value = Math.ceil(Math.random() * 100)
            gameData.won = null
            gameData.turn = gameData.turn === gameData.player1 ? gameData.player2 : gameData.player1

            emitValueByTurn()
        }
    }

    socket.on('connection', socket => {
        console.log('user connected');

        if (!gameData.player1) {
            gameData.player1 = socket.id
        }
        else {
            gameData.player2 = socket.id
        }

        if (gameData.player1 && gameData.player2) {
            gameData.value = Math.ceil(Math.random() * 100)
            gameData.turn = gameData.player2

            otherPlayerConnected()
            emitValueByTurn()
        }
        else {
            resetGameForPlayer()
        }

        socket.on("play", value => {
            if (!gameData.won) {
                gameData.value = Math.ceil((gameData.value + value) / 3)
                gameData.turn = gameData.turn === gameData.player1 && socket.id === gameData.turn ? gameData.player2 : gameData.player1

                if (gameData.value === 1) {
                    gameData.won = true
                }

                emitValueByTurn()
            }
        })

        socket.on("reset-game", () => {
            restartGame()
        })

        socket.on('disconnect', () => {
            if (gameData.player1 === socket.id) {
                gameData.player1 = null

                otherPlayerdDisconnected(gameData.player2)
            }
            else {
                gameData.player2 = null

                otherPlayerdDisconnected(gameData.player1)
            }

            console.log('user disconnected');
            resetGameForPlayer()
        });
    })
}

module.exports = { controller }