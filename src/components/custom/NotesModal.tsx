import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { NotebookPen } from "lucide-react";

const NotesModal = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
          <NotebookPen className='w-full h-full' />
        </button>
      </PopoverTrigger>
      <PopoverContent >
        <Input
          placeholder="Write your note"
        />
        <div className="flex justify-end mt-2">
          <button className="px-4 py-2 bg-green-500 text-white rounded-md">Save</button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotesModal;