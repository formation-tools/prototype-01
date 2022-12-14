import { Fragment } from 'react'
import {
  FDocument,
  FHeading,
  FLink,
  FElementType,
  FObjectType,
} from 'core/types'

import Code, { CodeProps } from 'components/doc/Code'
import CommentsBlock from 'components/doc/Comment'
import Heading, { HeadingProps } from 'components/doc/Heading'
import Section, { SectionProps } from 'components/doc/Section'
import Paragraph, { ParagraphProps } from 'components/doc/Paragraph'
import Link, { LinkProps } from 'components/doc/Link'
import FallbackInline, {
  FallbackInlineProps,
} from 'components/doc/FallbackInline'
import FallbackBlock, { FallbackBlockProps } from 'components/doc/FallbackBlock'
import Date, { DateProps } from 'components/doc/Date'
import { List, ListChild, ListChildProps, ListProps } from 'components/doc/List'

function assertExhaustive(
  value: never,
  message: string = 'Reached unexpected case in exhaustive switch',
): never {
  throw new Error(message)
}

export function renderElement(
  el: FElementType,
  key: number | string,
  // FIXME: The optional doc arg is a nasty hack to get context into the
  // rendering stage
  doc?: FDocument,
): JSX.Element[] {
  switch (el.type) {
    case 'S':
      return [<Section key={`S${key}`} data={el} doc={doc} />]
    case 'L':
      return [
        <List key={`L${key}`}>
          {el.content.flatMap((x, idx) =>
            renderElement(x, `L${key}-I${idx}`, doc),
          )}
        </List>,
      ]

    case 'I':
      if (el.content.length === 0) {
        return []
      }

      const [head, ...rest] = el.content

      // We don't know how to render a list if the head is not a paragraph
      if (head.type !== 'p') {
        return []
      }

      const checkbox = el.checkbox

      const headObjects = head.content.flatMap((x, idx) =>
        renderObject(x, `${key}-label-${idx}`, doc),
      )

      const restObjects =
        rest && rest.length > 0
          ? rest.flatMap((x, idx) =>
              renderElement(x, `${key}-body-${idx}`, doc),
            )
          : []

      return [
        <ListChild key={key} label={headObjects} checkbox={checkbox}>
          {restObjects}
        </ListChild>,
      ]

    case 'h':
      // TODO: @vidbina Source document context such that we can retrieve id slug

      switch (el.level) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          const { id, level, todoKeyword, priority, commented, tags } = el
          const renderedId = doc ? doc.headingIdToSlugIndex[id] || id : id

          return [
            // TODO: Migrate TODOs here to Heading component source file
            // TODO: Implement heading keyword
            // TODO: Implement heading priority
            // TODO: Implement heading comment status
            // TODO: Implement heading tags

            <Heading
              id={renderedId}
              key={`h${key}`}
              level={level}
              todoKeyword={todoKeyword}
              priority={priority}
              commented={commented}
              tags={tags}
            >
              {el.content.flatMap((el, idx) =>
                renderObject(el, `h${key}-${idx}`, doc),
              )}
            </Heading>,
          ]
        default:
          // FIXME: Implement a fallback case
          return []
      }
    case 'p':
      return [
        <Paragraph key={`p${key}`}>
          {el.content.flatMap((el, idx) =>
            renderObject(el, `p${key}-${idx}`, doc),
          )}
        </Paragraph>,
      ]
    case '#':
    case '/':
      // TODO: Collect multiple comments to present them in a CommentBlock
      return [
        <CommentsBlock key={`#${key}`} comments={[{ text: el.content }]} />,
      ]
    case 'E':
    case '{':
      return [<FallbackBlock key={`E${key}`}>{el.content}</FallbackBlock>]
    case 'e':
      return [<FallbackInline key={`e${key}`}>{el.content}</FallbackInline>]
    default:
      assertExhaustive(el)
  }
}

export function destinationForHeadingId(id: string, doc?: FDocument): string {
  if (doc === undefined) {
    return id
  }

  const renderedId = doc.headingIdToSlugIndex[id] || id
  return renderedId
}

