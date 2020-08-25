import React from 'react';


import {
  EmailShareButton,
  FacebookShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton
} from "react-share";

import {
    EmailIcon,
    FacebookIcon,
    FacebookMessengerIcon,
    InstapaperIcon,
    LineIcon,
    LinkedinIcon,
    LivejournalIcon,
    MailruIcon,
    OKIcon,
    PinterestIcon,
    PocketIcon,
    RedditIcon,
    TelegramIcon,
    TumblrIcon,
    TwitterIcon,
    ViberIcon,
    VKIcon,
    WeiboIcon,
    WhatsappIcon,
    WorkplaceIcon
  } from "react-share";
const config = require('./../../config_client').get(process.env.NODE_ENV);

 
class Sandbox extends React.Component {


    value = null;

    render() {
        return (
            <div>
                <p>Hi</p>

                <FacebookShareButton
                    url={`http://${config.IP_ADDRESS}:3000/sandbox`}
                    // quote={props.joke.setup + props.joke.punchline}
                    // hashtag="#programing joke"
                    >
                    <FacebookIcon logoFillColor="white" size={32} round={true}/>
                </FacebookShareButton>

            </div>
           
        )
    }
};
 
export default Sandbox;

