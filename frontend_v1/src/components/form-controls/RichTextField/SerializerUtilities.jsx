import React from 'react';
import { Value } from 'slate';
import Html from 'slate-html-serializer';
import Plain from 'slate-plain-serializer';

import BoldMark from './marks/BoldMark';
import ItalicMark from './marks/ItalicMark';
import AnchorBlock from './plugins/Link/AnchorBlock';

import BasicButton from '../../BasicButton';
import { getUserProfileUrl } from '../../../utilities/UrlUtilities';


export function getDefaultSlateValue(text = '') {
  return Value.fromJSON(
    {
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                text
              },
            ],
          },
        ],
      },
    }
  );
}

export function tryParseJSON (jsonString){
  try {
      const o = JSON.parse(jsonString);

      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object", 
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (o && typeof o === "object") {
          return o;
      }
  }
  catch (e) { 
    // Return false...
  }

  return false;
};

export function getSlateValueFor(richTextJSON) {
  let value;
  const json = tryParseJSON(richTextJSON);
  
  if(json) {
    // We have JSON, it should be compatible with Slate
    try { 
      value = Value.fromJSON(json);
    } catch( e ) {
      // If we get a problem... put the JSON into the default paragraph
      value = getDefaultSlateValue(richTextJSON);
    }
  } else {
    // Handle string data instead of JSON data
    // For fields that exist from before rich text editing was a thing
    value = Plain.deserialize(richTextJSON);
  }

  return value;
}

export function getPlainTextForSlateValue(value) {
  const text = Plain.serialize(value);
  return text;
}

export function getSlateHtmlSerializerRules() {
  // See https://docs.slatejs.org/other-packages/index 
  // rule.deserialize(el: Element, next: Function) => Object || Void
  // rule.serialize(object: Node || Mark || String, children: String || Element || Array) => Element || Void
  return [
    // Paragraph Rule
    {
      deserialize: (element, next) => undefined,
      serialize: (object, children) => {
        if(object.object === 'block' && object.type === 'paragraph') {
          return (<p>{children}</p>);
        }

        return undefined;
      }
    },
    
    // Line Rule
    {
      deserialize: (element, next) => undefined,
      serialize: (object, children) => {
        if(object.object === 'block' && object.type === 'line') {
          return (<React.Fragment>{children}{'\n'}</React.Fragment>);
        }
      }
    },

    // Bold Rule
    {
      deserialize: (element, next) => undefined,
      serialize: (object, children) => {
        if(object.object === 'mark' && object.type === 'bold') {
          return (<BoldMark>{children}</BoldMark>);
        }

        return undefined;
      }
    },

    // Italic Rule
    {
      deserialize: (element, next) => undefined,
      serialize: (object, children) => {
        if(object.object === 'mark' && object.type === 'italic') {
          return (<ItalicMark>{children}</ItalicMark>);
        }

        return undefined;
      }
    },

    // Anchor Rule
    {
      deserialize: (element, next) => undefined,
      serialize: (object, children) => {
        if(object.object === 'inline' && object.type === 'link') {
          return (<AnchorBlock target="_blank" {...object.data.toObject()}>{children}</AnchorBlock>);
        }

        return undefined;
      }
    },

    // Unordered List Rule
    {
      deserialize: (element, next) => undefined,
      serialize: (object, children) => {
        if(object.object === 'block' && object.type === 'unordered-list') {
          return (<ul {...object.data.toObject()}>{children}</ul>);
        }
      }
    },

    // Ordered List Rule
    {
      deserialize: (element, next) => undefined,
      serialize: (object, children) => {
        if(object.object === 'block' && object.type === 'ordered-list') {
          return (<ol {...object.data.toObject()}>{children}</ol>);
        }
      }
    },

    // List Item Rule
    {
      deserialize: (element, next) => undefined,
      serialize: (object, children) => {
        if(object.object === 'block' && object.type === 'list-item') {
          return (<li {...object.data.toObject()}>{children}</li>);
        }
      }
    },

    // List Item Child Rule
    {
      deserialize: (element, next) => undefined,
      serialize: (object, children) => {
        if(object.object === 'block' && object.type === 'list-item-child') {
          return (<React.Fragment>{children}</React.Fragment>);
        }
      }
    },

    // Mention Rule
    {
      deserialize: (element, next) => undefined,
      serialize: (object, children) => {
        if(object.object === 'inline' && object.type === 'mentionPerson') {
          const data = object.data.toObject();
          return (
            <BasicButton
              color="link"
              className="o-mention-person"
              linkTo={getUserProfileUrl(data.id)}
            >
              {'@'}{data.text}
            </BasicButton>
          );
        }
      }
    },

    // Catch All 
    {
      deserialize: (element, next) => undefined,
      serialize: (object, children) => {
        if(object.object === 'string') return undefined;

        const objectJson = JSON.stringify(object);
        return (
          <div>
            <p>catch all:<br />{objectJson}</p>
            <div>{children}</div>
          </div>
        );
      }
    }
  ];
}

export function getReactElementsForSlateValue(value) {
  const htmlSerializer = new Html({ rules: getSlateHtmlSerializerRules() });
  const richTextElementsList = htmlSerializer.serialize(value, { render: false });
  return richTextElementsList.toJS();
}
