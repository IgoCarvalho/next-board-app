import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { FiCalendar, FiClock, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { addDoc, deleteDoc, doc, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore'
import { format } from 'date-fns'

import { createCollection } from '../../services/firebase'

import { SupportButton } from '../../components/SupportButton'

import styles from './styles.module.scss'
import { getToken } from 'next-auth/jwt'

interface Task {
  id: string
  userId: string
  userName: string
  created: Date
  task: string
}

interface BoardProps {
  data: string
}

function Board({ data }: BoardProps) {
  const [taskInput, setTaskInput] = useState('')
  const [tasks, setTasks] = useState<Task[]>(JSON.parse(data) ?? [])

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

  function formatDate(date: Date) {
    return format(new Date(date), 'dd MMMM yyyy')
  }

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.boardContainer}>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Qual sua tarefa?"
            value={taskInput}
            onChange={handleInputChange}
          />
          <button type="submit">
            <FiPlus size={25} />
          </button>
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
                    <button>
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

  const taskCollection = createCollection<Omit<Task, 'id'>>('tasks')
  const tasksSnap = await getDocs(query(taskCollection, where('userId', '==', token?.sub), orderBy('created', 'asc')))

  const tasksData: Task[] = tasksSnap.docs.map(doc => ({ ...doc.data(), id: doc.id, created: (doc.data().created as unknown as Timestamp).toDate()}))

  return {
    props: {
      data: JSON.stringify(tasksData)
    }
  }
}
