# TaskFlow Todo

TaskFlow Todo is a polished Angular to‑do application built as a resume‑ready portfolio project. It showcases modern Angular patterns including signals, standalone components, template control flow, forms, local persistence with localStorage, and responsive UI design. Use it to track tasks, prioritize and filter items, and visualize progress.

## Features

- Create, edit, complete, and delete tasks with titles, descriptions and tags.
- Assign priority levels, due dates, and comma‑separated tags to tasks.
- Search tasks by title, description, priority, or tag.
- Filter tasks by status: all, active, completed, due today, and overdue.
- Sort tasks by newest, due date, or priority.
- View progress statistics and a summary dashboard.
- Persistent data using the browser's localStorage with fallback seed data.
- Fully responsive design for desktop and mobile screens.

## Tech Stack

This project leverages modern Angular features:

- **Angular 21** with the new signals API for fine‑grained reactivity.
- **Standalone components** and **template control flow** (`@if`, `@for`, `@empty`) for cleaner code.
- Reactive forms for validation and state management.
- **SCSS** for modular styling.
- **Vitest** for unit tests via the Angular CLI test setup.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [Angular CLI](https://angular.io/cli)

### Installation & Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/aligoodi77/TODO-ang.git
cd TODO-ang
npm install
```

Start the development server with hot‑reload:

```bash
npm start
```

The app will be served at `http://localhost:4200/`. Open the URL in your browser to view the app.

### Production Build

To build the project for production:

```bash
npm run build
```

Angular CLI outputs the compiled files to the `dist/` directory. Deploy these static files to any web host or CDN.

### Running Tests

Run unit tests with Vitest:

```bash
npm test
```

## Usage Tips

- Clear tasks data by removing the `todo”ang.tasks.v1` key from Local Storage via your browser’s developer tools.
- Use the search and filters at the top of the app to quickly locate tasks by priority, due date, or tag.

## Contributing

Contributions are welcome! If you'd like to propose improvements or fix issues, please fork this repository, create a feature branch, and submit a pull request.

## License

This project is open”source and available under the [MIT License](LICENSE). Feel free to use and modify it in your own projects.
