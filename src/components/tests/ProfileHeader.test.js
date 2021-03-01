import React from 'react';
import { create } from 'react-test-renderer';

import ProfileHeader from '../ProfileHeader';

describe('ProfileHeader', ()=>{
    it("matches snapshot of ProfileHeader component", () => {
        const data = {
            name: "Sprout Social",
            screen_name: "SproutSocial",
            profile_image_url:
            "http://pbs.twimg.com/profile_images/625697856330952709/3dynAKiy_normal.png",
        }
        const element = create(
            
            <ProfileHeader user = {data}/>
        );
        expect(element.toJSON()).toMatchSnapshot();
      })
})