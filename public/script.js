async function loadStats() {
  const res = await fetch("/api/stats");
  const data = await res.json();

  document.getElementById("total").textContent = data.total;
  document.getElementById("today").textContent = data.today;

  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  data.last.forEach(v => {
    const row = `<tr>
      <td>${v.id}</td>
      <td>${v.ip}</td>
      <td>${v.user_agent}</td>
      <td>${v.ts}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

setInterval(loadStats, 3000);
loadStats();
