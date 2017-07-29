class Controller {
	/**
	 * Constructeur
	 *
	 * @property LOGS
	 * @type {Array}
	 */
	constructor() {
		this.LOGS = [];
		this.OriginalPieceChessBoardPosition; // faire autrement
	}

	preload() {
		myView.preload();

		myMusic.preload();
	}

	create() {

		// l'echiquier
		myView.prepare();

		// preferences
		// preferences : fond
		var lLocalStoreThemeIndex = parseInt(localStorage.getItem('BackgroundColorIndex'));
		if (isNaN(lLocalStoreThemeIndex)) {
			lLocalStoreThemeIndex = 0;
		}
		myView.mTheme.Select(lLocalStoreThemeIndex);

		// preferences : musique
		myMusic.MUSIC_INDEX = parseInt(localStorage.getItem('MusicIndex'));
		if (myMusic.MUSIC_INDEX < 0 || 	myMusic.MUSIC_INDEX >= myMusic.MUSICS.length) myMusic.MUSIC_INDEX = 0;
		myMusic.MUSIC_LOOP_FLAG = JSON.parse(localStorage.getItem('MusicLoopFlag'));
		myMusic.MUSIC_MUTE_FLAG = JSON.parse(localStorage.getItem('MusicMuteFlag'));
		if (isNaN(myMusic.MUSIC_INDEX)) {
			myMusic.MUSIC_INDEX = 0;
		}

		// trace configuration locale
		for (var i = 0; i < localStorage.length; i++) {
			var lKey = localStorage.key(i);
			console.log(lKey + " : " + localStorage.getItem(lKey));
		}

		// nouvelle partie
		this.StartNewGame();
	}

	SwitchTheme() {
	   myView.mTheme.Switch();
	   localStorage.setItem('BackgroundColorIndex', myView.mTheme.mIndex);
	}

	RefreshPGN() {
		this.LOGS = [];
		this.LOGS.push(myBoard.GetPGN());
	}

	SetDragDropForColor(pColor) {
	// désactiver le drag/drop du joueur en cours
		var lDragFlag;
		for (var pPiece of myBoard.PiecesList) {
			lDragFlag = pPiece.Color == pColor;
			myView.myPiecesSet.SetDragDrop(pPiece, lDragFlag);
		}
	}

	StartNewGame() {
		console.log("new game");

		myBoard.StartNewGame();

		// on ajoute les frameindex
		for (var pPiece of myBoard.PiecesList) {
			myView.DisplayPiece(pPiece);
		}
		console.log("pieces initalisées");

		myView.ShowWhosTurn(myBoard.CURRENT_COLOR);

		// effacement du texte de fin de partie précédante
		myView.clearFinishedText();
	}

	onDragStart(sprite, pointer) {
		var lPos = new Phaser.Point();
		lPos.copyFrom(pointer.position);

		this.OriginalPieceChessBoardPosition = myView.myBoardUI.ScreenToChessBoardProjection(lPos);
		//sprite.tint = Math.random() * 0xffffff;
		//DebugText = "Orig = " + lPos + " = " + OriginalPieceChessBoardPosition;
	}

	onDragStop(sprite, pointer) {
		// calculer la case d'arrivée a partir du pointer
		var lFinalCase = myView.myBoardUI.ScreenToChessBoardProjection(pointer.position);
		var lDraggedPiece = sprite.piece;
		//console.log("moving " + lDraggedPiece);

		// si case d'arrivée = case de départ, ce n'est pas un coup
		if (Position.equals(lFinalCase, this.OriginalPieceChessBoardPosition)) {
			//LOGS.push("sur place en " + lFinalCase + " / " + OriginalPieceChessBoardPosition);
			myBoard.Trace();
			lDraggedPiece.sprite.position = myView.myBoardUI.ChessBoardToScreenProjection(this.OriginalPieceChessBoardPosition);
			lDraggedPiece.sprite.piece.Trace();
			return;
		}

		// vérification coup légal
		var lMoveErrorCode = myBoard.CheckMove(lDraggedPiece, lFinalCase, true);
		//LOGS.push("move to " + lFinalCase + " : " + lMoveErrorCode.desc);

		// si ok : déplacer pour de bon
		if (lMoveErrorCode != MOVE_ERROR_CODE.NO_ERROR) {
			// retour case départ : on centralise la piece sur sa case
			lDraggedPiece.sprite.position = myView.myBoardUI.ChessBoardToScreenProjection(this.OriginalPieceChessBoardPosition);

		} else {
			//LOGS.push("move to " + lFinalCase);
			//console.log("moving " + lDraggedPiece);
			myBoard.MovePiece(lDraggedPiece, lFinalCase, true);

			var lMove = myBoard.GetCurrentMove();

			if (! lMove) {
				console.log("erreur : movePiece return null alors que checkMove Ok")

			} else {
				myBoard.MainVariant.AddMove(myBoard.TurnIndex, lMove);
				lMove.Piece.sprite.position = myView.myBoardUI.ChessBoardToScreenProjection(lMove.Piece.BoardPosition);
				myView.myMovesList.AddMove(myBoard.TurnIndex, lMove);

				// cacher la piece prise
				if (lMove.TakenPiece) {
					lMove.TakenPiece.sprite.visible = false;
				}

				//after every move check if puzzle is completed
				if (myBoard.checkIfFinished()) {
					//LOGS.push("finished");
					return;
				}

				// changer de joueur
				myBoard.TurnIndex ++;
				myBoard.SwitchTurn();

				// afficher le joueur actif
				myView.ShowWhosTurn(myBoard.CURRENT_COLOR);

				// n'autoriser que le mouvement des pieces du nouveau actif
				myController.SetDragDropForColor(myBoard.CURRENT_COLOR);
			}
		}
	}

}
