import wrapLink from './commands/wrapLink';
import unwrapLink from './commands/unwrapLink';
import toggleLink from './commands/toggleLink';

const wrapWithOptions = (fn, options) => (...args) => fn(options, ...args);

export default options => ({
  wrapLink: wrapWithOptions(wrapLink, options),
  unwrapLink: wrapWithOptions(unwrapLink, options),
  toggleLink: wrapWithOptions(toggleLink, options)
});