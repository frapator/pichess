class MovesListUI {

	constructor(pUpperLeftCorner) {
		this.upperLeftCorner = pUpperLeftCorner;
		this.TextList = [];
	}

	AddMove(pIndex, pMove) {

		var lIndexIsEven = pIndex % 2 == 0;
		var lIndexIsOdd = 1 - lIndexIsEven;
		var lX = this.upperLeftCorner.x + lIndexIsOdd * 40;
		var lY = this.upperLeftCorner.y + Math.round((1 + pIndex) / 2) * 20;
		var lText = pMove.toString();

		var lMoveText = game.add.text(lX, lY, lText, { font: '12px Arial', fill: '#fff' });
	   lMoveText.inputEnabled = true;
	   lMoveText.events.onInputUp.add(function () {
	   	console.log("click move in list");

	   });

	   this.TextList[pIndex] = lMoveText;
	}

	Clear() {
		for (var pText of this.TextList) {
			if (! pText) {
				console.log("erreur text null pour index")
			} else {
				pText.destroy();
			}
		}
	}
}