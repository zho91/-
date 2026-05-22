/**
 * Mock AI transformation: converts long-form text into social media content.
 * Replace this with a real LLM call (e.g., Anthropic Claude API) when ready.
 */
export function transformContent(text) {
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const words = text.split(/\s+/);
  const wordCount = words.length;

  // Pick key phrases for tweets
  const keyPhrases = sentences.slice(0, 6);

  const xPosts = [
    `🔥 Key insight: "${keyPhrases[0] || text.slice(0, 120)}..." — This changes everything. Thread 🧵`,
    `💡 "${keyPhrases[1] || text.slice(60, 180) || text.slice(0, 120)}"

Most people overlook this. Don't be most people.

RT if this resonated 🙌`,
    `📌 TL;DR of a ${wordCount}-word piece in one tweet:

"${keyPhrases[2] || text.slice(0, 140)}"

Full breakdown below 👇 #productivity #growth`,
  ];

  const linkedin = `🚀 I just came across this powerful idea — and I had to share it with my network.

${text.slice(0, 300)}${text.length > 300 ? "..." : ""}

Here's what stood out to me:

✅ ${keyPhrases[0] || "The core message is crystal clear"}
✅ ${keyPhrases[1] || "It challenges conventional thinking"}
✅ ${keyPhrases[2] || "Actionable and immediately applicable"}

In a world of information overload, content like this is rare. It doesn't just inform — it transforms the way we think.

Whether you're a founder, professional, or lifelong learner, I believe this perspective is worth your time.

What do you think? Drop your thoughts in the comments 👇

#ThoughtLeadership #GrowthMindset #Innovation #ContentMarketing`;

  return { xPosts, linkedin };
}
