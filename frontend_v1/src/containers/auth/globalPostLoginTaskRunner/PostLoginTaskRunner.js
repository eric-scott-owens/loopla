import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';
import Task from './Task';

/**
 * PostLoginTaskRunner allows you to schedule tasks to run when 
 * a user has been logged in. receiveLoggedInEvent should be called
 * when the appropriate reducers complete
 */
function PostLoginTaskRunner() {
  const tasks = [];
  let processingLock;
  let hasReceivedLoginEvent = false;

  const loggedOutTasks = [];
  let loggedOutProcessingLock;

  /**
   * Only to be called by processQueues()
   */
  function processQueues() {
    // Don't allow more than one worker instance to run at a time
    if(processingLock !== undefined) return;

    // Don't run tasks until login silly!
    if(!hasReceivedLoginEvent) return;

    // bock the ability process the queue with more than one worker instance
    processingLock = "I'm already running one processing queue worker instance.";

    // Asynchronously process this so that it's not in the context
    // of the reducer
    if(tasks.length > 0) {
      // Chain all the tasks
      // Start with a promise that is resolve... on which we can chain
      let currentPromise = new Promise((resolve) => { resolve(1); });

      // Now chain all tasks - define the chaining job
      const chainNextTask = (index) => { 
        if(tasks.length > index) {
          // When the current task is done running, chain the next
          currentPromise.then(() => {
            const task = tasks[index];

            // Reset which promise we are tracking
            currentPromise = task.runTask();

            // move forward :)
            if(task.isOneTimeTask) {
              tasks.splice(index, 1);
              chainNextTask(index); // no need to advance index
            } else {
              chainNextTask(index + 1);
            }
          });
        }
        else {
          // All done, unlock the processor
          currentPromise.then(() => { processingLock = undefined; });
        }
      };

      // Start the chaining job
      chainNextTask(0);
    }
  }

  /**
   * Only to be called by processQueues()
   */
  function processLoggedOutQueues() {
    // Don't allow more than one worker instance to run at a time
    if(loggedOutProcessingLock !== undefined) return;

    // Don't run tasks until login silly!
    if(hasReceivedLoginEvent) return;

    // bock the ability process the queue with more than one worker instance
    loggedOutProcessingLock = "I'm already running one logged out processing queue worker instance.";

    // Asynchronously process this so that it's not in the context
    // of the reducer
    if(loggedOutTasks.length > 0) {
      // Chain all the tasks
      // Start with a promise that is resolve... on which we can chain
      let currentPromise = new Promise((resolve) => { resolve(1); });

      // Now chain all tasks - define the chaining job
      const chainNextTask = (index) => { 
        if(loggedOutTasks.length > index) {
          // When the current task is done running, chain the next
          currentPromise.then(() => {
            const task = loggedOutTasks[index];

            // Reset which promise we are tracking
            currentPromise = task.runTask();

            // move forward :)
            if(task.isOneTimeTask) {
              loggedOutTasks.splice(index, 1);
              chainNextTask(index); // no need to advance index
            } else {
              chainNextTask(index + 1);
            }
          });
        }
        else {
          // All done, unlock the processor
          currentPromise.then(() => { loggedOutProcessingLock = undefined; });
        }
      };

      // Start the chaining job
      chainNextTask(0);
    }
  }

  /**
   * Called when initialized or when a person logs out
   * This is wired into the authentication reducers
   */
  this.receiveLoggedOutEvent = () => {
    hasReceivedLoginEvent = false;
    processLoggedOutQueues();
  }

  /**
   * Called when a user is logged in
   * This is wired into the authentication reducers
   */
  this.receiveLoggedInEvent = () => {
    hasReceivedLoginEvent = true;
    processQueues();
  }

  /**
   * Registers a function to call every time a user
   * has been logged in.
   * @taskConfig object || func
   *    Pretty way to pass in the task setup configuration
   */
  this.addTask = (taskConfigOrFunction) => {
    this.addTaskBatch([taskConfigOrFunction]);
  }

  this.addTaskBatch = (configs) => {
    forEach(configs, taskConfigOrFunction => {
      if(isFunction(taskConfigOrFunction)) {
        tasks.push(new Task(taskConfigOrFunction));
      }else {
        tasks.push(new Task(taskConfigOrFunction.func, taskConfigOrFunction.isBlocking, taskConfigOrFunction.isOneTimeTask));
      }
    });

    processQueues();
  }

    /**
   * Registers a function to call every time a user
   * has been logged in.
   * @taskConfig object || func
   *    Pretty way to pass in the task setup configuration
   */
  this.addLoggedOutTask = (taskConfigOrFunction) => {
    this.addLoggedOutTaskBatch([taskConfigOrFunction]);
  }

  this.addLoggedOutTaskBatch = (configs) => {
    forEach(configs, taskConfigOrFunction => {
      if(isFunction(taskConfigOrFunction)) {
        loggedOutTasks.push(new Task(taskConfigOrFunction));
      }else {
        loggedOutTasks.push(new Task(taskConfigOrFunction.func, taskConfigOrFunction.isBlocking, taskConfigOrFunction.isOneTimeTask));
      }
    });

    processLoggedOutQueues();
  }

  // Constructor - initialize the runner
  ((runner) => {
    hasReceivedLoginEvent = false;
  })(this)
}

export default PostLoginTaskRunner;