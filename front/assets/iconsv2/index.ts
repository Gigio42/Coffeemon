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
  versus: require('./versus.png'),
  coffeeBreak: require('./coffee-break.png'),
  marketplace: require('./shopping-center.png'),
  people: require('./people.png'),
  copy: require('./copy.png'),
  qrCode: require('./qr-code.png'),
  settings: require('./settings.png'),
  chat: require('./chat.png'),
  menu: require('./menu.png'),
  catalog: require('./card.png'),
  paperPlane: require('./paper-plane.png'),
  back: require('./back.png'),
  globalNetwork: require('./global-network.png'),
};

export type BattleIconName = keyof typeof battleIcons;

export const getBattleIcon = (name: BattleIconName) => {
  return battleIcons[name];
};
