# Скрипт миграции команд в linear

Позволяет переносить команду со всеми проектами и issues из одного workspace в другое.

Пример использования:

1. Установить зависимости `npm install`
2. Создать в папке `migratingTeams` файл описывающий миграцию.
3. Запустить созданный файл `npx ts-node ./migratingTeams/<ИмяФайла>`.

Пример файл миграции:

```javascript
import { migrate } from "../src";

const apiKeyFrom = "<API ключ пространства из которого переносится команда>";
const apiKeyTo = "<API ключ пространства в которое переносится команда>";
const migrateTeamName = "ИмяКоманды (регистрозависимо)";
migrate(apiKeyFrom, apiKeyTo, migrateTeamName).catch((error) => {
  if (error instanceof Error) {
    console.error(
      `В результате миграции команды: "${migrateTeam.name}" возникла ошибка:\n\t${error.message}`
    );
  } else {
    console.error(
      `В результате миграции команды: "${
        migrateTeam.name
      }" возникла неопознанная ошибка ошибка:\n${JSON.stringify(
        error,
        undefined,
        2
      )}`
    );
  }
});
```
