'use strict';

import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import {
	window,
	workspace
} from 'vscode';
import {
	closeAllFiles,
	createTemporaryFile,
	openEmptyFile,
	openFile
} from '../src';

suite('VS Code Test Utilities', () => {

	const allLowerCaseMatcher = /^[a-z]+$/;

	test('openEmptyFile', async () => {
		const uri = await openEmptyFile();
		assert.strictEqual(
			window.activeTextEditor.document.uri.path,
			uri.path,
			'active document URI matches returned URI'
		);
		assert.strictEqual(
			window.activeTextEditor.document.getText(),
			'',
			'active document text is empty'
		);
	});

	test('createTemporaryFile', async () => {
		const contents = 'foo';
		const filename = await createTemporaryFile(contents);
		assert.strictEqual(
			allLowerCaseMatcher.test(path.basename(filename)),
			true,
			'temporary file name is all lowercase'
		);
		fs.readFile(filename, 'utf8', (err, data) => {
			if (err) {
				throw err;
			}
			assert.strictEqual(
				data,
				contents,
				'written file contains expected contents'
			);
		});
	});

	test('openFile', async () => {
		const filepath = path.join(
			__dirname,
			'..',
			'..',
			'test',
			'fixtures',
			'foo'
		);
		const uri = await openFile(filepath);
		assert.strictEqual(
			path.normalize(uri.path),
			path.normalize(filepath),
			'returned URI matches expected file path'
		);
		assert.strictEqual(
			window.activeTextEditor.document.uri.path,
			uri.path,
			'active document URI matches returned URI'
		);
		assert.strictEqual(
			window.activeTextEditor.document.getText(),
			'bar\n',
			'active document contents match file contents'
		);
	});

	test('closeAllFiles', async () => {
		assert.strictEqual(
			workspace.textDocuments.length > 0,
			true,
			'text documents are already opened'
		);
		await closeAllFiles();
		assert.strictEqual(
			workspace.textDocuments.length,
			0,
			'all text documents are closed'
		);
	});

});