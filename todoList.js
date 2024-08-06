// select
const todoInput = document.querySelector(".todo__input");
const todoForm = document.querySelector(".todo__form");
const todolist = document.querySelector(".todolist");
const selectFilters = document.querySelector(".filter-todos");
let filterValue = "all";
let editingId = null; // برای ذخیره ID تسکی که در حال ویرایش است
// functions
const addNewTodo = (e) => {
  e.preventDefault();
  if (!todoInput.value) return null;
  const todos = getAllTodos();
  const newTodo = {
    id: editingId || Date.now(),
    createdAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: false,
  };
  // اگر در حال ویرایش هستیم، تسک قبلی را به‌روزرسانی کنیم
  if (editingId) {
    const updatedTodos = todos.map((todo) =>
      todo.id === editingId ? newTodo : todo
    );
    saveAllTodos(updatedTodos);
  } else {
    saveTodo(newTodo);
  }
  resetInput();
  filterTodos();
};
const createTodos = (todos) => {
  let result = "";
  todos.forEach((todo) => {
    result += `
      <li class="todo">
        <img class="icon" src="assets/images/6-points.png" alt="6-points" />
        <p class="todo__title ${todo.isCompleted ? "completed" : ""}">
          ${todo.title}
        </p>
        <span class="todo__createdAt ${
          todo.isCompleted ? "completed" : ""
        }">${new Date(todo.createdAt).toLocaleDateString("fa-IR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })}</span>      
        <button class="btn__event">
          <svg class="icon">
            <use xlink:href="assets/images/icon.svg#three-dots-vertical-light"></use>
          </svg>
        </button>
        <div class="modal hidden">
          <div class="modal__container">
            <div class="modalcontent todoedit" data-todoId=${todo.id}>
              <svg class="icon">
                <use xlink:href="assets/images/icon.svg#edit"></use>
              </svg>
              <p>Edit</p>
            </div>
            <div class="modalcontent tododone" data-todoId=${todo.id}>
              <svg class="icon">
                <use xlink:href="assets/images/icon.svg#task-done"></use>
              </svg>
              <p>Done</p>
            </div>
            <div class="modalcontent tododelete" data-todoId=${todo.id}>
              <svg class="icon">
                <use xlink:href="assets/images/icon.svg#delete"></use>
              </svg>
              <p>Delete</p>
            </div>
          </div>
        </div>
      </li>`;
  });
  todolist.innerHTML = result;
  setupEventListeners();
};

const setupEventListeners = () => {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("mouseleave", () => {
      modal.classList.add("hidden");
    });
    modal.addEventListener("click", (e) => e.stopPropagation());
  });

  const deleteBtns = document.querySelectorAll(".tododelete");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", removeTodos);
  });

  const doneBtns = document.querySelectorAll(".tododone");
  doneBtns.forEach((btn) => {
    btn.addEventListener("click", checkTodos);
  });

  document.querySelectorAll(".btn__event").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest("li").querySelector(".modal");
      modal.classList.remove("hidden");
    });
  });

  const editBtns = document.querySelectorAll(".todoedit");
  editBtns.forEach((btn) => {
    btn.addEventListener("click", editTodo);
  });
};

// Functionality for removing, checking, and editing todos
function removeTodos(e) {
  const todos = getAllTodos();
  const todoId = +e.target.dataset.todoid;
  const updatedTodos = todos.filter((t) => t.id !== todoId);
  saveAllTodos(updatedTodos);
  filterTodos();
}
function checkTodos(e) {
  const todos = getAllTodos();
  const todoId = +e.target.dataset.todoid;
  const todo = todos.find((t) => t.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  saveAllTodos(todos);
  filterTodos();
}
function editTodo(e) {
  const todoId = +e.target.dataset.todoid;
  const todos = getAllTodos();
  const todo = todos.find((t) => t.id === todoId);
  todoInput.value = todo.title; // مقدار ورودی را تنظیم می‌کند
  editingId = todoId; // ID تسک در حال ویرایش را ذخیره می‌کند
}

const resetInput = () => {
  todoInput.value = "";
  editingId = null; // Reset editingId
};

const filterTodos = () => {
  const todos = getAllTodos();
  switch (filterValue) {
    case "all":
      createTodos(todos);
      break;
    case "completed":
      const filteredCompletedTodos = todos.filter((t) => t.isCompleted);
      createTodos(filteredCompletedTodos);
      break;
    case "uncompleted":
      const filteredUncompletedTodos = todos.filter((t) => !t.isCompleted);
      createTodos(filteredUncompletedTodos);
      break;
    default:
      createTodos(todos);
      break;
  }
};

// Local Storage Functions
const getAllTodos = () => {
  return JSON.parse(localStorage.getItem("todos")) || [];
};

const saveTodo = (todo) => {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
};

const saveAllTodos = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Event Listeners
selectFilters.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

todoForm.addEventListener("submit", addNewTodo);

document.addEventListener("DOMContentLoaded", () => {
  createTodos(getAllTodos());
});
