// src/services/AuthService.ts
import { Auth, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export class AuthService {
  constructor(private auth: Auth) {}

  async login(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(this.auth, email, password);
    return result.user;
  }

  async register(email: string, password: string): Promise<User> {
    const result = await createUserWithEmailAndPassword(this.auth, email, password);
    return result.user;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    onAuthStateChanged(this.auth, callback);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}