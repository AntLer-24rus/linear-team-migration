import type { LinearClient, Team } from "@linear/sdk";

type TInviteUsersOptions = {
  clientTo: LinearClient;
  srcTeam: Team;
  destTeam: Team;
};

export const migrateLabels = async ({
  clientTo,
  srcTeam,
  destTeam,
}: TInviteUsersOptions) => {
  const srcLabels = await srcTeam.labels();
  let destLabels = await destTeam.labels();

  const needMigrateLabels = srcLabels.nodes.filter((srcLabel) => {
    return !destLabels.nodes.find(
      (destLabel) => srcLabel.name === destLabel.name
    );
  });
  let i = 0;
  for (const srcLabel of needMigrateLabels) {
    const res = await clientTo.issueLabelCreate({
      name: srcLabel.name,
      color: srcLabel.color,
      description: srcLabel.description,
      teamId: destTeam.id,
    });
    console.info(
      `Перенесен label ${srcLabel.name} (${
        res.success ? "Ok" : "Error"
      }) ${++i}/${needMigrateLabels.length + 1}`
    );
  }
};
