import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
const PageHeader = ({ title, description, actions, backlink, ...rest }) => {
  return (
    <div>
      {/* header using tailwind */}
      <header className="bg-white shadow">
        <div className="  py-6 sm:px-6 ">
          {/* icon */}
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              {/* return button */}
              {backlink && (
                <Link href={backlink}>
                  <ArrowLeftIcon className="h-6 w-6 text-gray-500" />
                </Link>
              )}

              <div className="ml-3 font-medium text-gray-900 truncate">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
            {/* actions => add new, submit, delete , reset */}
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <div className="flex gap-x-2">
                {actions &&
                  actions.map((action) =>
                    action.type === "submit" ? (
                      <button
                        key={action.name}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={action.onClick}
                      >
                        {action.name}
                      </button>
                    ) : action.type === "reset" ? (
                      <button
                        key={action.name}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={action.onClick}
                      >
                        {action.name}
                      </button>
                    ) : action.type === "addNew" ? (
                      <Link
                        href={action.href}
                        key={action.name}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        {action.name}
                      </Link>
                    ) : (
                      action.type === "delete" && (
                        <button
                          key={action.name}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                          onClick={action.onClick}
                        >
                          {action.name}
                        </button>
                      )
                    )
                  )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default PageHeader;
