class View {
	
	constructor() {
		this.GameWidth = 1200;
		this.myBoardUI = new BoardUI(600, 600);
		this.lBoardPosition = new Phaser.Point(Math.round((this.GameWidth - this.myBoardUI.BOARD_WIDTH) / 2), 0);
		
		this.myPiecesSet = new PiecesSet(this.myBoardUI.BOARD_WIDTH, this.myBoardUI.BOARD_HEIGHT);
		
		this.myMovesList;
		
		this.mTheme = new Theme();
		
		this.myTransportUI;
		this.spritesGroup;
		this.WhosTurnDotGraphics;
		this.ResultText;
	}
	
	preload() {
		this.myBoardUI.preload();
		this.myPiecesSet.preload();
	}
	
	prepare() {
		this.myBoardUI.prepare();
		
		var lPos = new Phaser.Point(this.myBoardUI.GetUpperRightCorner().x + 40, this.myBoardUI.GetUpperRightCorner().y + 20);
		this.myMovesList = new MovesListUI(lPos);
		
		this.CreateWhosTurnIndicator();
		
		// menu
		CreateStartButton();
		CreateInfosButton();
		CreateFenInput();
		myMusic.CreateButtons();
		this.mTheme.CreateButton();
		CreatePGNButton();

		// transporteur
		this.myTransportUI = new TransportUI();
		var lX = this.myBoardUI.GetUpperRightCorner().x + 40;
		this.myTransportUI.Create(lX, 550);

	}
	
	TracePresentation() {
		myController.LOGS = [
		    "30/08 : grosse refactorisation terminée, finalisation ...",
			"16/08 : grosse refactorisation (la 4eme) ...",
			"10/08 : petite pause ...",
			"07/08 : 3eme refactorisation terminée",
			"02/08 : Ajout de thèmes et musiques pour voir",
			"29/07 : Fin phase 4",
			"28/07 : 2eme refactorisation terminée",
			"21/07 : Début phase 4",
			"26/06 : Début du projet",
			"",		
			"  0%|D| Design",
			"100%|C| trouver un nom au projet : PiChess",
			"        (tests, idées, coaching, planning, ressources ...)",
			"  0%|B| trouver de l'aide pour aller encore + loin",
			"-------",
			"Ensuite",
			"",
			"  0%|A| proposer des exos construits à partir des pgn",
			"  0%|9| détecter les thèmes dans les parties",
			"  0%|8| Module de lecture des pgn",
			"  0%|7| Module d'aide tactique visuelle",
			"  0%|6| Module d'analyse sans calcul",
			"------------------",
			"Assistant tactique",
			"",
			" 50%|5| Transporteur & affichage des coups",
			"100%|4| Menu de base : start, save fen, load fen",
			" 95%|3| Conditions de fin (reste répétition)",
			" 95%|2| Règles du jeu (reste sous promotion)",
			"100%|1| Echiquier, pièces, déplacements libres",
			"-----------------",
			"Interface de base",
			"",
			"Prochaines étapes :",
			"",
			"Version en développement alpha (bugguée).",
			"Analyseur de positions/aide a la tactique",
			"",
			"Bonjour"
		]
	}
	
	CreateWhosTurnIndicator() {
		// les points pour indiquer le joueur actif
		this.WhosTurnDotGraphics = game.add.graphics(0, 0);
		this.WhosTurnDotGraphics.beginFill(0xFFFFFF, 1);
		this.WhosTurnDotGraphics.drawCircle(this.myBoardUI.BOARD_WIDTH + this.myBoardUI.GetUpperLeftCorner().x + 20, 0, 10);
	}
	
	ShowWhosTurn(pColor) {
		if (pColor == COLOR_ENUM.BLANC) {
			this.WhosTurnDotGraphics.tint = 0xFFFFFF;
			this.WhosTurnDotGraphics.y = this.myBoardUI.BOARD_HEIGHT - 20;
		} else {
			this.WhosTurnDotGraphics.tint = 0x000000;
			this.WhosTurnDotGraphics.y = 20;
		}
	
	}
	
	showFinishedText(pText) {
	
	    var style = { font: "40px Arial", fill: "#000", align: "center"};
	
	    this.ResultText = game.add.text(game.world.centerX, game.world.centerY, pText, style);
	
	    this.ResultText.anchor.set(0.5);
	
	}
	
	clearFinishedText() {
		if (this.ResultText) {
			this.ResultText.destroy();
		}
	}
	
	DisplayPiece(pPiece) {
		var lFrameIndex = PiecesSet.GetFrameIndex(pPiece.Type, pPiece.Color);
		var lScreenPos = this.myBoardUI.ChessBoardToScreenProjection(pPiece.BoardPosition);
		this.myPiecesSet.SetSprite(pPiece, lScreenPos, lFrameIndex);
	}

	render() {
		
		var ly = 0;
		for (var i = myController.LOGS.length-1; i >= 0; i--) {
			ly += 15;
		    if (ly < 800) game.debug.text(myController.LOGS[i], 0, ly);
		}
	}
}