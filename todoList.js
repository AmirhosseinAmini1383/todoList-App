// select
const todoInput = document.querySelector(".todo__input");
const todoForm = document.querySelector(".todo__form");
const todolist = document.querySelector(".todolist");
const selectFilters = document.querySelector(".filter-todos");
const editModal = document.querySelector(".edit__modal");
const closeEditModalBtn = document.querySelector(".close-modal");
const backdrop = document.querySelector(".backdrop");
const editModalInput = document.querySelector(".editInput");
const editTodoForm = document.querySelector(".edit__todo__form");
let filterValue = "all";
let editingId = null; // برای ذخیره ID تسکی که در حال ویرایش است

// functions
const detailsCreateTodo = (title) => ({
  id: editingId || Date.now(),
  createdAt: new Date().toISOString(),
  title,
  isCompleted: false,
});

const addNewTodo = (e) => {
  e.preventDefault();
  if (!todoInput.value) return null;
  let newTodo = detailsCreateTodo(todoInput.value);
  saveTodo(newTodo);
  resetInput();
  filterTodos();
};

const handleEditSubmitModal = () => {
  const todos = getAllTodos();
  let editNewTodo = detailsCreateTodo(editModalInput.value);
  if (editingId) {
    const updatedTodos = todos.map((todo) =>
      todo.id === editingId ? editNewTodo : todo
    );
    saveAllTodos(updatedTodos);
  } else {
    saveTodo(editNewTodo);
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
    btn.addEventListener("click", editTodo);
    btn.addEventListener("click", () => {
      backdrop.classList.remove("hidden");
    });
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
function editTodo(e) {
  const todoId = +e.target.dataset.todoid;
  const todos = getAllTodos();
  const todo = todos.find((t) => t.id === todoId);
  editModalInput.value = todo.title;
  editingId = todoId;
}

const resetInput = () => {
  todoInput.value = "";
  editModalInput.value = "";
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
  const todos = getAllTodos();
  createTodos(todos);
});

closeEditModalBtn.addEventListener("click", () => {
  backdrop.classList.add("hidden");
});

editTodoForm.addEventListener("submit", () => {
  backdrop.classList.add("hidden");
});

editTodoForm.addEventListener("submit", handleEditSubmitModal);

editModal.addEventListener("click", (e) => e.stopPropagation());
