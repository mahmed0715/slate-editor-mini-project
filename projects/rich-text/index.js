import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValue from './value.json'
import { isKeyHotkey } from 'is-hotkey'
import { Button, Icon, Toolbar } from '../components'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import styled from 'react-emotion'
import BlockCountClass from './block-count'

const plugin = BlockCountClass({blockLimit: null})
const plugins = [plugin]

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = 'paragraph'


/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')


const Image = styled('img')`
  display: block;
  max-width: 100%;
  max-height: 20em;
  box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
`
function insertImage(editor, src, target) {
  if (target) {
    editor.select(target)
  }

  editor.insertBlock({
    type: 'image',
    data: { src },
  })
}
function isImage(url) {
  return !!imageExtensions.find(url.endsWith)
}

/**
 * The rich text example.
 *
 * @type {Component}
 */

class RichText extends React.Component {

  getExistingValue = () => {
    return JSON.parse(localStorage.getItem('content'))
  }


  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(this.getExistingValue() || initialValue),
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type == type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const { value } = this.state
    return value.blocks.some(node => node.type == type)
  }

  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */

  ref = editor => {
    this.editor = editor
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        <Toolbar>
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
          {this.renderBlockButton('heading-one', 'looks_one')}
          {this.renderBlockButton('heading-two', 'looks_two')}
          {this.renderBlockButton('block-quote', 'format_quote')}
          {this.renderBlockButton('numbered-list', 'format_list_numbered')}
          {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
          <input id="myInput" accept="image/*" type="file" ref={(ref) => this.upload = ref} style={{display: 'none'}} onChange={this.onChangeFile} />
          <Button active={true} title="Upload image"  primary={false} onClick={()=>{this.upload.click()}}>
            <Icon>image</Icon>
          </Button>
          <Button active={true} title="Save changes" primary={false} onClick={()=>{this.onSave()}}>
            <Icon>save</Icon>
          </Button>
          <Button  active={true} title="Cancel Save" primary={false} onClick={()=>{this.onCancel()}}>
            <Icon>cancel</Icon>
          </Button>
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          ref={this.ref}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          plugins={plugins}
        />
      </div>
    )
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }


  onClickImage = event => {
    event.preventDefault()
    const src = window.prompt('Enter the URL of the image:')
    if (!src) return
    // this.editor.command(insertImage, src)
  }
  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value: { document, blocks } } = this.state

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key)
        isActive = this.hasBlock('list-item') && parent && parent.type === type
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props, editor, next) => {
    const { attributes, children, node, isFocused} = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      case 'image': {
       const src = node.data.get('src')
          return <Image src={src} selected={isFocused} {...attributes} />
      }
     default:
        return next()
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props, editor, next) => {
    const { children, mark, attributes, isFocused} = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Editor} editor
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * Save the `value`.
   *
   */

  onSave = () => {
    console.log('Limit:', plugin.blockLimit)
    if(plugin.checkLimitCrossed()){
      return alert('Can not save, becasue top level element crossed its limit.')
    }
    const content = JSON.stringify(this.state.value.toJSON())
    localStorage.setItem('content', content)
    alert('Saved')
  }

  /**
   * Cancel and restore from previously saved state.
   *
   */

  onCancel = () => {
    const value = Value.fromJSON(this.getExistingValue())
    this.setState({ value })
    setTimeout(() => { 
      alert('Restored to previously saved state') 
    }, 1)
  }

  /**
   * Upload file on select
   *
   */

  onChangeFile = event => {
    event.stopPropagation()
    event.preventDefault()
    const editor = this.editor
    const file = event.target.files[0]
    const reader = new FileReader()
    const [mime] = file.type.split('/')
    if (mime !== 'image') return

    reader.addEventListener('load', () => {
      editor.command(insertImage, reader.result)
    })

    reader.readAsDataURL(file)
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @return {Change}
   */

  onKeyDown = (event, editor, next) => {
    let mark
    const { value } = editor
    const { document } = value
    const { data } = document
    const isList = this.hasBlock('list-item')
    const isBolletType = value.blocks.some(block => {
      return !!document.getClosest(block.key, parent => parent.type == 'bulleted-list')
    })
    const type = isList && (isBolletType ? 'bulleted-list' : 'numbered-list')
    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else if (event.key == 'Tab' && isList) {
      console.log('isList', isList)
      if (event.shiftKey) {
        editor.setBlocks('list-item').unwrapBlock(type)
      } else {
        console.log('depth', data.level, document.getDepth(value.blocks.first().key))
        document.getDepth(value.blocks.first().key) <= 3 && editor.setBlocks('list-item').wrapBlock(type)
      }
      return next()
    } else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    this.editor.toggleMark(type)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault()

    const { editor } = this
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type != 'bulleted-list' && type != 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type == type)
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        editor
          .unwrapBlock(
            type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
        // editor.setBlocks('list-item').wrapBlock(type)
      }
    }
  }
}

/**
 * Export.
 */

export default RichText
