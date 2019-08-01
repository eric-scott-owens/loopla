<h1 id="anchors-top">Loopla's Git Workflow</h1>

Here we outline our branch strategy and release management process. Super easy. Hardly an inconvenience. ;)

[Main Branches](#anchors-main-branches)  
[Supporting Branches](#anchors-supporting-branches)  
[Feature Branches](#anchors-feature-branches)  
[Release Branches](#anchors-release-branches)  
[Hotfix Branches](#anchors-hotfix-branches)  

---

![main branches](https://github.com/Loopla-1/Django-prototype-1/blob/master/Documents/Images/main-branches2.png)
                
<h2 id="anchors-main-branches">The Main Branches: Master and Dev</h2>

The **master** branch at origin should be familiar to every Git user. Parallel to the master branch, another branch exists called **dev**.

We consider **origin/master** to be the main branch where the source code of HEAD always reflects a production-ready state.

We consider **origin/dev** to be the main branch where the source code of HEAD always reflects a state with the latest delivered development changes for the next release. Some would call this the “integration branch”. This is where any automatic nightly builds are built from.

When the source code in the dev branch reaches a stable point and is ready to be released, all of the changes should be merged back into master somehow and then tagged with a release number.

Therefore, each time changes are merged back into master, this is a new production release by definition. We tend to be very strict at this, so that theoretically, we could use a Git hook script to automatically build and roll-out our software to our production servers every time there was a commit on master.

[back to top](#anchors-top)

---

<h2 id="anchors-supporting-branches">Supporting Branches</h2>

Next to the main branches master and dev, our development model uses a variety of supporting branches to aid parallel development between team members, ease tracking of features, prepare for production releases and to assist in quickly fixing live production problems. Unlike the main branches, these branches always have a limited life time, since they will be removed eventually.

The different types of branches we may use are:  
* Feature branches  
* Release branches  
* Hotfix branches

Each of these branches have a specific purpose and are bound to strict rules as to which branches may be their originating branch and which branches must be their merge targets. We will walk through them in a minute.

By no means are these branches “special” from a technical perspective. The branch types are categorized by how we use them. They are of course plain old Git branches.

[back to top](#anchors-top)

---

![feature branches](https://github.com/Loopla-1/Django-prototype-1/blob/master/Documents/Images/feature_branches2.png)

<h2 id="anchors-feature-branches">Feature Branches</h2>

May branch off from:  
dev

Must merge back into:  
dev

Branch naming convention:   
anything except master, dev, release-*, or hotfix-*

Feature branches (or sometimes called topic branches) are used to develop new features for the upcoming or a distant future release. When starting development of a feature, the target release in which this feature will be incorporated may well be unknown at that point. The essence of a feature branch is that it exists as long as the feature is in development, but will eventually be merged back into dev (to definitely add the new feature to the upcoming release) or discarded (in case of a disappointing experiment).

Feature branches typically exist in developer repos only, not in origin.

### Creating a feature branch  
When starting work on a new feature, branch off from the dev branch.

Switch to a new branch named "myfeature" `git checkout -b myfeature dev`

Incorporating a finished feature on dev 
Finished features may be merged into the dev branch to definitely add them to the upcoming release:

Switch to branch 'dev' `git checkout dev`

Create a new commit object (see note below) `git merge myfeature`

Delete branch myfeature `git branch -d myfeature`

Push local repository to remote repository `git push origin dev`

[back to top](#anchors-top)

---

<h2 id="anchors-release-branches">Release Branches</h2>

May branch off from:  
dev

Must merge back into:  
dev and master

Branch naming convention:  
release-*

Release branches support preparation of a new production release. They allow for last-minute dotting of i’s and crossing t’s. Furthermore, they allow for minor bug fixes and preparing meta-data for a release (version number, build dates, etc.). By doing all of this work on a release branch, the dev branch is cleared to receive features for the next big release.

The key moment to branch off a new release branch from dev is when dev (almost) reflects the desired state of the new release. At least all features that are targeted for the release-to-be-built must be merged in to dev at this point in time. All features targeted at future releases may not—they must wait until after the release branch is branched off.

It is exactly at the start of a release branch that the upcoming release gets assigned a version number—not any earlier. Up until that moment, the develop branch reflected changes for the “next release”, but it is unclear whether that “next release” will eventually become 0.3 or 1.0, until the release branch is started. That decision is made on the start of the release branch and is carried out by the project’s rules on version number bumping.

### Creating a release branch  
Release branches are created from the develop branch. For example, say version 1.1.5 is the current production release and we have a big release coming up. The state of dev is ready for the “next release” and we have decided that this will become version 1.2 (rather than 1.1.6 or 2.0). So we branch off and give the release branch a name reflecting the new version number.

Switch to a new branch "release-1.2" `git checkout -b release-1.2 dev`

Files modified successfully, version bumped to 1.2 `./bump-version.sh 1.2`

Commit bumped version number to 1.2 `git commit -a -m "Bumped version number to 1.2"`

After creating a new branch and switching to it, we bump the version number. Here, bump-version.sh is a fictional shell script that changes some files in the working copy to reflect the new version. (This can of course be a manual change—the point being that some files change.) Then, the bumped version number is committed.

This new branch may exist there for a while, until the release may be rolled out definitely. During that time, bug fixes may be applied in this branch (rather than on the dev branch). Adding large new features here is strictly prohibited. They must be merged into dev, and therefore, wait for the next big release.

### Finishing a release branch  
When the state of the release branch is ready to become a real release, some actions need to be carried out. First, the release branch is merged into master (since every commit on master is a new release by definition, remember). Next, that commit on master must be tagged for easy future reference to this historical version. Finally, the changes made on the release branch need to be merged back into develop, so that future releases also contain these bug fixes.

#### First two steps in Git

Switch to branch 'master' `git checkout master`

Merge made by recursive `git merge release-1.2`

Finish release by tagged for future reference `git tag -a 1.2`

(not sure what this means) Edit: You might as well want to use the -s or -u <key> flags to sign your tag cryptographically.

#### To keep the changes made in the release branch, we need to merge those back into dev

Switch to branch 'dev' `git checkout develop`

Make merge by recursive `git merge release-1.2`

This step may well lead to a merge conflict (probably even, since we have changed the version number). If so, fix it and commit.

Now we are really done and the release branch may be removed, since we don’t need it anymore:

Delete branch release-1.2 `git branch -d release-1.2`

[back to top](#anchors-top)

---

<h2 id="anchors-hotfix-branches">Hotfix Branches</h2>

![hotfix-branches](https://github.com/Loopla-1/Django-prototype-1/blob/master/Documents/Images/hotfix-branches2.png)

May branch off from:  
master

Must merge back into:  
dev and master

Branch naming convention:  
hotfix-*

Hotfix branches are very much like release branches in that they are also meant to prepare for a new production release, albeit unplanned. They arise from the necessity to act immediately upon an undesired state of a live production version. When a critical bug in a production version must be resolved immediately, a hotfix branch may be branched off from the corresponding tag on the master branch that marks the production version.

The essence is that work of team members (on the dev branch) can continue, while another person is preparing a quick production fix.

### Creating the hotfix branch  
Hotfix branches are created from the master branch. For example, say version 1.2 is the current production release running live and causing troubles due to a severe bug. But changes on develop are yet unstable. We may then branch off a hotfix branch and start fixing the problem:

Switch to a new branch "hotfix-1.2.1" `git checkout -b hotfix-1.2.1 master`

Files modified successfully, version bumped to 1.2.1 `./bump-version.sh 1.2.1`

Bumped version number to 1.2.1 `git commit -a -m "Bumped version number to 1.2.1"`

Don’t forget to bump the version number after branching off!

Then, fix the bug and commit the fix in one or more separate commits.

Fixed severe production problem `git commit -m "Fixed severe production problem"`

### Finishing a hotfix branch

When finished, the bugfix needs to be merged back into master, but also needs to be merged back into dev, in order to safeguard that the bugfix is included in the next release as well. This is completely similar to how release branches are finished.

#### Update master and tag the release

Switch to branch 'master' `git checkout master`

Make merge by recursive `git merge hotfix-1.2.1`

`git tag -a 1.2.1`

(don't know what this means) Edit: You might as well want to use the -s or -u <key> flags to sign your tag cryptographically.

#### Include the bugfix in dev

Switch to branch 'dev' `git checkout develop`

Make merge by recursive `git merge hotfix-1.2.1`

The one exception to the rule here is that, when a release branch currently exists, the hotfix changes need to be merged into that release branch, instead of develop. Back-merging the bugfix into the release branch will eventually result in the bugfix being merged into develop too, when the release branch is finished. (If work in develop immediately requires this bugfix and cannot wait for the release branch to be finished, you may safely merge the bugfix into develop now already as well.)

Finally, remove the temporary branch `git branch -d hotfix-1.2.1`

[back to top](#anchors-top)

--- 

Revised Aug 14 2018

Source: We used [this](https://nvie.com/posts/a-successful-git-branching-model/) document from [Vincent Driessen](https://nvie.com/) as a model for our process and a source of the language and images contained herein.
