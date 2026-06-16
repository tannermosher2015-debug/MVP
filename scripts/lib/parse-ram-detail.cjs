// Parse the rendered "More property info" text from a RAM property page into
// { mlsNumber, description, groups: [{ title, fields: [[label, value], ...] }] }.
// RAM renders it as ALL-CAPS section headers followed by "Label: Value" lines.

// RAM stores some ʻokina as a literal "?" (e.g. "Moloka?i"). Restore it for the
// known Hawaiian place names only — never touch URL query strings or real "?".
const OKINA = "ʻ";
function fixOkina(s) {
  return String(s)
    .replace(/Moloka\?i/g, `Moloka${OKINA}i`)
    .replace(/Hawai\?i/g, `Hawai${OKINA}i`)
    .replace(/O\?ahu/g, `O${OKINA}ahu`)
    .replace(/L(?:a|ā)na\?i/g, `Lāna${OKINA}i`)
    .replace(/Ali\?i/g, `Ali${OKINA}i`)
    .replace(/Kaua\?i/g, `Kaua${OKINA}i`)
    .replace(/Wai\?anae/g, `Wai${OKINA}anae`);
}

function titleCase(s) {
  return s
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\bOr\b/g, "or")
    .replace(/\bAnd\b/g, "and");
}

const isHeader = (l) =>
  !l.includes(":") &&
  l.length <= 45 &&
  l === l.toUpperCase() &&
  /[A-Z]/.test(l) &&
  /^[A-Z0-9][A-Z0-9 &/'.-]+$/.test(l);

function parseRamDetail(text) {
  const mls = text.match(/MLS ID\s*([0-9]+)/i);
  const mlsNumber = mls ? mls[1] : "";

  let block = text;
  const start = block.search(/More property info/i);
  if (start >= 0) block = block.slice(start);
  const end = block.search(/Listing courtesy of|This information is believed|GET MORE INFO/i);
  if (end >= 0) block = block.slice(0, end);

  const lines = block.split(/\n/).map((l) => l.trim()).filter(Boolean);

  const groups = [];
  let cur = null;
  let description = "";

  for (const line of lines) {
    if (/^More property info/i.test(line)) continue;
    if (isHeader(line)) {
      cur = { title: titleCase(line), fields: [] };
      groups.push(cur);
      continue;
    }
    if (!cur) continue;
    if (cur.title.toLowerCase() === "property description") {
      description += (description ? " " : "") + line;
      continue;
    }
    const ci = line.indexOf(":");
    if (ci > 0) {
      cur.fields.push([line.slice(0, ci).trim(), fixOkina(line.slice(ci + 1).trim())]);
    }
  }
  description = fixOkina(description);

  const fieldGroups = groups.filter(
    (g) => g.title.toLowerCase() !== "property description" && g.fields.length
  );
  return { mlsNumber, description: description.trim(), groups: fieldGroups };
}

module.exports = { parseRamDetail, fixOkina };
