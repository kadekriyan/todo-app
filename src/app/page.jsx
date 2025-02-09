import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Todo List</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Add a new task"
          className="p-2 border border-gray-300 rounded-lg shadow-md w-64"
        />
        <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
          Add
        </button>
      </div>
      <ul className="space-y-4">
        <li className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
          <span className="text-gray-700">Task 1</span>
          <div className="flex space-x-2">
            <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              ✓
            </button>
            <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              🗑
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
}
