import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { InvestorSelectOption, StartupSelectOption } from '@/types';
import { FC } from 'react';

interface SelectDropdownProps {
  name: string;
  options: StartupSelectOption[] | InvestorSelectOption[];
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
}

const SelectDropdown: FC<SelectDropdownProps> = ({ name, options, onChange }) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className='flex w-fit gap-2 bg-white'>
        <SelectValue placeholder={name} />
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem
            key={item.value}  
            value={item.value}
            className='flex items-center space-x-2'
          >
            {item.label}  
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectDropdown;
