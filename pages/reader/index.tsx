import React from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'

import base64url from 'base64url'

import { Button, TextInput } from 'grommet'

import Heading from 'components/doc/Heading'
import { AppContainer, Main, MainContent } from 'components/View'

const Home: NextPage = () => {
  const [value, setValue] = React.useState('')
  return (
    <AppContainer>
      <Main>
        <MainContent>
          <Heading title="Welcome to Formation!" level="1" />
          <p>Enter URL to read .org file</p>
          <TextInput
            placeholder="https://...filename.org"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <Link href={`/reader/${base64url(value)}`}>
            <Button primary label="Go!" margin={{ vertical: 'medium' }} />
          </Link>
        </MainContent>
      </Main>
    </AppContainer>
  )
}

export default Home
