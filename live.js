// Vercel serverless function. It MUST live at  api/live.js  in the repo.
const USER = "nashyy53";

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=30");
  const off = { platform: "kick", isLive: false, title: null, viewers: null, game: null };
  try {
    const r = await fetch(`https://kick.com/api/v2/channels/${USER}`, {
      headers: {
        accept: "application/json",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
    });
    if (!r.ok) throw new Error("kick status " + r.status);
    const d = await r.json();
    const ls = d && d.livestream;
    res.status(200).json(
      ls
        ? {
            platform: "kick",
            isLive: true,
            title: ls.session_title || null,
            viewers: typeof ls.viewer_count === "number" ? ls.viewer_count : null,
            game: (ls.categories && ls.categories[0] && ls.categories[0].name) || null,
          }
        : off
    );
  } catch (e) {
    res.status(200).json({ ...off, error: String((e && e.message) || e) });
  }
};
