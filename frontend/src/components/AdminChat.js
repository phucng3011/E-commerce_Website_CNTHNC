import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-toastify';

const socket = io(process.env.REACT_APP_API_URL, { autoConnect: false });

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);

  const admin = JSON.parse(localStorage.getItem('user')) || {};

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!admin?._id) {
      setError('Admin not logged in');
      return;
    }

    console.log('Connecting socket for admin:', admin._id);
    socket.connect();
    socket.emit('join_chat', admin._id);

    socket.on('receive_message', (message) => {
      console.log('Received message:', message);
      const messageSender = message.sender.toString();
      const adminId = admin._id.toString();
      const selectedUserId = selectedUser?._id?.toString();

      if (
        (messageSender === selectedUserId || messageSender === adminId) &&
        (message.receiver === selectedUserId || message.receiver === adminId)
      ) {
        setMessages((prev) => [...prev, message]);
      }

      if (messageSender !== adminId && messageSender !== selectedUserId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [messageSender]: (prev[messageSender] || 0) + 1,
        }));
        const sender = users.find(user => user._id.toString() === messageSender);
        toast.info(`New message from ${sender?.name || 'User'}: ${message.content}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to chat server');
    });

    return () => {
      console.log('Disconnecting socket for admin');
      socket.off('receive_message');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [admin._id, selectedUser, users]);

  useEffect(() => {
    if (!admin?._id) return;

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const nonAdminUsers = response.data.filter(user => !user.isAdmin);
        setUsers(nonAdminUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      }
    };
    fetchUsers();
  }, [admin._id]);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat/messages/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
        setUnreadCounts((prev) => ({
          ...prev,
          [selectedUser._id]: 0,
        }));
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages');
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !admin?._id) {
      setError('Please select a user and enter a message');
      return;
    }

    const messageData = {
      senderId: admin._id,
      receiverId: selectedUser._id,
      content: newMessage,
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
    setError(null);
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] bg-white rounded-lg shadow-lg">
      <div className="w-1/4 border-r bg-gray-50 overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Chats</h3>
        </div>
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 ${
                selectedUser?._id === user._id ? 'bg-gray-200' : ''
              }`}
            >
              <img
                src={user.avatar || 'https://via.placeholder.com/40'}
                alt={user.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{user.name}</p>
                  {unreadCounts[user._id] > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadCounts[user._id]}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b flex items-center">
              <img
                src={selectedUser.avatar || 'https://via.placeholder.com/40'}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${msg.sender.toString() === admin._id.toString() ? 'text-right' : 'text-left'}`}
                >
                  <p
                    className={`inline-block p-2 rounded-lg max-w-[80%] overflow-wrap break-word ${
                      msg.sender.toString() === admin._id.toString() ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    {msg.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-l-lg focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;