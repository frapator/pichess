class Music {
	
	constructor() {
		this.MUSIC_INDEX = 0;
		this.MUSIC_NAMES = [
			["compo-aribariba", 'assets/audio/compo_aribariba.mp3'],
			["oud-01", 'assets/audio/ana_ouenta_louahdina-25novembre04.mp3'],
			["oud-02", 'assets/audio/el helwadi-02-25novembre04.mp3']];
			//	en erreur ["bbb-05", 'assets/audio/big-bronsky-blues-05.mp3'],
		this.MUSICS = [];
		this.MUSIC_LOOP_FLAG;
		this.MUSIC_MUTE_FLAG;
		this.SelectButton;
		this.MuteButton;
	}
	
	preload() {
		for (var pMusicName of this.MUSIC_NAMES) {
			game.load.audio(pMusicName[0], pMusicName[1]);
		}
	}
	
	PlayMusic(pIndex) {
		if (! this.MUSICS[pIndex].isPlaying) {
			this.MUSICS[pIndex].play();
		}
	}
	
	StopMusic() {
		if (this.MUSICS[this.MUSIC_INDEX].isPlaying) {
			this.MUSICS[this.MUSIC_INDEX].stop();
		}
	}
	
	RegisterMusics() {
		console.log("musics registered");
		// premiere musique
		if (this.MUSIC_INDEX >= 0 && this.MUSIC_INDEX < this.MUSIC_NAMES.length) {
			if (! this.MUSIC_MUTE_FLAG) {
				this.PlayMusic(this.MUSIC_INDEX);
			}
		}
	}
	
	NextMusic() {
		console.log("next music");
	}
	
	CreateButtons() {
		this.MuteButton = this.CreateMuteButton(myView.GameWidth - 80, 370);
		this.UpdateMuteButtonText();
		this.SelectButton = this.CreateSelectButton(myView.GameWidth - 120, 350);
		this.UpdateSelectButtonText();
	}
	
	UpdateSelectButtonText() {
		this.SelectButton.text = "Musique #" + (this.MUSIC_INDEX + 1);
	}
	
	UpdateMuteButtonText() {
		this.MuteButton.text = this.MUSIC_MUTE_FLAG ? "muted" : "playing";
	}

	MusicMuteButtonHook() {
		this.MUSIC_MUTE_FLAG = ! this.MUSIC_MUTE_FLAG;
		if (this.MUSIC_MUTE_FLAG) {
	   		this.StopMusic();
		} else {
			this.PlayMusic(this.MUSIC_INDEX);
		}
		this.UpdateMuteButtonText();
		localStorage.setItem('MusicMuteFlag', JSON.stringify(this.MUSIC_MUTE_FLAG));	
	}
	
	CreateMuteButton(pX, pY) {
		var lButton = game.add.text(pX, pY, "", { font: '20px Arial', fill: '#fff' });
		lButton.inputEnabled = true;
		lButton.events.onInputUp.add(function () {
			myMusic.MusicMuteButtonHook();
		});
		return lButton;
	}

	MusicSelectButtonHook() {
		// on arrete la musique qui joue
		if (this.MUSICS[this.MUSIC_INDEX].isPlaying) {
			//console.log("stop music " + MUSIC_INDEX);
			this.MUSICS[this.MUSIC_INDEX].stop();
		}

		// on passe a la musique suivante
		this.MUSIC_INDEX ++;
		if (this.MUSIC_INDEX >= this.MUSICS.length) {
			this.MUSIC_INDEX = 0;
		}
		localStorage.setItem('MusicIndex', this.MUSIC_INDEX);
		this.UpdateSelectButtonText();
		
		if (! this.MUSIC_MUTE_FLAG) {
			this.PlayMusic(this.MUSIC_INDEX);
		}
	}
	
	CreateSelectButton(pX, pY) {

		for (var lIndex = 0; lIndex < this.MUSIC_NAMES.length; lIndex ++) {
			this.MUSICS[lIndex] = game.add.audio(this.MUSIC_NAMES[lIndex][0]);
			this.MUSICS[lIndex].onStop.addOnce(this.NextMusic);
		}
		game.sound.setDecodedCallback(this.MUSICS, this.RegisterMusics, this);

		var lButton = game.add.text(pX, pY, "", { font: '22px Arial', fill: '#fff' });
		lButton.inputEnabled = true;
		lButton.events.onInputUp.add(function () {
			//console.log("click music");
			myMusic.MusicSelectButtonHook();
		});
		return lButton;
	}

}