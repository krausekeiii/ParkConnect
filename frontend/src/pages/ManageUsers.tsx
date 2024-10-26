import React, { useState } from 'react';
import './ManageUsers.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string; // e.g., "admin", "volunteer"
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'volunteer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'volunteer' }
  ]);

  const handleDelete = (userId: number) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
  };

  const handleEdit = (userId: number) => {
    alert(`Edit user with ID: ${userId}`);
  };

  return (
    <div className="manage-users">
      <h1>Manage Users</h1>
      
      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEdit(user.id)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
