class Rules {

	constructor() {
	
		
	
	}
	
	GetStartupPieces() {
		
		var lPiecesList = [];

		// pieces blanches
		var lStartWhitePieces = [[PIECE_ENUM.KING,4,0],[PIECE_ENUM.QUEEN,3,0],[PIECE_ENUM.BISHOP,2,0],[PIECE_ENUM.BISHOP,5,0],[PIECE_ENUM.KNIGHT,1,0],[PIECE_ENUM.KNIGHT,6,0],[PIECE_ENUM.ROOK,0,0],[PIECE_ENUM.ROOK,7,0],
								 [PIECE_ENUM.PAWN,4,1],[PIECE_ENUM.PAWN,3,1],[PIECE_ENUM.PAWN,2,1],[PIECE_ENUM.PAWN,5,1],[PIECE_ENUM.PAWN,1,1],[PIECE_ENUM.PAWN,6,1],[PIECE_ENUM.PAWN,0,1],[PIECE_ENUM.PAWN,7,1]];
		// jeu de test
		//lStartWhitePieces = [[PIECE_ENUM.KING,4,0],[PIECE_ENUM.QUEEN,3,0],[PIECE_ENUM.ROOK,0,0],[PIECE_ENUM.ROOK,7,0]];
	
		for (var i = 0; i < lStartWhitePieces.length; i++) {
			var lPieceData = lStartWhitePieces[i];
			var lPiece = new Piece(lPieceData[0], lPieceData[1], lPieceData[2], COLOR_ENUM.BLANC);
			lPiecesList.push(lPiece);
		}
	
		// pieces noires	
		var lStartBlackPieces = [[PIECE_ENUM.KING,4,7],[PIECE_ENUM.QUEEN,3,7],[PIECE_ENUM.BISHOP,2,7],[PIECE_ENUM.BISHOP,5,7],[PIECE_ENUM.KNIGHT,1,7],[PIECE_ENUM.KNIGHT,6,7],[PIECE_ENUM.ROOK,0,7],[PIECE_ENUM.ROOK,7,7],
								 [PIECE_ENUM.PAWN,4,6],[PIECE_ENUM.PAWN,3,6],[PIECE_ENUM.PAWN,2,6],[PIECE_ENUM.PAWN,5,6],[PIECE_ENUM.PAWN,1,6],[PIECE_ENUM.PAWN,6,6],[PIECE_ENUM.PAWN,0,6],[PIECE_ENUM.PAWN,7,6]];
		// jeu de test
		//lStartBlackPieces = [[PIECE_ENUM.KING,4,7],[PIECE_ENUM.QUEEN,3,7]];
		
		for (var i = 0; i < lStartBlackPieces.length; i++) {
			var lPieceData = lStartBlackPieces[i];
			var lPiece = new Piece(lPieceData[0], lPieceData[1], lPieceData[2], COLOR_ENUM.NOIR);
			lPiecesList.push(lPiece);
		}
		
		return lPiecesList;
	}

