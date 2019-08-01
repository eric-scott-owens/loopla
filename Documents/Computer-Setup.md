<h1 id="top">Computer Setup</h1>

[Recommended Computer System](#anchors-recommended-computer-system)

[Install Visual Studio Code](#anchors-install-vscode)

[Terminal Window Setup](#anchors-terminal-window)

[Create Bash Profile](#anchors-create-bash-profile)

[Configure Environment Variables (Local Environment)](#anchors-configure-environment-variables)

[Install Git](#anchors-install-git)

[Install NodeJS](#anchors-install-nodejs)

[Heroku](#anchors-heroku)

[Setup Github](#anchors-setup-github)

[Install Redis Server](#anchors-setup-redis-server)

[Install Development PostgreSQL Database](#anchors-setup-postgreSQL)

[Clone Repository and Start Local Server](#anchors-clone-repository)

[Deploy Changes to the Staging Server on the Internet Using the Heroku service](#anchors-stage-changes)

[Deploy Changes to the Live Internet Server Using Heroku service](#anchors-deploy-changes)

[Setting Up Computer to Work with Amazon Web Services (AWS)](#anchors-aws)

[System Architecture](#anchors-system-architecture)

---


<h2 id="anchors-recommended-computer-system">Recommended Computer System</h2>

Mac OS X

Recommended Minimum Requirements: 1.8GHZ/8GB RAM/256GB Hard drive

[back to top](#top)

---


<h2 id="anchors-install-vscode">Install Visual Studio Code</h2>

1 - Download and install Visual Studio Code from [https://code.visualstudio.com/](https://code.visualstudio.com/)

2 - Open Visual Studio Code and install all of the following extensions
  * [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) - Enables python debugging
  * [Git Lense - Git Supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)   
        Supercharge the Git capabilities built into Visual Studio Code — Visualize code authorship at a glance via Git blame annotations and code lens, seamlessly navigate and explore Git repositories, gain valuable insights via powerful comparison commands, and so much more
  * [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer) or [Subtle Match Bracket](https://marketplace.visualstudio.com/items?itemName=rafamel.subtle-brackets) - untested internally
  * [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) by Dirk Baeumer. Configured via `.eslintrc` file  
  * [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) by Esben Petersen. Configured via `.prettierrc` file  
  * [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) - Spelling checker for source code
  * [Sass](https://marketplace.visualstudio.com/items?itemName=robinbentley.sass-indented) - Indented Sass syntax highlighting, autocomplete & snippets

3 - Set Default Tab to 2 Spaces
        
        "editor.tabSize": 2

[back to top](#top)


---


<h2 id="anchors-terminal-window">Terminal Window Setup</h2>

### Overview

* In a terminal window, all commands are entered as text.
* The commands are all based on the Unix operating system and are virtually the same as they would be on any linux computer or in other flavors of Unix. See a linux tutorial such as [this one](http://www.ee.surrey.ac.uk/Teaching/Unix/) to learn basics.
* A command shell, is kind of like a user interface for a terminal window. The linux commands are the same with any shell, but different shells provide different ways of setting up short-cuts, and initial settings. The 'bash' shell is recommended for Python and Django.

(Check if bash is default shell)

### Setting up 'bash' shell on Mac OS

* Open terminal app
* Select 'preferences'
* Select 'Profiles' from Top Menu Bar
* Select 'shell' from Menu Bar within container on right
* Enter 'bash' in the field indicating what command is run on startup

(Move to next card)

Typically, you want bash to run some commands every time you open a new terminal window. When you do this, you may want the shell to automatically create some 'aliases' which are short cuts for commands you expect to use frequently. For example, if you want to see a listing of all the files in a directory including the hidden files, and to include the date they were last edited, you would ordinarily need to type "ls -ltha". Aliases allow you to create another name for this command with fewer letters, like "lt". Also, you need to tell the shell where to look for various pieces of software, like Python, in your directory system. You do this by setting a 'PATH'. You do all of this in your initialization file which you store in your home directory. The initialization file is usually named ".bash_profile". See the next card for an example of one.

Note that some operating systems use a .bashrc file, too. It seems though for MacOS, only a .bash_profile is needed.

See [link](http://www.joshstaiger.org/archives/2005/07/bash_profile_vs.html)

[back to top](#top)

---

<h2 id="anchors-create-bash-profile">Create Bash Profile</h2>

In your editor, create a file with filename ".bash_profile" and save it in your home directory. Add the following content and save.

```alias la="ls -h -a"
alias lt="ls -lth -G"
alias ll="ls -lh"
alias s="more"
alias m="more"
alias rm="rm -i"
alias c="clear"
alias grep="grep -i -n"
alias h="history"
alias cp="cp -i"
alias mv="mv -i"

export GIT_EDITOR="code --wait"

# Setting PATH for Python 3.6
PATH="/Library/Frameworks/Python.framework/Versions/3.6/bin:${PATH}"
export PATH
```

[back to top](#top)

---

<h2 id="anchors-configure-environment-variables">Configure Environment Variables (Local Environment)</h2>

1. Open `~/.bash_profile` in a text editor

2. Add the following lines to the end of the file

        # Setting Loopla Environment Variables  
        export LOOPLA_ADMIN_LOOP="<Loop to provide admin capabilities to>"
        export LOOPLA_AWS_ACCESS_KEY_ID="<AWS access Key>"
        export LOOPLA_AWS_S3_REGION_NAME="<AWS region>"
        export LOOPLA_AWS_S3_SECURE_STORAGE_BUCKET_NAME="<secure storage bucket name>"
        export LOOPLA_AWS_S3_STORAGE_BUCKET_NAME="<storage bucket name>"
        export LOOPLA_AWS_SECRET_ACCESS_KEY="<AWS Key>"
        export LOOPLA_DATABASE_ENGINE="django.db.backends.postgresql"
        export LOOPLA_DATABASE_HOST="localhost"
        export LOOPLA_DATABASE_NAME="loopla-dev"
        export LOOPLA_DATABASE_PASSWORD="<database password>"
        export LOOPLA_DATABASE_PORT="5432"
        export LOOPLA_DATABASE_USER="loopla-dev"
        export LOOPLA_DEBUG_MODE_ENABLED="True"
        export LOOPLA_DEPLOYMENT_ENVIRONMENT="DEVELOPMENT"
        export LOOPLA_GOOGLE_OAUTH_CLIENT_ID="<OAuth client ID>"
        export LOOPLA_KUDOS_ENABLED="True"
        export LOOPLA_KUDOS_STORE_ENABLED="True"
        export LOOPLA_NEXMO_API_KEY="<Nexmo API Key>"
        export LOOPLA_NEXMO_API_SECRET="<Nexmo API Secret>"
        export LOOPLA_NEXMO_DEFAULT_FROM="<phone number to send texts from in E.164 format>"
        export LOOPLA_NOTIFICATIONS_ENABLED='True'
        export LOOPLA_NOTIFICATIONS_MAX_RETRY='3'
        export LOOPLA_NOTIFICATIONS_OVERRIDE_RECIPIENT='True'
        export LOOPLA_NOTIFICATIONS_OVERRIDE_RECIPIENT_EMAIL_ADDRESS='<your email address>'
        export LOOPLA_NOTIFICATIONS_OVERRIDE_RECIPIENT_TEXT_NUMBER='<your phone number in E.164 format>'
        export LOOPLA_NOTIFICATIONS_SERVICE_ADMIN_EMAIL_ADDRESS='<your email address>'
        export LOOPLA_REDIS_QUEUE_HOST='localhost'
        export LOOPLA_REDIS_QUEUE_PORT='6379'
        export LOOPLA_REDIS_QUEUE_DB='0'
        export LOOPLA_REDIS_QUEUE_DEFAULT_TIMEOUT='360'
        export LOOPLA_RESTRICT_LOOP_CREATION="True"
        export LOOPLA_RESTRICT_LOOP_CREATION_ALLOWED_LOOPS="<Comma separated list loop IDs allowed to create loops ex:228,230>"
        export LOOPLA_SERVER_SITE_ASSETS_FROM_S3="False"
        export LOOPLA_STRIPE_PRIVATE_KEY=""
        export LOOPLA_STRIPE_PUBLIC_KEY=""
        export LOOPLA_SOCKET_IO_SERVER_HOST="http://127.0.0.1"
        export LOOPLA_SOCKET_IO_SERVER_PORT="4001"
        export LOOPLA_VERBOSE_LOGGING_ENABLED="True"
        export OBJC_DISABLE_INITIALIZE_FORK_SAFETY='YES'

3. Save your changes

[back to top](#top)

---


<h2 id="anchors-install-git">Install Git</h2>

Git is a revision control system. It allow us to keep track of all the changes we make to our code. By storing these revisions, we can go back to previous versions if we realize that we have accidentally introduced a bug in the latest version. A git 'repository' stores a complete copy of our code including all changes we have made.

Check to see if git is installed by typing the following on command line:

` git --version`

If not, install it as follows:

### Installation

* Download [package](https://git-scm.com/download/mac)
* Double click downloaded package to install it. 

   Note, however, it may not install. If you don't see the install wizard sequence (e.g., click here to continue installation), then the package has not been installed. Depending on your settings, your Mac may not allow you to directly install packages that were not from the Apple Store. If so, do the following:

* Go to Mac "System Preferences"
* Go to the "Security and Privacy" pane. There should be an option to either allow package not from Apple store or to specifically allow installation of this package. Then try double clicking the downloaded package again.

### Setup

`git config --global user.name "<your chosen username>”`

For example: > git config --global user.name "henry-schneiderman”

`git config --global user.email "<your email address>”`

For example: > git config --global user.email "henry@loopla.com”

` git config --global core.editor "<your text editor>"`

For example: > git config --global core.editor emacs

#### To see your status

`git config --list`      

#### For Visual Studio code Editor use 

`git config --global core.editor "code --wait"`

#### Symbolic Links

You may need to use commands like the those below to create symbolic links. Type the following command (replacde "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" to match the one on your machine) into a terminal window while in your home directory.

`ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" /usr/local/bin/subl`

`ln -s "/Applications/Sublime Text.app/Contents/SharedSupport.bin/subl" /usr/local/bin/sublime`

[back to top](#top)

---


<h2 id="anchors-install-nodejs">Install NodeJS</h2>

1. Download the latest LTS 10.x version of Node from [https://nodejs.org/en/](https://nodejs.org/en/)

2. Run the downloaded node-v[version].pkg installer accepting all defaults

[back to top](#top)

---



<h2 id="anchors-setup-github">Setup Github</h2>

GitHub provides storage in the cloud for Git repositories. We store the definitive version of our code on a repository on GitHub, called 'origin'. See below for more info. All other repositories should be copies of 'origin'.

Sign up for a GitHub account and get added to our GitHub project.

[back to top](#top)

---

<h2 id="anchors-heroku">Heroku</h2>

We use the Heroku service to deploy our site to the Web. We currently use it to deploy our live site (https://www.loopla.com) and our experimental development site (https://desolate-stream-94650.herokuapp.com/).

[back to top](#top)

---

<h2 id="anchors-setup-redis-server">Setup Redis Server</h2>

Redis provides the data backing for our task runner (Redis-Queue + Django-RQ). To install a development instance of the redis server, type 
the following command in your console:

        `brew install redis`

[back to top](#top)

---


<h2 id="anchors-setup-postgreSQL">Install Development PostgreSQL Database</h2>

Our platform uses PostgreSQL as the database for our backend. To install and configure PostgreSQL follow the "Developer Configuration" steps found in
[Database-Management.md](Database-Management.md)

After completing these steps, restart your terminal so that the PostgreSQL command line utilities will be included in the path.

[back to top](#top)

---


<h2 id="anchors-clone-repository">Clone Repository and Start Local Server</h2>

1. Download the [Heroku command line interpreter](https://devcenter.heroku.com/articles/getting-started-with-python#set-up)

2. Create a directory to store the repository. Choose an appropriate name. For example, the following commands will create a directory named "loopla" and then a subdirectory named "src".

   `mkdir loopla`  
   `cd loopla`  
   `mkdir src`  
   `cd src`  

3. Login to Heroku using the command

   `heroku login`

4. Create a copy of the repository on your computer

   `git clone https://github.com/Loopla-1/Django-prototype-1.git .`  

5. Add the appropriate links to 'remote' copies of the repository. **Origin** is the authoritative version of the repository on GitHub. We use the Heroku service to deploy our site to the internet. The 'heroku' remote is the official live version of the website which is mapped to https://www.loopla.com. The 'staging' remote is used for testing changes to our site. It is mapped to https://desolate-stream-94650.herokuapp.com/.

   `git remote add origin https://github.com/Loopla-1/Django-prototype-1.git`  
   `git remote add heroku https://git.heroku.com/serene-hollows-98962.git`  
   `git remote add staging https://git.heroku.com/desolate-stream-94650.git`  
   `git remote add staging-socket-io https://git.heroku.com/staging-socket-io.git`

6. Verify that the git remotes are configured properly

   `git remote -v`

   It should probably look something like this:

   heroku https://git.heroku.com/serene-hollows-98962.git (fetch)  
   heroku https://git.heroku.com/serene-hollows-98962.git (push)  
   origin https://github.com/Loopla-1/Django-prototype-1.git (fetch)  
   origin https://github.com/Loopla-1/Django-prototype-1.git (push)  
   staging https://git.heroku.com/desolate-stream-94650.git (fetch)  
   staging https://git.heroku.com/desolate-stream-94650.git (push)  

7. Get updates from the origin repository. The 'master' branch of the code is the version deployed on https://www.loopla.com

   `git pull origin master`

8. Install virtual environment if it doesn't exist yet

   `python3 -m venv virtual_environment`
   
   Note: Make sure version 3.6 of Python is installed. If python3 is not installed on your computer, install it from www.python.org. 

9. Start virtual environment

   `source virtual_environment/bin/activate`

10. Install the Python libraries needed to run the website locally directly on your computer

    `pip install -r requirements.txt`
    
    Note: Your computer may require that you install Xcode in this step. If so, it will guide you through the installation.

11. Install the Node Packages needed to run the website locally

    `npm install`

11. To run site just on your computer run the following command

    `npm start`

12. To see site, go to: http://127.0.0.1:8000/

[back to top](#top)

---


<h2 id="anchors-aws">Setting Up Computer to Work with Amazon Web Services (AWS)</h2>

1. Run the following on your command line:

   `aws configure`

2. Enter the following info:

   AWS Access Key ID [None]: (ask admin for credentials)  
   AWS Secret Access Key [None]: (ask admin for credentials)  
   Default region name [None]: us-east-2  
   Default output format [None]: json
   
[back to top](#top)

---
   
<h2 id="anchors-system-architecture">System Architecture</h2>

[Diagram of the Three Git Repositories](https://docs.google.com/presentation/d/1R2153unSmBE1zylHv4MLmMdn67rz6BWR-eiKzhbR7mg/edit?usp=sharing)

[System Architecture](https://docs.google.com/presentation/d/1R2153unSmBE1zylHv4MLmMdn67rz6BWR-eiKzhbR7mg/edit?usp=sharing)

[back to top](#top)
