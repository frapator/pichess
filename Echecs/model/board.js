class Board {

	constructor() {

		this.PiecesList = [];
		this.MainVariant = new Variant();
		
		this.CURRENT_COLOR = null;
		
		this.rules = new Rules();

	}

	StartNewGame() {
		// initialisation des pieces
		this.ClearPieces();
		this.PiecesList = this.rules.GetStartupPieces();

		// initialisation de la liste des coups
		this.MainVariant.clear();

		// les blancs commencent
		this.SetTurn(0, COLOR_ENUM.BLANC, 0);
	}

	GetPGN() {
		return PGN.Build(this);
	}

	GetCurrentMove() {
		return this.MainVariant.GetCurrentMove();
	}

	MoveBack() {
	// renvoie le coup annulé
		var lMove = this.MainVariant.GetLastMove();
		if (! lMove) {
  			return null;
  		}

		this.UnMovePiece(lMove.Piece);
		this.TurnIndex --;
		this.SwitchTurn();

		return lMove;
	}

	MoveBackToStart() {
		while (this.TurnIndex > 0) {
			this.MoveBack();
		}
	}

	MoveForward() {

	}

	MoveForwardToEnd() {
		while (this.TurnIndex < this.MaxTurnIndex) {
			this.MoveForward();
		}
	}

	SetTurn(pIndex, pColor, pLastProgressionMoveIndex) {
		this.TurnIndex = pIndex;
		this.CURRENT_COLOR = this.AlternateColor(pColor);
		this.SwitchTurn();

		this.SetLastPawnMoveIndex(pLastProgressionMoveIndex);
		this.SetLastTakeMoveIndex(pLastProgressionMoveIndex);
	}

	ClearPieces() {
		// supprimer les pieces et leurs sprites
		if (this.PiecesList) {
			for (var lPiece of this.PiecesList) {
				lPiece.sprite.destroy();
			 }
		}
		this.PiecesList = [];
	}

	Trace() {
		myController.LOGS.push(
			"TurnIndex : " + this.TurnIndex,
			"Prise En Passant : " + this.PriseEnPassantPosition,
			"Last Pawn Move : " + this.GetLastPawnMoveIndex(),
			"Last Take move : " + this.GetLastTakeMoveIndex(),
			"Matériel Noir : " + this.CompterMateriel(COLOR_ENUM.NOIR),
			"Matériel Blanc : " + this.CompterMateriel(COLOR_ENUM.BLANC),
			"Coups joués : " + this.MovesList
		);
		myController.LOGS.push(
			"---------------- ",
			"TRACE BOARD : ",
			"");
	}

	GetLastPawnMoveIndex() {
		if (this.PawnMovesIndexList.length <= 0) { return 0; }
		return this.PawnMovesIndexList[this.PawnMovesIndexList.length - 1];
	}

	GetLastTakeMoveIndex() {
		if (this.TakeMovesIndexList.length <= 0) { return 0; }
		return this.TakeMovesIndexList[this.TakeMovesIndexList.length - 1];
	}

	GetLastMoveWithProgressIndex() {
		var lLastPawnMoveIndex = this.GetLastPawnMoveIndex();
		var lLastTakeMoveIndex = this.GetLastTakeMoveIndex();
		return Math.max(lLastTakeMoveIndex, lLastPawnMoveIndex);
	}

	SetLastPawnMoveIndex(pIndex) {
		// le tableau des MoveTurn de coups de pions
		this.PawnMovesIndexList = [];
		this.PawnMovesIndexList.push(pIndex);
	}

	SetLastTakeMoveIndex(pIndex) {
		this.TakeMovesIndexList = [];
		this.TakeMovesIndexList.push(pIndex);
	}

	GetCastleRook(pColor, pCastlShortFlag) {
		var lIndex = this.rules.GetCastleRookIndex(pColor, pCastlShortFlag);
		return this.PiecesList[lIndex];
	}
	
	MovePiece(pPiece, pTargetBoardPosition) {

		// retirer la piece sur la case cible
		var lTargetPiece = this.GetPiece(pTargetBoardPosition);
		if (lTargetPiece) {
			this.TakePiece(lTargetPiece);
			pPiece.PieceEatenLastMove = lTargetPiece;
		} else {
			pPiece.PieceEatenLastMove = null;
		}

		// enregistrer le mouvement effectué
		var lNewMove = new Move(pPiece, pPiece.BoardPosition, pTargetBoardPosition, this.PriseEnPassantPosition, lTargetPiece);
		//console.log("new move : " + lNewMove);
		this.MainVariant.AddMove(lNewMove);
				
		// placer la piece sur sa case finale : LE MOUVEMENT
		pPiece.Move(pTargetBoardPosition);

		// si c'est un roque
		if (pPiece.Type == PIECE_ENUM.KING) {
			// on récupère la bonne tour
			var lDeltaX = pTargetBoardPosition.x - pPiece.PreviousBoardPosition.x;
			var lRookTargetX;
			var lRook;
			if (lDeltaX == 2) {
				// petit roque
				// déplacer la tour coté roi
				//console.log("Petit roque " + pPiece.Color);
				lRook = this.GetCastleRook(pPiece.Color, true);
				lRookTargetX = pTargetBoardPosition.x - 1;
			} else if (lDeltaX == -2) {
				// grand roque
				// déplacer la tour coté dame
				//console.log("Grand roque " + pPiece.Color);
				lRook = this.GetCastleRook(pPiece.Color, false);
				lRookTargetX = pTargetBoardPosition.x + 1;		
			}

			// on déplace la tour
			if (lRook) {
				var lNewRookPosition = new Position(lRookTargetX, pPiece.PreviousBoardPosition.y);
				this.MovePiece(lRook, lNewRookPosition);
			}
		}
	
		// y a t il promotion ?
		if (pPiece.Type == PIECE_ENUM.PAWN) {
			//LOGS.push("... pion ok " + pPiece.BoardPosition.y + " =? " + this.rules.GetPromotionRankIndex(pPiece.Color));
			this.PawnMovesIndexList.push(this.TurnIndex);
			if (pPiece.BoardPosition.y == this.rules.GetPromotionRankIndex(pPiece.Color)) {
				// promotion
				//LOGS.push("Promotion ...");
				pPiece.Type = PIECE_ENUM.QUEEN;
				pPiece.sprite.frame = PiecesSet.GetFrameIndex(pPiece.Type, pPiece.Color); // si rendu visuel seulement ??
				pPiece.PromotionMoveIndex = pPiece.GetMovesCount();
			}
		}
	
		// est ce une prise en passant ?
		if (this.PriseEnPassantPosition) {
			// il existe une case de prise en passant possible ce coup ci
			if (pPiece.Type == PIECE_ENUM.PAWN) {
				var lDeltaX = pTargetBoardPosition.x - pPiece.PreviousBoardPosition.x;
				if (lDeltaX != 0) {
					if (Position.equals(pTargetBoardPosition, this.PriseEnPassantPosition)) {
						var lPePTargetPiecePosition = new Position();
						lPePTargetPiecePosition.x = pPiece.PreviousBoardPosition.x + lDeltaX;
						lPePTargetPiecePosition.y = pPiece.PreviousBoardPosition.y;
						lPePTargetPiece = this.GetPiece(lPePTargetPiecePosition);
						//LOGS.push("Prise en passant " + lPePTargetPiecePosition + " : " + lPePTargetPiece);
						if (lPePTargetPiece) {
							this.TakePiece(lPePTargetPiece);
							pPiece.PieceEatenLastMove = lPePTargetPiece;
						}
					}
				}
			}
		}
	
		// indiquer éventuellement une prise en passant possible
		this.PriseEnPassantPosition = null;
		if (pPiece.Type == PIECE_ENUM.PAWN) {
			var lDeltaY = pTargetBoardPosition.y - pPiece.PreviousBoardPosition.y;
			if (Math.abs(lDeltaY) == 2) {
				this.PriseEnPassantPosition = new Position();
				this.PriseEnPassantPosition.x = pPiece.PreviousBoardPosition.x;
				this.PriseEnPassantPosition.y = pPiece.PreviousBoardPosition.y + lDeltaY / 2
				//console.log("Prise en passant possible en " + this.PriseEnPassantPosition);
			}
		}
	
	}

	UnMovePiece(pPiece) {
		//console.log("unmove piece " + pPiece);
		// récupérer le dernier coup
		var lMove = this.MainVariant.GetCurrentMove();

		// dépiler le coup de pion si s'en est un
		if (pPiece.Type == PIECE_ENUM.PAWN) {
			this.PawnMovesIndexList.pop();
		}

		// calcul déplacement latéral
		var lDeltaX = pPiece.BoardPosition.x - pPiece.PreviousBoardPosition.x;

		// on considere petit roque si déplacement latéral droit
		var lMoveToRightFlag = lDeltaX > 0;
		var lCastleShortFlag = lMoveToRightFlag;

		// récupérer la case de prise en passant
		this.PriseEnPassantPosition = lMove.PriseEnPassantPositionBeforeMove;
		
		// remettre la piece sur sa case d'avant
		pPiece.UnMove();

		// on vérifie si le coup annulé était une promotion
		if (pPiece.PromotionMoveIndex == pPiece.GetMovesCount()) {
			// on annule la promotion effectuée au dernier coup
			pPiece.Type = PIECE_ENUM.PAWN;
			pPiece.sprite.frame = PiecesSet.GetFrameIndex(pPiece.Type, pPiece.Color);
			pPiece.PromotionMoveIndex = null;
		}

		// remettre la piece éventuellement mangée
		if (pPiece.PieceEatenLastMove) {
			this.UnTakePiece(pPiece.PieceEatenLastMove);
		}
		pPiece.PieceEatenLastMove = null;

		// remettre la tour en cas de roque
		if (pPiece.Type == PIECE_ENUM.KING) {
			if (Math.abs(lDeltaX) == 2) {
				var lRook = this.GetCastleRook(pPiece.Color, lCastleShortFlag);
				if (lRook) {
					//LOGS.push("replacer tour du roque : " + lRook);
					this.UnMovePiece(lRook);
				}
			}
		}
	}
	
	TakePiece(pPiece) {
		pPiece.Taken = true;
		this.TakeMovesIndexList.push(this.TurnIndex);
	}
	
	UnTakePiece(pPiece) {
		pPiece.Taken = false;
		this.TakeMovesIndexList.pop();
	}
	
	GetPiece(pBoardPosition) {
		var lFoundPiece = null;
		var lPiece;
		//LOGS.push("getPiece " + pBoardPosition + " amongst " + PiecesList.length);
		for (var pPiece of this.PiecesList) {
			if (! pPiece.Taken) {
			    if (Position.equals(pPiece.BoardPosition, pBoardPosition)) {
					lFoundPiece = pPiece;
					//LOGS.push("found : " + lFoundPiece);
			    }
			}
	    }
		return lFoundPiece;
	}
	
	GetColor(pBoardPosition) {
		var lPiece = this.GetPiece(pBoardPosition);
		if (lPiece) return lPiece.Color;
	}
	
	AlternateColor(pColor) {
		if (pColor == COLOR_ENUM.BLANC) return COLOR_ENUM.NOIR;
		if (pColor == COLOR_ENUM.NOIR) return COLOR_ENUM.BLANC;
	}

	SwitchTurn() {
	
		// changer la couleur active
		this.CURRENT_COLOR = this.AlternateColor(this.CURRENT_COLOR);
		
	}

	CheckCastleCondamned(pColor, pCastleShortFlag) {
		// vérification que le roi n'a pas bougé
		//LOGS.push("check castle condamné " + pColor + " " + pCastleShortFlag);
		var lKingPos = this.SearchKingPos(pColor);
		var lKing = this.GetPiece(lKingPos);
		if (lKing.HasMoved()) return true;

		// vérification que la tour n'a pas bougé		
		var lRook = this.GetCastleRook(pColor, pCastleShortFlag);
		//LOGS.push("tour roque : " + lRook);
		if (!lRook) {
			console.log("la tour du " + (pCastleShortFlag ? "petit" : "grand") + " roque " + pColor + " n'a pas été trouvée");
			return true;
		}
		if (lRook.HasMoved()) return true;

		// vérification que la tour n'a pas déjà été prise
		if (lRook.Taken) return true;

		// ok roque pas comdamné
		return false;
	}
	
	CheckCastle(pPiece, pCastleShortFlag) {
		// pas de controle sur le type de piece (roi)
		//LOGS.push("check " + (pCastleShortFlag ? "short" : "long") + " castle " + pPiece);
		// regle 1 : toutes les cases qui séparent le roi de la tour doivent être inoccupées
		var lColor;
		if (pCastleShortFlag) {
			lColor = this.GetColor(new Position(pPiece.BoardPosition.x + 1, pPiece.BoardPosition.y));
			if (lColor) return false;
			lColor = this.GetColor(new Position(pPiece.BoardPosition.x + 2, pPiece.BoardPosition.y));
			if (lColor) return false;
			
		} else {
			lColor = this.GetColor(new Position(pPiece.BoardPosition.x - 1, pPiece.BoardPosition.y));
			if (lColor) return false;
			lColor = this.GetColor(new Position(pPiece.BoardPosition.x - 2, pPiece.BoardPosition.y));
			if (lColor) return false;
			lColor = this.GetColor(new Position(pPiece.BoardPosition.x - 3, pPiece.BoardPosition.y));
			if (lColor) return false;
		}
	
		// regle 2 : ni le roi, ni la tour ne doivent avoir quitté leur position initiale
		if (this.CheckCastleCondamned(pPiece.Color)) return false;
		
		// regle 3 : aucune des trois cases (de départ, de passage ou d'arrivée)
		// par lesquelles transite le roi lors du roque
		// ne doit être contrôlée par une pièce adverse
		var lAlternateColor = this.AlternateColor(pPiece);
		if (this.CompterAttaques(pPiece.BoardPosition, lAlternateColor) > 0) return false;
		//LOGS.push("pas d'attaques");
		var lPos;
		if (pCastleShortFlag) {
			lPos = new Position(pPiece.BoardPosition.x + 1, pPiece.BoardPosition.y);
			if (this.CompterAttaques(lPos, lAlternateColor) > 0) return false;
			lPos = new Position(pPiece.BoardPosition.x + 2, pPiece.BoardPosition.y);
			if (this.CompterAttaques(lPos, lAlternateColor) > 0) return false;
		} else {
			lPos = new Position(pPiece.BoardPosition.x - 1, pPiece.BoardPosition.y);
			if (this.CompterAttaques(lPos, lAlternateColor) > 0) return false;
			lPos = new Position(pPiece.BoardPosition.x - 2, pPiece.BoardPosition.y);
			if (this.CompterAttaques(lPos, lAlternateColor) > 0) return false;
		}
		
		return true;
	}
	
	CheckMove(pMovedPiece, pTargetBoardPos, pCheckCheckFlag) {
		//if (pCheckCheckFlag) console.log("checking " + pMovedPiece.Desc() + " to " + pTargetBoardPos);
		
		var lMoveErrorCode = MOVE_ERROR_CODE.UNKOWN;
	
		var lTargetPiece = this.GetPiece(pTargetBoardPos);
		//LOGS.push("target " + pTargetBoardPos + " = " + (lTargetPiece ? lTargetPiece : "vide"));
		
		// regarde si une piece de meme couleur non prise est sur la case
		if (lTargetPiece) {
			if (lTargetPiece.Color == pMovedPiece.Color) {
				if (! lTargetPiece.Taken) {
					return MOVE_ERROR_CODE.TARGET_OCCUPIED;
				}
			}
		}
	
		// on calcule les coups libres possibles
		var lFreeMovesList = this.rules.GetFreeMovesList(this, pMovedPiece);
		
		// on regarde pour chaque mouvement libre possible si c'est celui demandé
		//LOGS.push("recherche mouvements libres pour " + pMovedPiece);
		for (var pFreeMove of lFreeMovesList) {
			//LOGS.push("analyse coup : " + pFreeMove);
	
			// on regarde si c'est bien le mouvement demandé sinon on passe au suivant.
			//LOGS.push("verif : " + pFreeMove + " ? " + pTargetBoardPos);
			if (! Position.equals(pFreeMove, pTargetBoardPos)) {
				//LOGS.push("non joué:" + pFreeMove + " target:" + pTargetBoardPos);
				continue; // on passe a la position suivante à tester
			}

			// Vérif des coordonnées
			if (pFreeMove.x > 7 || pFreeMove.x < 0) {
				return MOVE_ERROR_CODE.OUT_OF_BOARD_X;
			}
			if (pFreeMove.y > 7 || pFreeMove.y < 0) {
				return MOVE_ERROR_CODE.OUT_OF_BOARD_Y;
			}
			
			//LOGS.push("analyse cible choisie : " + pTargetBoardPos);
			lMoveErrorCode = MOVE_ERROR_CODE.NO_ERROR;
	
			// maintenant, on va regarder si le mouvement est légal
			
			// cas particulier des pions
			if (pMovedPiece.Type == PIECE_ENUM.PAWN) {
				//LOGS.push("analyse mvt du " + pMovedPiece);
	
				// on exclu les mouvements de pion de 2 cases apres leur premier coup
				if (! pMovedPiece.HasMoved()) {
					if (Math.abs(pFreeMove.y - pMovedPiece.y) == 2) {
						return MOVE_ERROR_CODE.PION_DEJA_AVANCE;
					}
				}
	
				// on exclue les mouvements de pion sur le coté qui ne sont pas des prises
				if (pFreeMove.x != pMovedPiece.BoardPosition.x) {
					//LOGS.push("mvt latéral : " + pFreeMove.x + " != " + pMovedPiece.BoardPosition.x);
					// est-ce une prise en regardant ce qu'il y a sur la case d'arrivée ?
					if (! lTargetPiece) {
						// ce n'est pas une prise
						// on regarde si la cible est une case de prise en passant
						if (! this.PriseEnPassantPosition) {
							return MOVE_ERROR_CODE.PAS_DE_PRISE_EN_PASSANT;
						} else {
							// autoriser la prise en passant
							if (Position.equals(pFreeMove, PriseEnPassantPosition)) {
								// Ok
								//LOGS.push("Prise en passant possible");
							} else {
								return MOVE_ERROR_CODE.EN_PASSANT_WRONG;
							}
						}
					}
				} else {
				// on exclue les mouvement de pions en avant qui sont des prises.
					//LOGS.push("mvt vertical : " + pFreeMove.y + " != " + pMovedPiece.BoardPosition.y);
					//LOGS.push("target piece prise : " + lTargetPiece); 
					if (lTargetPiece) {
						//LOGS.push("target piece prise : " + lTargetPiece.taken); 
						if (! lTargetPiece.Taken) {
							//LOGS.push("cible : " + lTargetPiece + " Pb : " + pFreeMove.x + " = " + pMovedPiece.BoardPosition.x);
							return MOVE_ERROR_CODE.PRISE_PAR_PION_EN_AVANT;
						}
					}
				}
			}
			//LOGS.push("error code : " + lMoveErrorCode.desc);
			
			// cas du roque
			if (pMovedPiece.Type == PIECE_ENUM.KING) {
				if (pFreeMove.x - pMovedPiece.BoardPosition.x == 2) {
					// demande de petit roque
					//LOGS.push("verif castle short for " + pMovedPiece + " " + (pCheckCheckFlag ? "test" : "reel"));
					if (! this.CheckCastle(pMovedPiece, true)) {
						return MOVE_ERROR_CODE.ROQUE_INTERDIT;
					}
				} else if (pFreeMove.x - pMovedPiece.BoardPosition.x == -2) {
					// demande de grand roque
					//LOGS.push("verif castle long for " + pMovedPiece + " " + (pCheckCheckFlag ? "test" : "reel"));
					if (! this.CheckCastle(pMovedPiece, false)) {
						return MOVE_ERROR_CODE.ROQUE_INTERDIT;
					}
				} else {
					//LOGS.push("pFreeMove.x - pMovedPiece.BoardPosition.x : " + (pFreeMove.x - pMovedPiece.BoardPosition.x));
				}
			}
			
			// OK : pas de contre indication trouvée pour ce mouvement
			lMoveErrorCode = MOVE_ERROR_CODE.NO_ERROR;
		}
		
		//LOGS.push(pMovedPiece.Color + " " + pMovedPiece.Type.name + " can move to " + pTargetBoardPos + " : " + lMoveErrorCode.desc);
		
	   if (lMoveErrorCode != MOVE_ERROR_CODE.NO_ERROR) {
	   	return lMoveErrorCode;
	   }

	   if (pCheckCheckFlag) {
	   	// on réalise le mouvement
			this.MovePiece(pMovedPiece, pTargetBoardPos);

			// vérification que le roi n'est pas en echec
			var lCheckFlag = this.RechercheEchec(pMovedPiece.Color);
			if (lCheckFlag) {
				//LOGS.push("ECHEC " + pMovedPiece.Color);
				lMoveErrorCode = MOVE_ERROR_CODE.ECHEC;
			}

			// on restaure la position de la piece
			this.UnMovePiece(pMovedPiece);
	
		}

		return lMoveErrorCode; 
	}
	
	RechercheEchec(pColor) {
	
		//LOGS.push("recherche echec contre Roi " + pColor);
		var lKingPos = this.SearchKingPos(pColor);
	
		var lAttacks = this.CompterAttaques(lKingPos, this.AlternateColor(pColor));
	
		return (lAttacks > 0);
	}

	SearchKingPos(pColor) {
		// on recherche la position du roi de la couleur
		var lKingPos;
		for (var pPiece of this.PiecesList) {
			if (pPiece.Type == PIECE_ENUM.KING) { // roi
				if (pPiece.Color == pColor) { // couleur demandée
					lKingPos = pPiece.BoardPosition;
				}
			}
		}
		//LOGS.push("Roi " + pColor + " trouvé : " + lKingPos);
		return lKingPos;
	}
	
	CompterAttaques(pTargetPos, pAttackerColor) {
	// on recherche les pieces adverses non prises qui peuvent attaquer la position
		var lNbAttacks = 0;
		for (var pPiece of this.PiecesList) {
			if (! pPiece.Taken) {
				//LOGS.push("piece " + pPiece.Color + " non prise : " + pPiece.BoardPosition);
				if (pPiece.Color == pAttackerColor) {
					//LOGS.push("piece attaquante " + pAttackerColor + " : " + pPiece.BoardPosition);
					var lCheckMove = this.CheckMove(pPiece, pTargetPos, false);
					//LOGS.push("check " + pPiece.BoardPosition  + " " + pTargetPos + " : " + lCheckMove.desc);
					if (lCheckMove == MOVE_ERROR_CODE.NO_ERROR) {
						lNbAttacks ++;
						//LOGS.push(pPiece.BoardPosition + " attaque " + pTargetPos);
					}
				}
			}
		}
		//LOGS.push(lNbAttacks + " attaque(s) " + pAttackerColor + " sur " + pTargetPos);
	
		return lNbAttacks;
	}
	
	ExisteTIlUnCoupPossible(pColor) {
		//LOGS.push("recherche d'un coup possible pour les " + pColor);
		var lNbCoupsPossibles = 0;
		for (var pPiece of this.PiecesList) {
			if (pPiece.Color == pColor) {
				if (! pPiece.Taken) {
					//LOGS.push("try " + pPiece);
					var lMovesList = this.rules.GetFreeMovesList(this, pPiece);
					if (lMovesList) {
						//LOGS.push(pPiece + " : " + lMovesList.length + " moves");
						if (lMovesList.length > 0) {
							for (var pMove of lMovesList) {
								//LOGS.push("coup : " + pMove);
								//try {
									var lTest = this.CheckMove(pPiece, pMove, true);
								//} catch(pErr) {
								//	LOGS.push("ERR : " + pErr);
								//}
								//LOGS.push(pPiece + " -> " + pMove + " : " + lTest.desc);
								if (lTest == MOVE_ERROR_CODE.NO_ERROR) {
									//LOGS.push("coup possible pour " + pPiece + " : " + pMove);
									lNbCoupsPossibles ++;
								}
							}
						}
					}
				}
			}
		}
		//LOGS.push("nb coups possibles : " + lNbCoupsPossibles);
		return lNbCoupsPossibles > 0;
	}

	CompterMateriel(pColor) {
		var lMateriel = 0;
		for (var pPiece of this.PiecesList) {
			if (pPiece.Color == pColor) { // couleur demandée
				if (! pPiece.Taken) { // piece non prise
					lMateriel += pPiece.GetValue();
				}
			}
		}

		return lMateriel;
	}

	ComputeCodeFin() {
		var lAlternateColor = this.AlternateColor(this.CURRENT_COLOR);
		//LOGS.push("alter color(" + this.CURRENT_COLOR+ ") = " + lAlternateColor);

		// recherche de PAT et MAT
		if (! this.ExisteTIlUnCoupPossible(lAlternateColor)) {
			if (this.RechercheEchec(lAlternateColor)) {
				return CODE_FIN.MAT;
			} else {
				return CODE_FIN.PAT;
			}
		}

		// recherche de matériel insuffisant
		var lMaterielNoir = this.CompterMateriel(COLOR_ENUM.NOIR);
		var lMaterielBlanc = this.CompterMateriel(COLOR_ENUM.BLANC);
		if (lMaterielNoir + lMaterielBlanc == 2000) {
			return CODE_FIN.MATERIEL_INSUFFISANT;
		}

		// recherche des 50 coups sans progresser
		var lLastMoveWithProgressIndex = this.GetLastMoveWithProgressIndex();
		if (this.TurnIndex - lLastMoveWithProgressIndex >= 100) {
			return CODE_FIN.PAS_DE_PROGRES;
		}
		return CODE_FIN.PAS_FINI;
	}
	
	checkIfFinished() {
		//LOGS.push("Vérification fin de partie ...");
		var lCodeFin = this.ComputeCodeFin();
		if (lCodeFin != CODE_FIN.PAS_FINI) {
			myView.showFinishedText("Partie terminée : " + lCodeFin.desc);
			return true;
		}
		return false;
	}

}