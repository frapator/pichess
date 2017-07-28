class BoardUI {

	constructor(pBoardWidth, pBoardHeight) {
		this.upperLeftCorner = new Phaser.Point(0, 0);
		this.BOARD_COLS = 8;
    	this.BOARD_ROWS = 8;
		this.BOARD_WIDTH = pBoardWidth;
		this.BOARD_HEIGHT = pBoardHeight;
		console.log("BoardUI constructor");
	}

	SetPosition(pUpperLeftCorner) {
		this.upperLeftCorner = pUpperLeftCorner;
	}

	GetUpperLeftCorner() {
		return this.upperLeftCorner;
	}

	GetUpperRightCorner() {
			return new Phaser.Point(this.GetUpperLeftCorner().x + this.BOARD_WIDTH, this.GetUpperLeftCorner().y);
	}

	preload() {
		game.load.image("board", "assets/Board_0mGud.png");
	}

	prepare() {
		// calcul de la position 
		var lBoardPosition = new Phaser.Point(Math.round((GameWidth - this.BOARD_WIDTH) / 2), 0);
		this.SetPosition(lBoardPosition);

		// creation du sprite board
		var lBoard = game.add.sprite(this.upperLeftCorner.x, this.upperLeftCorner.y, "board");
		lBoard.scale.setTo(this.BOARD_WIDTH / lBoard.width, this.BOARD_HEIGHT / lBoard.height);
	}

	ChessBoardToScreenProjection(pPosition) {
		var lScreenPosition = new Phaser.Point();
		lScreenPosition.x = pPosition.x * Math.floor(this.BOARD_WIDTH / 8) + this.upperLeftCorner.x;
		lScreenPosition.y = (7 - pPosition.y) * Math.floor(this.BOARD_HEIGHT / 8) + this.upperLeftCorner.y;
		return lScreenPosition;
	}
	
	ScreenToChessBoardProjection(pScreenPosition) {
		var lCorner = this.GetUpperLeftCorner();
		var lX = Math.floor((pScreenPosition.x - lCorner.x)/ this.BOARD_WIDTH * 8);
		var lY = 7 - Math.floor((pScreenPosition.y - lCorner.y) / this.BOARD_HEIGHT * 8);
		var pos = new Position(lX, lY);
		return pos;
	}
	
}