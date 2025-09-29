const gameHandler = require('../domain/game.js');
const playerHandler = require('../domain/player.js');
const { logger } = require('../config');

exports.getGames = (req, res) => {
    //Only id
    const games = gameHandler.getGames();
    res.status(200).json(games.map(g => g.id ?? g._id));

    //Full games
    //res.status(200).json(gameHandler.getGames());
}

exports.findGameById = (req, res) => {
    res.status(200).json(gameHandler.findGameById(req.params.id));
}

exports.createGame = (req, res) => {
    //res.json(gameHandler.findGameById(req.params.id));
    const game = gameHandler.createGame();
    res.status(200).json(JSON.stringify(game));
}

exports.joinGame = (req, res) => {
    const game = games.find( game => game.id == req.params.game );
    if(game.player1 == "missing"){
        game.player1 = req.params.player;
    }else if(game.player2 == "missing"){
        game.player2 = req.params.player;
    }
    logger.info(game);
    res.status(200).json(games);
}

exports.play = (req, res) => {
    logger.info(JSON.stringify(req.params))
    const id = req.params.game;
    const player = req.params.player;
    const col = req.params.col;
    const row = req.params.row;
    const game = gameHandler.play(id, player, col, row);
    res.status(200).json(game);
}