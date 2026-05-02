import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { getUsers, getConversation, sendMessage } from '../services/api';
import { io } from 'socket.io-client';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import './Chat.css';

function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    if (currentUser) {
      newSocket.emit('join', currentUser._id);
    }

    // Load users
    loadUsers();

    return () => {
      newSocket.close();
    };
  }, [currentUser]);

  useEffect(() => {
    if (socket && selectedUser) {
      // Listen for incoming messages
      socket.on('receiveMessage', (message) => {
        if (message.senderId === selectedUser._id || message.receiverId === selectedUser._id) {
          setMessages(prev => [...prev, message]);
        }
      });

      socket.on('messageSent', (message) => {
        if (message.receiverId === selectedUser._id) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => {
        socket.off('receiveMessage');
        socket.off('messageSent');
      };
    }
  }, [socket, selectedUser]);

  const loadUsers = async () => {
    try {
      const allUsers = await getUsers();
      const otherUsers = allUsers.filter(user => user._id !== currentUser?._id);
      setUsers(otherUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadConversation = async (user) => {
    setSelectedUser(user);
    try {
      const conversation = await getConversation(currentUser._id, user._id);
      setMessages(conversation);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || !selectedUser) return;

    const messageData = {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      content: content.trim()
    };

    try {
      const savedMessage = await sendMessage(messageData);
      
      // Emit via socket for real-time delivery
      socket.emit('sendMessage', {
        ...savedMessage,
        senderId: currentUser._id,
        receiverId: selectedUser._id
      });
      
      setMessages(prev => [...prev, savedMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <div className="user-info">
            <div className="avatar">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h3>{currentUser?.username}</h3>
              <p>{currentUser?.email}</p>
            </div>
          </div>
        </div>
        <ChatList 
          users={users} 
          selectedUser={selectedUser}
          onSelectUser={loadConversation}
          currentUser={currentUser}
        />
      </div>
      
      <div className="chat-main">
        <ChatWindow 
          selectedUser={selectedUser}
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}

export default Chat;