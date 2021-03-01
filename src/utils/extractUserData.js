export const extractUserData = (twitterUser) => {
  const nullUser = {
    name: null,
    screen_name: null,
    profile_image_url: null,
    verified: null,
  };
  const requiredProperties = [
    "name",
    "screen_name",
    "profile_image_url",
    "verified",
  ];
  for (let property of requiredProperties) {
    if (!twitterUser.hasOwnProperty(property)) return nullUser;
  }
  //destructure here
  const { name, screen_name, profile_image_url, verified } = twitterUser;

  return {
    name,
    screen_name,
    profile_image_url,
    verified,
  };
};
