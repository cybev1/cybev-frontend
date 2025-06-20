
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '../reports/weekly-report.pdf');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your provider or custom SMTP settings
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const recipients = (process.env.REPORT_RECIPIENTS || '').split(',').map(email => email.trim());

const mailOptions = {
  from: `"CYBEV Reports" <${process.env.EMAIL_USERNAME}>`,
  to: recipients,
  subject: '📄 Your CYBEV Weekly Report',
  text: 'Attached is your weekly performance summary on CYBEV.',
  attachments: [
    {
      filename: 'weekly-report.pdf',
      path: reportPath
    }
  ]
};

async function sendReport() {
  try {
    if (!fs.existsSync(reportPath)) {
      console.error('❌ Report not found at', reportPath);
      return;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Report email sent:', info.messageId);
  } catch (err) {
    console.error('❌ Failed to send email:', err.message);
  }
}

sendReport();
