const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')
const dialogTODO= document.getElementById("TODO_Dialog");

dialogTODO.addEventListener('close',(e)=>{
  document.getElementById('txtNewTODO').value='';
});
const url="https://practice-session-9-default-rtdb.firebaseio.com/.json";


var todos=[];

function newTodo() {
  dialogTODO.showModal();
}

function addTodo(){
  let todo={checked:false,value:document.getElementById('txtNewTODO').value}
  dialogTODO.close();
  const requestOptions = {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  };

  
  fetch(url,requestOptions).then(Response=> Response.json()).then(data=>{
    if(data && data.name)
      todo.id=data.name;
    todos[todos.length]=todo;
    render();
    updateCounter();
  });
}

function LoadTODOS(){
  let log =document.getElementById("Log");
  log.textContent="Start loading!";
  fetch(url).then(Response=> Response.json()).then(data=>{
    todos=[];
    for( var key in data) {
      todos[todos.length]={id:key,value:data[key].value,checked:data[key].checked};
    }
    render();
    updateCounter();
    log.textContent='Loda completed!';
  }).catch(err=>{
    let errors=document.getElementById("Errors")
    errors.style.color="red"
    errors.textContent=err.message;
  })
}


function renderTodo(todo){
  return`
  <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.checked ? 'checked' : ''} onchange="checkTodo('${todo.id}')">
      <label for="${todo.id}" id="lb${todo.id}">
          <span class="${todo.checked ? 'text-success text-decoration-line-through' : ''}">${todo.value}</span>
      </label>
      <button class="btn btn-danger btn-sm float-end" onclick="deleteTodo('${todo.id}')">delete</button>
  </li>
`;
}


function render(){
  let todoItems = todos.map(renderTodo).join('');
  document.getElementById('todo-list').innerHTML = todoItems;
}
function updateCounter(){
  itemCountSpan.innerText=todos.length;
  let count=0;
  for(let todo in todos){
    if(todos[todo].checked)
    {
      count+=1;
    }
  }
  uncheckedCountSpan.innerText=count;
}

function checkTodo(id){
  let index = todos.findIndex(todo => todo.id === id);
  let checkUrl="https://practice-session-9-default-rtdb.firebaseio.com/"+id+"/.json"
  const requestOptions = {
    method:'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify({checked:!todos[index].checked})
  };
  fetch(checkUrl,requestOptions).then(Response=>{
    if(Response.ok)
    {
      todos[index].checked=!todos[index].checked
      if(todos[index].checked){
        document.getElementById('lb'+id+'').children[0].classList.add('text-success','text-decoration-line-through');
      }
      else{
        document.getElementById('lb'+id+'').children[0].classList.remove('text-success','text-decoration-line-through');
      }
      updateCounter();
    }
  })

}

function deleteTodo(id){
  const requestOptions = {
    method:'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };
  let delUrl="https://practice-session-9-default-rtdb.firebaseio.com/"+id+"/.json"
  fetch(delUrl,requestOptions).then(Response=>{
    if(Response.ok)
    {
      let index = todos.findIndex(todo => todo.id === id);
        todos.splice(index, 1);
        render();
        updateCounter();
    
    }
  });
}

function SaveInLocalStorage(){
  localStorage.setItem('TODOS',JSON.stringify(todos));

}
LoadTODOS()