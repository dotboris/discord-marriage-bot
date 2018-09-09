const yargs = require('yargs')

yargs
  .command({
    command: 'start',
    desc: 'Start the discord bot',
    builder (yargs) {
      return yargs
        .option('dir', {
          alias: 'd',
          desc: 'Working directory for the bot',
          type: 'string',
          demandOption: true
        })
    },
    async handler ({ dir }) {
      await require('./commands/start')(dir)
    }
  })

  .command({
    command: 'init',
    desc: 'Initalize a new instance of the bot',
    builder (yargs) {
      return yargs
        .option('dir', {
          alias: 'd',
          desc: 'Working directory for the bot',
          type: 'string',
          demandOption: true
        })
    },
    async handler ({ dir }) {
      await require('./commands/init')(dir)
    }
  })

  .demandCommand(1)
  .strict()
  .help()
  .parse()
