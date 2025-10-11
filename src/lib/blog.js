import fs from "fs";
import path from "path";

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");

function parseFrontmatter(fileContent) {
  if (!fileContent.startsWith("---")) {
    return { data: {}, content: fileContent.trim() };
  }

  const closing = fileContent.indexOf("\n---");
  if (closing === -1) {
    return { data: {}, content: fileContent.trim() };
  }

  const raw = fileContent.slice(3, closing).trim();
  const body = fileContent.slice(closing + 4).trim();

  const data = {};
  raw.split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) return;
    const value = rest.join(":").trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key.trim()] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      data[key.trim()] = value.replace(/^["']|["']$/g, "");
    }
  });

  return { data, content: body };
}

export function getAllPostSlugs() {
  if (!fs.existsSync(BLOG_DIRECTORY)) return [];
  return fs
    .readdirSync(BLOG_DIRECTORY)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getPostBySlug(slug) {
  const filePath = path.join(BLOG_DIRECTORY, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = parseFrontmatter(fileContent);
  return {
    slug,
    ...data,
    content,
  };
}

export function getAllPosts() {
  return getAllPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter(Boolean)
    .sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    });
}

