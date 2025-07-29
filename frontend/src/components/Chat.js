import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CartContext } from '../context/CartContext';

const socket = io(process.env.REACT_APP_API_URL, { autoConnect: false });

const Chat = () => {
  const { user } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [receiverId] = useState('67dfaecbda782c5ed851bf0d');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user?._id) {
      console.log('User not logged in, cannot initialize chat', { user });
      return;
    }

    console.log('Connecting socket for user:', user._id);
    socket.connect();
    socket.emit('join_chat', user._id);

    socket.on('receive_message', (message) => {
      console.log('Received message:', message);
      const messageSender = message.sender.toString();
      const messageReceiver = message.receiver.toString();
      const userId = user._id.toString();

      if (
        (messageSender === receiverId && messageReceiver === userId) ||
        (messageSender === userId && messageReceiver === receiverId)
      ) {
        setMessages((prev) => [...prev, message]);
        if (!isOpen && messageSender !== userId) {
          setUnreadMessages((prev) => prev + 1);
        }
      }

      if (messageSender !== userId) {
        toast.info(`New message from Admin: ${message.content}`, {
          position: 'top-right',
          autoClose: 3000,
          onClick: () => {
            setIsOpen(true);
            setUnreadMessages(0);
          },
        });
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to chat server');
    });

    return () => {
      console.log('Disconnecting socket');
      socket.off('receive_message');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [user, receiverId, isOpen]);

  useEffect(() => {
    if (!isOpen || !user?._id) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching messages for receiver:', receiverId);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat/messages/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Messages fetched:', response.data);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError(error.response?.data?.message || 'Failed to fetch messages');
      }
    };
    fetchMessages();
  }, [isOpen, user, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?._id) {
      console.log('Cannot send message: invalid input or user', { newMessage, user });
      setError('Please log in and enter a message');
      return;
    }

    if (!receiverId || !/^[0-9a-fA-F]{24}$/.test(receiverId)) {
      console.log('Invalid receiverId:', receiverId);
      setError('Invalid receiver ID');
      return;
    }

    const messageData = {
      senderId: user._id,
      receiverId,
      content: newMessage,
    };

    console.log('Sending message:', messageData);
    socket.emit('send_message', messageData);
    setNewMessage('');
    setError(null);
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setUnreadMessages(0);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={handleOpenChat}
          className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 relative"
        >
          Chat
          {unreadMessages > 0 && (
            <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
              {unreadMessages}
            </span>
          )}
        </button>
      ) : (
        <div className="bg-white w-80 h-96 rounded-lg shadow-lg flex flex-col">
          <div className="bg-red-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3>Chat Support</h3>
            <button onClick={() => setIsOpen(false)} className="text-white">
              ✕
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.sender.toString() === user._id.toString() ? 'text-right' : 'text-left'}`}
              >
                <p
                  className={`inline-block p-2 rounded-lg max-w-[80%] overflow-wrap break-word ${
                    msg.sender.toString() === user._id.toString() ? 'bg-red-100' : 'bg-gray-100'
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
          <form onSubmit={handleSendMessage} className="p-3 border-t">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-l-lg focus:outline-none"
              />
              <button
                type="submit"
                className="bg-red-600 text-white p-2 rounded-r-lg hover:bg-red-700"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;