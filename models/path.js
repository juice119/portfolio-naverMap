module.exports = (sequelize, DataTypes) => (
    sequelize.define('path', {
      start: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      goal: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      way: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      timestamps: true,
      paranoid: true,
      charset:'utf8',
      collate:'utf8_general_ci',
    })
  );
  