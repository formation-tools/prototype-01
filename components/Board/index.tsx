import { Col, Row } from '../View'
import Column from './Column'

export type BoardProps = {
  url?: string
}

const states = ["idea","todo", "doing", "done"]

const todos: Array<DocumentElement> = [
  {
    name: 'Heading',
    data: {
      level: 1,
      title: 'This is some heading content for heading 1',
      isTodo: true,
      state: 'todo'
    },
  },
  {
    name: 'Heading',
    data: {
      level: 2,
      title: 'This is some other content for heading 2',
      isTodo: true,
      state: 'done'
    },
  },
  {
    name: 'Heading',
    data: {
      level: 3,
      title: 'This is some other content for heading 3',
      isTodo: true,
      state: 'doing'
    },
  },
  {
    name: 'Heading',
    data: {
      level: 4,
      title: 'This is some other content for heading 4',
      isTodo: true,
      state: 'todo'
    },
  },
  {
    name: 'Heading',
    data: {
      level: 5,
      title: 'This is some other content for heading 5',
      isTodo: true,
      state: 'idea'
    },
  },
]


export default function Board({ url }: BoardProps) {

  // TODO: fix lack of padding on right side when overflow-x
  // TODO: consider data flow. json -> select todos -> pass to column 
  // QUESTION: how to compose blocks? a code block can not be a todo?
  return (
    <Row flex="grow" gap="medium" justify="start" pad="medium">
      {states.map(state => (
        <Column title={state} todos={todos.filter(todo => (!!todo.data.isTodo && todo.data.state === state) )} />
        ))}
    </Row>
  )
}
