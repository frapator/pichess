class FEN {

	constructor() {

	}

	// GETTERS

	static GetPiecesFen(pBoard) {
	// la partie position des pieces
	// "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

		var lChaine = "";
		var lEmptySquaresNb = 0;
		var lPiece;
		for (var y=7; y>=0 ; y--) {
			for (var x=0; x<=7 ; x++) {
				lPiece = pBoard.GetPiece(new Position(x, y));
				if (!lPiece) {
					lEmptySquaresNb ++;
				} else {
					if (lEmptySquaresNb != 0) {
						lChaine += lEmptySquaresNb;
						lEmptySquaresNb = 0;
					}
					lChaine += lPiece.GetFenCode();
				}
			}
			if (lEmptySquaresNb != 0) {
				lChaine += lEmptySquaresNb;
				lEmptySquaresNb = 0;
			}
			if (y > 0) {
				lChaine += "/";
			}
		}

		return lChaine;
	}

	static GetCastlingFen(pBoard) {
	// 4 caracteres pour indiquer les roques possibles
		var lStr = "";

		if (! pBoard.CheckCastleCondamned(COLOR_ENUM.BLANC, true)) { lStr += "K"; }
		if (! pBoard.CheckCastleCondamned(COLOR_ENUM.BLANC, false)) { lStr += "Q"; }

		if (! pBoard.CheckCastleCondamned(COLOR_ENUM.NOIR, true)) { lStr += "k"; }
		if (! pBoard.CheckCastleCondamned(COLOR_ENUM.NOIR, false)) { lStr += "q"; }

		// valeur par défaut
		if (! lStr) { lStr= "-"; }

		return lStr;
	}

	static GetFen(pBoard) {
		// retourne le FEN de la position courante

		// exemples :
		// initiale : rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
		// apres 1.e3 :

		var lPiecesFen = FEN.GetPiecesFen(pBoard);
		var lColorFen = (pBoard.CURRENT_COLOR == COLOR_ENUM.BLANC) ? "w" : "b";
		var lCastlingFen = FEN.GetCastlingFen(pBoard);
		var lPriseEnPassantPosition = pBoard.MainVariant.GetPriseEnPassantPosition();
		var lEnPassantFen = lPriseEnPassantPosition ? lPriseEnPassantPosition : "-";
		var lHalfMoveClockFen = pBoard.TurnIndex - pBoard.MainVariant.GetLastMoveWithProgressIndex();
		var lFullMoveNbFen = 1 + Math.floor(pBoard.TurnIndex / 2);
		var lFen = lPiecesFen + " " + lColorFen + " " + lCastlingFen + " " + lEnPassantFen + " " + lHalfMoveClockFen + " " + lFullMoveNbFen;
		return lFen;
	}

	static GetInitialPositionFen() {
		return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
	}

	// SETTERS

	SetFenPosition(pFen) {
		var lFenItems = pFen.split(" ");
		this.SetPiecesFromFen(lFenItems[0]);

		var lTurnIndex = (lFenItems[5] - 1) * 2 + 1;
		var lColor;
		if(lFenItems[1].localeCompare("w") == 0) {
			lColor = COLOR_ENUM.BLANC;
		} else {
			lColor = COLOR_ENUM.NOIR;
			lTurnIndex ++;
		}
		//LOGS.push("turn index du fen : " + lTurnIndex);
		//LOGS.push("color du fen : " + lColor);

		this.SetCastlingFromFen(lFenItems[2]);

		this.SetEnPassantFromFen(lFenItems[3]);

		var lLastProgressionMoveIndex = lTurnIndex - lFenItems[4];
		//LOGS.push("lLastProgressionMoveIndex: " + lLastProgressionMoveIndex);

		this.SetTurn(lTurnIndex, lColor, lLastProgressionMoveIndex);
	}

	SetPiecesFromFen(pStr) {
		// positionner les pieces a partir du FEN

		this.ClearPieces();

		var i, c;
		var lType, lColor;
		var lX = 0;
		var lY = 7;
		var lPiece;
		for (var i=0; i< pStr.length; i++) {
			c = pStr.charAt(i);
			switch (c) {
				case 'K': // king blanc
					lType = PIECE_ENUM.KING;
					lColor = COLOR_ENUM.BLANC;
					break;
				case 'k': // king noir
					lType = PIECE_ENUM.KING;
					lColor = COLOR_ENUM.NOIR;
					break;
				case 'Q': // king blanc
					lType = PIECE_ENUM.QUEEN;
					lColor = COLOR_ENUM.BLANC;
					break;
				case 'q': // king noir
					lType = PIECE_ENUM.QUEEN;
					lColor = COLOR_ENUM.NOIR;
					break;
				case 'R': // king blanc
					lType = PIECE_ENUM.ROOK;
					lColor = COLOR_ENUM.BLANC;
					break;
				case 'r': // king noir
					lType = PIECE_ENUM.ROOK;
					lColor = COLOR_ENUM.NOIR;
					break;
				case 'B': // king blanc
					lType = PIECE_ENUM.BISHOP;
					lColor = COLOR_ENUM.BLANC;
					break;
				case 'b': // king noir
					lType = PIECE_ENUM.BISHOP;
					lColor = COLOR_ENUM.NOIR;
					break;
				case 'N': // king blanc
					lType = PIECE_ENUM.KNIGHT;
					lColor = COLOR_ENUM.BLANC;
					break;
				case 'n': // king noir
					lType = PIECE_ENUM.KNIGHT;
					lColor = COLOR_ENUM.NOIR;
					break;
				case 'P': // pion blanc
					lType = PIECE_ENUM.PAWN;
					lColor = COLOR_ENUM.BLANC;
					break;
				case 'p': // king noir
					lType = PIECE_ENUM.PAWN;
					lColor = COLOR_ENUM.NOIR;
					break;
				case '1': // pawns
				case '2': // pawns
				case '3': // pawns
				case '4': // pawns
				case '5': // pawns
				case '6': // pawns
				case '7': // pawns
				case '8': // pawns
					lX += c.charCodeAt() - '0'.charCodeAt();
					continue;
				case '/':
					// ligne suivante
					lY --;
					lX = 0;
					continue;
				default:
					console.log("caractere nom traité dans le FEN : '" + c + "'");
			}
			// on place la piece
			lPiece = new Piece(lType, lX, lY, lColor);
			this.PiecesList.push(lPiece);

			// on avance d'un cran
			lX ++;
		}
	}

	SetCastlingFromFen(pStr) {
		// on récupere les pieces dont il faudra préciser dire si c'est le premier coup ou non, ce qui détermine la possibilité de roquer ou non.
		var lWhiteKingSideRook = this.GetCastleRook(COLOR_ENUM.BLANC, true);
		var lWhiteQueenSideRook = this.GetCastleRook(COLOR_ENUM.BLANC, false);
		var lBlackKingSideRook = this.GetCastleRook(COLOR_ENUM.NOIR, true);
		var lBlackQueenSideRook = this.GetCastleRook(COLOR_ENUM.NOIR, false);

		// on vide ou pas la liste de coups en fonction des possibilités de roque
		for (var lCharIndex = 0; lCharIndex < pStr.length; lCharIndex ++) {
			// petit roque blanc
			if ((pStr[lCharIndex] == '-') || pStr[lCharIndex] == 'K') {
				// on ajoute un coup fictif du roi
	 			this.MovesList.push(new Move(lWhiteKingSideRook, null));
	 		}

	 		// grand roque blanc
	 		if ((pStr[lCharIndex] == '-') || pStr[lCharIndex] == 'Q') {
	 			this.MovesList.push(new Move(lBlackKingSideRook, null));
	 		}

	 		// petit roque noir
	 		if ((pStr[lCharIndex] == '-') || pStr[lCharIndex] == 'k') {
	 			this.MovesList.push(new Move(lWhiteKingSideRook, null));
	 		}

	 		// grand roque noir
	 		if ((pStr[lCharIndex] == '-') || pStr[lCharIndex] == 'q') {
	 			this.MovesList.push(new Move(lWhiteQueenSideRook, null));
	 		}
	 	}
	}

	SetEnPassantFromFen(pPosition) {
		if (pPosition.localeCompare("-")) {
			this.PriseEnPassantPosition = null;
		} else {
			var lX = pPosition.charCodeAt(0) - pPosition.charCodeAt('a');
			var lY = pPosition.charCodeAt(0) - pPosition.charCodeAt('0');
			this.PriseEnPassantPosition = new Position(lX, lY);
		}
	}

}