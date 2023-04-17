import { GitHub } from './setupScripts/github.js';

await Promise.all([new GitHub().download()]);
