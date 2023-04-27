/**
 * Generate a flattened text-only view of the results of the template items.
 * Notes such as ConsultNote will use this to generate the state of the
 * completed note.
 *
 * @param {*} templateObject
 * @returns string
 */
export function formatTemplateOutputToMarkdown(obj) {
  let result = "";

  function process(obj, prefix = "") {
    for (const key in obj) {
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        process(obj[key], prefix + key + ": ");
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item) => process(item));
      } else {
        if (
          key === "name" ||
          key === "formTitle" ||
          key === "formDescription" ||
          key === "title" ||
          key === "value"
        ) {
          let formattedKey = "**" + key + "**: ";
          let formattedValue =
            key === "title" ? "**" + obj[key] + "**" : obj[key];

          if (prefix) {
            result += prefix + formattedKey + formattedValue + "\n\n\n";
          } else {
            result +=
              key === "templateTitle" ? "## " : key === "title" ? "### " : "";
            result += formattedKey + formattedValue + "\n\n\n";
          }
        }
      }
    }
  }

  process(obj);
  return result;
}
