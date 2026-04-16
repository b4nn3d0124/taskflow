// src/ui/AuthUI.ts
import { AuthService } from '../services/AuthService';

export class AuthUI {
  constructor(private container: HTMLElement, private authService: AuthService) {}

  render() {
    this.container.innerHTML = `
      <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Taskflow</h2>
        <div id="auth-forms">
          <div id="login-form">
            <h3 class="text-xl font-semibold mb-4">Login</h3>
            <form id="login">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="login-email">Email</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="login-email" type="email" required>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="login-password">Password</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="login-password" type="password" required>
              </div>
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Login</button>
            </form>
            <p class="mt-4 text-center">
              Don't have an account? <a href="#" id="show-register" class="text-blue-500 hover:text-blue-800">Register</a>
            </p>
          </div>
          <div id="register-form" class="hidden">
            <h3 class="text-xl font-semibold mb-4">Register</h3>
            <form id="register">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="register-email">Email</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="register-email" type="email" required>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="register-password">Password</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="register-password" type="password" required>
              </div>
              <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Register</button>
            </form>
            <p class="mt-4 text-center">
              Already have an account? <a href="#" id="show-login" class="text-blue-500 hover:text-blue-800">Login</a>
            </p>
          </div>
        </div>
        <div id="auth-error" class="mt-4 text-red-500 text-center hidden"></div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents() {
    const loginForm = this.container.querySelector('#login') as HTMLFormElement;
    const registerForm = this.container.querySelector('#register') as HTMLFormElement;
    const showRegister = this.container.querySelector('#show-register') as HTMLElement;
    const showLogin = this.container.querySelector('#show-login') as HTMLElement;
    const errorDiv = this.container.querySelector('#auth-error') as HTMLElement;

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (loginForm.querySelector('#login-email') as HTMLInputElement).value;
      const password = (loginForm.querySelector('#login-password') as HTMLInputElement).value;
      try {
        await this.authService.login(email, password);
        errorDiv.classList.add('hidden');
      } catch (error) {
        errorDiv.textContent = (error as Error).message;
        errorDiv.classList.remove('hidden');
      }
    });

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (registerForm.querySelector('#register-email') as HTMLInputElement).value;
      const password = (registerForm.querySelector('#register-password') as HTMLInputElement).value;
      try {
        await this.authService.register(email, password);
        errorDiv.classList.add('hidden');
      } catch (error) {
        errorDiv.textContent = (error as Error).message;
        errorDiv.classList.remove('hidden');
      }
    });

    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      this.container.querySelector('#login-form')!.classList.add('hidden');
      this.container.querySelector('#register-form')!.classList.remove('hidden');
    });

    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      this.container.querySelector('#register-form')!.classList.add('hidden');
      this.container.querySelector('#login-form')!.classList.remove('hidden');
    });
  }
}