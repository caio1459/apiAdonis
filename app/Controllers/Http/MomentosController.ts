// Importa a interface HttpContextContract do Adonis para tipagem
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Importa a função 'v4' do pacote 'uuid' com o nome 'uuidv4'
import { v4 as uuidv4 } from 'uuid'

// Importa o modelo Momento
import Momento from 'App/Models/Momento'

// Importa a classe Application do Adonis
import Application from '@ioc:Adonis/Core/Application'

export default class MomentosController {
  // Define as opções de validação para a imagem
  private opcoesValidacoes = {
    types: ['image'], // Tipos permitidos: apenas imagens
    size: '2mb', // Tamanho máximo permitido: 2 megabytes
  }

  public async store({ request, response }: HttpContextContract) {
    // Obtém o corpo da requisição
    const body = request.body()

    // Obtém o arquivo de imagem da requisição usando as opções de validação
    const img = request.file('image', this.opcoesValidacoes)

    // Verifica se um arquivo de imagem foi enviado
    if (img) {
      // Gera um nome único para a imagem usando a função 'uuidv4' e sua extensão original
      const imgName = `${uuidv4()}.${img.extname}`

      // Move o arquivo de imagem para o diretório temporário de uploads
      await img.move(Application.tmpPath('uploads'), {
        name: imgName,
      })

      // Define o nome da imagem no corpo da requisição
      body.image = imgName
    }

    // Cria um novo registro no banco de dados com base no corpo da requisição
    const momento = await Momento.create(body)

    // Define o status da resposta como 201 (Created)
    response.status(201)

    // Retorna um objeto com uma mensagem e os dados do momento criado
    return {
      msg: 'Dados inseridos',
      data: momento,
    }
  }

  public async index() {
    // Retorna todos os dados
    const momentos = await Momento.query().preload('comentarios')//Chama os dados de uma tabela segundaria

    return {
      data: momentos,
    }
  }

  public async show({ params }: HttpContextContract) {
    const momentoUnico = await Momento.findOrFail(params.id)
    await momentoUnico.load('comentarios')//carrega os dados da tabela secundaria
    return {
      data: momentoUnico,
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const momentoUnico = await Momento.findOrFail(params.id)
    await momentoUnico.delete()
    return {
      msg: 'Momento excluido com sucesso',
      data: momentoUnico,
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body() //Obtém o corpo da requisição em formato de objeto.
    const momento = await Momento.findOrFail(params.id) //Busca o momento com o ID fornecido na URL. Se o momento não existir, uma exceção é lançada.

    momento.titulo = body.titulo
    momento.descricao = body.descricao

    if (momento.image != body.image || momento.image == null) {
      const img = request.file('image', this.opcoesValidacoes)
      if (img) {
        const imgName = `${uuidv4()}.${img.extname}`
        // Move o arquivo de imagem para o diretório temporário de uploads
        await img.move(Application.tmpPath('uploads'), {
          name: imgName,
        })
        // Define o nome da imagem no corpo da requisição
        momento.image = imgName
      }
    }
    await momento.save()
    return {
      msg: 'Momento Atualizado',
      data: momento,
    }
  }
}
