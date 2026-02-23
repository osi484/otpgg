class TodoList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.todos = JSON.parse(localStorage.getItem('focus-todos')) || [];
    }

    connectedCallback() {
        this.render();
    }

    saveTodos() {
        localStorage.setItem('focus-todos', JSON.stringify(this.todos));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .todo-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .input-group {
                    display: flex;
                    gap: 0.5rem;
                }
                input[type="text"] {
                    flex: 1;
                    background: oklch(100% 0 0 / 0.05);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 0.8rem 1rem;
                    color: var(--text-primary);
                    font-family: inherit;
                    outline: none;
                    transition: border-color 0.3s;
                }
                input[type="text"]:focus {
                    border-color: var(--accent-forest);
                }
                .add-btn {
                    background: var(--accent-forest);
                    color: var(--bg-color);
                    border: none;
                    width: 45px;
                    height: 45px;
                    border-radius: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }
                .todo-list {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .todo-item {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    background: oklch(100% 0 0 / 0.03);
                    padding: 0.8rem 1rem;
                    border-radius: 12px;
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .todo-item.completed span {
                    text-decoration: line-through;
                    opacity: 0.5;
                }
                .todo-item span {
                    flex: 1;
                    font-size: 0.95rem;
                }
                .checkbox {
                    width: 20px;
                    height: 20px;
                    border-radius: 6px;
                    border: 2px solid var(--border-color);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .checkbox.checked {
                    background: var(--accent-forest);
                    border-color: var(--accent-forest);
                }
                .delete-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    opacity: 0.3;
                    transition: opacity 0.2s;
                }
                .delete-btn:hover {
                    opacity: 1;
                    color: oklch(60% 0.15 20);
                }
            </style>
            <div class="todo-container">
                <div class="input-group">
                    <input type="text" id="new-todo" placeholder="추가할 작업..." maxlength="50">
                    <button class="add-btn" id="add-todo">+</button>
                </div>
                <ul class="todo-list" id="list">
                    ${this.todos.map((todo, index) => `
                        <li class="todo-item ${todo.completed ? 'completed' : ''}" data-index="${index}">
                            <div class="checkbox ${todo.completed ? 'checked' : ''}">
                                ${todo.completed ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' : ''}
                            </div>
                            <span>${todo.text}</span>
                            <button class="delete-btn">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                            </button>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const input = this.shadowRoot.getElementById('new-todo');
        const addButton = this.shadowRoot.getElementById('add-todo');

        const addTask = () => {
            const text = input.value.trim();
            if (text) {
                this.todos.push({ text, completed: false });
                input.value = '';
                this.saveTodos();
                this.render();
            }
        };

        addButton.onclick = addTask;
        input.onkeypress = (e) => { if (e.key === 'Enter') addTask(); };

        this.shadowRoot.querySelectorAll('.todo-item').forEach(item => {
            const index = item.dataset.index;
            item.querySelector('.checkbox').onclick = () => {
                this.todos[index].completed = !this.todos[index].completed;
                this.saveTodos();
                this.render();
            };
            item.querySelector('.delete-btn').onclick = () => {
                this.todos.splice(index, 1);
                this.saveTodos();
                this.render();
            };
        });
    }
}

customElements.define('todo-list', TodoList);
