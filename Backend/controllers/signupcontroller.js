
const User = require('../models/signupModel');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db-connection');
const path = require('path');


// POST request - Signup
const userSignUp = async (req, res) => {

    try {

        console.log("Request body:", req.body);

        const {name, email, password} = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({

            where: {
                email
            }

        });


        if (existingUser) {

            return res.status(400).json({
                message: "Email already exists"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });


        console.log("User created:", user);


        // Send response
        return res.status(201).json({

            id: user.id,
            name: user.name,
            email: user.email

        });


    } catch (error) {


        console.error("Error creating user:", error);
        console.error("Error stack:", error.stack);


        return res.status(500).json({

            error: error.message

        });
    }
};






module.exports = {

    userSignUp

};

