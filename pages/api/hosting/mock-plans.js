
export default function handler(req, res) {
  const mockPlans = [
    {
      name: "Starter Plan",
      price: "$3/mo",
      description: "Perfect for beginners starting a small blog or portfolio.",
      features: ["1 Website", "1GB SSD", "10GB Bandwidth", "Free SSL"]
    },
    {
      name: "Pro Plan",
      price: "$7/mo",
      description: "Best for growing websites with more storage needs.",
      features: ["5 Websites", "10GB SSD", "100GB Bandwidth", "Free Domain", "Free SSL"]
    },
    {
      name: "Unlimited Plan",
      price: "$12/mo",
      description: "Unlimited everything for large scale or business sites.",
      features: ["Unlimited Websites", "Unlimited SSD", "Unmetered Bandwidth", "Free Domain", "Priority Support"]
    }
  ];

  res.status(200).json(mockPlans);
}
