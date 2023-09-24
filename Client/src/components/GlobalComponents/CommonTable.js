// Desc: Common table component for displaying data, passing prop as column, data and with edit and delete actions

import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
const CommonTable = ({ columns, data, actions, ...rest }) => {
  return (
    <div className="flex flex-col">
      <div className="-my-2 sm:-mx-6 ">
        {/* Table */}
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          {/* Table body */}
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 ">
              {/* Table header */}
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {data &&
                  data.map((item) => (
                    <tr key={item.id}>
                      {columns.map((column) =>
                        column === "image" ? (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={`https://picsum.photos/id/${item[column]}/200/300`}
                                  alt=""
                                />
                              </div>
                            </div>
                          </td>
                        ) : column === "status" ? (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item[column] === "available"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item[column]}
                            </span>
                          </td>
                        ) : (
                          <td
                            key={column}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            <div className="text-sm text-gray-900">
                              {item[column]}
                            </div>
                          </td>
                        )
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-row space-x-2">
                          {actions.map((action) => (
                            <button
                              key={action.name}
                              onClick={(e) => action.onClick(e, item.id)}
                              className=""
                            >
                              {/* edit, delete, accept, reject */}
                              {action.type === "edit" ? (
                                <PencilSquareIcon className="h-6 w-6 text-blue-500 " />
                              ) : action.type === "delete" ? (
                                <TrashIcon className="h-6 w-6 text-red-500" />
                              ) : action.type === "accept" ? (
                                <CheckIcon className="h-6 w-6 text-green-500" />
                              ) : action.type === "block" ? (
                                <button className="text-red-500 outline outline-1 rounded-sm p-1 px-3 hover:bg-red-400 hover:text-white ">
                                  Restrict
                                </button>
                              ) : action.type === "unblock" ? (
                                <button className="text-green-500">
                                  Unblock
                                </button>
                              ) : (
                                action.type === "reject" && (
                                  <XMarkIcon className="h-6 w-6 text-red-500" />
                                )
                              )}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonTable;
