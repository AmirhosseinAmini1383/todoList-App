// select
const todoInput = document.querySelector(".todo__input");
const todoForm = document.querySelector(".todo__form");
const todolist = document.querySelector(".todolist");
const selectFilters = document.querySelector(".filter-todos");
let todos = [];
let filterValue = "all";
// functions
const addNewTodo = (e) => {
  e.preventDefault();
  if (!todoInput.value) return null;
  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: false,
  };
  todos.push(newTodo);
  // createTodos(todos);
  todoInput.value = "";
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

  // modal
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("mouseleave", () => {
      modal.classList.add("hidden");
    });
    modal.addEventListener("click", (e) => e.stopPropagation());
  });

  // removeBtn
  const removeBtns = document.querySelectorAll(".tododelete");
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", removeTodos);
  });

  // doneBtn
  const checkBtns = document.querySelectorAll(".tododone");
  checkBtns.forEach((btn) => {
    btn.addEventListener("click", checkTodos);
  });

  // Add click event to buttons only once
  const openModalBtns = document.querySelectorAll(".btn__event");
  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Select the modal corresponding to the button
      const modal = btn.nextElementSibling;
      modal.classList.remove("hidden");
    });
  });
};
function removeTodos(e) {
  const todoId = +e.target.closest(".tododelete").dataset.todoid;
  todos = todos.filter((t) => t.id !== todoId);
  console.log(todos);
  filterTodos();
}
function checkTodos(e) {
  console.log(+e.target.closest(".tododone").dataset.todoid);
  console.log(todos);
  const todoId = +e.target.closest(".tododone").dataset.todoid;
  const todo = todos.find((t) => t.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  filterTodos();
}
const filterTodos = () => {
  // const filter = e.target.value;
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

// events
selectFilters.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});
todoForm.addEventListener("submit", addNewTodo);
