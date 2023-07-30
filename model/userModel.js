module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("blogTB", {
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userPassword: {
        type: DataTypes.STRING,
        allowNull: false
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true
      },
      
    });
    return User;
  };
  