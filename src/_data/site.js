// Global site data - re-export properties for use in templates
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const propertiesPath = path.join(__dirname, 'properties.json');
const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));

export default {
  properties: properties,
};
