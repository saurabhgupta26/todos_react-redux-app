var inputText = document.querySelector(".todo_field");
var ul = document.querySelector(".todo_wrapper");
let clear = document.querySelector(".clear");
let activeList = document.querySelector(".active");
let completedList = document.querySelector(".completed");
let totalList = document.querySelector(".total");
let left = document.querySelector(".item_left");
let ulFooter = document.querySelector(".footer");
// store
let id = 0;

let initialState = {
  allTodos: [
    { text: "Learn DOM", isDone: false, id: id++ },
    { text: "Learn HTML", isDone: false, id: id++ },
  ],
  activeTab: "All",
};

let rootReducer = Redux.combineReducers({
  allTodos: allTodosReducer,
  activeTab: allTodosReducer,
});

let { dispatch, getState, subscribe } = Redux.createStore(
  rootReducer /* preloadedState */,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
// Reducers

function allTodosReducer(state = initialState.allTodos, action) {
  switch (action.type) {
    case "ADD_TODOS":
      return [...state, { text: action.payload, isDone: false, id: id++ }];

    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.payload);

    case "TOGGLE_TODO":
      return state.map((todo) => {
        if (todo.id === action.payload) {
          return {
            ...todo,
            isDone: !todo.isDone,
          };
        }
        return todo;
      });
    default:
      return state;
  }
}

function activeTabReducer(state = initialState.activeTab, action) {
  switch (action.type) {
    case "CHANGE":
      return action.payload;

    default:
      return state;
  }
}

// Actions

function createUI(root, data) {
  root.innerHTML = "";
  data.forEach((todo) => {
    let li = document.createElement("li");
    let label = document.createElement("label");
    let span = document.createElement("span");
    label.for = todo.id;
    let input = document.createElement("input");
    input.id = todo.id;
    input.type = "checkbox";
    input.checked = todo.isDone;
    label.addEventListener("click", () => handleToggle(todo.id));
    span.append(input, label);
    let p = document.createElement("p");
    p.innerText = todo.text;
    let spanDel = document.createElement("span");
    spanDel.innerText = "X";
    spanDel.addEventListener("click", () => handleDelete(todo.id));

    li.append(span, p, spanDel);
    ul.append(li);
  });
}

let addTodoAction = (payload) => ({
  type: "ADD_TODO",
  payload,
});

let toggleTodoAction = (payload) => ({
  type: "TOGGLE_TODO",
  payload,
});

let removeTodoAction = (payload) => ({
  type: "REMOVE_TODO",
  payload,
});

let changeTabAction = (payload) => ({
  type: "CHANGE",
  payload,
});

// Methods

function handleAddTodo({ target, keyCode }) {
  if (keyCode === 13) {
    dispatch(addTodoAction(target.value));
  }
}

function handleToggle(id) {
  dispatch(toggleTodoAction(id));
}

function handleDelete(id) {
  dispatch(removeTodoAction(id));
}

inputText.addEventListener("keyup", handleAddTodo);

createUI(ul, getState().allTodos);
function filterTodo(active, all) {
  switch (active) {
    case "Completed":
      return all.filter((t) => t.isDone);
    case "Active":
      return all.filter((t) => !t.isDone);
    default:
      return all;
  }
}

subscribe(() => createUI(ul, filterTodo(getState().allTodos)));

function handleChange(newTab) {
  dispatch(changeTabAction(newTab));
}

[...ulFooter.children].forEach((elm) =>
  elm.addEventListener("click", ({ target }) => handleChange(target.innerText))
);
