class Variant {

	constructor() {

		this.clear();
	}

	clear() {
		this.MovesList = [];
		this.MoveIndex = -1;
		this.PawnMovesIndexList = [];
		this.TakeMovesIndexList = [];
	}

	AddMove(pMove) {
		this.MovesList.push(pMove);
		this.MoveIndex ++;
	}

	GetCurrentMove() {
		return this.MovesList[this.MoveIndex];
	}

	GetPreviousMove() {
		if (this.MoveIndex == 0) {
			return null;
		}
		return this.MovesList[this.MoveIndex - 1];
	}

	GetLastMove() {
		if (this.MoveIndex == 0) {
			return null;
		}
		return this.MovesList[this.MovesList.length - 1];
	}

	GetLastMovedPiece() {
		var lLastMove = this.GetLastMove();
		if (! lLastMove) {
			return null;
		}
		return lLastMove.Piece;
	}

	GetPriseEnPassantPosition() {
		var lMove = this.GetCurrentMove();
		if (! lMove) {
			return null;
		}
		return lMove.PriseEnPassantPosition;
	}

	SetPriseEnPassantPosition(pPosition) {
		var lMove = GetCurrentMove();

		lMove.PriseEnPassantPosition = pPosition;
	}

	GetLastPawnMoveIndex() {
		if (this.PawnMovesIndexList.length <= 0) { return 0; }
		return this.PawnMovesIndexList[this.PawnMovesIndexList.length - 1];
	}

	GetLastTakeMoveIndex() {
		if (this.TakeMovesIndexList.length <= 0) { return 0; }
		return this.TakeMovesIndexList[this.TakeMovesIndexList.length - 1];
	}

	GetLastMoveWithProgressIndex() {
		var lLastPawnMoveIndex = this.GetLastPawnMoveIndex();
		var lLastTakeMoveIndex = this.GetLastTakeMoveIndex();
		return Math.max(lLastTakeMoveIndex, lLastPawnMoveIndex);
	}

	SetLastPawnMoveIndex(pIndex) {
		// le tableau des MoveTurn de coups de pions
		this.PawnMovesIndexList = [];
		this.PawnMovesIndexList.push(pIndex);
	}

	SetLastTakeMoveIndex(pIndex) {
		this.TakeMovesIndexList = [];
		this.TakeMovesIndexList.push(pIndex);
	}

}