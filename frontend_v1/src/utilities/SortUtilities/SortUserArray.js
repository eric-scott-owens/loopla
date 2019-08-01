import { formatPersonName } from '../StringUtilities';

export function sortUserArrayByFullName(userArray) {
  const names = {};
  userArray.sort((a,b) => {
    if(!names[a.id]) names[a.id] = formatPersonName(a.firstName, a.middleName, a.lastName).toUpperCase();
    if(!names[b.id]) names[b.id] = formatPersonName(b.firstName, b.middleName, b.lastName).toUpperCase();
    
    if (names[a.id] === names[b.id]) return 0;
    if (names[a.id] > names[b.id]) return 1;
    return -1;
  });
}

export function sortUserArrayByLastFirstMiddle(userArray) {
  const names = {};
  userArray.sort((a,b) => {
    if(!names[a.id]) names[a.id] = formatPersonName(a.lastName, a.firstName, a.middleName).toUpperCase();
    if(!names[b.id]) names[b.id] = formatPersonName(b.lastName, b.firstName, b.middleName).toUpperCase();
    
    if (names[a.id] === names[b.id]) return 0;
    if (names[a.id] > names[b.id]) return 1;
    return -1;
  });
}