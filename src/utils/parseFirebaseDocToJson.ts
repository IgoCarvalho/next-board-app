import { DocumentSnapshot } from 'firebase/firestore'
import { Task, TaskSnapshot } from '../shared/interfaces/tasks.interfaces'

export function parseTaskDocToJson(firebaseDoc: DocumentSnapshot<TaskSnapshot>) {
  return ({
    ...firebaseDoc.data(),
    id: firebaseDoc.id,
    created: firebaseDoc.data()?.created.toDate().toString(),
  })
}
