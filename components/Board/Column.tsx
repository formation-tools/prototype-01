import Card, { AddCard } from './Card'

import { Col } from 'components/View'
import { UIHeading, UISubheading } from 'components/generic/UIHeading'

export type BoardColumnProps = {
  title: string
  todos: any
}

const BoardColumn = ({ title, todos }: BoardColumnProps) => {
  return (
    <Col
      round="8px"
      pad={{ horizontal: 'medium' }}
      width={{ min: '252px', max: '252px' }}
      background={{ light: 'lightBlueGrey', dark: '#494956' }} //TODO: pick darkmode color palette
    >
      <UIHeading level={3}>{title}</UIHeading>
      <UISubheading level={3}>{`${todos.length} cards`}</UISubheading>
      {todos.map((todo: any, i: number) => (
        <Card key={i} title={todo.data.title} name={`card-${i}`} type="CARD" />
      ))}
      <AddCard />
    </Col>
  )
}

export default BoardColumn
