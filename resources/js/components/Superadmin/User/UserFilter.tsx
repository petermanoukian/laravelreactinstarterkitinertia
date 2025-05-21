// resources/js/Components/User/UserFilter.tsx

import React from 'react';

type UserFilterProps = {
  search: string;
  role: string;
  setSearch: (value: string) => void;
  setRole: (value: string) => void;
};

const UserFilter: React.FC<UserFilterProps> = ({ search, role, setSearch, setRole }) => {
  return (
    <div className="mb-4 flex gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name or email"
        className="border px-3 py-2 rounded w-64"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">All Roles</option>
        <option value="superadmin">Superadmin</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
    </div>
  );
};

export default UserFilter;
