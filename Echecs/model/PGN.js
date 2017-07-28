class PGN {

	constructor() {

	}

	static Build(pBoard) {

		var lEvent = "[Event \"Rated game\"]";
		var lSite = "[Site \"https://lichess.org/NPst5Sz4\"]";
		var lDate = "[Date \"2016.08.04\"]";
		var lWhite = "[White \"Frapator\"]";
		var lBlack = "[Black \"enzo17\"]";
		var lResult = "[Result \"1-0\"]";
		var lWhiteElo = "[WhiteElo \"1902\"]";
		var lBlackElo = "[BlackElo \"1808\"]";
		var lPlyCount = "[PlyCount \"71\"]";
		var lVariant = "[Variant \"Standard\"]";
		var lTimeControl = "[TimeControl \"180+0\"]";
		var lECO = "[ECO \"C00\"]";
		var lOpening = "[Opening \"French Defense: Normal Variation\"]";
		var lTermination = "[Termination \"Normal\"];"
		var lAnnotator = "[Annotator \"\"]";

		var lMoves = "Moves ";
		// 1. e4 e6 2. d4 { C00 French Defense: Normal Variation } Ne7 3. c4 c6 4. Nc3 Ng6 5. Nf3 Be7 6. c5 d5 7. e5 Nd7 8. b4 b6 9. Bd3 bxc5 10. bxc5 a5 11. O-O Ba6 12. Bxa6 Rxa6 13. Qd3 Ra8 14. Na4 O-O 15. Bd2 f5 16. exf6 Bxf6 17. Rab1 Rb8 18. Qa6 Rxb1 19. Rxb1 e5 20. Bxa5 Qe7 21. Qxc6 e4 22. Qxd5+ Kh8 23. Re1 Nf4 24. Qxe4 Qxe4 25. Rxe4 Nd3 26. Nb6 Nxb6 27. Bxb6 h6 28. a4 Bd8 29. a5 Bxb6 30. axb6 Nb4 31. h3 Nd5 32. Ne5 Ra8 33. b7 Rb8 34. c6 Nf6 35. Re1 Nd5 36. Nd7 { Black resigns } 1-0
		for (var i=0; i< pBoard.TurnIndex; i++) {
			var lMove = pBoard.MainVariant.MovesList[i];
			lMoves += lMove + "-";
		}

		var lPGN = "";
		//lPGN = lEvent + "\n" + lSite + "\n" + lMoves;
		lPGN = lMoves;

		return lPGN;
	}

	BuildBoard(pPGNStr) {
		// découpage

		// parcourir les coups

		var lBoard = null;

		return lBoard;
	}

}