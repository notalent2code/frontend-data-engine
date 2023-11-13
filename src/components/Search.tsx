import { Input } from '@/components/ui/Input';
import { FC } from 'react';

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Search: FC<SearchProps> = ({ ...props }) => {
  return (
    <Input
      {...props}
      type='search'
      placeholder='Search...'
      className='w-[200px] md:w-[300px] bg-white my-6'
    />
  );
};

export default Search;
