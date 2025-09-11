#!/usr/bin/env node

/**
 * Version bump script for LocalSearch
 * Supports patch, minor, major version bumps
 */

import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Get command line argument
const bumpType = process.argv[2]

if (!bumpType || !['patch', 'minor', 'major'].includes(bumpType)) {
  console.error('Usage: node version-bump.js <patch|minor|major>')
  process.exit(1)
}

// Read package.json
const packagePath = join(rootDir, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

// Parse current version
const currentVersion = packageJson.version
const [major, minor, patch] = currentVersion.split('.').map(Number)

// Calculate new version
let newVersion
switch (bumpType) {
  case 'patch':
    newVersion = `${major}.${minor}.${patch + 1}`
    break
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`
    break
  case 'major':
    newVersion = `${major + 1}.0.0`
    break
}

// Update package.json
packageJson.version = newVersion
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n')

console.log(`Version bumped from ${currentVersion} to ${newVersion}`)
console.log(`✅ Updated package.json`)

// Update version in src/version.ts if it exists
const versionTsPath = join(rootDir, 'src', 'version.ts')
if (fs.existsSync(versionTsPath)) {
  const versionContent = `export const VERSION = '${newVersion}'
export const BUILD_TIME = '${new Date().toISOString()}'
`
  fs.writeFileSync(versionTsPath, versionContent)
  console.log(`✅ Updated src/version.ts`)
}