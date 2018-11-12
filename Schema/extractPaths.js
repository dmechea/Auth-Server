const yaml = require("js-yaml");
const fs = require("fs");

try {
  const doc = yaml.safeLoad(fs.readFileSync("schema.yaml", "utf8"));
  console.log(doc);
} catch (e) {
  console.log(e);
}
