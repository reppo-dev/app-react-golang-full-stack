const App = () => {
  return (
    <div className="">
      <header className="bg-gray-800 text-white flex items-center justify-between px-6 py-3">
        <div className="text-lg font-semibold">Company name</div>

        <div className="flex items-center space-x-4 w-1/2">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-1 rounded bg-gray-200 text-black focus:outline-none"
          />
        </div>

        <button className="text-sm hover:underline">Sign out</button>
      </header>

      <div className="flex">
        <aside className="w-60 bg-white border-r min-h-screen">
          <nav className="p-4">
            <a href="#" className="block text-blue-600 font-medium">
              Dashboard
            </a>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="bg-white shadow rounded">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 text-sm font-semibold">#</th>
                  <th className="p-3 text-sm font-semibold">Header</th>
                  <th className="p-3 text-sm font-semibold">Header</th>
                  <th className="p-3 text-sm font-semibold">Header</th>
                  <th className="p-3 text-sm font-semibold">Header</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">1,001</td>
                  <td className="p-3">Lorem</td>
                  <td className="p-3">ipsum</td>
                  <td className="p-3">dolor</td>
                  <td className="p-3">sit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
