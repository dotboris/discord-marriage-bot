const yargs = require('yargs')

yargs
  .command({
    command: 'start',
    desc: 'Start the discord bot',
    async handler () {
      await require('./commands/start')()
    }
  })

  .demandCommand(1)
  .strict()
  .help()
  .parse()
