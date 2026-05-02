import React from 'react';
import './ChatList.css';

function ChatList({ users, selectedUser, onSelectUser, currentUser }) {
  return (
    <div className="chat-list">
      <div className="chat-search">
        <input type="text" placeholder="Search or start new chat" />
      </div>
      <div className="chat-items">
        {users.map(user => (
          <div
            key={user._id}
            className={`chat-item ${selectedUser?._id === user._id ? 'active' : ''}`}
            onClick={() => onSelectUser(user)}
          >
            <div className="chat-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="chat-info">
              <h4>{user.username}</h4>
              <p>{user.email}</p>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="no-users">
            <p>No other users found</p>
            <p className="hint">Create another user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatList;