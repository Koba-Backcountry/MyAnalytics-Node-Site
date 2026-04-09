async function updateVisitors() {
  try {
    const res = await fetch("/api/visitors");
    const data = await res.json();
    document.getElementById("visitor-count").textContent = data.visitors;
  } catch (e) {
    console.error("Failed to fetch visitors", e);
  }
}

// Update every 3 seconds
setInterval(updateVisitors, 3000);
updateVisitors();
