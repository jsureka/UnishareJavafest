// search bar and filter

import { SearchRounded } from "@mui/icons-material";

const Search = ({ handleSearch, handleFilter }) => {
  return (
    // search bar center tailwind
    <div className="flex justify-center items-center ">
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row justify-center items-center">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 bg-white w-full h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            onChange={handleSearch}
          />
          <button
            type="button"
            className="ml-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleFilter}
          >
            <SearchRounded />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
