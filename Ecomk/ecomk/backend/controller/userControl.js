const userModel = require('../models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const transporter = require('../config/email');

const userControl = {
  registerUser: async (req, res) => {
    const { username, first_name, last_name, email, phone, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verification_token = crypto.randomBytes(32).toString('hex');
      await userModel.createUser({
        username,
        first_name,
        last_name,
        email,
        phone,
        password: hashedPassword,
        verification_token
      });
  
      const verificationUrl = `http://localhost:8080/verify?token=${verification_token}`;
      const mailOptions = {
        from: 'no-reply@yourapp.com',
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the link: ${verificationUrl}`
      };
      await transporter.sendMail(mailOptions);
      return res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for verification.',
      });
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ message: 'An error occurred during registration. Please try again.' });
    }
  },
  
  
    
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findUserByEmailOrUsername(email);
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or username' });
        }
        if (!user.is_verified) {
            return res.status(400).json({ success: false, message: 'Account is not verified. Please verify your email.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        
        req.session.userId = user.id;
        console.log('Session after login:', req.session.userId); // Debug session

        // Generate a new token
        const newToken = crypto.randomBytes(32).toString('hex');
        const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await userModel.createUserToken(user.id, newToken, expiryDate);

        // Set session data here

        // Redirect based on the role
        const roleRedirects = {
            cashier: `/cashier?token=${newToken}`,
            admin: `/admin?token=${newToken}`,
            user: `/dashboard?token=${newToken}`,
        };
        
        const redirectUrl = roleRedirects[user.role] || '/';
        return res.status(200).json({ 
            success: true, 
            message: 'Login successful', 
            redirectUrl: redirectUrl 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
    
},




logoutUser: async (req, res) => {
    try {
        const userId = req.session.userId;  // Get user ID from session
        
        if (!userId) {
            return res.status(400).json({ success: false, message: 'No user is logged in' });
        }

        // Delete the user's cookie from the database
        await userModel.deleteUserToken(userId);

        // Clear the cookie from the user's browser
        res.clearCookie('token', { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure cookies in production
        });

        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error logging out' });
            }
            res.status(200).json({ success: true, message: 'Logout successful' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
},

getProfile: (req, res) => {
    // Retrieve the token from the query parameter
    const token = req.query.token;
  
    // Check if the token is provided
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token is required' });
    }
  
    // Find user by token using the model (assuming the token is valid and mapped to a user)
    userModel.findUserByToken(token)
      .then(user => {
        if (!user) {
          return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
  
        // If you have token expiration logic, handle it here
        // For example: if (Date.now() > user.tokenExpirationTime) { return res.status(401).json({ success: false, message: 'Token expired' }); }
  
        // Send only the necessary user data in the response
        const userData = {
          first_name: user.first_name,
          last_name: user.last_name,
         username: user.username,
          email: user.email,
          phone: user.phone,
          // Add any other data you want to send, but avoid sending sensitive information like password
        };
        
        res.status(200).json({ success: true, user: userData });
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
        res.status(500).json({ success: false, message: 'Server error' });
      });
  },
  
  

  updateProfile : (req, res) => {
    const userId = req.session.userId; // Assuming user ID is stored in session
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const userData = req.body; // Data sent from the frontend
    userModel.updateUserProfile(userId, userData)
      .then(() => {
        res.status(200).json({ message: 'Profile updated successfully' });
      })
      .catch(err => {
        console.error('Error updating user profile:', err);
        res.status(500).json({ message: 'Internal server error' });
      });
  },

  getHomepage: async (req, res) => {
    try {
        // Extract the token from the URL (assuming it's in the query string)
        const token = req.query.token;
        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is missing' });
        }

        // Find the user based on the token (you should have a function to verify and find the user)
        const user = await userModel.findUserByToken(token); // Ensure you have a function in your model for this
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        // If the user exists, send the username as a response
        return res.status(200).json({
            success: true,
            username: user.username, // Assuming 'username' is a field in your user table
        });
    } catch (error) {
        console.error('Error fetching homepage data:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
},




    verifyUser: async (req, res) => {
      const { token } = req.query;
      const user = await userModel.findByVerificationToken(token);
      const user1 = user;
      const updateResult = await userModel.updateVerificationStatus( token);
  },

  resetPassword: async (req, res) => {
    const { identifier } = req.body; // Email or username from the frontend

    try {
        // Step 1: Check if user exists based on email or username
        const user = await userModel.findUserByIdentifier(identifier);
        if (!user) {
            console.log('User not found with identifier:', identifier);
            return res.status(400).json({ message: 'No account found with that email/username.' });
        }

        // Step 2: Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        // Step 3: Set expiration time 1 hour from now (UTC+8)
        const resetTokenExpiration = new Date(Date.now() + 3600000 + (8 * 3600000)).toISOString();
        console.log('Reset token expiration:', resetTokenExpiration);

        // Step 4: Save the reset token and expiration to the user record in the database
        try {
            await userModel.saveResetToken(user.id, resetToken, resetTokenExpiration);
            console.log('Reset token and expiration saved for user ID:', user.id);
        } catch (err) {
            console.error('Error saving reset token:', err);
            return res.status(500).json({ message: 'An error occurred while saving the reset token.' });
        }

        // Step 5: Create the reset password link
        const resetLink = `http://localhost:8080/new-password/${resetToken}`;
        console.log('Password reset link:', resetLink);

        // Step 6: Send the reset link via email
        await transporter.sendMail({
            from: 'your-email@gmail.com',
            to: user.email,
            subject: 'Password Reset Request',
            text: `Please click the link below to reset your password:\n\n${resetLink}`
        });
        console.log('Password reset email sent to:', user.email);

        // Step 7: Return a success response
        return res.json({
            success: true,
            message: 'If this email/username exists, you will receive a password reset link shortly.'
        });

    } catch (error) {
        console.error('Error during password reset request:', error);
        return res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
    }
},

// Function to handle the actual password reset with the token and new password
 resetPasswordWithToken : async (req, res) => {
    const { token, newPassword } = req.body; 
    console.log(token);
    
    try {
        // Step 1: Find user by reset token
        const user = await userModel.findByResetToken(token);
        console.log('User found:', user);

        // Step 2: Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

        // Step 3: Update user's password
        await userModel.updatePassword(user.id, hashedPassword);
        console.log('Password updated for user ID:', user.id);

        // Step 4: Clear the reset token after successful password reset
        await userModel.clearResetToken(user.id);
        console.log('Reset token cleared for user ID:', user.id);

        // Step 5: Return success response
        return res.status(200).json({
            success: true,
            message: 'Password successfully reset. You can now log in with your new password.'
        });

    } catch (error) {
        console.error('Error during password reset process:', error);
        return res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
    }
},

getAllUsers: async (req, res) => {
  const { role } = req.params; // Assuming you pass the role as a URL parameter
  try {
    const users = await userModel.getAllUsersByRole(role);
    res.json(users);
  } catch (err) {
    console.error('Error fetching users by role:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
},







};

module.exports = userControl;
