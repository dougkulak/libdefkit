/** @module @dougkulak/libdefkit */
/** */

import findCacheDir from 'find-cache-dir'
import fs from 'fs-extra'
import { join } from 'path'

import { pipe as dtsgen } from './dts'
import { ICliFlags, IContext, IExecPipe } from './interface'
import { invoke } from './util'

export const normalize: IExecPipe = (flags: ICliFlags): IContext => {
  const cwd = flags.cwd || process.cwd()
  const cache = findCacheDir({ name: '@dougkulak/libdefkit' }) + ''
  const name = fs.readJsonSync(join(cwd, 'package.json')).name
  const entry = flags.entry ?? `${name}/target/es5`
  const dtsOut = flags.dtsOut ?? join(cwd, 'typings', 'index.d.ts')
  const flowOut = flags.flowOut ?? join(cwd, 'flow-typed', 'index.flow.js')

  return { ...flags, cache, cwd, name, entry, dtsOut, flowOut }
}

export const clear: IExecPipe = (ctx) => {
  fs.emptyDirSync(ctx.cache)
}

export const flowgen: IExecPipe = ({ dtsOut, flowOut }): void => {
  if (dtsOut && flowOut) {
    invoke({ cmd: 'flowgen', args: [dtsOut, '--output-file', flowOut] })
  }
}

export const pipeline: IExecPipe[] = [normalize, clear, dtsgen, flowgen, clear]

export const execute = (flags: ICliFlags): IContext =>
  pipeline.reduce((ctx, pipe) => pipe(ctx) || ctx, flags as IContext)
