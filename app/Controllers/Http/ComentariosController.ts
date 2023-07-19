import Momento from 'App/Models/Momento'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comentario from 'App/Models/Comentario'

export default class ComentariosController {
  public async store({ request, response, params }: HttpContextContract) {
    const body = request.body()
    const momentoId = params.momentoId

    await Momento.findOrFail(momentoId)

    body.momentoId = momentoId

    const comentario = await Comentario.create(body)

    response.status(201)

    return {
      msg: 'Dados Inseridos',
      data: comentario,
    }
  }
}
