const yaml = require("js-yaml");
const fs = require("fs");

const yamlToObject = () => {
  try {
    const doc = yaml.safeLoad(fs.readFileSync("./schema.yaml", "utf8"));
    return doc;
  } catch (e) {
    console.log(e);
  }
};

const convertToPathsConfig = yamlObject => {
  // Do some magic
  return null;
};

module.exports = { convertToPathsConfig };
