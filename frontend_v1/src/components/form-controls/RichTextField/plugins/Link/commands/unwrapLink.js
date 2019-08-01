/**
 * A change helper to standardize unwrapping links.
 *
 * @param {Editor} editor
 */

export default (config, editor) => {
  editor.unwrapInline('link')
}