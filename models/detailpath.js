module.exports = (sequelize, DataTypes) => (
    sequelize.define('detailpath', {
      guide: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      timestamps: true,
      paranoid: true,
      charset:'utf8',
      collate:'utf8_general_ci',
    })
  );
  