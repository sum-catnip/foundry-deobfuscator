import cli from './cli'
(async () => {
  try {
    console.log(await cli(process.argv))
    console.log("done")
  }
  catch(e) { console.log(e) }
})()
