class TransportUI {

	constructor() {
		this.BackToStartButton = null;
		this.BackButton = null;
		this.ForwardToEndButton = null;
		this.ForwardButton = null;
		this.Position = null;
	}

	Create(pX, pY) {
		this.Position = new Phaser.Point(pX, pY);
		console.log("transport @ " + this.Position);
		this.BackToStartButton = this.CreateBackToStartButton();
		this.BackButton = this.CreateBackButton();
		this.ForwardButton = this.CreateForwardButton();
		this.ForwardToEndButton = this.CreateForwardToEndButton();
	}

	GetPosition() {
		return this.Position;
	}

	CreateBackToStartButton() {

		var lTransporterPosition = this.GetPosition();
		var lButton = game.add.text(lTransporterPosition.x, lTransporterPosition.y, '|<', { font: '22px Arial', fill: '#fff' });
	   lButton.inputEnabled = true;
	   lButton.events.onInputUp.add(function () {
	   	myBoard.MoveBackToStart();
		});
		return lButton;
	}

	CreateBackButton() {

		var lTransporterPosition = this.GetPosition();
		var lButton = game.add.text(lTransporterPosition.x + 30, lTransporterPosition.y, '<', { font: '22px Arial', fill: '#fff' });
	   lButton.inputEnabled = true;
	   lButton.events.onInputUp.add(function () {
	   	var lMove = myBoard.MoveBack();
			console.log("back to position " + lMove.Piece.BoardPosition);
			console.log("back to position " + lMove.Piece);
			lMove.Piece.sprite.position = ChessBoardToScreenProjection(lMove.Piece.BoardPosition);

			if (lMove.TakenPiece) {
				lMove.TakenPiece.sprite.visible = true;
			}

		});
		return lButton;
	}

	CreateForwardButton() {

		var lTransporterPosition = this.GetPosition();
		var lButton = game.add.text(lTransporterPosition.x + 60, lTransporterPosition.y, '>', { font: '22px Arial', fill: '#fff' });
	   lButton.inputEnabled = true;
	   lButton.events.onInputUp.add(function () {
	   	myBoard.MoveForward();
		});
		return lButton;
	}

	CreateForwardToEndButton() {

		var lTransporterPosition = this.GetPosition();
		var lButton = game.add.text(lTransporterPosition.x + 90, lTransporterPosition.y, '>|', { font: '22px Arial', fill: '#fff' });
	   lButton.inputEnabled = true;
	   lButton.events.onInputUp.add(function () {
	   	myBoard.MoveForwardToEnd();
		});
		return lButton;
	}

}