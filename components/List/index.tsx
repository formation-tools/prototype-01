import type { NextPage, NextApiResponse } from 'next'
import useSWR, { Key, Fetcher } from 'swr'
import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Box, Grommet, ThemeContext } from 'grommet'

import generateComponent, { DocumentElement } from '../../core/renderer'

import { AppContainer, Main, MainContent, Row } from '../View'
// TODO: Generalize with board data struct
// TODO: Move out of presentation source
const json: Array<DocumentElement> = [
  {
    name: 'Heading',
    data: {
      level: 1,
      title: 'This is some heading content for heading 1',
    },
  },
  {
    name: 'Heading',
    data: {
      level: 2,
      title: 'This is some other content for heading 2',
    },
  },
  {
    name: 'Heading',
    data: {
      level: 3,
      title: 'This is some other content for heading 3',
    },
  },
  {
    name: 'Heading',
    data: {
      level: 4,
      title: 'This is some other content for heading 4',
    },
  },
  {
    name: 'Heading',
    data: {
      level: 5,
      title: 'This is some other content for heading 5',
    },
  },
  {
    name: 'Heading',
    data: {
      level: 6,
      title: 'This is some other content for heading 6',
    },
  },
  {
    name: 'Code',
    data: {
      source: 'const test = 123',
      language: 'javascript',
    },
  },
  {
    name: 'Paragraph',
    data: {
      children:
        'This is some content for the paragraph component. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  },
  {
    name: 'FallbackInline',
    data: {
      content:
        'This is some content for the fallback inline component. It is rendered as Grommet Text component, which resolves to a HTML <pre> tag.',
    },
  },
  {
    name: 'FallbackBlock',
    data: {
      children:
        'This is some content for the fallback block component. The component is similar to the fallback inline component with the only difference of having display: block instead of display: ilnine. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  },
  {
    name: 'Date',
    data: {
      timestamp: 1657743446788,
    },
  },
  // TODO: Deeper level headings need to be rendered with Fallback
  //{
  //    name: 'Heading',
  //    data: {
  //        level: 7,
  //        title: 'This is some other content for heading 2',
  //    },
  //},
]

const ListView = () => {
  // TODO: Use theming context/provider for this or define own
  // https://reactician.com/articles/sharing-state-between-nextjs-page-navigations-using-react-contexts
  const [serif, setSerif] = useState(false)

  return (
    <AppContainer>
      <Row gap="small" pad="small" justify="start">
        <span  onClick={() => setSerif(false)}>sans-serif</span>
        <span style={{fontFamily:'Times'}} onClick={() => setSerif(true)}>serif</span>
      </Row>
      <Main style={{ fontFamily: serif ? 'Times' : 'inherit' }}>
        <Head>
          <title>
            formation.tools -- Ideate, collaborate, smile and profit!
          </title>
        </Head>
        <MainContent>
          {/* iterate over json, build right component */}
          {json.map((component, i) => generateComponent(component, i))}
        </MainContent>
      </Main>
    </AppContainer>
  )
}

export default ListView
