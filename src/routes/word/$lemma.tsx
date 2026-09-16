import { createFileRoute, Link } from "@tanstack/react-router";
import { Dossier } from "@/components/word/dossier";
import { getWord } from "@/lib/lexicon";

export const Route = createFileRoute("/word/$lemma")({
  component: WordPage,
});

function WordPage() {
  const { lemma } = Route.useParams();
  const entry = getWord(lemma);

  if (!entry) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="font-display text-4xl">未收入</h1>
        <p className="mt-3 text-muted">词库里没有「{decodeURIComponent(lemma)}」。</p>
        <Link to="/lexicon" className="mt-6 inline-block text-sm text-fg underline-offset-4 hover:underline">
          回到词库
        </Link>
      </div>
    );
  }

  return <Dossier entry={entry} />;
}
