const express = require("express");
const cors = require("cors");
require("dotenv").config();
const signupRoutes = require("./routes/signupRoute");
const loginRoutes = require("./routes/loginRoute");
const sequelize = require("./config/db-connection");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);



app.get("/", (req, res) => {
    res.send("YourMessage Backend is running!");
});

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log("Database connected successfully!");
        
        // Sync database to create tables if they don't exist
        return sequelize.sync();
    })
    .then(() => {
        console.log("Database synced successfully!");
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Database connection failed:", error);
    });