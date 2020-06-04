module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
      userId: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      userPassword: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
    }, {
      timestamps: true,
      paranoid: true,
      charset:'utf8',
      collate:'utf8_general_ci',
    })
  );
  