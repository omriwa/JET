
const controller = (socket, gameData) => {
    const emitValueByTurn = () => {
        socket.to(gameData.turn).emit("value", { value: gameData.value, won: gameData.winningPlayer })
    }
    const resetGameForPlayer = () => {
        gameData.value = null
        gameData.winningPlayer = null

        socket.emit("value", { value: gameData.value, won: gameData.winningPlayer })
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

            emitValueByTurn()
        }
        else {
            resetGameForPlayer()
        }

        socket.on("play", value => {
            gameData.value = Math.ceil((gameData.value + value) / 3)
            gameData.turn = gameData.turn === gameData.player1 ? gameData.player2 : gameData.player1

            if (gameData.value === 1) {
                gameData.winningPlayer = true
            }

            emitValueByTurn()
        })

        socket.on('disconnect', socket => {
            if (gameData.player1 === socket.id) {
                gameData.player1 = null

            }
            else {
                gameData.player2 = null
            }

            console.log('user disconnected');
            resetGameForPlayer()
        });
    })
}

module.exports = { controller }