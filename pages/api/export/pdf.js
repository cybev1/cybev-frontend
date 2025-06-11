
import { jsPDF } from "jspdf";

export default async function handler(req, res) {
  try {
    const doc = new jsPDF();
    doc.text("CYBEV Platform Report", 20, 20);
    doc.text("This is a sample PDF export. Real data logic will be connected.", 20, 30);
    const pdfData = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=cybev_report.pdf");
    res.send(Buffer.from(pdfData));
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to generate PDF." });
  }
}
