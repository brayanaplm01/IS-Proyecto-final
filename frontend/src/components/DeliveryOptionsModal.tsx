'use client';

import { useState } from 'react';

interface DeliveryOption {
  type: string;
  description: string;
  cost: number;
}

interface DeliveryOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDelivery: (cost: number, type: string, description: string) => void;
}

export default function DeliveryOptionsModal({
  isOpen,
  onClose,
  onSelectDelivery,
}: DeliveryOptionsModalProps) {
  const [selectedOption, setSelectedOption] = useState<DeliveryOption | null>(null);

  const deliveryOptions: DeliveryOption[] = [
    { type: 'normal', description: 'Entrega normal (2 a 3 días)', cost: 0 },
    { type: 'platino', description: 'Entrega platino (1 día)', cost: 100 },
    { type: 'oro', description: 'Entrega oro (siguientes horas)', cost: 250 },
  ];

  const handleSelect = () => {
    if (selectedOption) {
      onSelectDelivery(selectedOption.cost, selectedOption.type, selectedOption.description);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Selecciona tipo de entrega</h3>
        <div className="space-y-4">
          {deliveryOptions.map((option) => (
            <div
              key={option.type}
              className={`cursor-pointer p-4 border rounded-md ${selectedOption?.type === option.type ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              onClick={() => setSelectedOption(option)}
            >
              <div className="font-semibold text-gray-900">{option.description}</div>
              <div className="text-sm text-gray-600">
                {option.cost === 0 ? 'Sin cargo' : `+ $${option.cost.toFixed(2)}`}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleSelect}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedOption}
        >
          Continuar
        </button>
      </div>
    </div>
  );
} 