
export default function handler(req, res) {
  if (req.method === "POST") {
    const { service, target, quantity } = req.body;
    const total = quantity * 0.05;
    console.log("📝 SMM Order received:", { service, target, quantity, total });
    return res.status(200).json({ success: true, message: "Order placed successfully", total });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
