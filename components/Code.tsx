import type { FC } from 'react'
import { useContext } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Box, ThemeContext } from 'grommet'

export type CodeProps = {
  language: string
  source: string
}

const Code: FC<CodeProps> = props => {
  const theme = useContext(ThemeContext)
  return (
    <Box alignSelf="stretch">
      <SyntaxHighlighter
        style={theme.dark ? oneDark : oneLight}
        customStyletabIndex="0"
        wrapLongLines
        language={props.language}
      >
        {props.source}
      </SyntaxHighlighter>
    </Box>
  )
}

export default Code
