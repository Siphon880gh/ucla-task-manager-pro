var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item

  // Creates DOM: li.list-group-item>(span.badge+p.m-1{taskText})
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  /**
   * 
   * @object tasks
   * @property {object} toDo
   *    
   *    @property {string} toDo.date
   *    @property {string} toDo.text
   * 
   * @property {object} inProgress
   * 
   *    @prop...
   * 
   * @property {object} done
   * 
   *    @prop...
   * 
   */
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // TODO; Review; jQuery fundamentap you can loop over object properties
  /**
   * 
   * @method
   * @param {object} tasks        The object containing multiple key-value arrays
   * @param {anonymousFunction} -
   *
   *         @param {string} key
   *         @param {mixed} val
   */
  $.each(tasks, function(list, arr) {
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// TO REVIEW: LiveQuery is not needed. Just delegate to the parent element. Any dynamically created children will automatically have the onclick
// TO REVIEW: The JS vanilla equivalent is using event.target.matches(..) to see if a child p is clicked
$(".list-group").on("click", "p", function() {
  var text = $(this)
    .text()
    .trim();
  var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);

  // TO REVIEW: jQuery .replaceWith()
  // TO REVIEW: js equivalent .replaceWith()
  $(this).replaceWith(textInput);
  textInput.focus();
});

$(".list-group").on("blur", "textarea", function() {

  // get the textarea's current value/text
  var text = $(this)
  .val()
  .trim();

  // get the parent ul's id attribute
  var status = $(this)
  .closest(".list-group")
  .attr("id")
  .replace("list-", "");

  // get the task's position in the list of other li elements
  var index = $(this)
  .closest(".list-group-item")
  .index();

  // console.log("status", status)
  
  tasks[status][index].text = text;
  saveTasks();

  // recreate p element
  var taskP = $("<p>")
  .addClass("m-1")
  .text(text);

  // replace textarea with p element
  $(this).replaceWith(taskP);

});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


