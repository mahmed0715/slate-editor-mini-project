/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertText(' ')
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        word <cursor />
      </paragraph>
    </document>
  </value>
)
