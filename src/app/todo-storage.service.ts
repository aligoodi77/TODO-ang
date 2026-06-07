import { Injectable } from '@angular/core';
import { Todo } from './todo.model';

const STORAGE_KEY = 'todo-ang.tasks.v1';

const seedTodos: Todo[] = [
  {
    id: 'seed-1',
    title: 'Build Angular todo portfolio app',
    description: 'Ship a polished CRUD workflow with filters, persistence, and responsive UI.',
    completed: false,
    priority: 'high',
    dueDate: new Date().toISOString().slice(0, 10),
    tags: ['angular', 'portfolio'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    title: 'Write project README',
    description: 'Explain features, tech stack, and local setup clearly for recruiters.',
    completed: false,
    priority: 'medium',
    dueDate: '',
    tags: ['docs'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

@Injectable({ providedIn: 'root' })
export class TodoStorageService {
  load(): Todo[] {
    if (!this.hasLocalStorage()) {
      return seedTodos;
    }

    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return seedTodos;
    }

    try {
      const parsed = JSON.parse(rawValue);
      return Array.isArray(parsed) ? parsed : seedTodos;
    } catch {
      return seedTodos;
    }
  }

  save(todos: Todo[]): void {
    if (!this.hasLocalStorage()) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  private hasLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}
