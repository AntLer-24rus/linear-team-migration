import { LinearClient } from "@linear/sdk";
import { inviteUsers } from "./inviteUsers";
import { migrateIssues } from "./migrateIssues";
import { migrateLabels } from "./migrateLabels";
import { migrateProjects } from "./migrateProjects";
import { migrateStates } from "./migrateStates";
import { migrateTeam } from "./migrateTeam";

export async function migrate(
  apiKeyFrom: string,
  apiKeyTo: string,
  migrateTeamName: string
) {
  const clientFrom = new LinearClient({ apiKey: apiKeyFrom });
  const clientTo = new LinearClient({ apiKey: apiKeyTo });

  const { srcTeam, destTeam } = await migrateTeam({
    clientFrom,
    clientTo,
    migrateTeamName,
  });

  const allMemberHasJoin = await inviteUsers({ clientTo, srcTeam, destTeam });
  if (!allMemberHasJoin) {
    return;
  }
  await migrateLabels({ clientTo, srcTeam, destTeam });
  await migrateStates({ clientTo, srcTeam, destTeam });
  await migrateProjects({ clientTo, srcTeam, destTeam });
  await migrateIssues({ clientTo, srcTeam, destTeam });
  // const userInDestWorkspace = await clientTo.users();

  // const invites = await clientTo.organizationInvites();
  // const srcTeamsList = await clientFrom.teams();
  // const migrateTeam = srcTeamsList.nodes.find(
  //   ({ name }) => name === migrateTeamName
  // );
  // if (!migrateTeam) {
  //   throw new Error(
  //     `Заданное имя команды (${migrateTeamName}) не найдено в списке команд: [${srcTeamsList.nodes
  //       .map(({ name }) => name)
  //       .join(", ")}]`
  //   );
  // }

  // const destTeamsList = await clientTo.teams();

  // let migrateTeamInDest = destTeamsList.nodes.find(
  //   ({ name }) => name === migrateTeam.name
  // );

  // if (typeof migrateTeamInDest === "undefined") {
  //   await clientTo.teamCreate({
  //     name: migrateTeam.name,
  //     color: migrateTeam.color,
  //     key: migrateTeam.key,
  //   });
  //   const destTeamsList = await clientTo.teams();
  //   migrateTeamInDest = destTeamsList.nodes.find(
  //     ({ name }) => name === migrateTeam.name
  //   );
  //   if (typeof migrateTeamInDest === "undefined") {
  //     throw new Error(`Ошибка создания команды ${migrateTeamName}`);
  //   }
  //   console.info(
  //     `Команда ${migrateTeam.name} успешно создана в новом workspace`
  //   );
  // }

  // const migrateTeamMembers = await srcTeam.members();

  // let needUserMigration = false;
  // for (const userForInvite of migrateTeamMembers.nodes) {
  //   const isMigrated = userInDestWorkspace.nodes.some(
  //     ({ email }) => email === userForInvite.email
  //   );
  //   if (isMigrated) {
  //     continue;
  //   }

  //   const isInvited = invites.nodes.some(
  //     ({ email }) => userForInvite.email === email
  //   );
  //   if (isInvited) {
  //     needUserMigration = true;
  //     console.info(
  //       `Пользователь ${userForInvite.name} (${userForInvite.email}) уже приглашен, ожидается его подтверждение`
  //     );
  //   } else {
  //     needUserMigration = true;
  //     await clientTo.organizationInviteCreate({
  //       email: userForInvite.email,
  //       teamIds: [migrateTeamInDest.id],
  //     });
  //     console.info(
  //       `Отправлено приглашение ${userForInvite.name} (${userForInvite.email})...`
  //     );
  //   }
  // }
  // if (needUserMigration) {
  //   console.log(
  //     "Дождитесь пока вся команда примет приглашения и запустите утилиту еще раз"
  //   );
  //   return;
  // }

  // const teamId = migrateTeamInDest.id;
  // const srcLabels = await migrateTeam.labels();
  // let destLabels = await migrateTeamInDest.labels();

  // const needMigrateLabels = srcLabels.nodes.filter((srcLabel) => {
  //   return !destLabels.nodes.find(
  //     (destLabel) => srcLabel.name === destLabel.name
  //   );
  // });
  // let i = 0;
  // for (const srcLabel of needMigrateLabels) {
  //   const res = await clientTo.issueLabelCreate({
  //     name: srcLabel.name,
  //     color: srcLabel.color,
  //     description: srcLabel.description,
  //     teamId,
  //   });
  //   console.info(
  //     `Перенесен label ${srcLabel.name} (${
  //       res.success ? "Ok" : "Error"
  //     }) ${++i}/${needMigrateLabels.length + 1}`
  //   );
  // }
  // const resMigrateLabel = await Promise.all(
  //   srcLabels.nodes
  //     .filter((srcLabel) => {
  //       return !destLabels.nodes.find(
  //         (destLabel) => srcLabel.name === destLabel.name
  //       );
  //     })
  //     .map((srcLabel) =>
  //       clientTo.issueLabelCreate({
  //         name: srcLabel.name,
  //         color: srcLabel.color,
  //         description: srcLabel.description,
  //         teamId,
  //       })
  //     )
  //     .filter((i) => typeof i !== "undefined")
  // );
  // console.info(
  //   `Результат переноса ярлыков: ${resMigrateLabel
  //     .map((l) => (l?.success ? "Ok" : "error"))
  //     .join(", ")}`
  // );

  // const srcStates = await migrateTeam.states();
  // let destStates = await migrateTeamInDest.states();

  // const needMigrateStates = srcStates.nodes.filter((srcState) => {
  //   return !destStates.nodes.find(
  //     (destState) => srcState.name === destState.name
  //   );
  // });
  // i = 0;
  // for (const srcState of needMigrateStates) {
  //   const res = await clientTo.workflowStateCreate({
  //     name: srcState.name,
  //     type: srcState.type,
  //     teamId,
  //     color: srcState.color,
  //     description: srcState.description,
  //     position: srcState.position,
  //   });
  //   console.info(
  //     `Перенесен state ${srcState.name} (${
  //       res.success ? "Ok" : "Error"
  //     }) ${++i}/${needMigrateStates.length + 1}`
  //   );
  // }

  // const resMigrateState = await Promise.all(
  //   srcStates.nodes.map(async (srcState) =>
  //     clientTo.workflowStateCreate({
  //       name: srcState.name,
  //       type: srcState.type,
  //       teamId,
  //       color: srcState.color,
  //       description: srcState.description,
  //       position: srcState.position,
  //     })
  //   )
  // );
  // console.info(
  //   `Результат переноса state: ${resMigrateState
  //     .map((s) => `${s.lastSyncId} ${s?.success ? "(Ok)" : "(Error)"}`)
  //     .join(", ")}`
  // );

  // const srcProjects = await migrateTeam.projects();
  // let destProjects = await migrateTeamInDest.projects();

  // const needMigrateProjects = srcProjects.nodes.filter((srcProject) => {
  //   return !destProjects.nodes.find(
  //     (destProject) => srcProject.name === destProject.name
  //   );
  // });
  // i = 0;
  // for (const srcProject of needMigrateProjects) {
  //   const res = await clientTo.projectCreate({
  //     color: srcProject.color,
  //     description: srcProject.description,
  //     name: srcProject.name,
  //     sortOrder: srcProject.sortOrder,
  //     startDate: srcProject.startedAt,
  //     state: srcProject.state,
  //     targetDate: srcProject.targetDate,
  //     teamIds: [teamId],
  //   });
  //   console.info(
  //     `Перенесен project ${srcProject.name} (${
  //       res.success ? "Ok" : "Error"
  //     }) ${++i}/${needMigrateProjects.length + 1}`
  //   );
  // }
  // const resMigrateProject = await Promise.all(
  //   srcProjects.nodes
  //     .filter((srcProject) => {
  //       return !destProjects.nodes.find(
  //         (destProject) => srcProject.name === destProject.name
  //       );
  //     })
  //     .map((srcProject) =>
  //       clientTo.projectCreate({
  //         color: srcProject.color,
  //         description: srcProject.description,
  //         name: srcProject.name,
  //         sortOrder: srcProject.sortOrder,
  //         startDate: srcProject.startedAt,
  //         state: srcProject.state,
  //         targetDate: srcProject.targetDate,
  //         teamIds: [teamId],
  //       })
  //     )
  // );
  // console.info(
  //   `Результат переноса проектов: ${resMigrateProject
  //     .map((p) => `${p.lastSyncId} ${p?.success ? "(Ok)" : "(Error)"}`)
  //     .join(", ")}`
  // );

  // const srcIssues = await migrateTeam.issues();
  // const destIssues = await migrateTeamInDest.issues();
  // const destUsers = await migrateTeamInDest.members();
  // destLabels = await migrateTeamInDest.labels();
  // destProjects = await migrateTeamInDest.projects();
  // destStates = await migrateTeamInDest.states();

  // const needMigrateIssues = srcIssues.nodes.filter(
  //   (srcIssue) =>
  //     !destIssues.nodes.find((destIssue) => destIssue.title === srcIssue.title)
  // );
  // i = 0;
  // for (const srcIssue of needMigrateIssues) {
  //   const srcAssignee = await srcIssue.assignee;
  //   const srcIssueLabels = await srcIssue.labels();
  //   const srcIssueProject = await srcIssue.project;
  //   const srcIssueState = await srcIssue.state;

  //   const res = await clientTo.issueCreate({
  //     assigneeId: destUsers.nodes.find(
  //       ({ email }) => srcAssignee?.email === email
  //     )?.id,
  //     boardOrder: srcIssue.boardOrder,
  //     description: srcIssue.description,
  //     dueDate: srcIssue.dueDate,
  //     estimate: srcIssue.estimate,
  //     labelIds: destLabels.nodes
  //       .filter(({ name }) =>
  //         srcIssueLabels.nodes.map(({ name }) => name).includes(name)
  //       )
  //       .map(({ id }) => id),
  //     priority: srcIssue.priority,
  //     projectId: destProjects.nodes.find(
  //       ({ name }) => srcIssueProject?.name === name
  //     )?.id,
  //     sortOrder: srcIssue.sortOrder,
  //     stateId: destStates.nodes.find(({ name }) => srcIssueState?.name === name)
  //       ?.id,
  //     // subIssueSortOrder: srcIssue.subIssueSortOrder,
  //     teamId,
  //     title: srcIssue.title,
  //   });
  //   console.info(
  //     `Перенесено issue ${srcIssue.identifier} (${
  //       res.success ? "Ok" : "Error"
  //     }) ${++i}/${needMigrateIssues.length + 1}`
  //   );
  // }

  // const resMigrateIssue = await Promise.all(
  //   srcIssues.nodes
  //     .filter(
  //       (srcIssue) =>
  //         !destIssues.nodes.find(
  //           (destIssue) => destIssue.title === srcIssue.title
  //         )
  //     )
  //     .map(async (srcIssue) => {
  //       const srcAssignee = await srcIssue.assignee;
  //       const srcIssueLabels = await srcIssue.labels();
  //       const srcIssueProject = await srcIssue.project;
  //       const srcIssueState = await srcIssue.state;

  //       return clientTo.issueCreate({
  //         assigneeId: destUsers.nodes.find(
  //           ({ email }) => srcAssignee?.email === email
  //         )?.id,
  //         boardOrder: srcIssue.boardOrder,
  //         description: srcIssue.description,
  //         dueDate: srcIssue.dueDate,
  //         estimate: srcIssue.estimate,
  //         labelIds: destLabels.nodes
  //           .filter(({ name }) =>
  //             srcIssueLabels.nodes.map(({ name }) => name).includes(name)
  //           )
  //           .map(({ id }) => id),
  //         priority: srcIssue.priority,
  //         projectId: destProjects.nodes.find(
  //           ({ name }) => srcIssueProject?.name === name
  //         )?.id,
  //         sortOrder: srcIssue.sortOrder,
  //         stateId: destStates.nodes.find(
  //           ({ name }) => srcIssueState?.name === name
  //         )?.id,
  //         subIssueSortOrder: srcIssue.subIssueSortOrder,
  //         teamId,
  //         title: srcIssue.title,
  //       });
  //     })
  // );
  // console.info(
  //   `Результат переноса issue: ${resMigrateIssue
  //     .map((i) => `${i.lastSyncId} ${i?.success ? "(Ok)" : "(Error)"}`)
  //     .join(", ")}`
  // );
}
