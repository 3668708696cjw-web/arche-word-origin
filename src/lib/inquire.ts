import { createServerFn } from "@tanstack/react-start";

export const inquireWord = createServerFn({ method: "POST" })
  .validator((input: { lemma: string; meaning: string; oldest: string; kernel: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "此刻无法连通更深的一层。" };

    const prompt = `你是语源学家兼哲学家。用中文，对英语单词「${data.lemma}」作更深一层溯源。
汉语常用义：${data.meaning || "（词表未收）"}
已有最古老本质：${data.oldest.slice(0, 400)}
语义核：${data.kernel}

要求：
- 不要鸡汤、不要考试用法、不要罗列派生词清单。
- 像《印欧语词根词典》遇上严格的现象学：具体、克制、有洞察。
- 只输出 JSON，键为 oldest, philosophy, ontology, phenomenology, epistemology, culture。每项 80–140 字。`;

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 900,
        temperature: 0.4,
      }),
    });
    if (!res.ok) return { ok: false as const, error: `溯源未成（${res.status}）` };
    const body = (await res.json()) as { choices: { message: { content: string } }[] };
    const text = body.choices[0]?.message.content ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { ok: false as const, error: "回应无法解析。" };
    try {
      const parsed = JSON.parse(jsonMatch[0]) as Record<string, string>;
      return {
        ok: true as const,
        essay: {
          oldest: parsed.oldest ?? "",
          philosophy: parsed.philosophy ?? "",
          ontology: parsed.ontology ?? "",
          phenomenology: parsed.phenomenology ?? "",
          epistemology: parsed.epistemology ?? "",
          culture: parsed.culture ?? "",
        },
      };
    } catch {
      return { ok: false as const, error: "回应无法解析。" };
    }
  });
