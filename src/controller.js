
const controller = (socket, gameData) => {
    const emitValueByTurn = () => socket.to(gameData.turn).emit("value", gameData.value)
    
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

  socket.on("play", value => {
    gameData.value = Math.ceil((gameData.value + value) / 3)
    gameData.turn = gameData.turn === gameData.player1 ? gameData.player2 : gameData.player1

    emitValueByTurn()
  })

  socket.on('disconnect', socket => {
    console.log('user disconnected');

    if (gameData.player1 === socket.id) {
      gameData.player1 = null
    }
    else {
      gameData.player2 = null
    }
    gameData.value = null
  });

  console.log("GAME DATA ", gameData.value)
})
}

module.exports = { controller }