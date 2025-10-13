export interface BotCoffeemonConfig {
  coffeemonId: number;
  level: number;
}

export interface BotProfile {
  id: string;
  name: string;
  strategy: 'random' | 'aggressive';
  party: BotCoffeemonConfig[];
}

export const BotProfiles: Record<string, BotProfile> = {
  jessie: {
    id: 'jessie',
    name: 'Treinadora Novata Jessie',
    strategy: 'random',
    party: [
      { coffeemonId: 1, level: 5 },
      { coffeemonId: 4, level: 5 },
    ],
  },
  'pro-james': {
    id: 'pro-james',
    name: 'Estrategista james',
    strategy: 'random', // TODO mudar para 'aggressive' quando implementar
    party: [
      { coffeemonId: 2, level: 10 },
      { coffeemonId: 5, level: 12 },
      { coffeemonId: 8, level: 11 },
    ],
  },
};
