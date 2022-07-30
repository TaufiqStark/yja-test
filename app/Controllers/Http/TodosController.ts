// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'
import Todo from 'App/Models/Todo'

export default class TodosController {
  public async index({ request, response }) {
    try {
      const todos = await Database.from('todos')
        .orderBy('id', 'desc')
        .paginate(request.input('page', 1), 10)
      return todos.toJSON()
    } catch (e) {
      response.badRequest({ error: e.message })
    }
  }
  public async show({ params, response }) {
    try {
      const todos = await Todo.findOrFail(params.id)
      return todos.toJSON()
    } catch (e) {
      response.badRequest({ error: e.message })
    }
  }
  public async store({ request, response }) {
    try {
      const title = request.input('title')
      if (!title) return response.badRequest({ error: 'Title field is required' })
      const todo = await Todo.create({ title })
      return response.created(todo)
    } catch (e) {
      response.badRequest({ error: e.message })
    }
  }
  public async update({ request, response, params }) {
    try {
      const title = request.input('title')
      if (!title) return response.accepted({ message: 'Nothing to update' })
      const todo = await Todo.updateOrCreate({ id: params.id }, { title })
      return todo.toJSON()
    } catch (e) {
      response.badRequest({ error: e.message })
    }
  }
  public async destroy({ params, response }) {
    try {
      const todo = await Todo.findOrFail(params.id)
      await todo.delete()
      return { message: 'Todo deleted successfully!' }
    } catch (e) {
      response.badRequest({ error: e.message })
    }
  }
}
