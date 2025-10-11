"use client";

import React from "react";

function formatInline(text) {
  const segments = [];
  let remaining = text;

  const patterns = [
    { regex: /\*\*(.+?)\*\*/, type: "strong" },
    { regex: /\*(.+?)\*/, type: "em" },
    { regex: /`([^`]+)`/, type: "code" },
  ];

  while (remaining.length > 0) {
    let matched = false;

    for (const { regex, type } of patterns) {
      const match = regex.exec(remaining);
      if (match) {
        const [full, value] = match;
        if (match.index > 0) {
          segments.push(remaining.slice(0, match.index));
        }
        segments.push({ type, value });
        remaining = remaining.slice(match.index + full.length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      segments.push(remaining);
      break;
    }
  }

  return segments.map((segment, index) => {
    if (typeof segment === "string") {
      return <React.Fragment key={index}>{segment}</React.Fragment>;
    }

    if (segment.type === "strong") {
      return (
        <strong key={index} className="font-semibold">
          {segment.value}
        </strong>
      );
    }

    if (segment.type === "em") {
      return (
        <em key={index} className="italic">
          {segment.value}
        </em>
      );
    }

    if (segment.type === "code") {
      return (
        <code
          key={index}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
        >
          {segment.value}
        </code>
      );
    }

    return null;
  });
}

function renderBlock(line, index) {
  if (!line.trim()) {
    return <div key={`spacer-${index}`} className="h-4" />;
  }

  if (line.startsWith("### ")) {
    return (
      <h3 key={index} className="text-xl font-semibold text-foreground">
        {formatInline(line.slice(4))}
      </h3>
    );
  }

  if (line.startsWith("## ")) {
    return (
      <h2 key={index} className="text-2xl font-semibold text-foreground">
        {formatInline(line.slice(3))}
      </h2>
    );
  }

  if (line.startsWith("# ")) {
    return (
      <h1 key={index} className="text-3xl font-bold text-foreground">
        {formatInline(line.slice(2))}
      </h1>
    );
  }

  if (line.startsWith(">")) {
    return (
      <blockquote
        key={index}
        className="border-l-4 border-primary/50 bg-muted/60 px-4 py-3 text-muted-foreground"
      >
        {formatInline(line.replace(/^>\s?/, ""))}
      </blockquote>
    );
  }

  if (line.match(/^\d+\.\s/)) {
    return {
      type: "ordered",
      value: line.replace(/^\d+\.\s/, ""),
    };
  }

  if (line.startsWith("- ")) {
    return {
      type: "unordered",
      value: line.slice(2),
    };
  }

  return (
    <p key={index} className="text-muted-foreground leading-relaxed">
      {formatInline(line)}
    </p>
  );
}

export default function Markdown({ content }) {
  const lines = content.split("\n");
  const blocks = [];
  let listBuffer = [];
  let listType = null;

  const flushList = (currentIndex) => {
    if (listBuffer.length === 0) return;
    if (listType === "ordered") {
      blocks.push(
        <ol key={`ol-${currentIndex}`} className="list-decimal space-y-2 pl-6 text-muted-foreground">
          {listBuffer.map((item, idx) => (
            <li key={idx}>{formatInline(item)}</li>
          ))}
        </ol>
      );
    } else {
      blocks.push(
        <ul key={`ul-${currentIndex}`} className="list-disc space-y-2 pl-6 text-muted-foreground">
          {listBuffer.map((item, idx) => (
            <li key={idx}>{formatInline(item)}</li>
          ))}
        </ul>
      );
    }
    listBuffer = [];
    listType = null;
  };

  lines.forEach((line, index) => {
    const rendered = renderBlock(line, index);
    if (rendered && typeof rendered === "object" && !React.isValidElement(rendered)) {
      if (!listType) {
        listType = rendered.type;
      }
      if (listType !== rendered.type) {
        flushList(index);
        listType = rendered.type;
      }
      listBuffer.push(rendered.value);
    } else {
      flushList(index);
      blocks.push(rendered);
    }
  });

  flushList("end");

  return <div className="space-y-4">{blocks}</div>;
}

