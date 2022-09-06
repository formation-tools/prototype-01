import { FNestedTableOfContents, FNestedTableOfContentsEntry } from 'core/types'
import { renderObject } from 'core/renderer'
import Tag from 'components/doc/Tag'

import { Disclosure, Transition } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

type TOCHeading = {
  heading: string
  children?: Array<TOCHeading>
}

export type TOCProps = {
  headings: FNestedTableOfContents
}

// TODO: Use Disclosure to support folding
type TableOfContentsEntryProps = {
  entry: FNestedTableOfContentsEntry
  depth: number
}

function TableOfContentsEntry({
  entry: { heading, children, text },
  depth,
}: TableOfContentsEntryProps) {
  const [transMotion, transOpened, transClosed] = [
    'transition transition-[max-height] duration-300 ease-in-out delay-100',
    'transform max-h-screen',
    'transform max-h-0',
  ]

  const { todoKeyword, tags } = heading

  return (
    <Disclosure as="li" defaultOpen className="py-1 w-full">
      {({ open }) => (
        <>
          <div className="flex items-center max-w-prose">
            {todoKeyword && (
              <Tag content={todoKeyword} color="green" size="small" />
            )}
            <a href="#test-anchor" className="hover:text-blue-700">
              {text.flatMap(renderObject)}
            </a>
            {tags &&
              tags.length > 0 &&
              tags.map((tag, idx) => (
                <Tag key={idx} size="small" color="yellow" content={tag} />
              ))}
            <Disclosure.Button
              as="span"
              className={`${!children.length && 'hidden'} contents`}
            >
              <ChevronUpIcon
                className={[
                  'transition-all',
                  open ? '' : 'rotate-180 transform',
                  'h-5 w-5 cursor-pointer hover:text-blue-700 select-none',
                ].join(' ')}
              />
            </Disclosure.Button>
          </div>
          {children && children.length > 0 && (
            <Transition
              show={open}
              className="overflow-hidden"
              enter={transMotion}
              enterFrom={transClosed}
              enterTo={transOpened}
              leave={transMotion}
              leaveFrom={transOpened}
              leaveTo={transClosed}
            >
              <Disclosure.Panel
                static
                as="ul"
                className={`px-${2 * depth} h-fit`}
              >
                {children.map((heading, idx) => (
                  <TableOfContentsEntry
                    key={idx}
                    entry={heading}
                    depth={depth + 1}
                  />
                ))}
              </Disclosure.Panel>
            </Transition>
          )}
        </>
      )}
    </Disclosure>
  )
}

export default function TOC({ headings }: TOCProps) {
  if (!headings.length) return null
  return (
    <ul className="text-sm text-gray-600 overflow-y-scroll">
      {headings.map((heading, idx) => (
        <TableOfContentsEntry key={idx} entry={heading} depth={1} />
      ))}
    </ul>
  )
}
