import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Comentario from './Comentario'

export default class Momento extends BaseModel {

  //ligação entre as tabelas
  @hasMany(() => Comentario)
  public comentarios: HasMany<typeof Comentario>

  @column({ isPrimary: true })
  public id: number //id da tabela

  @column()
  public titulo: String

  @column()
  public descricao: String

  @column()
  public image: String

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime //salva as datas de criação das tabelas

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime //salva as datas de atualização das tabelas
}
