import { DeVisitor } from './devisit'

import { parseScript } from 'meriyah'
import * as gen from 'escodegen'

import { promises as fs } from 'fs'
import path from 'path'
//import * as esprima from 'esprima'

async function* walk(dir: string): AsyncGenerator<[boolean, string]> {
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name)
    yield [d.isDirectory(), entry]
    if (d.isDirectory()) yield* walk(entry)
  }
}

async function deop(src: string, dst: string) {
  const data = (await fs.readFile(src)).toString()
  const ast = parseScript(data)
  //const ast = esprima.parseScript(data, {range: true})
  //if (!ast.body.length) return

  console.log(dst)
  const file = await fs.open(dst, 'w')
  try { file.writeFile(gen.generate(new DeVisitor().visit_script(ast))) }
  catch (e) { console.log(e) }
  finally { file.close() }
  file.close()
}
 
export default async function cli(args: string[]) {
  if (args.length != 3) {
    console.log('usage: deop <path>')
    process.exit(1)
  }

  const base = args[2]
  const rebase = (p: string) => path.join('out', path.relative(base, p))
  const jobs = [];
  try {await fs.mkdir('out')} catch {}
  for await (const [isdir, p] of walk(base)) {
    if (isdir) await fs.mkdir(rebase(p), {recursive: true})
    else jobs.push(deop(p, rebase(p)))
  }

  await Promise.all(jobs)
  console.log("bye")
}
