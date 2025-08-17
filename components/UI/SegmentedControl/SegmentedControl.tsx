
import React, { useState } from "react";
import css from './SegmentedControl.module.scss';

interface SegmentedControlProps {
  options: string[]; // Labels for the radio buttons
  initialSelection?: string | null;
  onSelectionChange: (selectedOption: string) => void; // Callback function to execute on selection
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({  options, initialSelection=null, onSelectionChange }) => {
  const initialSelectionIndex = initialSelection ? options.indexOf(initialSelection) : 0;
  const [selected, setSelected] = useState<string>(options[initialSelectionIndex]);

  const handleSelection = (option: string) => {
    setSelected(option);
    onSelectionChange(option);
  };

  return (
    <div className={css.container}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleSelection(option)}
          className={ `${css.button} ${selected === option ? css.selected : ''}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
