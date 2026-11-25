import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runFollowUp } from './demo.mjs';

const lead = { leadId: 'demo-001', eventId: 'follow-up-1', consent: true };

test('delivers once across duplicate inputs and repeated batches sharing state', () => {
  const delivered = new Set();
  const attempts = [];
  const capture = (message) => attempts.push(message);

  assert.deepEqual(
    runFollowUp([lead, { ...lead }], capture, delivered).map(({ status }) => status),
    ['sent', 'duplicate'],
  );
  assert.equal(runFollowUp([lead], capture, delivered)[0].status, 'duplicate');
  assert.equal(attempts.length, 1);
});

test('skips leads without explicit consent', () => {
  let sent = false;
  const capture = () => { sent = true; };
  assert.equal(runFollowUp([{ ...lead, consent: false }], capture)[0].status, 'skipped_no_consent');
  assert.equal(sent, false);
});

test('leaves failed delivery available for a later retry', () => {
  const delivered = new Set();
  const fail = () => { throw new Error('Simulated failure'); };
  assert.equal(runFollowUp([lead], fail, delivered)[0].status, 'retryable_failure');
  assert.equal(runFollowUp([lead], () => {}, delivered)[0].status, 'sent');
});
