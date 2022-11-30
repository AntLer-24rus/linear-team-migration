import type { LinearClient, Team } from "@linear/sdk";

type TMigrateIssuesOptions = {
  clientTo: LinearClient;
  srcTeam: Team;
  destTeam: Team;
};

export const migrateIssues = async ({
  clientTo,
  srcTeam,
  destTeam,
}: TMigrateIssuesOptions) => {
  const srcIssues = await srcTeam.issues();
  const destIssues = await destTeam.issues();
  const destUsers = await destTeam.members();
  const destLabels = await destTeam.labels();
  const destProjects = await destTeam.projects();
  const destStates = await destTeam.states();

  const needMigrateIssues = srcIssues.nodes.filter(
    (srcIssue) =>
      !destIssues.nodes.find((destIssue) => destIssue.title === srcIssue.title)
  );
  let i = 0;
  for (const srcIssue of needMigrateIssues) {
    const srcAssignee = await srcIssue.assignee;
    const srcIssueLabels = await srcIssue.labels();
    const srcIssueProject = await srcIssue.project;
    const srcIssueState = await srcIssue.state;

    const res = await clientTo.issueCreate({
      assigneeId: destUsers.nodes.find(
        ({ email }) => srcAssignee?.email === email
      )?.id,
      boardOrder: srcIssue.boardOrder,
      description: srcIssue.description,
      dueDate: srcIssue.dueDate,
      estimate: srcIssue.estimate,
      labelIds: destLabels.nodes
        .filter(({ name }) =>
          srcIssueLabels.nodes.map(({ name }) => name).includes(name)
        )
        .map(({ id }) => id),
      priority: srcIssue.priority,
      projectId: destProjects.nodes.find(
        ({ name }) => srcIssueProject?.name === name
      )?.id,
      sortOrder: srcIssue.sortOrder,
      stateId: destStates.nodes.find(({ name }) => srcIssueState?.name === name)
        ?.id,
      // subIssueSortOrder: srcIssue.subIssueSortOrder,
      teamId: destTeam.id,
      title: srcIssue.title,
    });
    console.info(
      `Перенесено issue ${srcIssue.identifier} (${
        res.success ? "Ok" : "Error"
      }) ${++i}/${needMigrateIssues.length + 1}`
    );
  }
  if (i === 0) {
    console.info('Все issues уже присутствуют в целевом пространстве')
  }
};
