var input = document.querySelector(".todo_field");
var ul = document.querySelector(".todo_wrapper");
let clear = document.querySelector(".clear");
let activeList = document.querySelector(".active");
let completedList = document.querySelector(".completed");
let totalList = document.querySelector(".total");
let left = document.querySelector(".item_left");

// var todos = [];


let store = Redux.createStore(reducer);
store.subscribe(createUI);

input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && event.target.value.trim() !== "") {
    let text = e.target.value;
    store.dispatch({
      type: "create",
      text,
    });
    event.target.value = "";
  }
});

function createUI() {
  ul.innerHTML = "";
  const todos = store.getState();
  todos.forEach((todo) => {
    let li = document.createElement("li");
    let p = document.createElement("p");
    let span = document.createElement("span");
    let flex = document.createElement('div');
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.isDone;
    p.classList.add("todo_text");
    li.classList.add("todo_child");
    flex.classList.add("flex");
    span.innerText = "X";
    span.addEventListener("click", () => {
      store.dispatch({
        type: "delete",
        id: todo.id,
      });
    });
    checkbox.addEventListener("click", () => {
        console.log('checked');
      if (todo.isDone) p.classList.add("strikeThrough");
      store.dispatch({
        type: "toggle",
        id: todo.id,
        isDone: todo.isDone,
      });
    });

    p.innerHTML = todo.text;
    flex.append(checkbox, p, span);
    li.append(flex);
    ul.append(li);
  });
}

function reducer(state = [], action) {
  switch (action.type) {
    case "create": {
      let newEntry = {
        id: Date.now(),
        text: action.text,
        isDone: false,
      };
      return [...state, newEntry];
    }
    case "delete": {
      return [...state.filter((todo) => !(todo.id == action.id))];
    }
    case "toggle": {
        return state.map(todo => {
            if (todo.id === action.id) {
                todo.isDone = !todo.isDone;
            }
            return todo;
        });
    }

  }
}
