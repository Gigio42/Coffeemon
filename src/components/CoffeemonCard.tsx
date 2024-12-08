import Image from "next/image";

const CoffeemonCard = () => {
  return (
    <div className="bg-cream-200 rounded-lg p-2 shadow-md">
      <div className="flex items-center space-x-2">
        <Image
          src="/placeholder.svg?height=40&width=40"
          alt="Coffeemon"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="text-brown-900 font-semibold text-sm">Espressaur</p>
          <p className="text-brown-700 text-xs">Level 5</p>
        </div>
      </div>
    </div>
  );
};

export default CoffeemonCard;
