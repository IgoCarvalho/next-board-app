import { ChangeEvent, FormEvent, useState } from 'react'
import Head from 'next/head'
import { FiCalendar, FiClock, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { addDoc } from 'firebase/firestore'

import { createCollection } from '../../services/firebase'

import { SupportButton } from '../../components/SupportButton'

import styles from './styles.module.scss'

interface Task {
  id: string
  userId: string
  userName: string
  created: Date
  task: string
}

function Board() {
  const [taskInput, setTaskInput] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])

  const { data: session } = useSession()

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
      const taskCollection = createCollection<Omit<Task, 'id'>>('tasks')
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
          <h1>Você tem 2 tarefas!</h1>

          <article className={styles.task}>
            <p>Aprender criar projetos usando Next JS e aplicando firebase como back.</p>

            <div className={styles.taskInfo}>
              <span>
                <FiCalendar />
                <time>17 de julho 2022</time>
              </span>

              <div className={styles.taskActions}>
                <button>
                  <FiEdit2 size={20} />
                  Editar
                </button>
                <button>
                  <FiTrash2 size={20} color={styles.dangerColor} />
                  Excluir
                </button>
              </div>
            </div>

          </article>

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
