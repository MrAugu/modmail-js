[![Maintenance](https://img.shields.io/badge/Maintained%3F-no-red.svg)]
While project does not get active maintenance and updates, issues are adressed and pull requests reviewed. 
---
*[For help and support join my discord server, click on this.](https://discord.gg/rk7cVyk)*

# Requirments
List of requirments to run modmail-js:

1 - Git Command Line Interface

2 - NodeJS Version 10.x or above

3 - NPM Version 6.x or above

# Installing Files
You to install the bot & the dependendencies you need to execute the following command in your command prompt or terminal.
```
git clone https://github.com/MrAugu/modmail-js/
cd modmail-js
npm install
```
Now that everything is installed on the current machine, we can start by configuring it.

# Configuration
To initialize the configuration editing *interface* we start it `node configurer.js`.

The script is goanna tell you to enter specific values for instance `Enter the bot's token: (<Current Value>)`, if you want <Current Value> to remain, just hit enter on that question. If you want to change the value to something else simply type value and hit enter. For the first run you need to set every single setting.

You need a discord bot token, a prefix (default is `-`), a guild id you can enter for both main and staff guild, a category id which is inside the staff guild with the respective id in which ticket channels are created, a support team role id, which is acessed to ticket channels and and a mongodb url.
