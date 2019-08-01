<h1 id="top">How To List</h1>

[Install Virtual Environment](#anchors-install-virtual-environment)

[Restart Your Virtual Environment](#anchors-restart-virtual-environment)

[Update Code from the Repository](#anchors-update-code-from-repository)

[Collect Static Files](#anchors-collect-static)

[Abandon Local Revisions & Revert Back To Last Commit](#anchors-revert)

[Safely Remove Files from Your Directory](#anchors-safely-remove)

[Install Packages](#anchors-install-packages)

[Uninstall Packages](#anchors-uninstall-packages)

[Locate or Add Fonts](#anchors-fonts)

[Locate Stylesheets](#anchors-stylesheets)

[Store Images (AWS)](#anchors-images)


---




<h2 id="anchors-install-virtual-environment">Install Virtual Environment</h2>

1. Install virtual environment

   `python3 -m venv virtual_environment`

2. Start virtual environment

   `source virtual_environment\bin\activate`

3. Install code to run website locally

   `pip install -r requirements.txt`

4. To run site only on your computer (changes do not need to be added to Git)

   `python manage.py runserver --settings prototype_1.settings_development`

5. To see website, go to: http://127.0.0.1:8000/

[back to top](#top)

---




<h2 id="anchors-restart-virtual-environment">Restart Your Virtual Environment</h2>

* To begin a work session, you must be in your virtual environment.
* You will need to restart your virtual environment for each terminal window you are using.

1. First change directories so you can activate your virtual environment. For example, based on the location of the virtual environment shown in the image below, you would type the following command from the home directory:

   `cd ITK/code/ITK-prototype-1/serene-hollows-98962/`
   
![directory example](https://github.com/Loopla-1/Django-prototype-1/blob/master/Documents/Images/virtual_environment.png "virtual environment directory example")

2. Then, type the "activate" command to start your virtual environment

   `source virtual_environment/bin/activate`
   
[back to top](#top)

---




<h2 id="anchors-update-code-from-repository">Update Code from the Repository</h2>

* Before you begin working, you must update your local repository with the most recently revised code
* Doing this updates the local code repository on your computer with any changes that have been made to the authoritative repository that is in the cloud on GitHub

#### To "pull" the updated code to your computer, type the following command

`git pull origin master`

[back to top](#top)

---



<h2 id="anchors-collect-static">Collect Static Files</h2>

1. If you make changes to static files, you need to use the following command to see these changes in the browser

   `python manage.py collectstatic`

2. Refresh cache

   command shift R
   
[back to top](#top)

---





<h2 id="anchors-revert">Abandon Local Revisions & Revert Back To Last Commit</h2>

Abandon local changes and revert back to files saved on Github

#### Revert ALL files

`git checkout HEAD`

#### Revert just one file at a time

`git checkout HEAD <filename>`

#### Revert back to a specific commit

`git checkout <git commit number> < filename>`

[back to top](#top)

---



<h2 id="anchors-revert">Commit Changes to Existing Files</h2>

After making revisions to existing files or adding text or image files, you need to

* Commit changes to your local Git repository
* Commit changes to the Git repository in the cloud on GitHub
* Deploy changes on the live site through Heroku's server

1. Commit changes to your local Git repository

   First save the files you have revised. If you have added text or image files, make sure they are saved within the appropriate directory.

   For example, an html file might be saved to:  
   alo/ITK/code/ITK-prototype-1/serene-hollows-98962/posts/templates/posts

   A css file might be saved to:  
   alo/ITK/code/ITK-prototype-1/serene-hollows-98962/posts/static/posts/bootstrap/css

   An image might be saved to:  
   alo/ITK/code/ITK-prototype-1/serene-hollows-98962/posts/static/posts/bootstrap/images

2. The next step is to check the status of your changes. This will remind you of all the modified files.  
N.B. You must be within your virtual environment for this to work. If you are not, use the steps from "Restart Your Virtual Environment" to change directories and activate your virtual environment.

   Type the following command into your terminal window to check the status of your changes:

   `git status -s`

   You will see a list of the modified files including their path.

3. In order to commit these changes to local repository, and eventually the cloud Git repository, you must first "stage" them. Do this with the 'git add' command. Each file must be added separately, but this is simple to do since you have the list from the results of the status command from #2. 

   Type the following command, replacing the text within the < > with the full path shown as a result of the status -s command. You need to remove the < >.

   `git add <path copied from results of status command>`
   
   For example:  
   `git add dashboard/templates/dashboard/dashboard_v_1_2.html`

4. Repeat the `git status -s` command and be sure you have added all the modified files. The "M" should be green instead of red once you have staged the modified file.

   `git status -s`

   If you missed any files, add them using the `git add ...` command from #3.

5. Commit these changes to your local Git repository. You will also provide a commit message that describes what these changes are. 

   Type the following command, replacing the text within the < > with a brief description of your changes. You need to remove the < >.

   `git commit -m "<Type your commit message>"`
   
   See [Guidelines for Commit Messages](https://gist.github.com/robertpainsi/b632364184e70900af4ab688decf6f53)

6. Upload these changes to the repository in the cloud on GitHub. This repository is called 'origin'. This is the repository that contains the authoritative version of the code. The message you entered above will appear on GitHub for the team. All your changes will also be visible there.

   Type the following command:

   `git push origin master`

7. Deploy these changes on an Internet server visible to the world through the Heroku service. You do this by pushing the changes to our Git repository on Heroku, named 'heroku'.
   
   Type the following command:

   `git push heroku master`

8. Start the server on Heroku with the following command:

   `heroku ps:scale web=1`

9. Check whether your changes are live by going to the [live site](https://www.loopla.com/).

10. Jump for joy if it worked.

[back to top](#top)

---




<h2 id="anchors-safely-remove">Safely Remove Files from Your Local Directory</h2>

Files tracked in git: 

`git rm <filename>`

Files not known by git: 

`rm <filename>`

[back to top](#top)

---




<h2 id="anchors-install-packages">Install Packages</h2>

1. Install a new package

   `pip install <filename>`
   
2. Update requirements file

   `pip freeze > requirements.txt`

3. Commit requirements file

   `git add <filename>`  
   `git commit -m "<commit message>"`  
   `git push origin master`  

3. Tell team to pull and update their requirements file

   `git pull origin master`  
   `pip install -r requirements.txt`

[back to top](#top)

---




<h2 id="anchors-uninstall-packages">Uninstall Packages</h2>

`pip uninstall <name of package>`

remove from settings file
remove any references in base template files

[back to top](#top)

---




<h2 id="anchors-fonts">Locate or Add Fonts</h2>

#### Fonts We Use

* [Montserrat](https://fonts.google.com/specimen/Montserrat?query=mont&selection.family=Montserrat)
* [Nunito](https://fonts.google.com/specimen/Nunito)

#### How to Add Fonts

* [How to add additional fonts and weights](https://developers.google.com/fonts/docs/getting_started)
* Include fonts in "html_setup.html" in posts/templates/posts. This file is then included in both "base_logged_in.html" and "base_logged_out.html"

[back to top](#top)

---




<h2 id="anchors-stylesheets">Locate Stylesheets</h2>

#### Custom CSS  
Our custom CSS is temporarily in "html_setup.html" in posts/templates/posts to avoid loading static files each time we change CSS

#### Bootstrap  
We are using Bootstrap 3. It is loaded in "html_setup.html" in posts/templates/posts  
[Bootstrap 3 Documentation](https://getbootstrap.com/docs/3.3/)

#### Creative Tim  
We are using a bootstrap styling package from [Creative Tim](https://www.creative-tim.com/). It is loaded in "html_setup.html" in posts/templates/posts.  
[Creative Tim Material Kit Components](https://demos.creative-tim.com/material-kit-pro/index.html)  
[Creative Tim Material Kit Documentation](https://demos.creative-tim.com/material-kit-pro/docs/2.0/getting-started/introduction.html)

[back to top](#top)

---




<h2 id="anchors-images">Store Images (AWS)</h2>

Sign into the [AWS console](https://aws.amazon.com/) (ask admin for credentials)
Under storage, choose S3  
Then find the appropriate folder in one of these directories:  
* intheknomediafiles001/static
* intheknomediafiles001/media

[back to top](#top)

---




