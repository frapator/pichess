var ThemeButton;

function CreateStartButton() {
	lStartButton = game.add.text(GameWidth - 120, 550, 'Start', { font: '24px Arial', fill: '#fff' });
   lStartButton.inputEnabled = true;
   lStartButton.events.onInputUp.add(function () {
        myController.StartNewGame();
   });
}

function CreateInfosButton() {
	lStartButton = game.add.text(GameWidth - 120, 500, 'Infos', { font: '24px Arial', fill: '#fff' });
   lStartButton.inputEnabled = true;
   lStartButton.events.onInputUp.add(function () {
   	//console.log("logs l-2 = " + LOGS[LOGS.length-2] + " compare : " + "Bonjour".localeCompare(LOGS[LOGS.length-2]));
        if ("Bonjour".localeCompare(myController.LOGS[myController.LOGS.length-2]) == 0) {
        	myController.LOGS = [""];
        	} else {
        		myView.TracePresentation();
        }
   });
}

function CreateFenInput() {
	//game.input.keyboard
	lStartButton = game.add.text(GameWidth - 120, 450, 'Position', { font: '24px Arial', fill: '#fff' });
   lStartButton.inputEnabled = true;
   lStartButton.events.onInputUp.add(function () {
   	lOldFen = FEN.GetFen(myBoard);
      lNewFen = prompt("FEN", lOldFen);
		if (lNewFen) {
			if (lNewFen.localeCompare(lOldFen) != 0) {
				// un Fen non vide et différent a été saisi
				console.log("nouveau FEN : " + lNewFen);
				Fen.SetFenPosition(myBoard, lNewFen);
			}
		}
   });
}

function CreatePGNButton() {

	var lX = GameWidth - 120;
	var lButton2 = game.add.text(lX, 300, 'PGN', { font: '22px Arial', fill: '#fff' });
	lButton2.inputEnabled = true;
	lButton2.events.onInputUp.add(myController.RefreshPGN);
}