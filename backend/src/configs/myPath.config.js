import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

const ROOT_PATH= path.resolve(__dirname, '../../');
const DIST_PATH= path.resolve(ROOT_PATH, 'dist');
const SRC_PATH= path.resolve(ROOT_PATH, 'src');
const PUBLIC_PATH= path.resolve(ROOT_PATH, 'public');
const ENV_PATH= path.resolve(ROOT_PATH, '.env');

export { ROOT_PATH, DIST_PATH, SRC_PATH, PUBLIC_PATH, ENV_PATH };