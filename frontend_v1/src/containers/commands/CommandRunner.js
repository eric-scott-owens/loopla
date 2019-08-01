import configuration from '../../configuration';
import { fetch } from '../../actions/fetch';

const LAST_RUN_COMMAND_ID_LS_KEY = 'LOOPLA_COMMANDS_JS_LAST_RUN_ID';

function getLastRunCommandId() {
  const lastRunCommandId = localStorage.getItem(LAST_RUN_COMMAND_ID_LS_KEY) || 0;
  return lastRunCommandId;
}

function setLastRunCommandId(id) {
  localStorage.setItem(LAST_RUN_COMMAND_ID_LS_KEY, id);
}

// Params passed in for access by eval below (when commands need it :) )
class CommandRunner{
  constructor({reduxStore, storeStorageService}) {
    this.reduxStore = reduxStore;
    this.storeStorageService = storeStorageService;
  }

  runNewCommands = async () => {
    // Import everything we want available in the context for use
    // by commands
    const { reduxStore, storeStorageService } = this;

    // Run all new commands
    let lastRunCommandId = getLastRunCommandId();
    const commands = await reduxStore.dispatch(fetch(`${configuration.API_ROOT_URL}/commands/?gt=${lastRunCommandId}`, {method: 'GET'}));

    for(let i = 0, iCount = commands.length; i < iCount; i += 1) {
      const command = commands[i];
      let failed = false;
      try {
        eval(command.command);
      } catch(e) {
        // eslint-disable-next-line
        console.warn(`Failed to run task ${command.id}`);
        failed = true;
      }

      if(failed) break;
      else lastRunCommandId = command.id;
    }
    
    setLastRunCommandId(lastRunCommandId);
  }

}

export default CommandRunner