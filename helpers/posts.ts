export const getCreatedAgo = (createdAt: string) => {
  const currDate = new Date();
  const createdDate = new Date(createdAt);
  const diffSecs = (currDate - createdDate) / 1000;
  if (diffSecs < 60) {
    return "1m";
  } else if (diffSecs > 60 && diffSecs < 60 * 60) {
    return `${Math.floor(diffSecs / 60)}m`;
  } else if (diffSecs >= 60 * 60 && diffSecs < 60 * 60 * 24) {
    return `${Math.floor(diffSecs / (60 * 60))}h`;
  } else if (diffSecs >= 60 * 60 * 24 && diffSecs < 60 * 60 * 24 * 7) {
    return `${Math.floor(diffSecs / (60 * 60 * 24))}d`;
  } else if (diffSecs >= 60 * 60 * 24 * 7 && diffSecs < 60 * 60 * 24 * 7 * 4) {
    return `${Math.floor(diffSecs / (60 * 60 * 24 * 7))}w`;
  } else if (
    diffSecs >= 60 * 60 * 24 * 7 * 4 &&
    diffSecs < 60 * 60 * 24 * 7 * 4 * 12
  ) {
    return `${Math.floor(diffSecs / (60 * 60 * 24 * 7 * 4))}m`;
  } else {
    return `${Math.floor(diffSecs / (60 * 60 * 24 * 7 * 4 * 12))}y`;
  }
};
