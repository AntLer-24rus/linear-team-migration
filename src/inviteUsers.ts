import type { LinearClient, Team } from "@linear/sdk";

type TInviteUsersOptions = {
  clientTo: LinearClient;
  srcTeam: Team;
  destTeam: Team;
};

export const inviteUsers = async ({
  clientTo,
  srcTeam,
  destTeam,
}: TInviteUsersOptions) => {
  const userInDestWorkspace = await clientTo.users();
  const invites = await clientTo.organizationInvites();

  const migrateTeamMembers = await srcTeam.members();

  let needUserMigration = false;
  for (const userForInvite of migrateTeamMembers.nodes) {
    const isMigrated = userInDestWorkspace.nodes.some(
      ({ email }) => email === userForInvite.email
    );
    if (isMigrated) {
      continue;
    }

    const isInvited = invites.nodes.some(
      ({ email }) => userForInvite.email === email
    );
    if (isInvited) {
      needUserMigration = true;
      console.info(
        `Пользователь ${userForInvite.name} (${userForInvite.email}) уже приглашен, ожидается его подтверждение`
      );
    } else {
      needUserMigration = true;
      await clientTo.organizationInviteCreate({
        email: userForInvite.email,
        teamIds: [destTeam.id],
      });
      console.info(
        `Отправлено приглашение ${userForInvite.name} (${userForInvite.email})...`
      );
    }
  }
  if (needUserMigration) {
    console.log(
      "Дождитесь пока вся команда примет приглашения и запустите утилиту еще раз"
    );
    return false;
  }
  return true;
};
