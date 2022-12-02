import type { LinearClient, Team } from "@linear/sdk";

type TMigrateStatesOptions = {
  clientTo: LinearClient;
  srcTeam: Team;
  destTeam: Team;
};

export const migrateStates = async ({
  clientTo,
  srcTeam,
  destTeam,
}: TMigrateStatesOptions) => {
  const srcStates = await srcTeam.states();
  let destStates = await destTeam.states();

  const needMigrateStates = srcStates.nodes.filter((srcState) => {
    return !destStates.nodes.find(
      (destState) => srcState.name === destState.name
    );
  });
  let i = 0;
  for (const srcState of needMigrateStates) {
    const res = await clientTo.workflowStateCreate({
      name: srcState.name,
      type: srcState.type,
      teamId: destTeam.id,
      color: srcState.color,
      description: srcState.description,
      position: srcState.position,
    });
    console.info(
      `Перенесен state ${srcState.name} (${
        res.success ? "Ok" : "Error"
      }) ${++i}/${needMigrateStates.length}`
    );
  }
};
