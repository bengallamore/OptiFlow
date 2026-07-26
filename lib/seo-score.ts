export function scoreSeoContent({
  title,
  targetKeyword,
  body,
}: {
  title: string;
  targetKeyword?: string | null;
  body: string;
}): number {
  let score = 0;

  // Word count (0-30 points): ideal range 300-1500 words
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount >= 300 && wordCount <= 1500) score += 30;
  else if (wordCount >= 150) score += 15;

  // Keyword usage (0-30 points)
  if (targetKeyword) {
    const kw = targetKeyword.toLowerCase();
    const bodyLower = body.toLowerCase();
    const titleLower = title.toLowerCase();
    const occurrences = bodyLower.split(kw).length - 1;

    if (titleLower.includes(kw)) score += 10;
    if (occurrences >= 1) score += 10;
    if (occurrences >= 3 && occurrences <= 12) score += 10;
  } else {
    score += 15; // neutral partial credit if no keyword set
  }

  // Structure (0-25 points): headings present
  const headingCount = (body.match(/^#{1,3}\s/gm) || []).length;
  if (headingCount >= 1) score += 10;
  if (headingCount >= 3) score += 15;

  // Title length (0-15 points): 20-70 chars is a good SEO title length
  if (title.length >= 20 && title.length <= 70) score += 15;
  else if (title.length > 0) score += 5;

  return Math.min(100, score);
}
