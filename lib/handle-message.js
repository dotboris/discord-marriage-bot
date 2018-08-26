const debug = require('debug')('hanlde-message')

module.exports = async function (message) {
  try {
    debug(`${message.author.username}> ${message.toString()}`)

    if (message.content === '!test') {
      await message.channel.send('test.... icles! HAHA!!! :rofl:')
    } else if (message.content === '!crash') {
      throw Error('nope')
    }
  } catch (err) {
    debug(err)
  }
}
