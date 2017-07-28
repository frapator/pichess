var COLOR_ENUM = { NOIR:"Noir", BLANC:"Blanc" };

var MOVE_ERROR_CODE = {
	NO_ERROR: { value:0, desc: "ok" },
	TARGET_OCCUPIED: { value:1, desc: "cible occupée" },
	PION_DEJA_AVANCE: { value:2, desc: "pion deja avancé" },
	OUT_OF_BOARD_X: { value:3, desc: "x trop petit ou trop grand" },
	OUT_OF_BOARD_Y: { value:4, desc: "y trop petit ou trop grand" },
	PAS_DE_PRISE_EN_PASSANT: { value:5, desc: "pas de prise en passant" },
	EN_PASSANT_WRONG: { value:6, desc: "en passant pas ici" },
	ECHEC: { value:7, desc: "echec" },
	ROQUE_INTERDIT: { value:8, desc: "roque interdit" },
	PRISE_PAR_PION_EN_AVANT: { value:9, desc: "Prise par pion en avant" },
	UNKOWN: { value:100, desc: "inconnu" }
}

var PIECE_ENUM = { 
	KING: { index:0, name: "Roi", value: 1000, fen: "k", fr: "R" }, 
	QUEEN: { index:1, name: "Dame", value: 9, fen: "q", fr: "D"}, 
	BISHOP: { index:2, name: "Fou", value: 3, fen: "b", fr: "F" }, 
	KNIGHT: { index:3, name: "Cavalier", value: 3, fen: "n", fr: "C" }, 
	ROOK: { index:4, name: "Tour", value: 5, fen: "r", fr: "T" }, 
	PAWN: { index:5, name: "Pion", value: 1, fen: "p", fr: "" }
}

var CODE_FIN = {
	PAS_FINI: { value:0, desc: "pas fini" },
	PAT : { value:1, desc: "Pat" },
	MAT : { value:2, desc: "Mat" },
	REPETITION : { value:3, desc: "Répétition" },
	MATERIEL_INSUFFISANT : { value:4, desc: "Matériel insuffisant" },
	PAS_DE_PROGRES : { value:5, desc: "50 coups sans progresser" },
	TIMEOUT : { value:10, desc: "Timeout" }
}