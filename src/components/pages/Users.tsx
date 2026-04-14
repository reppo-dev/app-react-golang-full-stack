const Users = () => {
  return (
    <div>
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
  );
};

export default Users;
