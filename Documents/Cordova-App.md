<h1 id="top">Cordova App</h1>

[Setup Cordova Build Environment](#anchors-setup-cordova-build-environment)

[Build Android App](#anchors-build-android-app)


---



<h2>Setup Cordova Build Environment</h2>

In order to create an app distribution package for any of our supported platforms, a Apache Cordova build
environment must be available. The following steps outline how to create such an environment on a Mac PC.

1. Install the Apache Cordova runtime

  `sudo npm install -g cordova`


2. Install XCode

  a. download XCode from the App Store

  b. Run XCode and wait for installation to finish (will take several minutes)

  c. Install the XCode command line utilities

    i. From the terminal, run the following command

      `xcode-select --install`


3. Install the iOS command line deployment tools

  a. From the terminal, run the following command

    `sudo npm install -g ios-deploy --unsafe-perm=true`


4. Install Cocoa Pods

  a. From the terminal, run the following command

    `sudo gem install cocoapods`

  b. Update the pod repository data.
  
    i. From the terminal, run the following command
    
      `pod setup`


5. Install the Java SE Developer Kit version 8

  a. Download the Mac installer from
  
    `https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html`

  b. Run the installer


6. Install Gradle

  a. Run the following command from the terminal

    `brew install gradle`


7. Install the Android Studio 

  a. Download the Android Studio from 
  
    `https://developer.android.com/studio/index.html#downloads`

  b. Run the Android Studio installer

  c. Installed the Android 8 SDK
  
    i. Open Android Studio

    ii. From the welcome screen *click* `Configure > SDK Manager`

    iii. *Check* `Android 8.0 (Oreo)` and *click* `Apply`

    iv. Close the Android Studio

  d. Change the Emulator to run on Android 8.0

    i. Open Android Studio

    ii. From the welcome screen *click* `Configure > AVD Manager`

    iii. Edit the default virtual device (Nexus 5x API...) by clicking the pencil icon

    iv. *Click* `Change...` next to the target runtime environment 

    v. *Click* `Download` next to Oreo | 26 | x86_64 | Android 8.0

      Wait for the download to complete

    vi. *Select* `Oreo | 26 | x86_64 | Android 8.0` and then *click* `OK`

    vii. Rename the `AVD Name` as desired so that it indicates it's running API v26 instead of the version defaulted.


8. Install the Android Command Line Tools

  a. Download the Android Studio from 
  
    `https://developer.android.com/studio/index.html#command-tools`

  b. extract the contents and move to ~/Library/Android/sdk

    `sudo mv tools ~/Library/Android/sdk`


9. Add environment variables and path updates to your Bash profile

  a. Open `~/.bash_profile` in a text editor

  b. add the following lines to the end of the file

      export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk1.8.0_211.jdk/Contents/Home"
      export ANDROID_HOME="~/Library/Android/sdk"
      export PATH="~/Library/Android/sdk/emulator:~/Library/Android/sdk/tools:$PATH"

