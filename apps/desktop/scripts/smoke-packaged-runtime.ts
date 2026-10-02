/** Validate the assembled application, including native Office conversion outside ASAR. */
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { resolveDesktopBuildTarget, resolveDesktopTargetBuildPaths } from './desktop-build-paths.mjs'
import { readDesktopRuntime, verifyDesktopRuntime } from '../src/runtime-tree.ts'
import { verifyWindowsCode } from './windows-runtime-signature.mjs'
import { smokePreparedRuntime } from './smoke-prepared-runtime.ts'
import { resolveDesktopPackageTarget } from './package-target.ts'
import { desktopNodeExecutable } from '../src/node-environment.ts'

const paths = resolveDesktopTargetBuildPaths()
const { values } = parseArgs({ options: { unsigned: { type: 'boolean', default: false } }, allowPositionals: false })
const target = resolveDesktopBuildTarget()
const windows = target === 'win-x64'
const linux = target === 'linux-x64' || target === 'linux-arm64'
if (values.unsigned && !windows) throw new Error('desktop smoke: unsigned artifacts require Windows')
const artifacts = values.unsigned ? paths.unsignedArtifacts : paths.artifacts
const macApplication = join(artifacts, target === 'mac-arm64' ? 'mac-arm64' : 'mac', 'DeepSeek Harness.app', 'Contents')
const linuxApplication = join(artifacts, target === 'linux-arm64' ? 'linux-arm64-unpacked' : 'linux-unpacked')
const application = windows ? join(artifacts, 'win-unpacked') : linux ? linuxApplication : macApplication
const resources = join(application, windows || linux ? 'resources' : 'Resources')
const macExecutable = join(application, 'MacOS', 'DeepSeek Harness')
const electron = windows ? join(application, 'DeepSeek Harness.exe') : linux ? join(application, 'deepseek-harness') : macExecutable
const executable = desktopNodeExecutable(electron, join(resources, 'runtime', 'primary-runtime'))
const descriptor = await verifyDesktopRuntime(paths.dsh, readDesktopRuntime(paths.dsh).release.version,
  resolveDesktopPackageTarget(target))
if (windows && !values.unsigned) await verifyWindowsCode(application)
await smokePreparedRuntime(join(resources, linux ? 'app' : 'app.asar', 'dsh'), executable, join(resources, 'runtime'), descriptor)
