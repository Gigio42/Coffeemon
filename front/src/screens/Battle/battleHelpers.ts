import { Coffeemon, Move } from "../../types";

export interface SwitchCandidate {
  coffeemon: Coffeemon;
  index: number;
  canSwitch: boolean;
  reason?: string;
}

export interface InitialSelectionCandidate {
  coffeemon: Coffeemon;
  index: number;
  canSelect: boolean;
  reason?: string;
}

export function getBattleStatusText(context: {
  battleEnded: boolean;
  isProcessing: boolean;
  myPendingAction: any;
  turnPhase: string;
  needsSwitch: boolean;
  canAct: boolean;
  actionMode: string;
  isSwitchModalVisible: boolean;
  hasSelectedCoffeemon: boolean;
  opponentHasSelectedCoffeemon: boolean;
  isMyTurn: boolean;
}): string {
  const {
    battleEnded,
    isProcessing,
    myPendingAction,
    turnPhase,
    needsSwitch,
    canAct,
    actionMode,
    isSwitchModalVisible,
    hasSelectedCoffeemon,
    opponentHasSelectedCoffeemon,
    isMyTurn,
  } = context;

  if (battleEnded) {
    return "BATALHA FINALIZADA!";
  }

  if (isProcessing) {
    return "PROCESSANDO TURNO...";
  }

  if (myPendingAction) {
    return "AGUARDANDO OPONENTE...";
  }

  if (turnPhase === "RESOLUTION") {
    return "EXECUTANDO AÇÕES...";
  }

  if (turnPhase === "END_OF_TURN") {
    return "FINALIZANDO TURNO...";
  }

  if (turnPhase === "SELECTION") {
    if (!hasSelectedCoffeemon) {
      return "ESCOLHA SEU COFFEEMON INICIAL";
    }
    if (!opponentHasSelectedCoffeemon) {
      return "AGUARDANDO OPONENTE ESCOLHER...";
    }
    return "PREPARANDO BATALHA...";
  }

  if (needsSwitch && canAct) {
    return "SEU COFFEEMON DESMAIOU! ESCOLHA TROCAR OU FUGIR.";
  }

  if (actionMode === "attack") {
    return "ESCOLHA UM ATAQUE.";
  }

  if (isSwitchModalVisible) {
    return "ESCOLHA UM COFFEEMON PARA TROCAR.";
  }

  if (turnPhase === "SUBMISSION") {
    return "ESCOLHA A SUA PRÓXIMA AÇÃO?";
  }

  if (isMyTurn) {
    return "SEU TURNO! ESCOLHA SUA AÇÃO.";
  }

  return "AGUARDANDO TURNO DO OPONENTE...";
}

export function canUseAttackButton(context: {
  canAct: boolean;
  myPendingAction: any;
  needsSwitch: boolean;
}): boolean {
  return context.canAct && !context.myPendingAction && !context.needsSwitch;
}

export function canUseSwitchButton(context: {
  hasSwitchCandidate: boolean;
  isProcessing: boolean;
  myPendingAction: any;
  turnPhase: string;
  canAct: boolean;
}): boolean {
  return (
    context.hasSwitchCandidate &&
    !context.isProcessing &&
    !context.myPendingAction &&
    context.turnPhase !== "RESOLUTION" &&
    context.canAct
  );
}

export function canUseItemButton(context: {
  canAct: boolean;
  myPendingAction: any;
  hasItems: boolean;
}): boolean {
  return context.canAct && !context.myPendingAction && context.hasItems;
}
