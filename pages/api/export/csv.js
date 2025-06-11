
import { Parser } from "json2csv";

export default async function handler(req, res) {
  try {
    const data = [
      { user: "prince", earnings: 320.45, tokens: 782.5 },
      { user: "faithwriter", earnings: 290.10, tokens: 610.2 },
    ];
    const parser = new Parser();
    const csv = parser.parse(data);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=cybev_report.csv");
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to generate CSV." });
  }
}
