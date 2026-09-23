import mongoose from 'mongoose';

// L-4/#36 data-class note: documents in this collection carry sender PII
// (name + email + free-text message). Retention is ADMIN-MANAGED — the admin
// UI's delete endpoint is the purge path; no automatic TTL window ships in
// v1 (a TTL index is the documented upgrade if a fixed window is ever
// required). Logs carry receipt-id only, never contents.

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for efficient admin queries (unread messages first, then by date)
contactMessageSchema.index({ read: 1, createdAt: -1 });
contactMessageSchema.index({ email: 1 });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
