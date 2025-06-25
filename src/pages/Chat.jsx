import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {jwtDecode}from 'jwt-decode';
import axios from 'axios';

const socket = io(import.meta.env.VITE_API_URL);

const Chat = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    const decoded = jwtDecode(token);
    setUser(decoded);

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error('Error loading messages:', err));

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('userTyping', (name) => {
      if (name !== decoded.name) {
        setTypingUser(name);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setTypingUser('');
        }, 1000);
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userTyping');
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMsg = {
      sender: user.name,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.emit('sendMessage', newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setText('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Welcome, {user?.name}</h2>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}
        >
          Logout
        </button>
      </div>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.sender === user?.name ? 'flex-end' : 'flex-start' }}>
            <div className={`chat-message ${msg.sender === user?.name ? 'sender' : 'receiver'}`}>
              <b>{msg.sender}</b>: {msg.text}
              <div className="chat-message-time">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
        {isTyping && (
          <p className="typing-indicator">{typingUser} is typing...</p>
        )}
      </div>

      <div className="chat-input-section">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            socket.emit('userTyping', user.name);
          }}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button onClick={sendMessage} className="chat-send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
