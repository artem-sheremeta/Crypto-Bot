import { Model, Sequelize } from "sequelize";

export async function createTable(
  sequelize: Sequelize,
  ...models: (typeof Model)[]
) {
  try {
    await sequelize.authenticate();
    console.log("Підключено до бази даних!");

    for (const Model of models) {
      await Model.sync({ alter: true });
      console.log(`Таблицю ${Model.name} створено!`);
    }
  } catch (error) {
    console.error(
      "Помилка підключення до бази даних або створення таблиць:",
      error
    );
  }
}
