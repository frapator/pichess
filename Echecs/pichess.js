const GameWidth = 1200;

myView = new View();
myMusic = new Music();
myBoard = new Board();
myController = new Controller();

this.game = new Phaser.Game(GameWidth, 600, Phaser.AUTO, 'echecs', { preload: preload, create: create, render: render });
//game.stage.disableVisibilityChange = true;

function preload() {
	myController.preload();
}

function create() {
	myController.create();
}

function render() {
	myView.render();	
}