
import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

const reportsDir = path.resolve('./public/reports');
const indexFile = path.join(reportsDir, 'index.json');

export default async function generateWeeklyReport() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const fileName = `weekly-${dateStr}.pdf`;
  const filePath = path.join(reportsDir, fileName);

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('CYBEV Weekly Report', 20, 20);
  doc.setFontSize(12);
  doc.text(`Date: ${dateStr}`, 20, 30);
  doc.text('Total Posts: 124', 20, 50);
  doc.text('Top User: prince', 20, 60);
  doc.text('Top Earning Post: "How AI Will Change the World"', 20, 70);
  doc.text('Mint Peak: June 6, 2025', 20, 80);
  doc.text('Web3 articles had 3x more engagement than average.', 20, 100);

  fs.writeFileSync(filePath, doc.output('arraybuffer'));

  let index = [];
  if (fs.existsSync(indexFile)) {
    const raw = fs.readFileSync(indexFile);
    index = JSON.parse(raw);
  }

  index.push({ date: dateStr, file: fileName });
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));

  return { success: true, file: fileName };
}

// For manual testing if needed
generateWeeklyReport().then(console.log).catch(console.error);
