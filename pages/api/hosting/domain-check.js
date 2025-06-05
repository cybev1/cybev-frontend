
export default function handler(req, res) {
  const { domain } = req.query;
  if (!domain || domain.length < 3) {
    return res.status(400).json({ available: false, message: "Invalid domain." });
  }

  // Mock logic: pretend domains ending in "test" are unavailable
  const isAvailable = !domain.includes("test");
  res.status(200).json({
    available: isAvailable,
    message: isAvailable
      ? `🎉 Congratulations! ${domain} is available!`
      : `❌ Sorry, ${domain} is already taken.`,
  });
}
