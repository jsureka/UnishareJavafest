// search bar and filter

import { SearchOutlined } from "@mui/icons-material";
import { useState } from "react";

const Search = ({ categories, onSearch, onCategoryChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    onCategoryChange(e.target.value);
  };

  return (
    <div className="bg-gray-200 py-4 -mt-5">
      <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="w-1/2">
          <div className="relative text-gray-600">
            <input
              type="search"
              name="search"
              placeholder="Search"
              className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className=" ml-3 top-0 mt-3 mr-4"
              onClick={() => onSearch(searchTerm)}
            >
              <SearchOutlined className="h-4 w-4 fill-current hover:text-blue-500" />
            </button>
          </div>
        </div>
        <div className="w-1/2 flex justify-end">
          <div className="w-1/2 ml-2">
            <select
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="0">All Categories</option>
              {categories &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
