import type { NextPage, NextApiResponse } from 'next'
import useSWR, { Key, Fetcher } from 'swr'
import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Box, Grommet, ThemeContext } from 'grommet'

import Code, { CodeProps } from '../Code'
import Heading, { HeadingProps } from '../Heading'
import Paragraph, { ParagraphProps } from '../Paragraph'
import Date, { DateProps } from '../Date'
import CheckBox, { CheckBoxProps } from '../CheckBox'

import FallbackInline, { FallbackInlineProps } from '../FallbackInline'
import FallbackBlock, { FallbackBlockProps } from '../FallbackBlock'

import { AppContainer, Main, MainContent } from '../View'

export type HeadingElement = {
  name: 'Heading'
  data: HeadingProps
}

export type ParagraphElement = {
  name: 'Paragraph'
  data: ParagraphProps
}

type CodeBlockElement = {
  name: 'Code'
  data: CodeProps
}

type FallbackInlineElement = {
  name: 'FallbackInline'
  data: FallbackInlineProps
}

type FallbackBlockElement = {
  name: 'FallbackBlock'
  data: FallbackBlockProps
}

type DateElement = {
  name: 'Date'
  data: DateProps
}

type CheckBoxElement = {
  name: 'CheckBox'
  data: CheckBoxProps
}

type DocumentElement =
  | HeadingElement
  | ParagraphElement
  | CodeBlockElement
  | FallbackInlineElement
  | FallbackBlockElement
  | DateElement

// Dummy API call
import type { HelloData } from '../../pages/api/hello'

type User = {
  name: string
  age: number
}

const fetcher: Fetcher<HelloData, string> = url =>
  fetch('../../pages/api/hello').then(r => r.json())

type HelloResponse = {
  hello: string
  isLoading: boolean
  isError: Error
}

function validName(data: HelloData | undefined): string {
  console.log('validName', data, data == undefined)
  if (data == undefined) {
    return 'that which should not be named'
  }
  return data.name
}

function useHello(): HelloResponse {
  const { data, error } = useSWR('/api/hello', fetcher)

  return {
    hello: validName(data),
    isLoading: !error && !data,
    isError: error,
  }
}

// Dummy document
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

export function assertExhaustive(
  value: never,
  message: string = 'Reached unexpected case in exhaustive switch',
): never {
  throw new Error(message)
}

function generateComponent(el: DocumentElement, idx: number) {
  // TODO: De-couple component type from storage type
  switch (el.name) {
    case 'Heading':
      // TODO: Implement fallback when level>6
      return <Heading title={el.data.title} level={el.data.level} />
    case 'Code':
      return <Code language={el.data.language} source={el.data.source} />
    case 'Paragraph':
      return <Paragraph>{el.data.children}</Paragraph>
    case 'FallbackInline':
      return <FallbackInline content={el.data.content} />
    case 'FallbackBlock':
      return <FallbackBlock>{el.data.children}</FallbackBlock>
    case 'Date':
      return <Date timestamp={el.data.timestamp} />
    default:
      return assertExhaustive(el)
  }
}

const AppBar = (props: any) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation="medium"
    style={{ zIndex: '1' }}
    {...props}
  />
)

const ListView = () => {
  const { hello, isLoading, isError }: HelloResponse = useHello()
  const [serif, setSerif] = useState(true)

  return (
      <AppContainer>
        <div>
          <span onClick={() => setSerif(true)}>serif</span>
          <span onClick={() => setSerif(false)}>sans-serif</span>
        </div>
        <Main style={{ fontFamily: serif ? 'inherit' : 'Times' }}>
          <Head>
            <title>
              formation.tools -- Ideate, collaborate, smile and profit!
            </title>
          </Head>
          <MainContent>
            <Heading
              alignSelf="center"
              level="1"
              title="Welcome to Formation!"
            />
            <p>
              This is some dynamic content from the api: 👉🏿{' '}
              <strong>{hello}</strong>
              {isLoading && <span>⏳</span>}
            </p>

            {/* iterate over json, build right component */}
            {json.map((component, i) => generateComponent(component, i))}
            <CheckBox checked />
            <CheckBox />
            <CheckBox indeterminate />
          </MainContent>
        </Main>
      </AppContainer>
  )
}

export default ListView