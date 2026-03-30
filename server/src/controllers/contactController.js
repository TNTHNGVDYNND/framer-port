// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
export const submitContactForm = (req, res) => {
  const { name, email, message } = req.body;

  // In a real application, you would typically:
  // 1. Validate the input data
  // 2. Save the data to a database
  // 3. Send an email (e.g., using Nodemailer)
  // 4. Integrate with a CRM or other service

  console.log('Contact Form Submission:');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);

  res.status(200).json({ message: 'Message received successfully!', data: { name, email, message } });
};
