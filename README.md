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

# Getting a MongoDB URI
To be able to store data such as logs, you will need to use your own database. A database is required, as the database also stores configuration data for your bot.


Modmail supports MongoDB and you are required to provide a MongoDB connection string to the bot. You can get a free 500MB cluster from MongoDB Atlas, which is enough to store around 3 million message logs.


Upon creating an account, you will be greeted with this page. Make sure you select Starter Cluster.

<img src="https://user-images.githubusercontent.com/44692189/64170897-1297a600-ce73-11e9-910e-38b78c3ac315.jpg" alt="mongo">

After this, you will be taken to the below screen:

<img src="https://user-images.githubusercontent.com/44692189/64170901-14fa0000-ce73-11e9-8f17-dc0f751a7492.jpg" alt="mongo">

Select one of the servers marked with `FREE TIER AVAILABLE` and click on `Create Cluster`. It will only take a couple of minutes to configure everything for you.


Follow the "Getting Started" tutorial on the bottom left.

**Creating a database user:**

Go to the `Database Access` section in the security tab. Click on `+ Add New User` to create a new user, whereupon a new screen will pop up. Select `Read and write to any database`, so the bot can properly store the data. Choose a username and password, but make sure they both don't contain any special character like `!`, `-`, `?`. Copy the password into your notepad.

Finally, click `Add User` to finish the creation.

<img src="https://camo.githubusercontent.com/c7dec2c72cb99015509a6b385123bc0851163139/68747470733a2f2f692e696d6775722e636f6d2f70646f38474c672e706e67" alt="mongo">

**Whitelisting all the IPs:**

Go to the `Network Access` section in the security tab. Click on `+ Add IP Address to add an IP address`, whereupon a new screen will pop up. Click the `Allow Access From Everywhere` button and `0.0.0.0/0` should appear in the `Whitelist Entry`. Otherwise, make sure to put input that manually. Finally, click `Confirm` to confirm your changes.

<img src="https://camo.githubusercontent.com/189a1a0b4f4c48b9a1f47e9f5efd943002b9ac1e/68747470733a2f2f692e696d6775722e636f6d2f684d455a7734512e706e67" alt="mongo">

**Obtain a connection string:**

The last part is to generate a Mongo URI. Go to the `Clusters` section in the `Atlas` tab. Click on `Connect` on the left side of your Cluster dashboard. This will open up a new screen where you have three options. For our purposes, select the middle option `Connect Your Application`.

<img src="https://camo.githubusercontent.com/ff93c12255a62f3d4232682375683c87ba193d91/68747470733a2f2f692e696d6775722e636f6d2f526c7653676d682e706e67" alt="mongo">

You need to copy the connection string, which can be easily done by clicking the `Copy` button. Remove `/test?retryWrites=true&w=majority`. Then replace `<password>` with the password for your user, which you set earlier. Paste the URI in your notepad.

The final URI looks similar to this: `mongodb+srv://UsErNaMe:MyPaSsWoRd@modmail-js.mongodb.net/`.

<img src="https://camo.githubusercontent.com/44b2a550a88183dfbd7f6deb5fc608e73c799609/68747470733a2f2f692e696d6775722e636f6d2f55494168725a312e706e67" alt="mongo">
