// obtaining all the needed elements from the html
const lightToggle = document.querySelector('.toggle-image')
const textInputElement = document.querySelector('.text-input')
const todoContainer = document.querySelector('.todo-container')
const todoContainers = document.querySelectorAll('.todo-container')
const deleteBtns = document.querySelectorAll('.cancel-btn')
const clearBtn = document.querySelector('.clear-btn')
const checkBtn = document.querySelectorAll('.done')
const todoTotal = document.querySelector('.all')
const todoLeft = document.querySelector('.todo-left')

// create global variables for use
let addedTodos = []
let inputArr = []
let count = 0
let clickedCount = 1
textInputElement.focus();

// add events for backLight, input, keypress and delete
lightToggle.addEventListener('click', changeLight)
textInputElement.addEventListener('input', getInputValue)
textInputElement.addEventListener('keypress', enterToSubmitTodo)
clearBtn.addEventListener('click', deleteCompleted)

// spreading the obtained NodeList obtained for Array operatons
const todosDone = [...checkBtn]
const clickForDeleteBtns = [...deleteBtns]

// Performing array operation to to obtain individual element
todosDone.forEach(todoDone => {
    todoDone.addEventListener('click', markTodoItem, {once: true})
    todoDone.addEventListener('dblclick', removeTodoItem)
})

clickForDeleteBtns.forEach(clickForDeleteBtn => {
    clickForDeleteBtn.addEventListener('click', removeTodoItem)
})
// Function for background light condition
function changeLight() {
    document.querySelector('body').classList.toggle('light');
}
// function for obtaining the newTodo added
function getInputValue() {
    const newTodo = textInputElement.value
    if(newTodo === '' || newTodo == null) return 
    addedTodos.push(newTodo)
}
// funtion for submit event by enter key
function enterToSubmitTodo(e) {
    if(e.key !== 'Enter') return
    if(addedTodos.length <= 0) return
    count++
    todoTotal.innerText = (count)
    let newTodoDiv = document.createElement('div');
    addedTodos.join('')
    createNewTodo(newTodoDiv)
    // clear input field for more new todo entry
    clearInputValue()
}
// funtion for creating the new todo and appending to the document
function createNewTodo(newTodoDiv) {
    const newTodoContent = 
    `<div class="todo" draggable="true">                        
        <input class="done"  type="checkbox" id=${addedTodos[addedTodos.length - 1]}>
        <label for=${addedTodos[addedTodos.length - 1]}>
            ${addedTodos[addedTodos.length - 1]}
        </label>
        <button class="cancel-btn">
            <img src="images/icon-cross.svg" alt="cancel">
        </button>
    </div>`
    newTodoDiv.innerHTML = newTodoContent;
    todoContainer.prepend(newTodoDiv)
    // adding event listeners to the newly created todos
    newTodoDiv.querySelector(".cancel-btn").addEventListener('click', removeTodoItem)
    newTodoDiv.querySelector(".done").addEventListener('dblclick', removeTodoItem)
    newTodoDiv.querySelector('.done').addEventListener('click', markTodoItem, {once: true})
    // pushing the newly created todos in a global array for access for more operations
    const todoDiv = newTodoDiv.querySelector('div')
    inputArr.push(todoDiv)
}
// clearing the input field for another todo
function clearInputValue () {
    textInputElement.value = ''
    addedTodos = []
}
// function to handle todo checked
function markTodoItem(e) {
    if(!e.target.checked) return
    const newclickedCount = clickedCount++
    todoLeft.innerText = newclickedCount
    todoLeft.classList.add('all')
    todoTotal.innerText = (count - newclickedCount)
}
// function for cancle btn to delete inidividual todo
function removeTodoItem(event) {
    const removeBtnClicked = event.target
    removeBtnClicked.closest('.todo').remove()
}
// function to delete all todos done and checked
function deleteCompleted() {
    if(inputArr.length <= 0) return
    inputArr.map(todoDiv => {
        const inputElement = todoDiv.querySelector('input')
        if(inputElement.checked === true) todoDiv.remove()
    })
    todoLeft.innerText = 0
    count = 0
}
// for drag and drop

document.addEventListener('keypress', (event) => {
    // add drag event to all todo items
    if(event.key !== 'Enter') return
    inputArr.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            draggable.classList.add('dragging')
        })

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging')
        })
    })
    // monitor containers for drag-over 
    todoContainers.forEach(container => {
        container.addEventListener('dragover', (e) => {
            e.preventDefault()

            const afterElement = getDragAfterElement(container, e.clientY)
            const draggable = document.querySelector('.dragging')
            if(afterElement !== null) {
                container.prepend(draggable)
            } else {
                container.append(draggable)
            }
        })
    })
})
// to know the exact location of dragged element before dropping
function getDragAfterElement(container, yPosition) {
    const draggableElements = [...container.querySelectorAll('.todo:not(.dragging)')]
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = yPosition - box.top - box.height / 2

        if(offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child}
        } else {
            return closest
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}