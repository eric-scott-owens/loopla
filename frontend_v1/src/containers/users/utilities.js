import forEach from 'lodash/forEach';

export function getLoopUsers(storeState, loopId) {
  const { users } = storeState;
  const loopUsers = [];
  forEach(users, user => {
    if(user.groups.includes(loopId)) {
      loopUsers.push(user);
    }
  });

  return loopUsers;
}

export function getLoopUsersHash (storeState, loopId) {
  const { users } = storeState;
  const loopUsers = {};
  forEach(users, user => {
    if(user.groups.includes(loopId)) {
      loopUsers[user.id] = user;
    }
  });

  return loopUsers;
}