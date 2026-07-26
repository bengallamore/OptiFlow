export async function generateSeoContent({
  title,
  targetKeyword,
}: {
  title: string;
  targetKeyword?: string;
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const prompt = `Write an SEO-optimized blog article.
Title: ${title}
${targetKeyword ? `Target keyword: ${targetKeyword}` : ""}

Write 500-800 words in markdown. Naturally include the target keyword a few times if one is given. Use a clear H1 title, a few H2 subheadings, and a short concluding paragraph. Return only the article content, no preamble.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic API error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const textBlock = data.content?.find((b: any) => b.type === "text");
  return textBlock?.text ?? "";
}
