const playerHandler = require("../domain/player");

exports.createPlayer = (req, res) => {
    const user =  playerHandler.create();
    res.status(200).json(user);
}