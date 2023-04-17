import { GitHub } from './setupScripts/github.js';

await Promise.allSettled([new GitHub().download()]);
