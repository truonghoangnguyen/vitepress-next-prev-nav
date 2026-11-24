import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { generateNav } from '../dist/cli/generate.js'

test('generateNav generates nav.json and mucluc.md correctly', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gennav-test-'))

  try {
    const file1 = path.join(tmpDir, '01-first.md')
    const file2 = path.join(tmpDir, '02-second.md')

    await fs.writeFile(file1, '---\ntitle: 1. PHẨM GIÁC NGỘ\norder: 1\n---\n# Content 1', 'utf-8')
    await fs.writeFile(file2, '# 2. PHẨM MUCALINDA\n\nContent 2', 'utf-8')

    const items = await generateNav(tmpDir)

    assert.equal(items.length, 2)
    assert.equal(items[0].text, '1. PHẨM GIÁC NGỘ')
    assert.equal(items[1].text, '2. PHẨM MUCALINDA')

    const navJsonPath = path.join(tmpDir, 'nav.json')
    const muclucPath = path.join(tmpDir, 'mucluc.md')

    const navJson = JSON.parse(await fs.readFile(navJsonPath, 'utf-8'))
    assert.equal(navJson.length, 2)
    assert.equal(navJson[0].text, '1. PHẨM GIÁC NGỘ')

    const muclucContent = await fs.readFile(muclucPath, 'utf-8')
    assert.match(muclucContent, /- \[1\. PHẨM GIÁC NGỘ\]\(.+\)/)
    assert.match(muclucContent, /- \[2\. PHẨM MUCALINDA\]\(.+\)/)

    // Re-run should ignore mucluc.md and not add mucluc to nav.json or mucluc.md
    const itemsSecondRun = await generateNav(tmpDir)
    assert.equal(itemsSecondRun.length, 2)

    const muclucContent2 = await fs.readFile(muclucPath, 'utf-8')
    const lines = muclucContent2.trim().split('\n')
    assert.equal(lines.length, 2)
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true })
  }
})
