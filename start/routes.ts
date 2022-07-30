/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import path from 'path'

Route.get('/', async ({ view }) => {
  return view.render('todo')
})

Route.group(() => {
  Route.resource('todos', 'TodosController').apiOnly()
}).prefix('/api')

Route.get('/assets/*', ({ params, response }) => {
  response.download(`./public/assets/${path.join(...params['*'])}`, true, (e) => {
    if (e.code === 'ENOENT') return ['File does not exists', 404]
    return ['Cannot get file', 404]
  })
})
