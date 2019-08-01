<h1 id="top">Database Management</h1>

<h2>Developer Configuration</h2>

[Install Postgres.app](#anchors-install-postgres-app)

[Initialize PostgreSQL Server Instance](#anchors-initialize-postgres-server-instance)

[Pull Copy of Production Database to the Local PostgreSQL Server Instance](#anchors-pull-production-database)

[Pull Copy of Staging Database to the Local PostgreSQL Server Instance](#anchors-pull-staging-database)

[Install pgAdmin 4](#anchors-install-pgadmin4)

[Add the Local PostgreSQL Instance to pgAdmin](#anchors-add-local-dev-to-postgres)

[Add Developer Credentials to Local PostgreSQL Instance](#anchors-add-dev-credentials)

NOTE: Ensure that all environment variables are configured (see Computer-Setup.md).

<h2>Other Actions</h2>

[Create Heroku Database Backup](#anchors-create-database-backup-heroku-data-dashboard)

[Push a Copy of Your Development Database to the Staging Instance on Heroku](#anchors-push-development-database)

---



<h1>Developer Configuration</h1>

<h2 id="anchors-install-postgres-app">Install Postgres.app</h2>

### Overview   
These instructions walk through installing the Postgres.app management toolkit. Among other things, these tools provide command line utilities used by Heroku's CLI. 

1. Download the Postgres.app  
  <a href="https://postgresapp.com/downloads.html">https://postgresapp.com/downloads.html</a>

2. Install Postgres.app

    a. Move Postgres.app to the Applications folder

    b. Configure your $PATH to use the included command line tools by entering the following command in the terminal:

      `sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp`

      * Enter your credentials when asked

      * **NOTE:** You must close the terminal window before these changes will take effect  
        You will need to open a new terminal to run any commands that use Postgres.app command line utilities. This includes commands found in [Pull Copy of Production Database to the Local PostgreSQL Server Instance](#anchors-pull-production-database).

[back to top](#top)

---




<h2 id="anchors-initialize-postgres-server-instance">Initialize PostgreSQL Server Instance</h2>

### Overview
These instructions use Postgres.app to initialize a new PostgrSQL server instance with the current user's credentials used to deploy, and access, the server instance.

1. Run Postgres.app

2. Click the **Initialize** button


[back to top](#top)

---




<h2 id="anchors-pull-production-database">Pull Copy of Production Database to the Local PostgreSQL Server Instance</h2>

1. Pull a copy of the production database to the local PostgreSQL developer instance  
  `npm run pg-pull-from-production`

[back to top](#top)

---




<h2 id="anchors-pull-staging-database">Pull Copy of Staging Database to the Local PostgreSQL Server Instance</h2>

1. Pull a copy of the production database to the local PostgreSQL developer instance  
  `npm run pg-pull-from-staging`

[back to top](#top)

---




<h2 id="anchors-install-pgadmin4">Install pgAdmin 4</h2>

1. Download the pgAdmin 4 installer  
  <a href="https://www.pgadmin.org/download/pgadmin-4-macos/">https://www.pgadmin.org/download/pgadmin-4-macos/</a>

    * The Select the most recent Mac installer. At the time of this writing that is **pgadmin4-3.5.dmg (pgAdmin 4 v3.5)**

    * When drirected to the 

2. Install pgAdmin 4

    a. Open **pgadmin4-3.5.dmg**

    b. Click **Agree**  

    c. Drag pgAdmin 4.app to the Applications folder


[back to top](#top)

---



<h2 id="anchors-add-local-dev-to-postgres">Add the Local PostgreSQL Instance to pgAdmin</h2>

1. Open pgAdmin 4

2. Right/Ctrl click  **Servers** and select **Create > Server...**

  A. Add the following configurations

    * General

      * Name: `LocalHost`
    
    * Connection
      
      * Host name/address: `localhost`

      * Port: `5432`

      * Username: `postgres`

      * Password: `L00pl@1!`

  B. Click **Save**

[back to top](#top)

---




<h2 id="anchors-add-dev-credentials">Add Developer Credentials to Local PostgreSQL Instance</h2>

1. Open pgAdmin 4

2. Expand Servers > Postgres 11 > Login/Group Roles

3. Right click **Login/Group Roles** and select **Create > Login/Group Role...**

    a. Configure the new login account
    
      * General

        * Name: `loopla-dev`

      * Definition

        * Password: `L00pl@1!`

      * Privileges

        * Can login? `Yes`

        * Superuser? `Yes`

        * Create roles? `Yes`

        * Create Databases? `Yes`

        * Update Catalog? `Yes`

        * Inherit rights from the parent roles? `Yes`

        * Can initiate streaming replication and backups? `Yes`

    b. Click **Save**

    **NOTE:** You must close the terminal window before these changes will take effect.  
    You will need to open a new terminal to run `npm run django`.

[back to top](#top)

---




<h1>Other Actions</h1>
<h2 id="anchors-create-database-backup-heroku-data-dashboard">Create Heroku Database Backup</h2>

### Overview   
These instructions walk through creating a database backup for a Heroku application using the Heroku website

1. Create a downloadable database backup

  a. Log into the Heroku dashboard by navigating to <a href="https://dashboard.heroku.com">https://dashboard.heroku.com</a> and signing in.

  b. Change the view selector in the top left corner from **Personal** to **loopla**

  c. Click on the **Apps** tab 

  d. Click on the app for which you want to create a backup  
    * Production: serene-hollows-98962
    * Staging:desolate-stream-94650

  e. From the app screen, click on the **Resources** tab

  f. Under **Add-ons** click **Heroku Postgress :: Database**

  g. From the Data - Datastores dashboard click on the **Durability** tab

  h. Click **Create Manual Backup**

  i. Wait for the backup job to complete. When completed the backup with show up in the table below.

[back to top](#top)

---




<h2 id="anchors-push-development-database">Push a Copy of Your Development Database to the Staging Instance on Heroku</h2>

1. Push a copy of the development database to the staging PostgreSQL instance on Heroku  
  `npm run pg-push-to-staging`

[back to top](#top)

---
END OTHER ACTIONS

---
