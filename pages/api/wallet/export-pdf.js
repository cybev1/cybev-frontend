
import { jsPDF } from 'jspdf';

export default async function handler(req, res) {
  try {
    const logs = [
      { type: 'Stake', amount: 100, date: '2025-06-05T10:00:00Z' },
      { type: 'Claim', amount: 47.5, date: '2025-06-07T08:00:00Z' },
      { type: 'Reward Unlock', amount: 12.5, date: '2025-06-10T09:30:00Z' },
      { type: 'Stake', amount: 50, date: '2025-06-11T12:15:00Z' }
    ];

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('CYBEV Wallet Activity Log', 20, 20);
    doc.setFontSize(12);

    logs.forEach((log, i) => {
      doc.text(
        `${log.type} | ${log.amount} CYBV | ${new Date(log.date).toLocaleString()}`,
        20,
        40 + i * 10
      );
    });

    const pdf = doc.output('arraybuffer');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=wallet_logs.pdf');
    res.send(Buffer.from(pdf));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to export PDF' });
  }
}
