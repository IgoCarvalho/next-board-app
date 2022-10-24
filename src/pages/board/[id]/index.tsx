import { doc, getDoc } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FiCalendar } from 'react-icons/fi';
import { createCollection } from '../../../services/firebase';
import { Task, TaskSnapshot } from '../../../shared/interfaces/tasks.interfaces';
import { formatDate } from '../../../utils/formatDate';
import { parseTaskDocToJson } from '../../../utils/parseFirebaseDocToJson';

import styles from './styles.module.scss'

interface TaskDetailsProps {
  task: Task
}

function TaskDetails({ task }: TaskDetailsProps) {
  return (
    <>
      <Head>
        <title>Detalhes da sua tarefa</title>
      </Head>

      <article className={styles.container}>
        <div className={styles.actions}>
          <FiCalendar size={25} />
          <span>Tarefa criada:</span>
          { formatDate(task.created) }
        </div>
        <p> { task.task } </p>
      </article>
    </>
  );
};

export default TaskDetails;

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const { id } = params!

  const taskCollection = createCollection<TaskSnapshot>('tasks')
  const taskSnap = await getDoc(doc(taskCollection, String(id)))

  const taskData = parseTaskDocToJson(taskSnap)

  return {
    props: {
      task: taskData
    }
 }
}
