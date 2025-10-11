// export function parseAIResponse(response) {
//   if (!response) return { conditions: [], steps: [] };

//   const sections = response.split(/Recommended Next Steps/i);

//   const conditions = [];
//   const steps = [];

//   const parseLines = (text) => {
//     const lines = text
//       .split("\n")
//       .map((line) => line.trim())
//       .filter(Boolean);
//     const items = [];

//     lines.forEach((line) => {
//       if (/^Probable Conditions:?$/i.test(line)) return;
//       if (/^Recommended Next Steps:?$/i.test(line)) return;

//       // Match any line with optional bullet/number and colon
//       const match = line.match(/^\s*[\-\d\*\.]?\s*(.+?):\s*(.+)/);
//       if (match) items.push({ title: match[1], description: match[2] });
//     });

//     return items;
//   };

//   if (sections[0]) conditions.push(...parseLines(sections[0]));
//   if (sections[1]) steps.push(...parseLines(sections[1]));

//   return { conditions, steps };
// }


export function parseAIResponse(response) {
  if (!response) return { conditions: [], steps: [] };

  const sections = response.split(/Recommended Next Steps/i);

  const conditions = [];
  const steps = [];

  const parseLines = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const items = [];

    // lines.forEach((line) => {
    //   // Skip section headers and malformed duplicates
    //   if (/^(?:\**\s*)?Probable Conditions\s*\**:?$/i.test(line)) return;
    //   if (/^(?:\**\s*)?Recommended Next Steps\s*\**:?$/i.test(line)) return;

    //   // Match lines like "**Title:** Description" or "- Title: Description"
    //   const match = line.match(/^\s*[\-\*\d\.]?\s*\**(.+?)\**:\s*(.+)/);
    //   if (match) items.push({ title: match[1].trim(), description: match[2].trim() });
    // });

    lines.forEach((line) => {
        line = line.trim();
        // Skip section headers or duplicates
        if (/^Probable Conditions:?(\s*\*\*)?$/i.test(line)) return;
        if (/^Recommended Next Steps:?(\s*\*\*)?$/i.test(line)) return;

        const match = line.match(/^\s*[\-\*\d\.]?\s*\**(.+?)\**:\s*(.+)/);
        if (match) items.push({ title: match[1].trim(), description: match[2].trim() });
        });

    return items;
  };

  if (sections[0]) conditions.push(...parseLines(sections[0]));
  if (sections[1]) steps.push(...parseLines(sections[1]));

  return { conditions, steps };
}
