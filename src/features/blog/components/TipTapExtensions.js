import { Extension, Node } from '@tiptap/core'
import Image from '@tiptap/extension-image'

// Custom Font Size Extension
export const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) return {}
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

// Custom Line Height Extension
export const LineHeight = Extension.create({
  name: 'lineHeight',
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => element.style.lineHeight,
            renderHTML: attributes => {
              if (!attributes.lineHeight) return {}
              return {
                style: `line-height: ${attributes.lineHeight}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setLineHeight: lineHeight => ({ commands }) => {
        return this.options.types.every(type => commands.updateAttributes(type, { lineHeight }))
      },
      unsetLineHeight: () => ({ commands }) => {
        return this.options.types.every(type => commands.updateAttributes(type, { lineHeight: null }))
      },
    }
  },
})

// Custom Letter Spacing Extension
export const LetterSpacing = Extension.create({
  name: 'letterSpacing',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          letterSpacing: {
            default: null,
            parseHTML: element => element.style.letterSpacing,
            renderHTML: attributes => {
              if (!attributes.letterSpacing) return {}
              return {
                style: `letter-spacing: ${attributes.letterSpacing}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setLetterSpacing: letterSpacing => ({ chain }) => {
        return chain()
          .setMark('textStyle', { letterSpacing })
          .run()
      },
      unsetLetterSpacing: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { letterSpacing: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

// Custom Responsive Iframe Node Extension
export const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'responsive-iframe-container',
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '450',
      },
      frameborder: {
        default: '0',
      },
      allowfullscreen: {
        default: 'true',
      },
      style: {
        default: 'border:0;',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', this.options.HTMLAttributes, ['iframe', HTMLAttributes]]
  },

  addCommands() {
    return {
      setIframe:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})

// Custom Extended Image Extension
export const CustomImage = Image.extend({
  inline: false,
  group: 'block',

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '100%',
        parseHTML: element => element.getAttribute('width') || element.style.width || '100%',
        renderHTML: () => ({})
      },
      align: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-align') || 'center',
        renderHTML: () => ({})
      },
      caption: {
        default: null,
        parseHTML: element => element.getAttribute('data-caption'),
        renderHTML: () => ({})
      },
      loading: {
        default: 'lazy',
        parseHTML: element => element.getAttribute('loading') || 'lazy',
        renderHTML: attributes => ({
          loading: attributes.loading || 'lazy'
        })
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
      {
        tag: 'figure',
        contentElement: 'img',
        getAttrs: (element) => {
          const img = element.querySelector('img')
          if (!img) return false
          const caption = element.querySelector('figcaption')
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            width: img.getAttribute('width') || img.style.width || '100%',
            align: img.getAttribute('data-align') || 'center',
            caption: caption ? caption.textContent : null,
          }
        }
      }
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { caption, align: _a, width: _w, 'data-align': _da, 'data-caption': _dc, style: _s, ...cleanAttributes } = HTMLAttributes
    const align = node.attrs.align || 'center'
    const width = node.attrs.width || '100%'
    const nodeCaption = node.attrs.caption || null

    if (nodeCaption) {
      let figureStyle = 'margin-left: auto; margin-right: auto;'
      if (align === 'left') {
        figureStyle = 'margin-left: 0; margin-right: auto;'
      } else if (align === 'right') {
        figureStyle = 'margin-left: auto; margin-right: 0;'
      }
      figureStyle += ` width: ${width}; max-width: 100%;`

      return [
        'figure',
        {
          class: 'image-figure',
          style: figureStyle,
          'data-align': align,
          'data-caption': nodeCaption
        },
        ['img', {
          ...cleanAttributes,
          style: 'width: 100%; max-width: 100%; height: auto; display: block;'
        }],
        ['figcaption', { class: 'image-caption' }, nodeCaption]
      ]
    }

    let imgStyle = `display: block; max-width: 100%; height: auto; width: ${width};`
    if (align === 'center') {
      imgStyle += ' margin-left: auto; margin-right: auto;'
    } else if (align === 'left') {
      imgStyle += ' margin-left: 0; margin-right: auto;'
    } else if (align === 'right') {
      imgStyle += ' margin-left: auto; margin-right: 0;'
    }

    return [
      'img',
      {
        ...cleanAttributes,
        'data-align': align,
        style: imgStyle
      }
    ]
  }
})
