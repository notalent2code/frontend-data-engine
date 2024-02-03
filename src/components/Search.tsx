import { Input } from '@/components/ui/Input';
import { SearchIcon } from 'lucide-react';
import { FC } from 'react';

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Search: FC<SearchProps> = ({ ...props }) => {
  return (
    <div className='relative flex flex-row items-center w-[200px] md:w-[300px]'>
      <Input
        {...props}
        name='search'
        type='search'
        placeholder='Search...'
        className='w-full bg-white pl-8'
      />
      <SearchIcon className='absolute left-2 pr-1 text-muted-foreground' />{' '}
    </div>
  );
};

export default Search;
