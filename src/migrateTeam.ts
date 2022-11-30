import type { LinearClient } from "@linear/sdk";

type TMigrateTeamOptions = {
  clientFrom: LinearClient;
  clientTo: LinearClient;
  migrateTeamName: string;
};

export const migrateTeam = async ({
  clientFrom,
  clientTo,
  migrateTeamName,
}: TMigrateTeamOptions) => {
  console.info(`Мигрирую команду ${migrateTeamName}`);
  const srcTeamsList = await clientFrom.teams();
  const migrateTeam = srcTeamsList.nodes.find(
    ({ name }) => name === migrateTeamName
  );
  if (!migrateTeam) {
    throw new Error(
      `Заданное имя команды (${migrateTeamName}) не найдено в списке команд: [${srcTeamsList.nodes
        .map(({ name }) => name)
        .join(", ")}]`
    );
  }

  const destTeamsList = await clientTo.teams();

  let migrateTeamInDest = destTeamsList.nodes.find(
    ({ name }) => name === migrateTeam.name
  );

  if (typeof migrateTeamInDest === "undefined") {
    await clientTo.teamCreate({
      name: migrateTeam.name,
      color: migrateTeam.color,
      key: migrateTeam.key,
    });
    const destTeamsList = await clientTo.teams();
    migrateTeamInDest = destTeamsList.nodes.find(
      ({ name }) => name === migrateTeam.name
    );
    if (typeof migrateTeamInDest === "undefined") {
      throw new Error(`Ошибка создания команды ${migrateTeamName}`);
    }
    console.info(
      `Команда ${migrateTeam.name} успешно создана в новом workspace`
    );
  } else {
    console.info(
      `Команда c именем ${migrateTeamName} уже существует в целевом пространстве`
    );
  }

  return {
    srcTeam: migrateTeam,
    destTeam: migrateTeamInDest,
  };
};
