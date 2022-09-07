import { describe, expect, it } from 'vitest'

import { render as r } from '@testing-library/react'

import { render, renderElement } from 'core/renderer'

import { emptyDocument } from 'core/types'

const f = (a) => {
  const { asFragment, getByText } = r(a)
  return asFragment()
}

describe('heading', () => {
  it('renders', () => {
    expect(
      f(
        renderElement({
          type: 'h',
          level: 1,
          todoKeyword: 'TODO',
          priority: 'A',
          commented: true,
          tags: ['idea', 'strategy'],
          content: [{ type: 't', content: 'Collect underpants' }],
        }),
      ),
    ).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="p-4"
        >
          <h1>
            Collect underpants
          </h1>
        </div>
      </DocumentFragment>
    `)
  })
})

describe('paragraph', () => {
  it('renders', () => {
    expect(
      f(
        renderElement({
          type: 'p',
          content: [
            { type: 't', content: 'The first part of the ' },
            { type: 'b', content: [{ type: 't', content: 'masterplan' }] },
          ],
        }),
      ),
    ).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="p-4"
        >
          <p>
            The first part of the 
            <b>
              masterplan
            </b>
          </p>
        </div>
      </DocumentFragment>
    `)
  })

  describe('including timestamp', () => {
    it('renders', () => {
      expect(
        f(
          renderElement({
            content: [
              {
                content: 'Watching Penelope and Morgan solve crimes on ',
                type: 't',
              },
              {
                content: '<2022-08-14 Sun>',
                type: 'Z',
              },
              {
                content: ' while testing fallback components.',
                type: 't',
              },
            ],
            type: 'p',
          }),
        ),
      ).toMatchInlineSnapshot(`
        <DocumentFragment>
          <div
            class="p-4"
          >
            <p>
              Watching Penelope and Morgan solve crimes on 
              <time
                datetime="2015-10-21"
              >
                &lt;2022-08-14 Sun&gt;
              </time>
               while testing fallback components.
            </p>
          </div>
        </DocumentFragment>
      `)
    })
  })
})

describe('fallback', () => {
  describe('for element', () => {
    it('renders', () => {
      expect(
        f(
          renderElement({
            type: 'e',
            content: 'some random junk',
          }),
        ),
      ).toMatchInlineSnapshot(`
        <DocumentFragment>
          <code
            class="p-2 rounded bg-gray-300/30 "
          >
            some random junk
          </code>
        </DocumentFragment>
      `)
    })
  })
  describe('for greater element', () => {
    it('renders', () => {
      expect(
        f(
          renderElement({
            type: 'E',
            content: 'some random junk',
          }),
        ),
      ).toMatchInlineSnapshot(`
        <DocumentFragment>
          <pre
            class="overflow-auto p-2 rounded bg-gray-300/30 "
          >
            some random junk
          </pre>
        </DocumentFragment>
      `)
    })
  })
})
