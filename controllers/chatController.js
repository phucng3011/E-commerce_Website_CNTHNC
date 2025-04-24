const Message = require('../models/messageModel');

const getMessages = async (req, res) => {
  const userId = req.user.id;
  const { receiverId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).sort('createdAt');
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMessages };