export default async function handler(req, res) {
  const { word } = req.query;

  if (!word) {
    return res.status(400).json({ error: 'Missing "word" query parameter' });
  }

  try {
    const cleanWord = word.trim().toLowerCase();
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Definition not found' });
    }

    const data = await response.json();
    const definition = data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition || null;

    // Cache successful responses for a day to reduce repeat calls to the upstream API
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    return res.status(200).json({ definition });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch definition' });
  }
}