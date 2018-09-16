const yargs = require('yargs')

async function runCommand (fn, ...args) {
  const { code, noExit } = (await fn(...args) || {})

  if (!noExit) {
    process.exit(code || 0)
  }
}

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
      await runCommand(require('./commands/start'), dir)
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
      await runCommand(require('./commands/init'), dir)
    }
  })

  .demandCommand(1)
  .strict()
  .help()
  .parse()
