
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');

require("dotenv").config();

const signupRoutes = require("./routes/signupRoute");
const loginRoutes = require("./routes/loginRoute");
const Message = require("./models/messageModel");
const sequelize = require("./config/db-connection");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);

app.get("/", (req, res) => {
    res.send("YourMessenger Backend is running!");
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error("Authentication error"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        next();
    } catch (error) {
        next(new Error("Invalid token"));
    }
});

io.on("connection", async (socket) => {

    console.log("User connected:", socket.id, "UserId:", socket.userId);

    try {
        const messages = await Message.findAll({
            order: [["createdAt", "ASC"]]
        });

        socket.emit("messageHistory", messages);

    } catch (error) {
        console.log("Error loading messages:", error);
    }

    socket.on("sendMessage", async (data, callback) => {

        try {
            const { message } = data;
            const userId = socket.userId; // JWT se aaya

            if (!message || !message.trim()) {
                return callback({
                    success: false,
                    message: "Message is required"
                });
            }

            const newMessage = await Message.create({
                userId,
                message: message.trim()
            });

            io.emit("receiveMessage", newMessage);

            callback({
                success: true
            });

        } catch (error) {
            console.log("Message error:", error);

            callback({
                success: false,
                message: "Message sending failed"
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });

});

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log("Database connected successfully!");

        return sequelize.sync();
    })
    .then(() => {
        console.log("Database synced successfully!");

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.log("Database connection failed:", error);
    });
