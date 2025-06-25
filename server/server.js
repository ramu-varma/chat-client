require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const Message = require('./models/Message');
const { messageSchema } = require('./validator/messageValidator');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('MongoDB Error:', err));

// Get all chat messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log(`🔌 New client: ${socket.id}`);

  socket.on('sendMessage', async (data) => {
    const { error } = messageSchema.validate(data);
    if (error) return;

    try {
      const newMsg = new Message(data);
      await newMsg.save();
      socket.broadcast.emit('receiveMessage', data);
    } catch (err) {
      console.error('Error saving message:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
