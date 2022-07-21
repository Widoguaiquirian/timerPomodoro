"use strict";
// ! FOR LESSONS NAMES //
// ? FOR REGULAR COMMENTS //
const tasks = [];
let time = 0;
let timer = null;
let timerbreak = null;
let current = null;

const addTask = document.querySelector(".btn-submit"); // Boton para agregar tarea
const crearTarea = document.querySelector(".task-input"); // input donde escribir tarea
const form = document.querySelector(".form"); //Form donde vamos a escuchar el evento submit
const taskName = document.querySelector(".task"); // el h3 que dice task bajo el timer
const timerText = document.querySelector(".timer"); // El tiempo en timer

//SE dispara un evento al pulsar submit
form.addEventListener("submit", (e) => {
   e.preventDefault();
   if (crearTarea.value !== "") {
      createTask(crearTarea.value); // funcion que crea la tarea
      crearTarea.value = ""; // LImpia el input despues de crear la tarea
      renderTask(); // funcion que hacer aparecer a la tarea
   }
});

const createTask = function (titleTaskValue) {
   const newTask = {
      id: (Math.random() * 100).toString(36).slice(3), // Generamos un numero random y lo convertimos a string
      title: titleTaskValue, // Es el parametro titleTaskValue de esta misma funcion
      completed: false,
   };

   tasks.unshift(newTask); //Con esto inyectamos la tarea en el array de task = []; del principio
};

const renderTask = function () {
   const html = tasks.map((task) => {
      // Map para crear un nuevo array con el resultado
      // Del array original alterado por cierta condicion
      return `
    <div class="task-added">
        <div class="completed">${
           task.completed
              ? `<span class="done"> Tarea terminada ➡ </span>`
              : `<button class="start-btn" data-id="${task.id}">Comenzar</button>`
        }
        </div>
        <div class="title">${task.title}</div>
    </div>
    `;
   });

   const tasksContainer = document.querySelector(".tasks");
   tasksContainer.innerHTML = html.join("");

   const startButtons = document.querySelectorAll(".task-added .start-btn");

   startButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
         if (!timer) {
            const id = button.getAttribute("data-id");
            startButtonsHandler(id);
            button.textContent = "Actualmente trabajando en...";
         }
      });
   });
};

function startButtonsHandler(id) {
   time = 25 * 60;
   current = id;
   const taskIndex = tasks.findIndex((task) => task.id === id);

   taskName.textContent = tasks[taskIndex].title;

   timer = setInterval(() => {
      timeHandler(id);
   }, 1000);
}

function timeHandler(id) {
   time--;
   renderTime();

   if (time === 0) {
      clearInterval(timer);
      markCompleted(id);
      timer = null;
      renderTask();
      startBreak();
   }
}

function startBreak() {
   time = 5 * 60;
   taskName.textContent = "Descanso de 5 minutos.";
   timerbreak = setInterval(() => {
      timerbreakHandler();
   }, 1000);
}

function timerbreakHandler() {
   time--;
   renderTime();

   if (time === 0) {
      clearInterval(timerbreak);
      current = null;
      timerbreak = null;
      taskName.textContent = "";
      renderTask();
   }
}

function renderTime() {
   const minutes = parseInt(time / 60);
   const seconds = parseInt(time % 60);
   timerText.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function markCompleted(id) {
   const taskIndex = tasks.findIndex((task) => task.id === id);
   tasks[taskIndex].completed = true;
}
