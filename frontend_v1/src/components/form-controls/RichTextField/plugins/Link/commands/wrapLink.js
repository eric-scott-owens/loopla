/**
 * A change helper to standardize wrapping links.
 *
 * @param {Editor} editor
 * @param {String} href
 */

export default (config, editor, { href }) => {
  editor.wrapInline({
    type: 'link',
    data: { href },
  })

  editor.moveToEnd()
}