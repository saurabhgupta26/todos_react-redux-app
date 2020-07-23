const inputText = document.querySelector(".todo_field");
const ul = document.querySelector(".todo_wrapper");
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
    // { text: "Learn DOM", isDone: false, id: id++ },
    // { text: "Learn HTML", isDone: false, id: id++ },
  ],
  activeTab: "all",
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
    case "ADD_TODO":
      return [...state, { text: action.payload, isDone: false, id: id++ }];
    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    case "TOGGLE_TODO":
      // console.log('toggle')
      return state.map((todo) => {
        if (todo.id == action.payload) {
          todo.isDone = !todo.isDone;
          console.log(todo.isDone, todo.id);
            return todo;
      };
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

function createUI(root, data = []) {
  root.innerHTML = "";
  data.forEach((todo) => {
    console.log("create", todo);
    let flex = document.createElement("div");
    let li = document.createElement("li");
    flex.classList.add("flex");
    let span = document.createElement("span");
    let input = document.createElement("input");
    let label = document.createElement("label");
    label.for = todo.id;
    input.id = todo.id;
    input.type = "checkbox";
    input.checked = todo.isDone;
    label.addEventListener("click", () => handleToggle(todo.id));
    label.append(input, span);
    let p = document.createElement("p");
    p.innerText = todo.text;
    let spanDel = document.createElement("span");
    spanDel.innerText = "X";
    spanDel.addEventListener("click", () => handleDelete(todo.id));
    flex.append(label, p, spanDel);
    li.append(flex);
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
  console.log(id, "handle");
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
      console.log("in complete");
      return all.filter((t) => t.isDone);

    case "Active":
      console.log("in active");

      return all.filter((t) => !t.isDone);
    default:
      return all;
  }
}

subscribe(() =>
  createUI(ul, filterTodo(getState().activeTab, getState().allTodos))
);

function handleChange(newTab) {
  console.log("handleChange");
  dispatch(changeTabAction(newTab));
}
[...ulFooter.children].forEach((elm) =>
  elm.addEventListener("click", ({ target }) => handleChange(target.innerText))
);
