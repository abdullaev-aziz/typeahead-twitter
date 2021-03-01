import { extractUserData } from "../extractUserData";
import { LOGGED_IN_USER } from "../../constants/constants";

test("return null object if one of properties is missing", () => {
  const twitterUser = {
    name: null,
    screen_name: null,
    profile_image_url: null,
  };
  const expectedUser = {
    name: null,
    screen_name: null,
    profile_image_url: null,
    verified: null,
  };
  expect(extractUserData(twitterUser)).toStrictEqual(expectedUser);
});

test("returns user object if all parameters exist", () => {
  const twitterUser = LOGGED_IN_USER;
  const nullUser = {
    name: "Sprout Social",
    screen_name: "SproutSocial",
    profile_image_url:
      "http://pbs.twimg.com/profile_images/625697856330952709/3dynAKiy_normal.png",
    verified: true,
  };
  expect(extractUserData(twitterUser)).toStrictEqual(nullUser);
});
