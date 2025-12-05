import { useMemo } from "react";
import { CoffeemonVariant } from "../../../assets/coffeemons";
import { Coffeemon } from "../../types";
import { SpriteStateResult } from "../../utils/spriteStateMachine";

interface SpriteData {
  imageSource: any;
  state: string;
  variant: CoffeemonVariant;
  name: string;
  index?: number;
}

export function useBattleSprites(
  myPlayerState: any,
  opponentPlayerState: any,
  optimisticActiveIndex: number | null,
  resolveSpriteVariant: (
    name: string,
    baseVariant: CoffeemonVariant,
    statusEffects?: any[]
  ) => SpriteStateResult,
  getCoffeemonImageSource: (name: string, variant: CoffeemonVariant) => any
) {
  const playerSprite = useMemo<SpriteData | null>(() => {
    if (
      !myPlayerState ||
      (optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex) === null
    ) {
      return null;
    }

    const activeIndex =
      optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex!;
    const activeCoffeemon = myPlayerState.coffeemons[activeIndex];

    if (!activeCoffeemon) {
      return null;
    }

    const spriteState = resolveSpriteVariant(
      activeCoffeemon.name,
      "back",
      activeCoffeemon.statusEffects
    );
    const imageSource = getCoffeemonImageSource(
      activeCoffeemon.name,
      spriteState.variant
    );

    return {
      imageSource,
      state: spriteState.state,
      variant: spriteState.variant,
      name: activeCoffeemon.name,
      index: activeIndex,
    };
  }, [
    myPlayerState,
    optimisticActiveIndex,
    resolveSpriteVariant,
    getCoffeemonImageSource,
  ]);

  const opponentSprite = useMemo<SpriteData | null>(() => {
    if (
      !opponentPlayerState ||
      opponentPlayerState.activeCoffeemonIndex === null
    ) {
      return null;
    }

    const activeCoffeemon =
      opponentPlayerState.coffeemons[opponentPlayerState.activeCoffeemonIndex];
    if (!activeCoffeemon) {
      return null;
    }

    const spriteState = resolveSpriteVariant(
      activeCoffeemon.name,
      "default",
      activeCoffeemon.statusEffects
    );
    const imageSource = getCoffeemonImageSource(
      activeCoffeemon.name,
      spriteState.variant
    );

    return {
      imageSource,
      state: spriteState.state,
      variant: spriteState.variant,
      name: activeCoffeemon.name,
    };
  }, [opponentPlayerState, resolveSpriteVariant, getCoffeemonImageSource]);

  const playerHudVariant = useMemo<CoffeemonVariant | null>(() => {
    if (!myPlayerState || myPlayerState.activeCoffeemonIndex === null) {
      return null;
    }

    const activeMon =
      myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex];
    if (!activeMon) {
      return null;
    }

    return resolveSpriteVariant(
      activeMon.name,
      "default",
      activeMon.statusEffects
    ).variant;
  }, [myPlayerState, resolveSpriteVariant]);

  const opponentHudVariant = useMemo<CoffeemonVariant | null>(() => {
    if (
      !opponentPlayerState ||
      opponentPlayerState.activeCoffeemonIndex === null
    ) {
      return null;
    }

    const activeMon =
      opponentPlayerState.coffeemons[opponentPlayerState.activeCoffeemonIndex];
    if (!activeMon) {
      return null;
    }

    return resolveSpriteVariant(
      activeMon.name,
      "default",
      activeMon.statusEffects
    ).variant;
  }, [opponentPlayerState, resolveSpriteVariant]);

  return {
    playerSprite,
    opponentSprite,
    playerHudVariant,
    opponentHudVariant,
  };
}
