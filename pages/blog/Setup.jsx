
<button onClick={() => 
    fetch("https://api.cybev.io/blog/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    .then(res => res.json())
    .then(data => {
    if (data.success) {
      alert("✅ Blog publish successful!");
      // You can optionally redirect: window.location.href = "/dashboard"
    } else {
      alert("⚠️ Publish failed: " + (data.message || "Unknown error"));
    }
    .catch(err => alert("Something went wrong: " + err.message));
    } className="px-8 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">🚀 Publish My Blog</button>
