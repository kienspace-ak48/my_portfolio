const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '../../');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const PUBLIC_PATH = path.resolve(ROOT_PATH, 'public');
const ENV_PATH = path.resolve(ROOT_PATH, '.env');

module.exports = {
  ROOT_PATH,
  DIST_PATH,
  SRC_PATH,
  PUBLIC_PATH,
  ENV_PATH,
};
