import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Todo,
  TodoDraft,
  TodoFilter,
  TodoPriority,
  TodoSort,
  TodoStats,
} from './todo.model';
import { TodoStorageService } from './todo-storage.service';

@Component({
  selector: 'app-root',
  imports: [DatePipe, FormsModule, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly storage = inject(TodoStorageService);
  private readonly today = new Date().toISOString().slice(0, 10);

  protected readonly todos = signal<Todo[]>(this.storage.load());
  protected readonly draft = signal<TodoDraft>(this.emptyDraft());
  protected readonly editingId = signal<string | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal<TodoFilter>('all');
  protected readonly priorityFilter = signal<TodoPriority | 'all'>('all');
  protected readonly sortBy = signal<TodoSort>('created');

  protected readonly statusFilters: { label: string; value: TodoFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Today', value: 'today' },
    { label: 'Overdue', value: 'overdue' },
  ];

  protected readonly priorityOptions: { label: string; value: TodoPriority | 'all' }[] = [
    { label: 'All priorities', value: 'all' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  protected readonly sortOptions: { label: string; value: TodoSort }[] = [
    { label: 'Newest first', value: 'created' },
    { label: 'Due date', value: 'dueDate' },
    { label: 'Priority', value: 'priority' },
  ];

  protected readonly stats = computed<TodoStats>(() => {
    const todos = this.todos();
    const completed = todos.filter((todo) => todo.completed).length;
    const active = todos.length - completed;
    const dueToday = todos.filter((todo) => this.isDueToday(todo)).length;
    const overdue = todos.filter((todo) => this.isOverdue(todo)).length;

    return {
      total: todos.length,
      active,
      completed,
      dueToday,
      overdue,
      completionRate: todos.length ? Math.round((completed / todos.length) * 100) : 0,
    };
  });

  protected readonly visibleTodos = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    const sortBy = this.sortBy();

    return this.todos()
      .filter((todo) => {
        const matchesTerm =
          !term ||
          [todo.title, todo.description, todo.priority, ...todo.tags]
            .join(' ')
            .toLowerCase()
            .includes(term);
        const matchesStatus =
          status === 'all' ||
          (status === 'active' && !todo.completed) ||
          (status === 'completed' && todo.completed) ||
          (status === 'today' && this.isDueToday(todo)) ||
          (status === 'overdue' && this.isOverdue(todo));
        const matchesPriority = priority === 'all' || todo.priority === priority;

        return matchesTerm && matchesStatus && matchesPriority;
      })
      .sort((a, b) => this.compareTodos(a, b, sortBy));
  });

  protected readonly allTags = computed(() =>
    Array.from(new Set(this.todos().flatMap((todo) => todo.tags))).sort(),
  );

  constructor() {
    effect(() => this.storage.save(this.todos()));
  }

  protected updateDraft<K extends keyof TodoDraft>(field: K, value: TodoDraft[K]): void {
    this.draft.update((draft) => ({ ...draft, [field]: value }));
  }

  protected submitTodo(): void {
    const draft = this.draft();
    const title = draft.title.trim();

    if (!title) {
      return;
    }

    const now = new Date().toISOString();
    const tags = draft.tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    if (this.editingId()) {
      const editingId = this.editingId();
      this.todos.update((todos) =>
        todos.map((todo) =>
          todo.id === editingId
            ? {
                ...todo,
                title,
                description: draft.description.trim(),
                priority: draft.priority,
                dueDate: draft.dueDate,
                tags,
                updatedAt: now,
              }
            : todo,
        ),
      );
    } else {
      const todo: Todo = {
        id: crypto.randomUUID(),
        title,
        description: draft.description.trim(),
        completed: false,
        priority: draft.priority,
        dueDate: draft.dueDate,
        tags,
        createdAt: now,
        updatedAt: now,
      };

      this.todos.update((todos) => [todo, ...todos]);
    }

    this.cancelEdit();
  }

  protected startEdit(todo: Todo): void {
    this.editingId.set(todo.id);
    this.draft.set({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate,
      tags: todo.tags.join(', '),
    });
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
    this.draft.set(this.emptyDraft());
  }

  protected toggleTodo(todoId: string): void {
    this.todos.update((todos) =>
      todos.map((todo) =>
        todo.id === todoId
          ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
          : todo,
      ),
    );
  }

  protected deleteTodo(todoId: string): void {
    this.todos.update((todos) => todos.filter((todo) => todo.id !== todoId));
    if (this.editingId() === todoId) {
      this.cancelEdit();
    }
  }

  protected clearCompleted(): void {
    this.todos.update((todos) => todos.filter((todo) => !todo.completed));
  }

  protected applyTag(tag: string): void {
    this.searchTerm.set(tag);
  }

  protected trackTodo(_index: number, todo: Todo): string {
    return todo.id;
  }

  protected isOverdue(todo: Todo): boolean {
    return Boolean(todo.dueDate && todo.dueDate < this.today && !todo.completed);
  }

  protected isDueToday(todo: Todo): boolean {
    return todo.dueDate === this.today && !todo.completed;
  }

  private compareTodos(a: Todo, b: Todo, sortBy: TodoSort): number {
    if (sortBy === 'dueDate') {
      return (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31');
    }

    if (sortBy === 'priority') {
      const rank: Record<TodoPriority, number> = { high: 0, medium: 1, low: 2 };
      return rank[a.priority] - rank[b.priority];
    }

    return b.createdAt.localeCompare(a.createdAt);
  }

  private emptyDraft(): TodoDraft {
    return {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      tags: '',
    };
  }
}
