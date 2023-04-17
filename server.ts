import { CDNJS } from './setupScripts/cdnjs.js';
import { GitHub } from './setupScripts/github.js';

await Promise.all([new CDNJS().download(), new GitHub().download()]);
