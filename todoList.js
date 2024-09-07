// select
const todoInput = document.querySelector(".todo__input");
const todoForm = document.querySelector(".todo__form");
const todolist = document.querySelector(".todolist");
const selectFilters = document.querySelector(".filter-todos");
const editModal = document.querySelector(".edit__modal");
const closeEditModalBtn = document.querySelector(".close-modal");
const backdrop = document.querySelector(".backdrop");
const editTodoInput = document.querySelector(".editInput");
const updateTodoBtn = document.querySelector(".submit--btn");
const closeModalBtn = document.querySelector(".close--btn");
let filterValue = "all";

// functions

const addNewTodo = (e) => {
  e.preventDefault();
  if (!todoInput.value) return null;
  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: false,
  };
  saveTodo(newTodo);
  resetInput();
  filterTodos();
};
const createTodos = (todos) => {
  let result = "";
  todos.forEach((todo) => {
    result += `
      <li class="todo">
        <img class="icon" src="assets/images/6-points.png" alt="6-points" />
        <p class="todo__title ${
          todo.isCompleted ? "completed completed_text" : ""
        }">
          ${todo.title}
        </p>
        <span class="todo__createdAt ${
          todo.isCompleted ? "completed" : ""
        }">${new Date(todo.updatedAt).toLocaleDateString("fa-IR", {
      year: "numeric",
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
              <p>${todo.isCompleted ? "Not Done" : "Done"}</p>
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
    modal.addEventListener("click", () => {
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
    btn.addEventListener("click", openEditForm);
  });
};

// Functionality for removing, checking, and editing todos
function removeTodos(e) {
  let todos = getAllTodos();
  const todoId = +e.target.dataset.todoid;
  todos = todos.filter((t) => t.id !== todoId);
  saveAllTodos(todos);
  filterTodos();
}
function checkTodos(e) {
  let todos = getAllTodos();
  const todoId = +e.target.dataset.todoid;
  const todo = todos.find((t) => t.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  saveAllTodos(todos);
  filterTodos();
}
// MODAL EDIT:
function openModal(e) {
  backdrop.classList.remove("hidden");
}
function closeModal(e) {
  backdrop.classList.add("hidden");
}
// EDIT SECTION:
let todoToEditId;
function openEditForm(e) {
  openModal();
  todoToEditId = +e.target.dataset.todoid;
  const todos = getAllTodos();
  const todo = todos.find((t) => t.id === todoToEditId);
  editTodoInput.value = todo.title;
  editTodoInput.focus();
}
function updateTodo(e) {
  if (!editTodoInput.value) {
    alert("Please enter a valid todo title !");
    return;
  }
  const todos = getAllTodos();
  const todo = todos.find((t) => t.id === todoToEditId);
  todo.title = editTodoInput.value;
  todo.updatedAt = new Date().toISOString();
  saveAllTodos(todos);
  filterTodos();
  closeModal();
}

const resetInput = () => {
  todoInput.value = "";
  editTodoInput.value = "";
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
  const todos = getAllTodos();
  createTodos(todos);
  todoInput.focus();
});

updateTodoBtn.addEventListener("click", updateTodo);

closeEditModalBtn.addEventListener("click", closeModal);

closeModalBtn.addEventListener("click", closeModal);

editModal.addEventListener("click", (e) => e.stopPropagation());
