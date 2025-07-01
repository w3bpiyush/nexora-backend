import express from 'express';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message';


const router = express.Router();

// POST /api/contact/post/message
router.post('/post/message', [
  // Validation middleware
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
], async (req:any, res:any) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Create new message
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      status: 'pending'
    });

    // Save to database
    const savedMessage = await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: savedMessage._id,
        status: savedMessage.status
      }
    });

  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

export default router;