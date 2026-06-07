# TaskFlow Todo

A polished Angular todo application built as a resume-ready portfolio project. It demonstrates modern Angular state management with signals, template control flow, forms, local persistence, filtering, sorting, and responsive UI.

## Features

- Create, edit, complete, and delete tasks
- Priority levels, due dates, descriptions, and comma-separated tags
- Search across titles, descriptions, priorities, and tags
- Status filters for all, active, completed, due today, and overdue tasks
- Priority filtering and sorting by newest, due date, or priority
- Progress and task statistics dashboard
- LocalStorage persistence with safe fallback seed data
- Responsive layout for desktop and mobile screens

## Tech Stack

- Angular 21
- Angular Signals and computed state
- Standalone components
- Template control flow with `@if`, `@for`, and `@empty`
- SCSS
- Vitest through the Angular CLI test setup

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm start
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Project Notes

The app stores todos in the browser with the key `todo-ang.tasks.v1`. Clear site data or remove that key from localStorage to reset the demo data.
# TODO-ang
