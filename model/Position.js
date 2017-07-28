class Position extends Phaser.Point {
	
	toString() {
		return String.fromCharCode(97 + this.x) + (this.y+1);
	}
	
	clone() {
		return new Position(this.x, this.y);
	}
}