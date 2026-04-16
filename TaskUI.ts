// src/ui/TaskUI.ts
import { TaskService } from '../services/TaskService';
import { AuthService } from '../services/AuthService';
import { Task } from '../models/Task';

export class TaskUI {
  private tasks: Task[] = [];
  private filterStatus: string = 'all';
  private filterPriority: string = 'all';
  private sortBy: string = 'createdAt';

  constructor(private container: HTMLElement, private taskService: TaskService, private authService: AuthService) {}

  render() {
    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto">
        <header class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold">Taskflow</h1>
          <button id="logout" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
        </header>

        <div class="mb-6">
          <button id="add-task" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Task</button>
        </div>

        <div class="mb-6 flex flex-wrap gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select id="filter-status" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Priority</label>
            <select id="filter-priority" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="all">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Sort by</label>
            <select id="sort-by" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="createdAt">Date Created</option>
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Search</label>
            <input id="search" type="text" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Search tasks...">
          </div>
        </div>

        <div id="tasks-list" class="grid gap-4">
          <!-- Tasks will be rendered here -->
        </div>
      </div>

      <!-- Add/Edit Task Modal -->
      <div id="task-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4" id="modal-title">Add Task</h3>
            <form id="task-form">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="task-title">Title</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="task-title" type="text" required>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="task-description">Description</label>
                <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="task-description" rows="3"></textarea>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="task-status">Status</label>
                <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="task-status">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="task-priority">Priority</label>
                <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="task-priority">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="task-deadline">Deadline</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="task-deadline" type="date">
              </div>
              <div class="flex justify-end">
                <button type="button" id="cancel-task" class="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.loadTasks();
  }

  private bindEvents() {
    const addTaskBtn = this.container.querySelector('#add-task') as HTMLElement;
    const logoutBtn = this.container.querySelector('#logout') as HTMLElement;
    const taskForm = this.container.querySelector('#task-form') as HTMLFormElement;
    const cancelTaskBtn = this.container.querySelector('#cancel-task') as HTMLElement;
    const filterStatus = this.container.querySelector('#filter-status') as HTMLSelectElement;
    const filterPriority = this.container.querySelector('#filter-priority') as HTMLSelectElement;
    const sortBy = this.container.querySelector('#sort-by') as HTMLSelectElement;
    const search = this.container.querySelector('#search') as HTMLInputElement;

    addTaskBtn.addEventListener('click', () => this.showTaskModal());
    logoutBtn.addEventListener('click', () => this.authService.logout());
    cancelTaskBtn.addEventListener('click', () => this.hideTaskModal());

    taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));

    filterStatus.addEventListener('change', () => {
      this.filterStatus = filterStatus.value;
      this.renderTasks();
    });

    filterPriority.addEventListener('change', () => {
      this.filterPriority = filterPriority.value;
      this.renderTasks();
    });

    sortBy.addEventListener('change', () => {
      this.sortBy = sortBy.value;
      this.renderTasks();
    });

    search.addEventListener('input', () => this.renderTasks());
  }

  private loadTasks() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.taskService.subscribeToTasks(user.uid, (tasks) => {
      this.tasks = tasks;
      this.renderTasks();
    });
  }

  private renderTasks() {
    const tasksList = this.container.querySelector('#tasks-list') as HTMLElement;
    const searchTerm = (this.container.querySelector('#search') as HTMLInputElement).value.toLowerCase();

    let filteredTasks = this.tasks.filter(task => {
      const matchesStatus = this.filterStatus === 'all' || task.status === this.filterStatus;
      const matchesPriority = this.filterPriority === 'all' || task.priority === this.filterPriority;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm);
      return matchesStatus && matchesPriority && matchesSearch;
    });

    filteredTasks.sort((a, b) => {
      if (this.sortBy === 'deadline') {
        const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        return aDeadline - bDeadline;
      } else if (this.sortBy === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    tasksList.innerHTML = filteredTasks.map(task => this.renderTask(task)).join('');

    // Bind edit and delete events
    tasksList.querySelectorAll('.edit-task').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const taskId = (e.target as HTMLElement).dataset.id!;
        const task = this.tasks.find(t => t.id === taskId);
        if (task) this.showTaskModal(task);
      });
    });

    tasksList.querySelectorAll('.delete-task').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const taskId = (e.target as HTMLElement).dataset.id!;
        if (confirm('Are you sure you want to delete this task?')) {
          try {
            await this.taskService.deleteTask(taskId);
          } catch (error) {
            console.error('Error deleting task:', error);
          }
        }
      });
    });
  }

  private renderTask(task: Task): string {
    const priorityColors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800'
    };

    const statusColors = {
      'Pending': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800'
    };

    return `
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold">${task.title}</h3>
          <div class="flex space-x-2">
            <button class="edit-task text-blue-500 hover:text-blue-700" data-id="${task.id}">Edit</button>
            <button class="delete-task text-red-500 hover:text-red-700" data-id="${task.id}">Delete</button>
          </div>
        </div>
        <p class="text-gray-600 mb-4">${task.description}</p>
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}">${task.status}</span>
          <span class="px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}">${task.priority}</span>
          ${task.deadline ? `<span class="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Due: ${new Date(task.deadline).toLocaleDateString()}</span>` : ''}
        </div>
      </div>
    `;
  }

  private showTaskModal(task?: Task) {
    const modal = this.container.querySelector('#task-modal') as HTMLElement;
    const form = this.container.querySelector('#task-form') as HTMLFormElement;
    const title = this.container.querySelector('#modal-title') as HTMLElement;

    if (task) {
      title.textContent = 'Edit Task';
      (form.querySelector('#task-title') as HTMLInputElement).value = task.title;
      (form.querySelector('#task-description') as HTMLTextAreaElement).value = task.description;
      (form.querySelector('#task-status') as HTMLSelectElement).value = task.status;
      (form.querySelector('#task-priority') as HTMLSelectElement).value = task.priority;
      (form.querySelector('#task-deadline') as HTMLInputElement).value = task.deadline ? task.deadline.toISOString().split('T')[0] : '';
      (form as any).dataset.taskId = task.id;
    } else {
      title.textContent = 'Add Task';
      form.reset();
      delete (form as any).dataset.taskId;
    }

    modal.classList.remove('hidden');
  }

  private hideTaskModal() {
    const modal = this.container.querySelector('#task-modal') as HTMLElement;
    modal.classList.add('hidden');
  }

  private async handleTaskSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const taskData = {
      title: (form.querySelector('#task-title') as HTMLInputElement).value,
      description: (form.querySelector('#task-description') as HTMLTextAreaElement).value,
      status: (form.querySelector('#task-status') as HTMLSelectElement).value as Task['status'],
      priority: (form.querySelector('#task-priority') as HTMLSelectElement).value as Task['priority'],
      deadline: (form.querySelector('#task-deadline') as HTMLInputElement).value ? new Date((form.querySelector('#task-deadline') as HTMLInputElement).value) : undefined,
    };

    try {
      if ((form as any).dataset.taskId) {
        await this.taskService.updateTask((form as any).dataset.taskId, taskData);
      } else {
        await this.taskService.createTask(taskData, user.uid);
      }
      this.hideTaskModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  }
}