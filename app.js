const fs = require('fs')
const yargs = require('yargs')
const chalk = require("chalk");

function loadData() {
    try {
        const buffer = fs.readFileSync('data.json'); //path to the file we want to read
        const dataString = buffer.toString(); // return a string
        const javaScriptObject = JSON.parse(dataString) // convert string to js obj
        return javaScriptObject
    } catch (err) {
        console.log("error", err)
        return []
    } // expect to be a js array
}

function saveData(data) {
    //write a string or buffer to data.json
    fs.writeFileSync("data.json", JSON.stringify(data))
};

yargs.command({
    command: "add",
    describe: "Adding a new todo",
    builder: {
        todo: {
            descibe: "thing you need to do",
            demandOption: true,
            type: "string",
        },
        completed: {
            describe: "todo status",
            default: false,
            type: "boolean",
        },
    },
    handler: function (arguments) {
        const todos = loadData();
        const id = todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;
        todos.push({
            id: id,
            todo: arguments.todo,
            completed: arguments.completed,
        });
        saveData(todos);
        console.log("Added successfully");
    }
})

yargs.command({
    command: "list",
    describe: "List todos,if you want to see the status of todos, use --completed ",
    builder: {
        completed: {
            describe: "show todos base on completed option \n  could be either 'all' || 'completed' || 'uncompleted'",
            type: "string",
            default: "all"
        },
    },
    handler: function ({ completed }) {
        const todos = loadData();
        let results
        if (completed === "completed") {
            results = todos.filter(e => e.completed === true)
            if (results.length === 0) {
                console.log("You haven't completed any tasks!")
            }
        } else if (completed === "uncompleted") {
            results = todos.filter(e => e.completed === false)
            if (results.length === 0) {
                console.log("You have no remaining tasks left!")
            }
        } else {
            results = todos
        }
        results.forEach((e) => console.log(`id: ${e.id}, \n todo: ${e.todo}, \n completed: ${e.completed}`))
    }
})

yargs.command({
    command: "delete",
    descibe: "delete a todo using ID ",
    builder: {
        id: {
            describe: "The ID you want to delete",
            type: "number",
            demandOption: true,
        },
    },
    handler: function (args) {
        const todos = loadData();
        const results = todos.filter(e => e.id !== args.id);
        saveData(results)
        console.log(`Deleted:${arg.todo}`)
    },
})

yargs.command({
    command: "complete",
    describe: "change the status of the task based on id",
    builder: {
        id: {
            describe: "The ID you want to change status",
            type: "number",
            demandOption: "true",
        },
    },
    handler: function (args) {
        const todos = loadData();
        for (let i = 0; i < todos.length; i++) {

            if (todos[i].id === args.id) {
                if (todos[i].completed === true) {
                    todos[i].completed = false
                    console.log(chalk.blue(`Marked ${todos[i].todo} uncomplete `))
                } else {
                    todos[i].completed = true
                    console.log(chalk.blue(`Marked ${todos[i].todo} complete `))
                }
            }


            saveData(todos)
        }
    }
})


yargs.command ({
    command: "deleteAll",
    descibe: "delate all the tasks",
    builder: {
        delete: {
            describe: "delete all the tasks",
            demandOption: true,
            type: "string",
        }
    },

    handler:function(args) {
        const todos = loadData()
        const results = todos.filter(e => e.completed === args.completed);
        saveData(results)
        console.log(chalk.red("Deleted all the tasks"))
    }
})

yargs.parse()