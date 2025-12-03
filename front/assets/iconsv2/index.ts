// Ícones da pasta iconsv2
export const battleIcons = {
  attack: require('./swords.png'),
  switch: require('./switch.png'),
  item: require('./potion.png'),
  run: require('./running.png'),
  card: require('./card.png'),
  cart: require('./shopping-cart.png'),
  paw: require('./paw.png'),
  beans: require('./coffee-beans.png'),
  coach: require('./coach.png'),
};

export type BattleIconName = keyof typeof battleIcons;

export const getBattleIcon = (name: BattleIconName) => {
  return battleIcons[name];
};
