module.exports = (sequelize, DataTypes) => (
    sequelize.define('path', {
      start: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      start_ps: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      goal: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      goal_ps: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      way: {
        type: DataTypes.TEXT,
        allowNull: true,  
      },
      way_ps: {
        type: DataTypes.TEXT,
        allowNull: false,
      }
    }, {
      timestamps: true,
      paranoid: true,
      charset:'utf8',
      collate:'utf8_general_ci',
    })
  );
  