//MOUSE EVENTLARI

//DOMConetentLoaded

// document.addEventListener("DOMContentLoaded", run);

// function run() {
//   alert("Sayfa Yüklendi");
// }

//KLAVYE EVENTLARI

//keypress
//keydown
//keyup

// const todo = document.querySelector("#todoName");

// todo.addEventListener("focus", run);
// todo.addEventListener("blur", run);
// todo.addEventListener("copy", run);
// todo.addEventListener("paste", run);
// todo.addEventListener("cut", run);
// todo.addEventListener("select", run);

// function run(e) {
//   console.log(e.type);
// }

//Session Storage
//Değer Ekleme

// sessionStorage.setItem("350", "Ikra");
// sessionStorage.setItem("216", "Enes");
// sessionStorage.setItem("425", "Mehmet");
// sessionStorage.setItem("178", "Sena");

//Değer Silme

// sessionStorage.removeItem("216");
// sessionStorage.removeItem("425");

//Session Stroage - Array Yazdırma

// let name = ["Ali", "Enes", "Kübra", "Adem", "Ayşenur"];
// sessionStorage.setItem("names", JSON.stringify(names));

// let value = JSON.parse(sessionStorage.getItem("names"));
// value.forEach(function (name) {
//   console.log(value);
// });

//Local Stroage Kullanımı

//Değer Ekleme
// localStorage.setItem("motion1", "Push Up");
// localStorage.setItem("motion2", "Barfix");
// localStorage.setItem("motion3", "Burpee");
// localStorage.setItem("motion4", "Squat");

//Değeri Almak

// let value = localStorage.getItem("motion1");
// console.log(value);

//Değer Silmek

// localStorage.removeItem("motion4");

//Tümünü Temizle
//localStorage.clear();

//Tüm Elementleri Seçmek

const form = document.querySelector("#todoAddForm");
const addInput = document.querySelector("#todoName");
const todoList = document.querySelector(".list-group");
const firstCarBody = document.querySelectorAll(".card-body")[0];
const secondCarBody = document.querySelectorAll(".card-body")[1];
const clearButton = document.querySelector("#todoclearButton");
const filterInput = document.querySelector("#todosearch");

//console.log(firstCardBody);
let todos = [];

runEvents();

function runEvents() {
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", pageLoaded);
  secondCarBody.addEventListener("click", removeTodoToUI);
  document
    .querySelector("#todoClearButton")
    .addEventListener("click", allTodosEverywhere);
  filterInput.addEventListener("keyup", filter);
}

function pageLoaded() {
  checkTodosFromsStorage();
  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}

function filter(e) {
  const filterValue = e.target.value.toLowerCase().trim();
  const todoListesi = document.querySelectorAll(".list-group-item");

  if (todoListesi.length > 0) {
    todoListesi.forEach(function (todo) {
      if (todo.toLowerCase().trim().includes(filterValue)) {
        //
        todo.setAttribute("style", "display:block");
      } else {
        todo.setAttribute("style", "display : none!important");
      }
    });
  } else {
    showAlert("warning", "Filtreleme yapmak için en az bir todo olmalıdır!");
  }
}

function allTodosEverywhere() {
  const todoListesi = document.querySelectorAll(".list-group-item");
  if (todoListesi.length > 0) {
    //Ekrandan Silme
    todoListesi.forEach(function (todo) {
      todo.remove();
    });

    //Storage'dan Silme
    todos = [];
    localStorage.setItem("todos", JSON.stringify(todos));
    showAlert("success", "Başarılı bir şekilde silindi");
  } else {
    showAlert("warning", "Silmek için en az bir todo olmalıdır.");
  }
}

function removeTodoToUI(e) {
  if (e.target.className === "fa fa-remove") {
    //Ekrandan Silme
    const todo = e.target.parentElement.parentElement;
    todo.remove();
    //Storage den silme
    removeTodoToStorage(todo.textContent);
    showAlert("success", "Todo başarıyla silindi.");
  }
}

function removeTodoToStorage(removeTodo) {
  checkTodosFromsStorage();
  todos.forEach(function (todo, index) {
    if (removeTodo === todo) {
      todos.splice(index, 1);
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo(e) {
  const inputText = addInput.value.trim();
  if (inputText == null || inputText == "") {
    alert("Lütfen bir değer giriniz.");
  } else {
    //Arayüz Ekleme
    addTodoToUI(inputText);
    addTodoToStorage(inputText);
    showAlert("success", "Todo Eklendi.");
  }

  //Stroage Ekleme
  e.preventDefault();
}
function addTodoToUI(newTodo) {
  /*
 <li class="list-group-item d-flex justify-content-between">
  Todo 1
  <a href="#" class="delete-item">
    <i class="fa fa-remove"></i>
  </a>
</li>
*/
  const li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between";
  li.textContent = newTodo;
  const a = document.createElement("a");
  a.href = "#";
  a.className = "delete-item";
  const i = document.createElement("i");
  i.className = "fa fa-remove";

  a.appendChild(i);
  li.appendChild(a);
  todoList.appendChild(li);

  addInput.value = "";
}

function addTodoToStorage(newTodo) {
  checkTodosFromsStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function checkTodosFromsStorage() {
  if (localStorage.getItem("todos") == null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return;
}
function showAlert(type, message) {
  /*
  <div class="alert alert-warning" role="alert">
  A simple warning alert—check it out!
  </div>
  */
  const div = document.createElement("div");
  //div.className = "alert alert-" + type;
  div.className = `alert alert-${type}`;

  div.textContent = message;

  firstCarBody.appendChild(div);

  setTimeout(function () {
    div.remove();
  }, 2500);
}
