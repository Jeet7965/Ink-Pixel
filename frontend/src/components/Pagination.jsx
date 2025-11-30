import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

export default function Pagination({ totalItems, page, limit, setPage }) {
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="flex bg-[#0A1128] items-center justify-between border-t border-white/10 px-8 py-4 sm:px-15">
      
      {/* Mobile View */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="relative inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-300">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(page * limit, totalItems)}
            </span>{' '}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md">
            
            {/* Prev */}
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 hover:bg-white/5 disabled:opacity-40"
            >
              <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold 
                ${page === i + 1
                  ? "bg-indigo-500 text-white"
                  : "text-gray-200 hover:bg-white/5"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 hover:bg-white/5 disabled:opacity-40"
            >
              <ChevronRightIcon aria-hidden="true" className="size-5" />
            </button>

          </nav>
        </div>
      </div>
    </div>
  );
}
