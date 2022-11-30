import type { LinearClient, Team } from "@linear/sdk";

type TMigrateProjectsOptions = {
  clientTo: LinearClient;
  srcTeam: Team;
  destTeam: Team;
};

export const migrateProjects = async ({
  clientTo,
  srcTeam,
  destTeam,
}: TMigrateProjectsOptions) => {
  const srcProjects = await srcTeam.projects();
  let destProjects = await destTeam.projects();

  const needMigrateProjects = srcProjects.nodes.filter((srcProject) => {
    return !destProjects.nodes.find(
      (destProject) => srcProject.name === destProject.name
    );
  });
  let i = 0;
  for (const srcProject of needMigrateProjects) {
    const res = await clientTo.projectCreate({
      color: srcProject.color,
      description: srcProject.description,
      name: srcProject.name,
      sortOrder: srcProject.sortOrder,
      startDate: srcProject.startedAt,
      state: srcProject.state,
      targetDate: srcProject.targetDate,
      teamIds: [destTeam.id],
    });
    console.info(
      `Перенесен project ${srcProject.name} (${
        res.success ? "Ok" : "Error"
      }) ${++i}/${needMigrateProjects.length + 1}`
    );
  }
};
