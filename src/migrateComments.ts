import type { LinearClient, Team } from "@linear/sdk";

type TMigrateCommentsOptions = {
  clientTo: LinearClient;
  srcTeam: Team;
  destTeam: Team;
};
let i = 0;
export const migrateComments = async ({
  srcTeam,
  destTeam,
  clientTo,
}: TMigrateCommentsOptions) => {
  const srcIssues = await srcTeam.issues();
  const destIssues = await destTeam.issues();
  console.info('Начинаю перенос комментариев...')
  for (const srcIssue of srcIssues.nodes) {
    const { title } = srcIssue;
    const destIssue = destIssues.nodes.find((di) => di.title === title);
    if (!destIssue) {
      continue;
    }
    
    
    const srcComments = await srcIssue.comments();
    if (srcComments.nodes.length > 0) {
      console.info(`Переношу комментарии из issue ${srcIssue.identifier}`)
    } 

    const oldComments = [];
    for (const srcComment of srcComments.nodes) {
      const { body, createdAt, updatedAt, user: userPromise } = srcComment;
      const user = await userPromise;
      const userName = user ? `${user.displayName} (${user.email})` : "Unknown";
      oldComments.push(
        `${userName}: created ${createdAt.toLocaleString(
          "ru-RU"
        )} updated ${updatedAt.toLocaleString("ru-RU")}\n  ${body}`
      );
    }


    const res = await clientTo.commentCreate({
      issueId: destIssue.id,
      body: `Идентификатор issue из старого пространства \`${srcIssue.identifier}\`, для сохранения представления о сделанной работе.`,
    });
    if (oldComments.length > 0) {
      await clientTo.commentCreate({
        issueId: destIssue.id,
        body: `Комментарии из старого пространства:\n${oldComments.join('\n\n')}`,
      });
    }
    console.info(
      `Перенесены комментарии для issue ${srcIssue.identifier} (${
        res.success ? "Ok" : "Error"
      }) ${++i}/${srcIssues.nodes.length}`
    );
  }
};
