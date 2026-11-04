
const Message = require('../models/messageModel');
const { Op } = require('sequelize');

let clients = [];

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.userId; // JWT middleware se aayega

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        const newMessage = await Message.create({
            userId,
            message: message.trim()
        });

        // Notify all waiting clients
        clients.forEach(client => {
            if (client.afterId < newMessage.id) {
                clearTimeout(client.timeout);

                if (!client.res.headersSent) {
                    client.res.json([newMessage]);
                }
            }
        });

        clients = clients.filter(client =>
            client.afterId >= newMessage.id
        );

        return res.status(201).json(newMessage);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const afterId = Number(req.query.afterId) || 0;

        // Check existing new messages
        const messages = await Message.findAll({
            where: {
                id: {
                    [Op.gt]: afterId
                }
            },
            order: [['id', 'ASC']],
            limit: 100
        });

        if (messages.length > 0) {
            return res.json(messages);
        }

        // Wait for new message
        const client = {
            res,
            afterId,
            timeout: null
        };

        clients.push(client);

        // Wait maximum 20 seconds
        client.timeout = setTimeout(() => {

            clients = clients.filter(c => c !== client);

            if (!res.headersSent) {
                res.json([]);
            }

        }, 20000);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    sendMessage,
    getMessages
};
