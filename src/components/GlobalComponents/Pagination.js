export default function Pagination({
  postsPerPage,
  totalPosts,
  paginateFront,
  paginateBack,
  startIndex,
  endIndex,
}) {
  return (
    <div className="py-4 flex flex-col items-center justify-center">
      <div className="text-sm text-gray-700 mb-2">
        Showing
        <span className="font-medium px-2">
          {startIndex }
        </span>
        to
        <span className="font-medium px-2">{endIndex}</span>
        of
        <span className="font-medium px-1">{totalPosts}</span>
        results
      </div>

      <nav className="block mb-4"></nav>

      <div>
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm space-x-2"
          aria-label="Pagination"
        >
          <a
            onClick={() => {
              paginateBack();
            }}
            href="#"
            className="relative inline-flex items-center px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Previous
          </a>

          <a
            onClick={() => {
              paginateFront();
            }}
            href="#"
            className="relative inline-flex items-center px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Next
          </a>
        </nav>
      </div>
    </div>
  );
}
