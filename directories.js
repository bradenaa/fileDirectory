

const string = `CREATE fruits
CREATE vegetables
CREATE grains
CREATE fruits/apples
CREATE fruits/apples/fuji
LIST
CREATE grains/squash
MOVE grains/squash vegetables
CREATE foods
MOVE grains foods
MOVE fruits foods
MOVE vegetables foods
LIST
DELETE fruits/apples
DELETE foods/fruits/apples
LIST`

const DELETE = 'DELETE'
const CREATE = 'CREATE'
const LIST = 'LIST'
const MOVE = 'MOVE'

class Commands {
  constructor(commandString) {
    this.commands = commandString;
    this.directory = {};
    this.commandsArray = [];
    this.init();
  }

  init() {
    this.makeCommandsArray();
    this.runCommandsArray();
  }

  makeCommandsArray() {
    const list = this.commands.split('\n');
    this.commandsArray = list.map((commandList) => {
      const split = commandList.split(' ')
      const command = split[0];
      const args = split.slice(1);
      return {
        command,
        args
      }
    });
  }

  runCommandsArray() {
    this.commandsArray.forEach((commandObj) => {
      switch(commandObj.command) {
        case DELETE:
          this.delete(commandObj.args);
          break;
        case MOVE:
          this.move(commandObj.args);
          break;
        case CREATE:
          this.create(commandObj.args);
          break;
        case LIST:
          console.log(LIST)
          this.list(this.directory, 0);
          break;
        default:
          console.log('Sorry we do not recognize this command!')
      }
    });
  }

  move(args) {
    const [currentPath, newPath ] = args;
    console.log(`${MOVE} ${currentPath} ${newPath}`)
    const currentPathSplit = currentPath.split('/')
    const newPathSplit = newPath.split('/')
    const fileName = currentPathSplit[currentPathSplit.length - 1]

    let parent = this.directory;
    let index = 0

    while (!parent.hasOwnProperty(fileName)) {
      parent = parent[currentPathSplit[index]]
      index += 1;
    }
    const toAdd = parent[fileName];
    delete parent[fileName]

    parent = this.directory;
    index = 0;

    while(parent.hasOwnProperty(newPathSplit[index])) {
      parent = parent[newPathSplit[index]]
      index += 1;
    }
    parent[fileName] = toAdd;

  }

  create(args) {
    const split = args[0].split('/')
    let parent = this.directory
    for (let i = 0; i < split.length; i++) {
      if (!parent[split[i]]) {
        parent[split[i]] = {};
      }
      parent = parent[split[i]];
    }
    console.log(`${CREATE} ${args}`)
  }

  delete(args) {
    console.log(`${DELETE} ${args[0]}`)
    const split = args[0].split('/')
    const fileName = split[split.length - 1];

    let parent = this.directory;
    let index = 0

    while (!parent.hasOwnProperty(fileName)) {
      if (!parent.hasOwnProperty(split[index])) {
        console.log(`Cannot delete ${args[0]} - ${split[index]} does not exist`)
        break;
      }
      parent = parent[split[index]]
      index += 1;
    }
    
    delete parent[fileName]
    
  }

  list(obj, depth) {
    Object.entries(obj).forEach(([name, value]) => {
      console.log(`${` `.repeat(depth)}${name}`)
      if (Object.keys(value).length > 0) {
        this.list(value, depth + 1)
      }
    })
  }
}

const newCommands = new Commands(string)