import { DataTypes, QueryInterface } from 'sequelize'

module.exports = {
  up: async ({ context: queryInterface }) => {
		let tableDef = await queryInterface.describeTable('unseen_msgs')
		
		if (!tableDef.connection_id) {
			await queryInterface.addColumn('unseen_msgs', 'connection_id', {
				type: DataTypes.INTEGER,
				references: { model: 'connections', key: 'connection_id'},
				onDelete: 'CASCADE'				
			})
		}
		
		tableDef = await queryInterface.describeTable('messages')
		
		if (!tableDef.connection_id) {
			await queryInterface.addColumn('messages', 'connection_id', {
				type: DataTypes.INTEGER,
				references: { model: 'connections', key: 'connection_id'},
				onDelete: 'CASCADE'				
			})
		}
	},
	down: async ({ context: queryInterface }) => {
		await queryInterface.removeColumn('unseen_msgs', 'connection_id')
		await queryInterface.removeColumn('messages', 'connection_id')
	}
}