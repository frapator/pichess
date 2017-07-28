class PiecesSet {

	constructor(pBoardWidth, pBoardHeight) {
		this.PIECE_WIDTH = 333;
    	this.PIECE_HEIGHT = 333;
		this.PIECE_X_SCALE = Math.floor(pBoardWidth / 8) / 333;
		this.PIECE_Y_SCALE = Math.floor(pBoardHeight / 8) / 333;

		this.spritesGroup = [];
	}
	
	preload() {
		game.load.spritesheet("background", "assets/Chess_Pieces_Sprite.svg.png", this.PIECE_WIDTH, this.PIECE_HEIGHT);
	}

	prepare() {

	}

	static GetFrameIndex(pType, pColor) {
		var lFrameIndex = pType.index;
		if (pColor == COLOR_ENUM.NOIR) lFrameIndex += 6;
		return lFrameIndex;
	}

	SetSprite(pPiece, pScreenPos, pFrameIndex) {
		//console.log("ajout piece " + pPiece + " frame:" + pFrameIndex);
		// l'affichage
		var lSprite = game.add.sprite(pScreenPos.x, pScreenPos.y, "background", pFrameIndex);
		lSprite.scale.setTo(this.PIECE_X_SCALE, this.PIECE_Y_SCALE);
		lSprite.piece = pPiece; // pointeurs croisés
		pPiece.sprite = lSprite;

		// l'evenementiel 
		lSprite.inputEnabled = true;
		lSprite.input.enableDrag(true);
		lSprite.events.onDragStart.add(myController.onDragStart, pPiece);
		lSprite.events.onDragStop.add(myController.onDragStop, pPiece);
	}

	SetDragDrop(pPiece, pFlag) {
		pPiece.sprite.inputEnabled = pFlag;
	}

}