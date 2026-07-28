import { Fragment, type ReactNode } from "react";

function InlineMarkdown({ children }: { children: string }) {
  const tokens = children.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\((?:<[^>]+>|[^)]+)\))/g);

  return tokens.map((token, index): ReactNode => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-stone-100 px-1 py-0.5 text-[0.92em] text-stone-800">
          {token.slice(1, -1)}
        </code>
      );
    }

    const link = token.match(/^\[([^\]]+)\]\((?:<([^>]+)>|([^)]+))\)$/);
    if (link) {
      const [, label, angleUrl, plainUrl] = link;
      const url = angleUrl ?? plainUrl;
      if (/^https?:\/\//.test(url)) {
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-stone-950 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-700"
          >
            {label}
          </a>
        );
      }
      return (
        <span key={index} title="Referencia de archivo no publicada" className="font-medium text-stone-900">
          {label}
        </span>
      );
    }

    return <Fragment key={index}>{token}</Fragment>;
  });
}

type MarkdownBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; lines: string[] }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "rule" };

function parseBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: "rule" });
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
      index += 1;
      continue;
    }

    const listItem = line.match(/^\s*(-|\d+\.)\s+(.+)$/);
    if (listItem) {
      const ordered = /\d+\./.test(listItem[1]);
      const items: string[] = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*(-|\d+\.)\s+(.+)$/);
        if (!match || /\d+\./.test(match[1]) !== ordered) break;
        items.push(match[2]);
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length) {
      const current = lines[index];
      if (
        !current.trim() ||
        /^(#{2,4})\s+/.test(current) ||
        /^---+$/.test(current.trim()) ||
        /^\s*(-|\d+\.)\s+/.test(current)
      ) {
        break;
      }
      paragraph.push(current.trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", lines: paragraph });
  }

  return blocks;
}

export function MarkdownDocument({ markdown }: { markdown: string }) {
  const blocks = parseBlocks(markdown);

  return (
    <div className="max-w-none text-[15px] leading-7 text-stone-700">
      {blocks.map((block, index) => {
        if (block.type === "rule") return <hr key={index} className="my-7 border-stone-200" />;
        if (block.type === "heading") {
          const className =
            block.level === 2
              ? "mb-3 mt-8 text-xl font-semibold leading-7 text-stone-950 first:mt-0"
              : "mb-2 mt-6 text-base font-semibold leading-6 text-stone-950";
          return block.level === 2 ? (
            <h2 key={index} className={className}><InlineMarkdown>{block.text}</InlineMarkdown></h2>
          ) : (
            <h3 key={index} className={className}><InlineMarkdown>{block.text}</InlineMarkdown></h3>
          );
        }
        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul";
          return (
            <List
              key={index}
              className={`my-4 space-y-2 pl-6 ${block.ordered ? "list-decimal" : "list-disc"}`}
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="pl-1"><InlineMarkdown>{item}</InlineMarkdown></li>
              ))}
            </List>
          );
        }
        return (
          <p key={index} className="my-4 first:mt-0">
            {block.lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex ? " " : null}
                <InlineMarkdown>{line}</InlineMarkdown>
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
