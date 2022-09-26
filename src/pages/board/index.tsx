import Head from 'next/head'
import { FiCalendar, FiClock, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'

import styles from './styles.module.scss'

import { SupportButton } from '../../components/SupportButton'

function Board() {
  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.boardContainer}>
        <form>
          <input type="text" placeholder="Qual sua tarefa?" />
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
