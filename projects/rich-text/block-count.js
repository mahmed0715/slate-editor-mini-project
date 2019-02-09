import React from 'react'
import styled from 'react-emotion'

const BlockCount = styled('div')`
  margin-top: 10px;
  padding: 12px;
  background-color: #ebebeb;
  display: block;
`

export default function BlockCountClass(options) {
  const blockLimit = options.blockLimit || 'unlimited'
  let blockCount = 0
  return {
    blockLimit,
    blockCount,
    checkLimitCrossed() {
      return blockLimit < blockCount
    },
    renderEditor(props, editor, next) {
      const children = next()
      console.log('Blocks length', props.value.document.getBlocks())
      blockCount = props.value.document.getBlocks().size
      return (
        <div>
          <div>{children}</div>
          <BlockCount>Top level Blocks: {blockCount}    <br /> Limit: {blockLimit}</BlockCount>
        </div>
      )
    },
  }
}
