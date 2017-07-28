class Move {

	constructor(pPiece, pStartPosition, pTargetPosition, pPriseEnPassantPosition, pTakenPiece = null) {
		this.Piece = pPiece;
		this.StartPosition = pStartPosition;
		this.TargetPosition = pTargetPosition;
		this.PriseEnPassantPosition = pPriseEnPassantPosition;
		this.TakenPiece = pTakenPiece;
	}

	toString() {
		return this.Piece.Type.fr + this.TargetPosition;
	}

	Desc() {
		return "Move: " + this.Piece.Type.name + " " + this.StartPosition + " -> " + this.TargetPosition + " PeP:" + this.PriseEnPassantPosition;
	}
}