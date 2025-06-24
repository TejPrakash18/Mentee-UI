export async function fetchHeatmap(username, year) {
  try {
    // const { data } = await axios.get(`/api/users/${username}/heatmap?year=${year}`);
    // return data;

    // ---- Mock: random contribution counts ----
    const start = new Date(`${year}-01-01`);
    const end   = new Date(`${year}-12-31`);
    const dayMs = 24 * 60 * 60 * 1000;
    const out   = [];
    for (let d = start; d <= end; d = new Date(d.getTime() + dayMs)) {
      out.push({
        date: d.toISOString().slice(0, 10),
        count: Math.random() < 0.4 ? Math.floor(Math.random() * 4) : 0
      });
    }
    return out;
  } catch (err) {
    console.error("fetchHeatmap failed", err);
    return [];
  }
}
