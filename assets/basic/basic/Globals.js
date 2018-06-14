window.Game = {
    GameManager: null,
    ItemManager: null,
    PlayerManager: null
}

window.GameState = cc.Enum({
    None: 0,
    Pause: 1,
    Play: 2,
    Over: 3
})

window.DirectState = cc.Enum({
    None: 0,
    Left: 1,
    Right: 2
})

window.GLB = {
    RANDOM_MATCH: 1,
    PROPERTY_MATCH: 2,
    COOPERATION: 1,
    COMPETITION: 2,
    MAX_PLAYER_COUNT: 2,

    PLAYER_COUNTS: [2],

    GAME_START_EVENT: "gameStart",
    GAME_OVER_EVENT: "gameOver",
    READY: "ready",
    ROUND_START: "roundStar",
    SCORE_EVENT: "score",
    GO_EVENT: "go",
    ITEM_GET: "itemGet",// 缩小药
    DIRECTION_START_EVENT: "direction_start_event",
    DIRECTION_EVENT: "direction_event",

    channel: 'MatchVS',
    platform: 'alpha',
    gameId: 201409,
    gameVersion: 1,
    appKey: '311842dafe7846418420fc37886f97bf',
    secret: '688468ba92ce462fa97b286d4a30f3d3',

    matchType: 1,
    gameType: 2,
    userInfo: null,
    playerUserIds: [],
    isRoomOwner: false,

    syncFrame: true,
    FRAME_RATE: 10,

    NormalBulletSpeed: 1000,
    limitX: 415
}
