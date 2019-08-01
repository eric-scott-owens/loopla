<h1 id="top">Dev Resources</h1>

[Basic Commands](#anchors-basic-commands)

[Github Basics](#anchors-github)

[Basic Github Commands](#anchors-github-commands)

[Visual Studio Code (Editor)](#anchors-vsc)

[Python and Django Basics](#anchors-python-django)

[Django Forms](#anchors-django-forms)

[Bootstrap](#anchors-bootstrap)

[CSS](#anchors-css)

[Design Resources](#anchors-design-resources)

---

<h2 id="anchors-basic-commands">Basic Commands</h2>

Start virtual environment `source virtual_environment/bin/activate`

Run your local server `python manage.py runserver --settings prototype_1.settings_development`

[back to top](#top)

---




<h2 id="anchors-github">Github Basics</h2>

Each user has a complete self-contained version of the code repository. Each user can create multiple "branches" or versions of the code within their repository. Their main version is called the master. Each user is responsible for updating their version(s) (using the 'git pull' command) to pull in changes made by others. Users then broadcast their own changes using the 'git push' command.

Visit [Loopla's Brand and Release Strategy](https://github.com/Loopla-1/Django-prototype-1/blob/master/Documents/Branch-and-Release-Strategy.md) to learn how we deploy code on Git.

Files can be in one of two states: 
* tracked - Under Git version control
* untracked - Ignored by Git

Tracked files can then been in one of three states:
* modified - your version of the file has been changed
* staged - your changed version is ready to be committed
* committed - file is up-to-date in the repository


[back to top](#top)

---





<h2 id="anchors-github-commands">Basic Github Commands</h2>

[More complete resource](https://gist.github.com/hofmannsven/6814451)

Help `git help`

Check which files have been modified and staged `git status -s`

File is tracked and staged for commit `git add filename.html`

Commit files that have been staged to your personal repository `git commit -m "Message"`

Push local changes to master `git push origin master`

Pull `git pull`

Abandon local changes to one file `git checkout HEAD filename.html`

Undo git add (but keep changes) `git reset HEAD hello.py` 

Remove files from Git `git rm filename.html`

Compare modified files `git diff`

Go back to commit `git revert 073791e7dd71b90daa853b2c5acc2c925f02dbc6`

Show branches `git branch`

Create branch `git branch branchname`

Change to branch `git checkout branchname`

Create and change to new branch `git checkout -b branchname`

Show remote branches `git branch -r`

Show all branches `git branch -a`

[back to top](#top)

---




<h2 id="anchors-vsc">Visual Studio Code (Editor)</h2>

[Download](https://code.visualstudio.com/) Visual Studio Code  
[Tips and Tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)  
[User Interface](https://code.visualstudio.com/docs/getstarted/userinterface)

### Extensions  
[Git Extension Pack](https://marketplace.visualstudio.com/items?itemName=donjayamanne.git-extension-pack) - see branches and git history/log  
[Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer) or [Subtle Match Bracket](https://marketplace.visualstudio.com/items?itemName=rafamel.subtle-brackets) - untested internally

For awesome Javascript  
[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) by Dirk Baeumer. Configured via `.eslintrc` file  
[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) by Esben Petersen. Configured via `.prettierrc` file  
There is an autofix on save feature in vscode that you may want to turn on as well. This is what I have in my vscode user settings regarding javascript formatting and linting. Feel free to set these up how you want. I don't remember exactly what each one does.  
```
"eslint.alwaysShowStatus": true,
"eslint.autoFixOnSave": true,
"editor.formatOnSave": true,
"editor.formatOnPaste": true,
"javascript.suggestionActions.enabled": false,
"prettier.requireConfig": true
```

### Keyboard Shortcuts  
[Cheatsheet for Mac](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf)  
[Cheatsheet for Windows](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)  
[Cheatsheet for Linux](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf)

### Particularly Useful Features  
[Integrated Terminal](https://code.visualstudio.com/docs/editor/integrated-terminal) - open an integrated terminal so you don't have to switch windows to perform a quick command line task

**Quick Open** - quickly search and open a file by its name  
⌘P (for Mac)  
Ctrl P (for windows or linux)



[back to top](#top)

---





<h2 id="anchors-python-django">Python & Django</h2>

* Python is a general purpose interpreted programming language
* Django is web framework built on top of Python
* As of November 2, 2017 we use Python 3.6.1 and Django 1.11

#### Python Resources

[The Python Website](https://docs.python.org/3/)

[Django video tutorial](https://www.youtube.com/watch?v=tkwZ1jG3XgA)  
Well regarded but not for absolute beginners

[Python Crash Course - Book](https://www.amazon.com/Python-Crash-Course-Hands-Project-Based/dp/1593276036)       
Ask Anne or Henry to borrow a copy  
Well written book. Not comprehensive. Covers basic features of Python but not many of the advanced ones. Has a really excellent chapter for getting started with Django. By far the best tutorial I've encountered on Django. Much better than the ones on the djangoproject.com

[Learning Python - Book](https://www.amazon.com/Learning-Python-5th-Mark-Lutz/dp/1449355730/ref=sr_1_9?ie=UTF8&qid=1534098199&sr=8-9&keywords=learn+python+book)  
1500+ page comprehensive tome on Python. It's fairly well written but I often prefer the explanations I find on the Internet

[Python Style Guide](https://www.python.org/dev/peps/pep-0008/)

[Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)

[Django Style Guide](https://docs.djangoproject.com/en/1.11/internals/contributing/writing-code/coding-style/)

#### Django Resources

[The Django Website](https://www.djangoproject.com/)

[Good overview](http://djangobook.com/)

[General overview - readthedocs](http://ech-db.readthedocs.io/ru/latest/chapter14.html)

[General overview - mozilla](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/Forms)

[General overview - tutorialspoint](https://www.tutorialspoint.com/django/django_sessions.htm)

[General form - tangowithdjango](http://www.tangowithdjango.com/book/index.html)

[Original designers of Django](http://slav0nic.org.ua/static/books/python/The%20Definitive%20Guide%20to%20Django%20-%20Apress.pdf)

[Same as above or newer?](http://gsl.mit.edu/media/programs/south-africa-summer-2015/materials/djangobook.pdf)

[Google Groups Django User Forum](https://groups.google.com/forum/#!forum/django-users)

[Code snippets](https://djangosnippets.org/)

[Django and Bootstrap](https://django-bootstrap3.readthedocs.io/en/latest/)

[List of Django packages](djangopackages.com)

[Using with Ajax](http://www.tangowithdjango.com/book/chapters/ajax.html)

[Common Django tasks: infinite feed, cropping images](https://simpleisbetterthancomplex.com/)

[Django Conference](https://www.djangounderthehood.com/)

[Spokane, WA Aug.13-18, 2017](https://2017.djangocon.us/)

[back to top](#top)

---




<h2 id="anchors-django-forms">Django Forms</h2>

[Django Forms Documentation](https://docs.djangoproject.com/en/1.11/topics/forms/)

#### Important Files:

**posts/models.py**  
Python file containing the declarations of basic data types such as "post", "comment", etc.

**posts/forms.py**  
Python file specifying how any of the data types can be rendered in a html form. For example, "PostForm" specifies how a 'post' is rendered including the labels in the form, e.g., "Post to circle" is the label for the "group" field and the widget, e.g., 'text', the body of the post, is rendered with 80 columns.

**posts/templates/posts/category.html**  
The Django template for the dashboard. It consists of html with django code. I broke each form into individual fields. Each of these fields can be formatted separately. I think any formatting will override the 'widgets' specification in the forms.py. If not, the widgets specification in forms.py will need to be removed.

[back to top](#top)

---




<h2 id="anchors-bootstrap">Bootstrap</h2>

[Bootstrap 3 Documentation](https://getbootstrap.com/docs/3.3)

[Bootstrap W3Schools Reference](https://www.w3schools.com/bootstrap/default.asp)

[Bootstrap Video Tutorial Series](https://youtu.be/314m7YBRFvQ?list=PL6n9fhu94yhXd4xnk-j5FGhHjUv1LsF0V)

[Bootstrap Overview Video (1 hr)](https://youtu.be/gqOEoUR5RHg)

[Bootstrap Examples](http://getbootstrap.com/getting-started/#examples)

[back to top](#top)

---




<h2 id="anchors-css">CSS</h2>

[CSS W3Schools Reference](https://www.w3schools.com/css/)

[CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)

[More CSS Style](https://github.com/necolas/idiomatic-css#5-practical-example)

[back to top](#top)

---




<h2 id="anchors-design-resources">Design Resources</h2>

[Material Design Documentation by Google](https://material.io/)

[Material Icons](https://material.io/tools/icons/?style=baseline)

[Color Picker](http://www.colorzilla.com/chrome/)  
Eyedropper allows you to identify any color used on a website

[Gradient Generator](http://www.colorzilla.com/gradient-editor/)

[Ipsum Lorem Generator](http://www.lipsum.com/)  
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum commodo nisi mi, ornare consectetur libero egestas vel. Curabitur quis placerat neque. Integer pharetra turpis dolor, ut tincidunt purus dignissim eu.

[Sketch](https://www.sketchapp.com/)  
Great tool for creating mockups

[back to top](#top)

---




