#!/usr/bin/env zx
import 'zx/globals';
import { generateIdl } from '@metaplex-foundation/shank-js';
import { getCargo, getProgramFolders } from './utils.mjs';

const binaryInstallDir = path.join(__dirname, '..', '.cargo');

for (const folder of getProgramFolders()) {
  const cargo = getCargo(folder);
  const isShank = Object.keys(cargo.dependencies).includes('shank');
  const programDir = path.join(__dirname, '..', folder);
  const programName = cargo.package.name.replace(/-/g, '_');
  const programId = cargo.package.metadata.solana['program-id'];

  if (!isShank) {
    await $`anchor build --idl ${programDir}`;
    await $`mv ${programDir}/${programName}.json ${programDir}/idl.json`;
  } else {
    generateIdl({
      generator: 'shank',
      programName,
      programId,
      idlDir: programDir,
      idlName: 'idl',
      programDir,
      binaryInstallDir,
    });
  }
}
