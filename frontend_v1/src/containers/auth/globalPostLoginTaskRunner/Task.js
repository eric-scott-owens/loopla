class Task {
  constructor(func, isBlocking, isOneTimeTask) {
    this.func = func;
    this.isBlocking = isBlocking === true;
    this.isOneTimeTask = isOneTimeTask === true;
  }

  runTask = async () => {
    try {
      if(this.isBlocking) {
        await this.func(); // must wait until all is done
        return undefined;
      }
      
      // fire and forget request
      this.func();
      return undefined; 
    } catch(e) {
      // Ignore?
      return e;
    }
  }
}

export default Task;