	GetBishopMovesList(pBoard, pPiece) {
		//console.log("get bishop moves list de " + pPiece);
		var lMovesList = [];
		var lTargetColor;
		var lY1 = pPiece.BoardPosition.y + 1;
		var lY2 = pPiece.BoardPosition.y - 1;
		var lDiag1BlockedFlag = false;
		var lDiag2BlockedFlag = false;
		var lDiag3BlockedFlag = false;
		var lDiag4BlockedFlag = false;
		var lPos;
		for (var lX = pPiece.BoardPosition.x + 1; lX <= 7; lX ++) {
			if (lY1 <= 7 ) { // X+ Y+
				lTargetColor = pBoard.GetColor(new Position(lX, lY1));
				if (lTargetColor && lTargetColor == pPiece.Color) lDiag1BlockedFlag = true;
				if (! lDiag1BlockedFlag) {
					lPos = new Position(lX, lY1 ++);
					lMovesList.push(lPos);
				}
				if (lTargetColor && lTargetColor != pPiece.Color) lDiag1BlockedFlag = true;
			}
			if (lY2 >= 0 ) { // X+ Y-
				lTargetColor = pBoard.GetColor(new Position(lX, lY2));
				if (lTargetColor && lTargetColor == pPiece.Color) lDiag2BlockedFlag = true;
				if (! lDiag2BlockedFlag) {
					lPos = new Position(lX, lY2 --);
					lMovesList.push(lPos);
				}
				if (lTargetColor && lTargetColor != pPiece.Color) lDiag2BlockedFlag = true;
			}
		}
		var lY3 = pPiece.BoardPosition.y + 1;
		var lY4 = pPiece.BoardPosition.y - 1;
		for (lX = pPiece.BoardPosition.x - 1; lX >= 0; lX --) {
			if (lY3 <= 7 ) { // X- Y+
				lTargetColor = pBoard.GetColor(new Position(lX, lY3));
				if (lTargetColor && lTargetColor == pPiece.Color) lDiag3BlockedFlag = true;
				if (! lDiag3BlockedFlag) {
					lPos = new Position(lX, lY3 ++);
					lMovesList.push(lPos);
				}
				if (lTargetColor && lTargetColor != pPiece.Color) lDiag3BlockedFlag = true;
			}
			if (lY4 >= 0 ) { // X- Y-
				lTargetColor = pBoard.GetColor(new Position(lX, lY4));
				if (lTargetColor && lTargetColor == pPiece.Color) lDiag4BlockedFlag = true;
				if (! lDiag4BlockedFlag) {
					lPos = new Position(lX, lY4 --);
					lMovesList.push(lPos);
				}
				if (lTargetColor && lTargetColor != pPiece.Color) lDiag4BlockedFlag = true;
			}
		}
		return lMovesList;
	}
	
	GetRookMovesList(pBoard, pPiece) {
		var lMovesList = [];
		//console.log("get rook moves list de " + pPiece);
		
		// coups à droite
		var lBlockedFlag = false;
		var lTargetColor;
		var lPos;
		for (var lX = pPiece.BoardPosition.x + 1; lX <= 7; lX ++) {
			//LOGS.push("test " + lX);
			lTargetColor = pBoard.GetColor(new Position(lX, pPiece.BoardPosition.y));
			if (lTargetColor && lTargetColor == pPiece.BoardPosition.Color) lBlockedFlag = true;
			if (! lBlockedFlag) {
				lPos = new Position(lX, pPiece.BoardPosition.y);
				lMovesList.push(lPos);
			}
			if (lTargetColor && lTargetColor != pPiece.BoardPosition.Color) lBlockedFlag = true;
		}

		// coups à gauche
		lBlockedFlag = false;
		for (var lX = pPiece.BoardPosition.x - 1; lX >= 0; lX --) {
			lTargetColor = pBoard.GetColor(new Position(lX, pPiece.BoardPosition.y));
			if (lTargetColor && lTargetColor == pPiece.Color) lBlockedFlag = true;
			if (! lBlockedFlag) {
				lPos = new Position(lX, pPiece.BoardPosition.y);
				lMovesList.push(lPos);
			}
			if (lTargetColor && lTargetColor != pPiece.BoardPosition.Color) lBlockedFlag = true;
		}

		// coups à en bas
		lBlockedFlag = false;
		for (var lY = pPiece.BoardPosition.y + 1; lY <= 7; lY ++) {
			lTargetColor = pBoard.GetColor(new Position(pPiece.BoardPosition.x, lY));
			if (lTargetColor && lTargetColor == pPiece.Color) lBlockedFlag = true;
			if (! lBlockedFlag) {
				lPos = new Position(pPiece.BoardPosition.x, lY);
				lMovesList.push(lPos);
			}
			if (lTargetColor && lTargetColor != pPiece.BoardPosition.Color) lBlockedFlag = true;
		}

		// coups à en haut
		lBlockedFlag = false;
		for (var lY = pPiece.BoardPosition.y - 1; lY >= 0; lY --) {
			lTargetColor = pBoard.GetColor(new Position(pPiece.BoardPosition.x, lY));
			if (lTargetColor && lTargetColor == pPiece.Color) lBlockedFlag = true;
			if (! lBlockedFlag) {
				lPos = new Position(pPiece.BoardPosition.x, lY);
				lMovesList.push(lPos);
			}
			if (lTargetColor && lTargetColor != pPiece.BoardPosition.Color) lBlockedFlag = true;
		}

		return lMovesList;
	}
	
