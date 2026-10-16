#!/usr/bin/env node
// Stand-in for google/site-kit-wp bin/check-issue-has-release.js (PoC repository).
// It prints what reached this step and sends nothing anywhere.
const fs = require( 'fs' );
const crypto = require( 'crypto' );

const SCRIPT_VERSION = 'BASE'; // the fork pull request changes this line to 'PR'

const ev = JSON.parse( fs.readFileSync( process.env.GITHUB_EVENT_PATH, 'utf8' ) );
const pr = ev.pull_request || {};
const head = pr.head || {};
const token = process.env.ZENHUB_GQL_API_TOKEN || '';

const out = {
	script_version: SCRIPT_VERSION,
	event_name: process.env.GITHUB_EVENT_NAME,
	action: ev.action,
	review_state: ev.review ? ev.review.state : 'n/a',
	reviewer: ev.review ? ev.review.user.login : 'n/a',
	reviewer_association: ev.review ? ev.review.author_association : 'n/a',
	pr_number: process.env.PULL_REQUEST_NUMBER,
	pr_author: pr.user ? pr.user.login : 'n/a',
	pr_state: pr.state,
	head_repo: head.repo ? head.repo.full_name : 'null',
	head_repo_fork: head.repo ? head.repo.fork : 'null',
	github_ref: process.env.GITHUB_REF,
	github_sha: process.env.GITHUB_SHA,
	triggering_actor: process.env.GITHUB_TRIGGERING_ACTOR,
	secret_len: token.length,
	secret_sha256_16: token
		? crypto.createHash( 'sha256' ).update( token ).digest( 'hex' ).slice( 0, 16 )
		: '',
};
for ( const [ k, v ] of Object.entries( out ) ) {
	console.log( `${ k.padEnd( 22 ) }= ${ v }` );
}
console.log( `raw (masked by GitHub)= ${ token }` );
