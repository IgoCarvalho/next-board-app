import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { FiCalendar, FiClock, FiEdit2, FiPlus, FiTrash2, FiX, FiCheck } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { addDoc, deleteDoc, doc, getDocs, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore'

import { createCollection } from '../../services/firebase'

import { SupportButton } from '../../components/SupportButton'

import styles from './styles.module.scss'
import { getToken } from 'next-auth/jwt'
import { parseTaskDocToJson } from '../../utils/parseFirebaseDocToJson'
import { Task, TaskSnapshot } from '../../shared/interfaces/tasks.interfaces'
import { formatDate } from '../../utils/formatDate'

interface BoardProps {
  data: Task[]
}

function Board({ data }: BoardProps) {
  const [taskInput, setTaskInput] = useState('')
  const [tasks, setTasks] = useState<Task[]>(data ?? [])
  const [updatingTask, setUpdatingTask] = useState<Task | null>(null)

  const { data: session } = useSession()

  const taskCollection = useMemo(() => createCollection<Omit<Task, 'id'>>('tasks'), [])

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setTaskInput(e.target.value)
  }

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!taskInput.trim()) {
      alert('Preencha com alguma tarefa!')
      setTaskInput('')
      return
    }

    if (await handleUpdateTask()) return

    const taskData: Omit<Task, 'id'> = {
      userId: session?.user?.id!,
      userName: session?.user?.name!,
      created: new Date(),
      task: taskInput.trim()
    }

    try {
      const docRef = await addDoc(taskCollection, taskData)

      const createdTaskData: Task = {
        ...taskData,
        id: docRef.id
      }

      setTasks([...tasks, createdTaskData])
      setTaskInput('')
      console.log('TASK CRIADA: ', docRef.id)
    } catch (error) {
      console.log('DEU ALGO ERRADO: ', error)
    }
  }

  async function handleUpdateTask() {
    if (updatingTask) {
      try {
        await updateDoc(doc(taskCollection, updatingTask.id), { task: taskInput })
        console.log(`TASK [${updatingTask.id}] ATUALIZADA:`)

        updateTasksState(updatingTask.id, taskInput)
        setTaskInput('')
        setUpdatingTask(null)

      } catch (error) {
        console.log(`ERRO AO ATUALIZAR [${updatingTask.id}]:`, error)
      }

      return true
    }

    return false
  }

  function handleDeleteTask(taskId: string) {
    return async () => {
      try {
        await deleteDoc(doc(taskCollection, taskId))
        removeTaskFromState(taskId)
        console.log(`TASK [${taskId}] REMOVIDA:`)
      } catch (error) {
        console.log(`ERRO AO REMOVER [${taskId}]:`, error)
      }
    }
  }

  function removeTaskFromState(taskId: string) {
    const filteredTasks = tasks.filter((t) => t.id !== taskId)

    setTasks(filteredTasks)
  }

  function handleEditTask(task: Task) {
    return () => {
      setTaskInput(task.task)
      setUpdatingTask(task)
    }
  }

  function updateTasksState(taskId: string, taskText: string) {
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, task: taskText }
      }

      return t
    })

    setTasks(updatedTasks)
  }

  function handleCancelEditTask() {
    setTaskInput('')
    setUpdatingTask(null)
  }

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.boardContainer}>

        { updatingTask && (<span>Você está editando uma tarefa!</span>)}

        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Qual sua tarefa?"
            value={taskInput}
            onChange={handleInputChange}
          />

          {
            updatingTask ? (
              <>
                <button
                  type="button"
                  className={styles.delete}
                  onClick={handleCancelEditTask}
                >
                  <FiX size={25} />
                </button>
                <button type="submit" className={styles.save}>
                  <FiCheck size={25} />
                </button>
              </>
            ) : (
              <button type="submit">
                <FiPlus size={25} />
              </button>
            )
          }


        </form>

        <section className={styles.tasksList}>
          <h1>Você tem {tasks.length} {tasks.length === 1 ? 'tarefa!' : 'tarefas!'}</h1>

          {
            tasks.map((task) => (
              <article key={task.id} className={styles.task}>
                <Link href={`/board/${task.id}`}>
                  <p>{ task.task }</p>
                </Link>

                <div className={styles.taskInfo}>
                  <span>
                    <FiCalendar />
                    <time>{ formatDate(task.created) }</time>
                  </span>

                  <div className={styles.taskActions}>
                    <button onClick={handleEditTask(task)}>
                      <FiEdit2 size={20} />
                      Editar
                    </button>
                    <button onClick={handleDeleteTask(task.id)}>
                      <FiTrash2 size={20} color={styles.dangerColor} />
                      Excluir
                    </button>
                  </div>
                </div>

              </article>
            ))
          }
        </section>

      </main>

      <div className={styles.vipContainer}>
        <h2>Obrigado por apoiar esse projeto.</h2>

        <div>
          <FiClock size={20} />
          <span>Última doação cerca de 2 horas</span>
        </div>
      </div>

      <SupportButton />

    </>
  )
}

export default Board

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = await getToken({ req })

  const taskCollection = createCollection<TaskSnapshot>('tasks')
  const tasksSnap = await getDocs(query(taskCollection, where('userId', '==', token?.sub), orderBy('created', 'asc')))

  const tasksData = tasksSnap.docs.map(parseTaskDocToJson)

  return {
    props: {
      data: tasksData
    }
  }
}
