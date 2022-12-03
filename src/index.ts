import { LinearClient } from "@linear/sdk";
import { inviteUsers } from "./inviteUsers";
import { migrateComments } from "./migrateComments";
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
  await migrateComments({ clientTo, srcTeam, destTeam });
}