export type WorkflowStateColor =
  | 'blue'
  | 'gray'
  | 'red'
  | 'green'
  | 'yellow'
  | 'indigo'
  | 'purple'
  | 'pink'

export function colorForWorkflowState(
  state: string,
  doc?: FDocument,
): WorkflowStateColor {
  const colors: { [index: string]: WorkflowStateColor } = {
    ['TODO']: 'red',
    ['DONE']: 'green',
    ['CANCELED']: 'gray',
    ['default']: 'yellow',
  }

  return colors[state] || colors['default']
}

export function destinationForLink(link: FLink, doc?: FDocument): string {
  if (doc === undefined) {
    return link.target
  }

  switch (link.linkType) {
    case 'fuzzy':
      if (link.target.charAt(0) !== '*') {
        return link.target
      }
      const fuzzyTarget = link.target.slice(1)

      const id = doc.headingFuzzyToIdIndex[fuzzyTarget]
      if (id === undefined) {
        return link.target
      }

      const headingSlug = doc.headingIdToSlugIndex[id]
      if (headingSlug === undefined) {
        return link.target
      }

      return `/#${headingSlug}`
    case 'id':
      // TODO: Implement
      return link.target
    default:
      return link.target
  }
}

export function renderObject(
  el: FObjectType,
  i: number | string,
  // FIXME: Reevaluate if this context-dump is really necessary
  doc?: FDocument,
): JSX.Element[] {
  switch (el.type) {
    case 'a':
      return [
        <Link
          key={`a${i}`}
          url={destinationForLink(el, doc)}
          linkType={el.linkType}
          label={el.content.flatMap((el, idx) =>
            renderObject(el, `a${i}-${idx}`, doc),
          )}
        />,
      ]
    case 'b':
      return [
        <b key={`b${i}`}>
          {el.content.flatMap((el, idx) =>
            renderObject(el, `b${i}-${idx}`, doc),
          )}
        </b>,
      ]
    case 'i':
      return [
        <i key={`i${i}`}>
          {el.content.flatMap((el, idx) =>
            renderObject(el, `i${i}-${idx}`, doc),
          )}
        </i>,
      ]
    case 'c':
      return [<code key={`c${i}`}>{el.content}</code>]
    case 'v':
      return [<code key={`v${i}`}>{el.content}</code>]
    case '+':
      return [
        <s key={`+${i}`}>
          {el.content.flatMap((el, idx) =>
            renderObject(el, `+${i}-${idx}`, doc),
          )}
        </s>,
      ]
    case 'u':
      return [
        <u key={`u${i}`}>
          {el.content.flatMap((el, idx) =>
            renderObject(el, `u${i}-${idx}`, doc),
          )}
        </u>,
      ]
    case '^':
      return [
        <sup key={`^${i}`}>
          {el.content.flatMap((el, idx) =>
            renderObject(el, `^${i}-${idx}`, doc),
          )}
        </sup>,
      ]
    case '_':
      return [
        <sub key={`_${i}`}>
          {el.content.flatMap((el, idx) =>
            renderObject(el, `_${i}-${idx}`, doc),
          )}
        </sub>,
      ]
    case 't':
      return [<Fragment key={`t${i}`}>{el.content}</Fragment>]
    case 'Z':
      // TODO: Pass along datetime
      return [
        <time key={`Z${i}`} dateTime="2015-10-21">
          {el.content}
        </time>,
      ]
    case 'f':
      // TODO: Implement footnote
      return [
        <em key={`f${i}`}>
          {el.content.flatMap((el, idx) =>
            renderObject(el, `f${i}-${idx}`, doc),
          )}
        </em>,
      ]
    case 'X':
      // TODO: Display LaTeX (using MathJaX or something server-side-rendered for better perf)
      return [<code key={`X${i}`}>{el.content}</code>]
    case '?':
      // TODO: Decide on and implement fallback-strategy for entity types
      return [<code key={`?${i}`}>{el.content}</code>]
    case 'C':
      return [
        <td key={`C${i}`}>
          {el.content.flatMap((el, idx) =>
            renderObject(el, `C${i}-${idx}`, doc),
          )}
        </td>,
      ]
    default:
      assertExhaustive(el)
  }
}
