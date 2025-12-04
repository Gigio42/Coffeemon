import { useEffect, useState } from "react";
import { getPlayerItems, Item } from "../api/itemsService";

export function useBattleItems(playerId: number, token: string) {
  const [items, setItems] = useState<Item[]>([]);
  const [playerItems, setPlayerItems] = useState<Map<number, number>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadItems();
  }, [playerId, token]);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const result = await getPlayerItems(playerId, token);

      if (result && result.items && result.playerItems) {
        setItems(result.items);
        setPlayerItems(result.playerItems);
      }
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items,
    playerItems,
    isLoading,
    reloadItems: loadItems,
  };
}
