import React, { useState, useEffect } from 'react';
import './ManageUsers.css';
import axios from 'axios';
import Modal from '../components/Modal';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/list`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/user/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!selectedUser) return;
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleModalSubmit = async () => {
    if (!selectedUser) return;
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/user/${selectedUser.id}`, {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? { ...user, name: selectedUser.name, email: selectedUser.email, role: selectedUser.role }
            : user
        )
      );
      alert('User updated successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  return (
    <div className="manage-users">
      <h1>Manage Users</h1>
      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Editing User */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit User"
      >
        {selectedUser && (
          <form onSubmit={(e) => e.preventDefault()}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={selectedUser.name}
                onChange={handleModalChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={selectedUser.email}
                onChange={handleModalChange}
              />
            </label>
            <label>
              Role:
              <select
                name="role"
                value={selectedUser.role}
                onChange={handleModalChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <div className="modal-actions">
              <button onClick={handleModalSubmit}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ManageUsers;
