import { unified } from 'unified'
import parser from 'uniorg-parse'
// https://github.com/rasendubi/uniorg/blob/master/packages/uniorg/src/index.ts
// https://github.com/rasendubi/uniorg/blob/master/packages/uniorg-parse/src/parser.ts#L4
import { OrgData, ObjectType, GreaterElementType, ElementType } from 'uniorg'

import { FDocument, FObjectType, FElementType, emptyDocument } from 'core/types'

// TODO: Potentially clean up by letting users import types directly
export type { FDocument }

function assertExhaustive(
  value: never,
  message: string = 'Reached unexpected case in exhaustive switch',
): never {
  throw new Error(message)
}

export function extractLabel(el: FObjectType): string {
  if ('content' in el) {
    switch (typeof el.content) {
      case 'string':
        return el.content
      default:
        return el.content
          .map(extractLabel)
          .reduce((next, acc) => acc.concat(next), '')
    }
  } else {
    assertExhaustive(el)
  }
}

function mapObjectType(x: ObjectType): FObjectType {
  // TODO: Restructure to a list of non-string members
  // A lot of information is lost in just reducing this to strings
  switch (x.type) {
    case 'link':
      // https://orgmode.org/worg/dev/org-syntax.html#Links
      return {
        type: 'a',
        target: x.rawLink,
        linkType: x.linkType,
        content: x.children.map(mapObjectType),
      }
    case 'bold':
      return { type: 'b', content: x.children.map(mapObjectType) }
    case 'italic':
      return { type: 'i', content: x.children.map(mapObjectType) }
    case 'strike-through':
      return { type: '+', content: x.children.map(mapObjectType) }
    case 'underline':
      return { type: 'u', content: x.children.map(mapObjectType) }
    case 'superscript':
      return { type: '^', content: x.children.map(mapObjectType) }
    case 'subscript':
      return { type: '_', content: x.children.map(mapObjectType) }
    case 'code':
      return { type: 'c', content: x.value }
    case 'verbatim':
      return { type: 'v', content: x.value }
    case 'text':
      return { type: 't', content: x.value }
    case 'timestamp':
      return { type: 'Z', content: x.rawValue }
    case 'footnote-reference':
      return {
        type: 'f',
        label: x.label,
        content: x.children.map(mapObjectType),
      }
    case 'latex-fragment':
      return { type: 'X', content: x.value }
    case 'entity':
      return { type: '?', content: x.name, html: x.html }
    case 'table-cell':
      return { type: 'C', content: x.children.map(mapObjectType) }
    default:
      return assertExhaustive(x)
  }
}

function unpackElementWithContext(text: string) {
  return (x: GreaterElementType | ElementType) => unpackElementType(text, x)
}

function unpackElementType(
  text: string,
  x: GreaterElementType | ElementType,
): FElementType[] {
  switch (x.type) {
    // GreaterElementType
    case 'org-data':
      return []
    case 'section':
      return x.children.flatMap(unpackElementWithContext(text))
    case 'property-drawer':
    case 'drawer':
    case 'plain-list':
    case 'list-item':
    case 'quote-block':
    case 'verse-block':
    case 'center-block':
    case 'special-block':
    case 'footnote-definition':
      return [
        { type: 'F', content: text.slice(x.contentsBegin, x.contentsEnd) },
      ]
    case 'table':
      switch (x.tableType) {
        case 'org':
          return [
            { type: 'F', content: text.slice(x.contentsBegin, x.contentsEnd) },
          ]
        case 'table.el':
          return [{ type: 'F', content: x.value }]
      }
    // ElementType
    case 'headline':
      return [
        {
          type: 'h',
          level: x.level,
          todoKeyword: x.todoKeyword,
          commented: x.commented,
          priority: x.priority,
          tags: x.tags,
          content: x.children.map(mapObjectType),
        },
      ]
    case 'planning':
    case 'node-property':
    case 'list-item-tag':
    case 'comment-block':
    case 'src-block':
    case 'example-block':
    case 'export-block':
    case 'keyword':
    case 'table-row':
    case 'comment':
    case 'fixed-width':
    case 'clock':
    case 'latex-environment':
    case 'horizontal-rule':
    case 'diary-sexp':
      // TODO: Implement
      return []
    case 'paragraph':
      return [{ type: 'p', content: x.children.map(mapObjectType) }]
    default:
      return assertExhaustive(x)
  }
}

function convertWithContext(text: string) {
  return (
    acc: FDocument,
    node: GreaterElementType | ElementType,
    idx: number,
  ) => convert(text, acc, node, idx)
}

// Convert document to internal representation
function convert(
  text: string,
  acc: FDocument,
  node: GreaterElementType | ElementType,
  idx: number,
): FDocument {
  // TODO: Implement fallback for all NOOPs
  switch (node.type) {
    // GreaterElementType
    case 'org-data':
      return node.children.reduce(convertWithContext(text), acc)
    case 'section':
      // TODO: Evaluate wrapping in section element
      return {
        ...acc,
        content: [
          ...acc.content,
          ...node.children.flatMap(unpackElementWithContext(text)),
        ],
      }
    case 'property-drawer':
    case 'drawer':
    case 'plain-list':
    case 'list-item':
    case 'quote-block':
    case 'verse-block':
    case 'center-block':
    case 'special-block':
    case 'footnote-definition':
    case 'table':
      return {
        ...acc,
        content: [...acc.content, ...unpackElementType(text, node)],
      }

    // TODO: Note that we may not need this at a document level, since all
    // items of type Element items may be contained within a container of type
    // GreaterElement

    // ElementType
    case 'headline':
      return {
        ...acc,
        content: [...acc.content, ...unpackElementType(text, node)],
      }
    case 'planning':
    case 'node-property':
    case 'list-item-tag':
    case 'comment-block':
    case 'src-block':
    case 'example-block':
    case 'export-block':
      return acc // noop
    case 'keyword':
      switch (node.key) {
        case 'TITLE':
          return { ...acc, title: node.value }
        case 'TODO':
          // FIXME: Accomodate for multiple swimlanes as per https://orgmode.org/manual/Per_002dfile-keywords.html
          return {
            ...acc,
            todoStates: node.value.split(' ').filter((x) => x != '|'),
          }
        default:
          return acc
      }
    case 'table-row':
    case 'comment':
    case 'fixed-width':
    case 'clock':
    case 'latex-environment':
    case 'horizontal-rule':
    case 'diary-sexp':
      return {
        ...acc,
        content: [...acc.content, ...unpackElementType(text, node)],
      }
    case 'paragraph':
      return {
        ...acc,
        content: [...acc.content, ...unpackElementType(text, node)],
      }
    default:
      return assertExhaustive(node)
  }
}

export default function parse(text: string): FDocument {
  const ast = unified().use(parser).parse(text) as OrgData
  return convert(text, emptyDocument, ast, 0)
}
