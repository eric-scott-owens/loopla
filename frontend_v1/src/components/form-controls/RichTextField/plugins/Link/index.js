import createCommands from './createCommands';
import createRenderNodes from './createRenderNodes';


export default function Link(options = {}) {
  const config = {
    ...options
  };

  const blocks = {
    link: 'link',
    ...config.blocks
  };

  const classNames = {
    link: 'o-link',
    ...config.classNames
  }

  const commands = createCommands({ blocks });
  const renderNode = createRenderNodes({ blocks, classNames });

  return [
    {
      commands: {
        wrapLink: commands.wrapLink,
        unwrapLink: commands.unwrapLink,
        toggleLink: commands.toggleLink
      },
      renderNode
    }
  ];
}