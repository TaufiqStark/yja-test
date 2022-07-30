function Loading(e, label) {
  this.e = e
  this.text = this.e.innerText
  this.label = label
  this.set = () => {
    this.e.setAttribute('disabled', '')
    this.e.innerHTML = (`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span class="visually-hidden">${this.label ?? 'Loading...'}</span>`)
  }
  this.unset = () => {
    this.e.removeAttribute('disabled')
    this.e.innerHTML = (this.text)
  }
}
function errAlert(e, type = 'warning') {
  if (window?.alertTimeout) clearTimeout(alertTimeout)
  const html = `<div class="alert alert-${type}">${e}</div>`
  const alert = document.querySelector('.error')
  alert.innerHTML = html
  window.alertTimeout = setTimeout(()=>alert.innerHTML = '', 6000)
}

const todoList = document.querySelector('#todoList')
const updateTodoList = async (page = 1) => {
  let html = ''
  const { meta, data} = await fetch(`/api/todos?page=${page}`).then(a=>a.json())
  data.forEach((res)=>{
    html += `<div class="d-flex justify-content-between bg-light rounded p-2 my-2">
    <p class="mb-0">${res?.title}</p>
    <div class="action">
      <button class="btn btn-success btn-sm" onclick="editTodo(this, ${res?.id})">Edit</button>
      <button class="btn btn-primary btn-sm" onclick="doneTodo(this, ${res?.id})">Done</button>
    </div>
  </div>`
  })
  const pagination = ({ first_page, last_page, current_page, total }) => {
    const paginate = ({ pageLink, prev, next, canPrev = true, canNext = true }) => `<nav aria-label="Todo navigation" id="pagination">
      <ul class="pagination justify-content-center">
        <li class="page-item ${canPrev ? '' : 'disabled'}">
          <a class="page-link" href="#pagination" onclick="updateTodoList(${prev})" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        ${pageLink}
        <li class="page-item ${canNext ? '' : 'disabled'}">
          <a class="page-link" href="#pagination" onclick="updateTodoList(${next})" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>`
    const el = (n, active = false) => `<li class="page-item ${active ? 'active' : ''}"><a class="page-link" href="#pagination" onclick="updateTodoList(${n})">${n}</a></li>`
    if(!total)return ''
    if (first_page === current_page){
      const next = first_page+1
      return paginate({
        canPrev: false,
        next,
        pageLink: el(first_page, true)+ el(next)+ el(first_page+2)
      })
    }
    if (last_page === current_page){
      const prev = last_page-1
      return paginate({
        canNext: false,
        prev,
        pageLink: el(last_page-2)+ el(prev)+ el(last_page, true)
      })
    }
    const prev = current_page-1
    const next = current_page+1
    return paginate({
      prev, next,
      pageLink: el(prev)+ el(current_page, true)+ el(next)
    })
  }
  html += pagination(meta)
  todoList.innerHTML = html
  // console.log(meta);
}
updateTodoList()
const doneTodo = async (e, id) => {
  loading = new Loading(e)
  loading.set()
  const res = await fetch(`/api/todos/${id}`, { method: 'delete' }).then(a=>a.json())
  loading.unset()
  if(res.error)return errAlert(res.error)
  errAlert(res?.message, 'success')
  e.parentElement.previousElementSibling.classList.add('text-decoration-line-through')
} 
const editTodo = async (e, id) => {
  const text = e.parentElement.previousElementSibling
  const title = prompt('Title', text.innerText)
  // console.log(title)
  if(!title) return errAlert('Nothing to update')
  loading = new Loading(e)
  loading.set()
  const res = await fetch(`/api/todos/${id}`, { 
    method: 'put',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title })
  }).then(a=>a.json())
  loading.unset()
  if(res.error)return errAlert(res.error)
  errAlert('Todo updated successfully!', 'success')
  text.innerText = title
}
const todoForm = document.querySelector('#todo-form')
todoForm.onsubmit = async (e)=>{
  e.preventDefault()
  const loading = new Loading(e.target[1])
  loading.set()
  const res = await fetch('/api/todos', {
    method: 'post', 
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: e.target[0].value })
  }).then(a=>a.json())
  loading.unset()
  if(res.error)return errAlert(res.error)
  errAlert('Todo created successfully!', 'success')
  e.target[0].value = ''
  updateTodoList()
}

