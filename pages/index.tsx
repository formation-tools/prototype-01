import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Box, Grommet } from 'grommet'

import Code from '../components/Code'
import { Heading1, Heading2 } from '../components/Heading'
import { FallbackInline } from '../components/FallbackInline'
import Par from '../components/Paragraph'

// map available components
const components = { Heading1, Heading2, Code, Par, FallbackInline }

// dummy json
const json = [
  {
    name: 'Heading1',
    content: 'This is some heading content for heading 1',
  },
  {
    name: 'Heading2',
    content: 'This is some other content for heading 2',
  },
  {
    name: 'Code',
    content: 'const test = 123',
    props: {
      language: 'javascript',
    },
  },
  {
    name: 'Paragraph',
    content:
      'This is some content for the paragraph component. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    name: 'FallbackInline',
    content:
      'This is some content for the fallback inline component. It is rendered as Grommet Text component, which resolves to a HTML <pre> tag.',
  },
]

// dynamic component
const DynamicComponent = (
  component: { name: string; content: string; props?: { language?: string } },
  i: number,
) => {
  const Component = components[component.name as keyof typeof components]
  const _props = component.props ? component.props : {}
  if (!Component) {
    console.error(`component ${component.name} was not found in component map`)
    return <></>
  }
  return <Component key={i} content={component.content} props={_props} />
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

const Home: NextPage = () => {
  const theme = {
    global: {
      colors: {
        brand: '#228BE6',
      },
      font: {
        family: 'Roboto',
        size: '18px',
        height: '20px',
      },
    },
  }
  return (
    <div>
      <Head>
        <title>Formartion.tools</title>
      </Head>
      <Grommet theme={theme}>
        <AppBar>Hello Grommet!</AppBar>
        <h1>Welcome to Formation!</h1>

        {/* iterate over json, build right component */}
        <div>{json.map((component, i) => DynamicComponent(component, i))}</div>
      </Grommet>
    </div>
  )
}

export default Home
