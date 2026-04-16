// src/services/TaskService.ts
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Task } from '../models/Task';

export class TaskService {
  private tasksCollection = 'tasks';

  constructor(private db: Firestore) {}

  async createTask(task: Omit<Task, 'id'>, userId: string): Promise<string> {
    const docRef = await addDoc(collection(this.db, this.tasksCollection), {
      ...task,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  }

  async getTasks(userId: string): Promise<Task[]> {
    const q = query(
      collection(this.db, this.tasksCollection),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const taskRef = doc(this.db, this.tasksCollection, taskId);
    await updateDoc(taskRef, { ...updates, updatedAt: new Date() });
  }

  async deleteTask(taskId: string): Promise<void> {
    await deleteDoc(doc(this.db, this.tasksCollection, taskId));
  }

  subscribeToTasks(userId: string, callback: (tasks: Task[]) => void) {
    const q = query(
      collection(this.db, this.tasksCollection),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      callback(tasks);
    });
  }
}