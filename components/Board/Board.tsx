import { useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import { PlusIcon } from '@heroicons/react/outline'

import { columnsFromBackend } from './data'
import BoardColumn from './Column'

// import { FDocument } from 'core/types'

type KanbanBoardProps = {
  data: Array<KanbanColumnProps>
  /*eslint no-unused-vars: ["error", {"args": "none"}]*/
  addTask: (visible: boolean) => any
  editTask: (visible: boolean) => any
}

export default function KanbanBoard({
  data,
  addTask,
  editTask,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState(columnsFromBackend)

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return
    const { source, destination } = result
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.tasks]
      const destItems = [...destColumn.tasks]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destItems,
        },
      })
    } else {
      const column = columns[source.droppableId]
      const copiedItems = [...column.tasks]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          tasks: copiedItems,
        },
      })
    }
  }
  const handleAddTask = (columnId) => {
    console.log('add task in column with id: ', columnId)
    addTask(true)
  }
  const handleEditTask = (taskId) => {
    console.log('edit task with id: ', taskId)
    editTask(true)
  }

  // const { todoStates } = doc

  // ----------------

  // if (doc === undefined) {
  //   // TODO: Implement empty board view
  //   return <span>noop</span>
  // }

  return (
    <DragDropContext
      onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
    >
      <div className="flex flex-col mt-2">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <div className="flex items-start justify-start px-4 mb-6 space-x-4">
                {Object.entries(columns).map(([columnId, column], index) => {
                  return (
                    <Droppable key={columnId} droppableId={columnId}>
                      {(provided, snapshot) => (
                        // TODO: Drill todos down to BoardColumn
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <BoardColumn
                            key={index}
                            id={columnId}
                            index={index}
                            title={column.title}
                            tasks={column.tasks}
                            onAddTask={(columnId) => handleAddTask(columnId)}
                            onEditTask={(taskId) => handleEditTask(taskId)}
                            placeholder={provided.placeholder}
                          />
                        </div>
                      )}
                    </Droppable>
                  )
                })}

                <div className="w-72">
                  <div className="py-4 text-base font-semibold text-gray-900">
                    Add another group
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addTask(true)
                    }}
                    className="flex items-center justify-center w-full h-32 py-2 m-0 font-semibold text-gray-500 border-2 border-gray-200 border-dashed rounded-lg hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    <PlusIcon className="w-10 h-10" fill="none" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}
