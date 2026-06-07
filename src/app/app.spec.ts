import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the todo workspace', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('TaskFlow Todo');
    expect(compiled.textContent).toContain('Create task');
  });

  it('should add a new todo from the form', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as unknown as {
      updateDraft: (field: 'title', value: string) => void;
      submitTodo: () => void;
    };

    app.updateDraft('title', 'Prepare Angular demo');
    app.submitTodo();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();

    expect(compiled.textContent).toContain('Prepare Angular demo');
  });
});
