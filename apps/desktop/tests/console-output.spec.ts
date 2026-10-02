import { PassThrough, Writable } from 'node:stream'
import { expect, it } from 'vitest'
import { forwardConsoleOutput, ignoreClosedConsolePipes } from '../src/console-output.ts'

function failure(code: string): NodeJS.ErrnoException {
  return Object.assign(new Error(code), { code })
}

it('absorbs a closed console pipe but rethrows other stream errors', () => {
  const stream = new PassThrough()
  ignoreClosedConsolePipes([stream])
  expect(() => stream.emit('error', failure('EPIPE'))).not.toThrow()
  expect(() => stream.emit('error', failure('EIO'))).toThrow('EIO')
})

it('keeps reading child output after the console stops accepting writes', () => {
  const source = new PassThrough()
  const written: string[] = []
  const destination = new Writable({ write(chunk: Buffer, _encoding, done) { written.push(chunk.toString()); done() } })
  forwardConsoleOutput(source, destination)
  source.write('first')
  destination.destroy()
  source.write('second')
  expect(written).toEqual(['first'])
  expect(source.readableFlowing).toBe(true)
})
