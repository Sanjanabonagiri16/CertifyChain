import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { sendCredentialEmail } from '../utils/emailService';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const { success, error } = useNotification();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();

    if (!validateEmail(newUserEmail)) {
      error('Please enter a valid email address');
      return;
    }

    // Check if user already exists
    if (users.some(user => user.email === newUserEmail)) {
      error('A user with this email already exists');
      return;
    }

    const password = generatePassword();
    const newUser = {
      email: newUserEmail,
      password: password, // In production, this should be hashed
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setNewUserEmail('');

    // Send credentials via email
    sendCredentialEmail(newUser.email, password);
    success('User created successfully. Credentials have been sent.');
  };

  const handleDeleteUser = (email) => {
    const updatedUsers = users.filter(user => user.email !== email);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    success('User deleted successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
      
      {/* Create User Form */}
      <form onSubmit={handleCreateUser} className="mb-6">
        <div className="flex gap-2">
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="Enter user email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Create User
          </button>
        </div>
      </form>

      {/* Users List */}
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.email}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDeleteUser(user.email)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        ))}

        {users.length === 0 && (
          <p className="text-center text-gray-500 py-4">No users created yet.</p>
        )}
      </div>
    </div>
  );
}

export default UserManagement; 