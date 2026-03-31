import ContactMessage from '../models/ContactMessage.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Create contact message in database
    const contact = await ContactMessage.create({
      name,
      email,
      message,
    });

    // Log for development/debugging (optional)
    console.log('New Contact Message:', {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      createdAt: contact.createdAt,
    });

    res.status(201).json({
      message: 'Message received successfully! We will get back to you soon.',
      id: contact._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact/messages
// @access  Private/Admin
export const getAllContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ read: 1, createdAt: -1 }) // Unread first, then newest
      .select('-__v');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read/unread (Admin only)
// @route   PATCH /api/contact/:id/read
// @access  Private/Admin
export const markMessageAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { read } = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { read: read !== undefined ? read : true },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({
      message: `Message marked as ${message.read ? 'read' : 'unread'}`,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({
      message: 'Message deleted successfully',
      id: message._id,
    });
  } catch (error) {
    next(error);
  }
};
