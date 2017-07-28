class Piece {

	constructor(pTypePiece, pBoardX, pBoardY, pColor) {

		// les valeurs de départ de cette piece
		var lBoardPosition = new Position(pBoardX, pBoardY);
		this.OriginalBoardPosition = lBoardPosition;
		this.BoardPosition = lBoardPosition;
		this.Type = pTypePiece;
		this.Color = pColor;
		this.PreviousBoardPosition = null;

		// nettoyage commun a toutes les pieces
		this.visible = true;
		this.Taken = false;
		this.Positions = [this.BoardPosition.clone()]; // initialisation avec la position sur l'echiquier
	}

	toString() {
		var lTypeName = this.Type ? this.Type.name : null; 
		return lTypeName + " " + this.Color + " " + this.BoardPosition;
	}

	Desc() {
		return this.toString() + " - positions : " + this.Positions.join(" ");
	}

	GetPGN() {
	}

	GetFenCode() {
		if (this.Color == COLOR_ENUM.NOIR) {
			return this.Type.fen.toLowerCase();
		} else {
			return this.Type.fen.toUpperCase();
		}
	}

	GetValue() {
		return this.Type.value;
	}

	GetMovesCount() {
		return this.Positions.length - 1;
	}

	HasMoved() {
		return this.GetMovesCount() > 0;
	}

	Move(pTargetPosition) {
		this.PreviousBoardPosition = this.BoardPosition;
		this.BoardPosition = pTargetPosition;
		this.Positions.push(pTargetPosition);
	}

	UnMove() {
		// effacement derniere position
		this.Positions.pop();

		// valeur par defaut
		this.PreviousBoardPosition = null;
		this.BoardPosition = null;

		// si le tableau est vide
		if (! this.Positions) {
			console.log("bug positions[] vide");
			return;
		}

		if (this.Positions.length > 0) {
			this.BoardPosition = this.Positions[this.Positions.length - 1];
		}

		if (this.Positions.length > 1) {
			this.PreviousBoardPosition = this.Positions[this.Positions.length - 2];
		}
	}

	Trace() {
		myController.LOGS.push(
			"FrameIndex : " + this.sprite.frame,
			"PieceEatenLastMove : " + (this.PieceEatenLastMove ? this.PieceEatenLastMove : "N/A"),
			"Taken : " + this.Taken,
			"MovesCount : " + this.GetMovesCount(),
			"HasMoved : " + this.HasMoved(),
			"Valeur : " + this.GetValue(),
			"BoardPosition : " + this.BoardPosition,
			"Couleur : " + this.Color,
			"Type : " + this.Type.name,
			"Desc : " + this.Desc(),
			"toString : " + this,
			"-----------",
			"TRACE PIECE :",
			"");
	}		
}
