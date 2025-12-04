"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid'; // Assuming @heroicons/react is installed

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | number | null | undefined;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(placeholder);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selectedOption = options.find(option => option.value === value);
    if (selectedOption) {
      setSelectedLabel(selectedOption.label);
    } else {
      setSelectedLabel(placeholder);
    }
  }, [value, options, placeholder]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  const handleOptionClick = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        className="flex items-center justify-between w-full px-3 py-2 text-left bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedLabel}
        <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none">
          {options.map((option) => (
            <li
              key={option.value}
              className="text-gray-900 dark:text-gray-100 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-500 hover:text-white"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 