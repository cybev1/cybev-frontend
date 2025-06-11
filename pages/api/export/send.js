
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    const mailOptions = {
      from: `"CYBEV Reports" <${process.env.EMAIL_USERNAME}>`,
      to: process.env.REPORT_RECIPIENTS || 'admin@example.com',
      subject: '📊 Weekly CYBEV Analytics Report',
      html: `
        <h2>Weekly Summary</h2>
        <p>Attached is your weekly analytics report from the CYBEV platform.</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      `,
      attachments: [
        {
          filename: 'cybev_weekly_report.pdf',
          path: './public/sample.pdf', // This can be replaced with generated file path
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Report email sent successfully.' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send report email.' });
  }
}
