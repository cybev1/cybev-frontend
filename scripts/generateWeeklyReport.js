
const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

const generateWeeklyReport = async () => {
  const doc = new jsPDF();
  const reportData = {
    period: 'June 10 – June 16, 2025',
    posts: 8,
    views: 3450,
    shares: 290,
    earnings: 187.45,
    mints: 6,
    boosts: 11,
    summary: "Your engagement this week increased by 14%. AI-generated content and boosted posts performed best."
  };

  doc.setFontSize(16);
  doc.text('CYBEV Weekly Report', 14, 20);
  doc.setFontSize(11);
  doc.text(`Period: ${reportData.period}`, 14, 30);

  doc.autoTable({
    startY: 40,
    head: [['Metric', 'Value']],
    body: [
      ['Posts', reportData.posts],
      ['Views', reportData.views],
      ['Shares', reportData.shares],
      ['Earnings (CYBV)', reportData.earnings],
      ['Mints', reportData.mints],
      ['Boosts', reportData.boosts],
    ],
  });

  doc.setFontSize(12);
  doc.text('AI Summary:', 14, doc.lastAutoTable.finalY + 10);
  doc.setFontSize(10);
  doc.text(reportData.summary, 14, doc.lastAutoTable.finalY + 20);

  const outputPath = path.join(__dirname, '../reports/weekly-report.pdf');
  doc.save(outputPath);
  console.log('✅ Weekly report saved to:', outputPath);
};

generateWeeklyReport();
