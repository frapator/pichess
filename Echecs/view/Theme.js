class Theme {

	constructor() {
		this.mColors = ["#4488AA", "#444444", "#AAAAAA", "#CC99FF"];
		this.mIndex = 0;

		this.ThemeButton;
	}


	CreateButton() {
		this.ThemeButton = game.add.text(GameWidth - 120, 400, 'Thème', { font: '24px Arial', fill: '#fff' });
		this.ThemeButton.inputEnabled = true;
		this.ThemeButton.events.onInputUp.add(function () {
		   myController.SwitchTheme();
	   });
	}

	Switch() {
	   this.mIndex ++;
	   if (this.mIndex >= this.mColors.length) this.mIndex = 0;
	   this.Select(this.mIndex);
	}

	Select(pIndex) {
		this.ThemeButton.text = "Thème #" + (pIndex + 1);
		game.stage.backgroundColor = this.mColors[pIndex];
	}
}
