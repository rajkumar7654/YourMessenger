const Message = require('../models/messageModel');

// POST request - Send message
const sendMessage = async (req, res) => {
    try {
        const { userId, message } = req.body;

        // Validate input
        if (!userId || !message) {
            return res.status(400).json({
                message: "userId and message are required"
            });
        }

        // Create message
        const newMessage = await Message.create({
            userId,
            message
        });

        console.log("Message saved:", newMessage);

        // Send response
        return res.status(201).json({
            id: newMessage.id,
            userId: newMessage.userId,
            message: newMessage.message,
            createdAt: newMessage.createdAt
        });

    } catch (error) {
        console.error("Error saving message:", error);
        return res.status(500).json({
            error: error.message
        });
    }
};

// GET request - Get all messages
const getMessages = async (req, res) => {
    try {
        // Get all messages from database
        const messages = await Message.findAll({
            order: [['createdAt', 'ASC']]
        });

        return res.status(200).json(messages);

    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    sendMessage,
    getMessages
};
