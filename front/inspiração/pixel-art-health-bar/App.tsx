import React from 'react';
import { HealthBar } from './components/HealthBar';

const App: React.FC = () => {
  return (
    <main className="bg-[#0f172a] min-h-screen w-full flex items-center justify-center p-4">
      <HealthBar
        name="SUICUNE"
        level={100}
        currentHp={348}
        maxHp={348}
      />
    </main>
  );
};

export default App;