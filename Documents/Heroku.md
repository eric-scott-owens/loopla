<h1 id="top">Heroku</h1>

[Deploy on the Internet Using a Heroku Server](#anchors-deployment-on-heroku)

* [Push to Heroku Staging](#anchors-push-to-heroku-staging)

* [Push to Heroku Production](#anchors-push-to-heroku-production)

[Create a New Heroku Deployment Environment](#anchors-create-heroku-deployment-environment)

[Add Environment Variables to a Heroku Deployment Environment](#anchors-create-heroku-environment-variables)

[Output Real Time Heroku Logs](#anchors-output-heroku-logs)

[Create New Heroku App For Socket.IO](#anchors-create-heroku-app-socket-io)

---

<h2 id="anchors-deployment-on-heroku">Deploy on the Internet Using a Heroku Server</h2>

[Download](https://devcenter.heroku.com/articles/getting-started-with-python#set-up) the Heroku command line interpreter

`heroku login`

ask admin for heroku login and password

[back to top](#top)

---




<h2 id="anchors-push-to-heroku-staging">Push Your Code to the Heroku Staging Server</h2>

The 'staging' branch in our code is meant for deployment to our experimental staging server. This site is not known to the public allowing us to test any changes before moving them to https://www.loopla.com. 

1. Push your changes on the staging branch to the authoritative repository on GitHub

   `git push origin staging`

2. Push your changes on the staging branch to the 'staging' remote repository on the Heroku service:

   `git push staging staging:master`

3. Run the code on the 'staging' remote on the Heroku webserver:

   `heroku ps:scale web=1 worker=1 --remote staging`

4. Push your changes to the staging Socket.IO code to the 'staging-socket-io' remote repository on the Heorku service:

   `git subtree push staging-socket-io --prefix socket-app master`
   
   NOTE: you can force push a subtree with
   
      `git push staging-socket-io ``git subtree split --prefix socket-app``:master --force`

5. Run the code on the 'staging-socket-io' remote on the Heroku webserver:

   `heroku ps:scale web=1 --remote staging-socket-io`

6. To go our site in the the browser

   `https://desolate-stream-94650.herokuapp.com/`
   
[back to top](#top)

---




<h2 id="anchors-push-to-heroku-production">Push Your Code to the Heroku Production Server</h2>

The 'master' branch in our code is meant for deployment to our live site. It is meant to be the most thoroughly tested version of the code.

1. Push your changes on the master branch to the authoritative repository on GitHub

   `git push origin master`

2. Push your changes on the master branch to the 'heroku' remote repository on the Heroku service:
   `git push heroku master`

3. Run the code on the 'heroku' remote on the Heroku webserver:

   `heroku ps:scale web=1 worker=1 --remote heroku`

4. Push your changes to the staging Socket.IO code to the 'staging-socket-io' remote repository on the Heorku service:

   `git subtree push socket-io --prefix socket-app master`
   

5. Run the code on the 'socket-io' remote on the Heroku webserver:

   `heroku ps:scale web=1 --remote socket-io`

6. To go our site in the the browser

   `https://www.loopla.com/`
   
[back to top](#top)

---




<h2 id="anchors-create-heroku-deployment-environment">Create a New Heroku Deployment Environment for the Web Application</h2>

See: `https://medium.com/alpha-coder/deploy-your-react-django-app-on-heroku-335af9dab8a3`

1. Create and new Heroku App for the Web Application

   a. Log into Heroku

      `https://dashboard.heroku.com/`

   b. Change the view selector in the top left corner from **Personal** to **loopla**

   c. Click on the **Apps** tab 

   d. Click **Create new app**

   e. todo... (configure app for Django)

2. Add Heroku Node.js Buildpack

   a. Login to the Heroku CLI

      `heroku login`

   b. Add the Node.js Buildpack in position 1

      `heroku buildpacks:add --index 1 heroku/nodejs --app <AppName>`

3. Add Heroku Multi Procfile buildpack
   
   a. Login to the Heroku CLI

      `heroku login`

   b. Add the Nulti Procfile buildpack

      `heroku buildpacks:add https://github.com/heroku/heroku-buildpack-multi-procfile --app <AppName>`

   c. Configure the Django application's Procfile

      `heroku config:set --app <AppName> PROCFILE=Procfile`

4. Add Redis-to-Go Heroku Addon

   a. Log into Heroku

      `keroku login`

   b. Add the Redis-to-Go Addon

      `heroku addons:create redistogo --app <AppName>`

5. Push code to the server (see above)

6. Run it on the heroku server

   `heroku ps:scale web=1`
   
[back to top](#top)

---




<h2 id="anchors-create-heroku-environment-variables">Add Environment Variables to a Heroku Deployment Environment</h2>

1. Log into Heroku

   `https://dashboard.heroku.com/`

2. Change the view selector in the top left corner from **Personal** to **loopla**

3. Click on the **Apps** tab 

4. Click to select the app for you want to add environment variables to

5. Click the **Settings** tab

6. Scroll down to the **Config Vars** section and click **Reveal Config Vars**

7. Add **Key** **Value** pairs for each environment variable value you want to add and then press add
   
[back to top](#top)

---




<h2 id="anchors-output-heroku-logs">Output Real Time Heroku Logs</h2>

You can stream real time logging information from Heroku from the console using the following commands 
(once you are logged into Heroku)

1. Log into Heroku
   
   `heroku login`

2. Read Web Application Logs

   `heroku logs --source app --tail --remote <remote>`

3. Read Redis Queue Worker Logs

   `heroku logs --source app --tail --remote <remote>`

---




<h2 id="anchors-create-heroku-app-socket-io">Create a New Heroku Deployment Environment for SOCKET.IO</h2>

See: `https://medium.com/alpha-coder/deploy-your-react-django-app-on-heroku-335af9dab8a3`

1. Create and new Heroku App for the Web Application

   a. Log into Heroku

      `https://dashboard.heroku.com/`

   b. Change the view selector in the top left corner from **Personal** to **loopla**

   c. Click on the **Apps** tab 

   d. Click **Create new app**

   e. todo... (configure app for Django)


2. Enable Session Affinity

   a. Login to the Heroku CLI

      `heroku login`

   b. Enable session affinity

      `heroku features:enable http-session-affinity --app <AppName>`

3. Add Node buildpack
   
   a. Login to the Heroku CLI

      `heroku login`

   b. Add the Node buildpack

      `heroku buildpacks:set heroku/nodejs --app`

---