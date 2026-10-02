/** Console streams of a GUI-launched main process, whose stdout and stderr may be pipes a launcher already closed. */

/**
 * Keep writes to a closed console pipe from becoming uncaught exceptions. Launchers such as desktop entries
 * can start the application with a pipe and exit; every later console write then fails with EPIPE. Other
 * stream errors still propagate as uncaught exceptions.
 * @param streams - Console streams of the current process.
 */
export function ignoreClosedConsolePipes(streams: readonly NodeJS.WritableStream[] = [process.stdout, process.stderr]): void {
  for (const stream of streams) {
    stream.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code !== 'EPIPE') throw error
    })
  }
}

/**
 * Forward child output to a console stream while it accepts writes, and discard it afterwards. Reading
 * continues either way so a child never blocks on a full output pipe.
 * @param source - Child output stream.
 * @param destination - Console stream of the current process.
 */
export function forwardConsoleOutput(source: NodeJS.ReadableStream, destination: NodeJS.WritableStream = process.stdout): void {
  source.on('data', (chunk: Buffer | string) => {
    if (destination.writable) destination.write(chunk)
  })
}
