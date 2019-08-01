export default ({blocks}, editor, options = {}) => {
  const { value } = editor;
  const hasLink = value.inlines.some(inline => inline.type === blocks.link);
  
  // It's already a link, un-link it.
  if (hasLink) {
    return editor.unwrapLink();
  } 
  
  // We've got selected text. Prompt for the href to be paired with it
  if (value.selection.isExpanded) {
    // We know that prompting is undesirable... and temporary
    // eslint-disable-next-line 
    const href = window.prompt('Enter the URL of the link:');
    if(href == null) { return undefined; }

    return editor.wrapLink({ ...options, href });
  }
  
  // We want to insert a link with new text and href

  // We know that prompting is undesirable... and temporary
  // eslint-disable-next-line 
  const href = window.prompt('Enter the URL of the link:')
  if (href == null) { return undefined; }

  // We know that prompting is undesirable... and temporary
  // eslint-disable-next-line 
  const text = window.prompt('Enter the text for the link:')
  if (text == null) { return undefined; }

  return editor
    .insertText(text)
    .moveFocusBackward(text.length)
    .wrapLink({ ...options, href });
}