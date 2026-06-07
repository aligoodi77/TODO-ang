export type TodoPriority = 'low' | 'medium' | 'high';

export type TodoFilter = 'all' | 'active' | 'completed' | 'today' | 'overdue';

export type TodoSort = 'created' | 'dueDate' | 'priority';

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
  dueDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TodoDraft {
  title: string;
  description: string;
  priority: TodoPriority;
  dueDate: string;
  tags: string;
}

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
  dueToday: number;
  overdue: number;
  completionRate: number;
}
