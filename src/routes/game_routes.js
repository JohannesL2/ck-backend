const router = require('express').Router();
const gameController = require('../controllers/game_controller.js')
const userController = require('../controllers/player_controller.js')

/**
 * @swagger
 * /games:
 *   get:
 *     tags:
 *       - Games
 *     description: Retrieve a list of games
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of game objects
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Game'
 *       500:
 *         description: Internal server error
 */
router.get('/games', gameController.getGames);

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     tags:
 *       - Games
 *     description: Retrieve a game by its UUID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: UUID of the game to retrieve
 *         in: path
 *         required: true
 *         type: string
 *         format: uuid
 *         #enum:
 *         #  - "015cdc04-4d22-46f7-8d8e-f1879bb9bf1b"
 *         #  - "88aaf28d-7fef-4028-9e94-7fdbbbd662a0"
 *         #  - "6d3e9d43-9d19-4fb5-a684-b8514f0e4810"
 *         #  - "ebdf150a-4740-42ea-a5a7-dfce2f6f3725"
 *         #  - "6d8fbefa-c1ed-4401-b7b1-894581d84798"
 *         #  - "a451aa61-76f0-4cd0-bb37-8594512d7bde"
 *     responses:
 *       200:
 *         description: A game object
 *         schema:
 *           $ref: '#/definitions/Game'
 *       404:
 *         description: Game not found
 *       500:
 *         description: Internal server error
 */
router.get('/game/:id', gameController.findGameById);

/**
 * @swagger
 * /game/add:
 *   get:
 *     tags:
 *       - Games
 *     description: Adds a new game with a name
 *     responses:
 *       200:
 *         description: Game successfully added
 *         schema:
 *           $ref: '#/definitions/Game'
 *       400:
 *         description: Bad request (e.g., missing name data)
 *       500:
 *         description: Server error
 */
router.get('/games/add', gameController.createGame);

/**
 * @swagger
 * /player/join/{game}/{player}:
 *   get:   # Again, consider changing this to PUT or POST as recommended earlier.
 *     tags:
 *       - Players
 *     description: Allows a player to join a game
 *     parameters:
 *       - in: path
 *         name: game
 *         description: ID of the game to join
 *         required: true
 *         type: string
 *         format: uuid
 *       - in: path
 *         name: player
 *         description: User ID of the player joining the game
 *         required: true
 *         type: string
 *         format: uuid
 *     responses:
 *       200:
 *         description: Successfully joined the game
 *         schema:
 *           $ref: '#/definitions/Game'
 *       400:
 *         description: Bad request (e.g., invalid game or player ID)
 *       403:   # or 409 depending on your preference
 *         description: Game is already full
 *       404:
 *         description: Game or player not found
 *       500:
 *         description: Server error
 */
router.get('/player/join/:game/:player', gameController.joinGame);

/**
 * @swagger
 * /player/play/{game}/{player}/{col}/{row}:
 *   get:  # Consider changing this to PUT or POST for semantic clarity.
 *     tags:
 *       - Players
 *     description: Allows a player to lay a piece on a specific tile identified by its column and row
 *     parameters:
 *       - in: path
 *         name: game
 *         description: ID of the game
 *         required: true
 *         type: string
 *         format: uuid
 *       - in: path
 *         name: player
 *         description: User ID of the player making the move
 *         required: true
 *         type: string
 *         format: uuid
 *       - in: path
 *         name: col
 *         description: Column number of the tile
 *         required: true
 *         type: integer
 *       - in: path
 *         name: row
 *         description: Row number of the tile
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully laid the piece
 *         schema:
 *           $ref: '#/definitions/Game'
 *       400:
 *         description: Bad request (e.g., invalid game, player, column or row data)
 *       409:
 *         description: Conflict - various reasons, such as tile not free, not the player's turn, game still waiting for another player, or a player cancelled
 *       500:
 *         description: Server error
 */
router.get('/player/play/:game/:player/:col/:row', gameController.play);

/**
 * @swagger
 * /player/create/:
 *   get:  # It's more appropriate to use POST here since it's a creation operation.
 *     tags:
 *       - Players
 *     description: Creates a new player and returns an ID along with a random user ID
 *     responses:
 *       201:
 *         description: Player successfully created
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: The ID of the newly created player
 *             userId:
 *               type: string
 *               format: uuid
 *               description: Randomly generated user ID for the player
 *       500:
 *         description: Server error
 */
router.get('/player/create/', userController.createPlayer);

module.exports = router

/**
 * @swagger
 * definitions:
 *   Game:
 *     type: object
 *     required:
 *       - id
 *       - name
 *       - round
 *       - player
 *       - state
 *       - board
 *     properties:
 *       id:
 *         type: string
 *         format: uuid
 *       name:
 *         type: string
 *       round:
 *         type: integer
 *       player:
 *         type: integer
 *       player1:
 *         $ref: '#/definitions/User'
 *         nullable: true
 *       player2:
 *         $ref: '#/definitions/User'
 *         nullable: true
 *       state:
 *         type: string
 *         enum: [waiting, playing, black, white, tie, cancelled]
 *       board:
 *         $ref: '#/definitions/Board'
 *   Board:
 *     type: object
 *     properties:
 *       minInRow:
 *         type: integer
 *       cols:
 *         type: integer
 *         default: 16
 *       rows:
 *         type: integer
 *         default: 16
 *       tiles:
 *         $ref: '#/definitions/Tiles'
 *   Tiles:
 *     type: array
 *     items:
 *       type: array
 *       items:
 *         type: integer
 *       minItems: 5
 *       maxItems: 16
 *     minItems: 5
 *     maxItems: 16
 *   User:
 *     type: object
 *     required:
 *       - id
 *       - name
 *     properties:
 *       id:
 *         type: string
 *         format: uuid
 *       name:
 *         type: string
 */