	GetFreeMovesList(pBoard, pPiece) {
		var lMovesList = [];
		//console.log("get free moves for " + pPiece);
		var lDeltaY;
		if (pPiece.Color == COLOR_ENUM.BLANC) {
			lDeltaY = 1;
		} else {
			lDeltaY = -1;
		}
		switch (pPiece.Type) {
			case PIECE_ENUM.PAWN:
				// cas des deplacement de 2 cases et des prises du pion
				var lPos = new Position(pPiece.BoardPosition.x, pPiece.BoardPosition.y + lDeltaY);
				lMovesList.push(lPos);
				if (! pPiece.HasMoved()) {
					// on autorise l'avance de 2 cases
					lPos = new Position(pPiece.BoardPosition.x, pPiece.BoardPosition.y + 2 * lDeltaY);
					lMovesList.push(lPos);
				}
				if (pPiece.BoardPosition.x + 1 <= 7) {
					// prise coté roi
					lPos = new Position(pPiece.BoardPosition.x + 1, pPiece.BoardPosition.y + lDeltaY);
					lMovesList.push(lPos);
				}
				if (pPiece.BoardPosition.x - 1 >= 0) {
					// prise coté dame
					lPos = new Position(pPiece.BoardPosition.x - 1, pPiece.BoardPosition.y + lDeltaY);
					lMovesList.push(lPos);
				}
				break;

			case PIECE_ENUM.KNIGHT:
				var lPos = new Position(pPiece.BoardPosition.x + 2, pPiece.BoardPosition.y + 1);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x + 2, pPiece.BoardPosition.y - 1);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x + 1, pPiece.BoardPosition.y + 2);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x + 1, pPiece.BoardPosition.y - 2);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x - 2, pPiece.BoardPosition.y + 1);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x - 2, pPiece.BoardPosition.y - 1);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x - 1, pPiece.BoardPosition.y + 2);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x - 1, pPiece.BoardPosition.y - 2);
				lMovesList.push(lPos);
				break;

			case PIECE_ENUM.BISHOP:
				return this.GetBishopMovesList(pBoard, pPiece);
				break;

			case PIECE_ENUM.ROOK:
				return this.GetRookMovesList(pBoard, pPiece);
				break;

			case PIECE_ENUM.QUEEN:
				var lBishopMoves = this.GetBishopMovesList(pBoard, pPiece);
				var lRookMoves = this.GetRookMovesList(pBoard, pPiece);
				return lBishopMoves.concat(lRookMoves);
				break;

			case PIECE_ENUM.KING:
				var lPos = new Position(pPiece.BoardPosition.x + 1, pPiece.BoardPosition.y - 1);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x + 1, pPiece.BoardPosition.y);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x + 1, pPiece.BoardPosition.y + 1);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x, pPiece.BoardPosition.y + 1);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x, pPiece.BoardPosition.y - 1);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x - 1, pPiece.BoardPosition.y - 1);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x - 1, pPiece.BoardPosition.y);
				lMovesList.push(lPos);
				lPos = new Position(pPiece.BoardPosition.x - 1, pPiece.BoardPosition.y + 1);
				lMovesList.push(lPos);
				// ajout des roques
				if (! pPiece.HasMoved()) {
					lPos = new Position(pPiece.BoardPosition.x + 2, pPiece.BoardPosition.y);
					lMovesList.push(lPos);
					lPos = new Position(pPiece.BoardPosition.x - 2, pPiece.BoardPosition.y);
					lMovesList.push(lPos);
				}
				break;

		}

		return lMovesList;
	}
		
	GetCastleRookIndex(pColor, pCastlShortFlag) {
		//LOGS.push("recherche tour " + pColor + " " + (pCastlShortFlag ? "court" : "long"));
		var lIndex;
		if (pColor == COLOR_ENUM.BLANC) {
			if (pCastlShortFlag) {
				lIndex = 7;
				//lIndex = 3; pour le jeu de test
			} else {
				lIndex = 6;
				//lIndex = 2; pour le jeu de test		
			}
		} else if (pColor == COLOR_ENUM.NOIR) {
			if (pCastlShortFlag) {
				lIndex = 23;
			} else {
				lIndex = 22;
			}
		} else {
			return null
		}
		return lIndex;
	}
	
	GetPromotionRankIndex(pColor) {
		if (pColor == COLOR_ENUM.BLANC) {
			return 7;
		} else {
			return 0;
		}
	}

}