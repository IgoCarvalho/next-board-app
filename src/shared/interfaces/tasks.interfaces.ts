import { Timestamp } from "firebase/firestore"

export interface Task {
  id: string
  userId: string
  userName: string
  created: Date
  task: string
}

export interface TaskSnapshot {
  userId: string
  userName: string
  created: Timestamp
  task: string
}
