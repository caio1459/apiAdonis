import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'comentarios'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('user_name') // Alterado o nome da coluna para "user_name"
      table.string('texto')
      //Faz a ligação das tabela, onde um momento tem vários comentarios, alem da função onDelete('CASCADE') que deleta todos os comentarios se um momento for excluido
      table.integer('momento_id').unsigned().references('momentos.id').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
  public async down() {
    this.schema.dropTable(this.tableName)
  }
}