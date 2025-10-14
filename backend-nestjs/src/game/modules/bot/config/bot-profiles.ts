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
    id: 'Jessie',
    name: 'Jessie (Rookie Trainer)',
    strategy: 'random',
    party: [
      { coffeemonId: 1, level: 5 },
      { coffeemonId: 4, level: 5 },
    ],
  },
  'pro-james': {
    id: 'James (Pro)',
    name: 'James',
    strategy: 'random', // TODO change to 'aggressive' when implemented
    party: [
      { coffeemonId: 2, level: 10 },
      { coffeemonId: 5, level: 12 },
      { coffeemonId: 8, level: 11 },
    ],
  },
};
