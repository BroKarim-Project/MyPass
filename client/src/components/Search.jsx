import { Input } from '@headlessui/react';
import { Search } from 'lucide-react';
import { Fragment } from 'react';

export default function SearchBar() {
  return (
    <>
      <div className="relative w-full">
        <Input type="text" className="w-full h-10 bg-[#383838] pl-10 text-black rounded-md" name="full_name" as={Fragment}>
          {/* <Search/> */}
          {({ focus, hover }) => <input placeholder="Seach ..." className={('border text-black placeholder-gray-500 ', focus && 'bg-[#383838]', hover && 'shadow')} />}
        </Input>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
