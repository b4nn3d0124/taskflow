// src/app/App.ts
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { AuthService } from '../services/AuthService';
import { TaskService } from '../services/TaskService';
import { AuthUI } from '../ui/AuthUI';
import { TaskUI } from '../ui/TaskUI';

export class App {
  private authService: AuthService;
  private taskService: TaskService;
  private authUI: AuthUI;
  private taskUI: TaskUI;

  constructor(private container: HTMLElement, auth: Auth, db: Firestore) {
    this.authService = new AuthService(auth);
    this.taskService = new TaskService(db);
    this.authUI = new AuthUI(this.container, this.authService);
    this.taskUI = new TaskUI(this.container, this.taskService, this.authService);
  }

  init() {
    this.authService.onAuthStateChanged((user) => {
      if (user) {
        this.taskUI.render();
      } else {
        this.authUI.render();
      }
    });
  }
}