import { pathToFileURL } from 'node:url';

export function runFollowUp(events, send, delivered = new Set()) {
  const seen = new Set();

  return events.map(({ leadId, eventId, consent }) => {
    const key = JSON.stringify([leadId, eventId]);
    if (seen.has(key) || delivered.has(key)) return { leadId, status: 'duplicate' };
    seen.add(key);

    if (consent !== true) return { leadId, status: 'skipped_no_consent' };

    try {
      send({ leadId, idempotencyKey: key, template: 'lead-follow-up' });
      delivered.add(key);
      return { leadId, status: 'sent' };
    } catch {
      return { leadId, status: 'retryable_failure' };
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const first = { leadId: 'demo-001', eventId: 'follow-up-1', consent: true };
  const events = [
    first,
    { ...first },
    { leadId: 'demo-002', eventId: 'follow-up-1', consent: false },
    { leadId: 'demo-003', eventId: 'follow-up-1', consent: true },
  ];

  const results = runFollowUp(events, ({ leadId }) => {
    if (leadId === 'demo-003') throw new Error('Simulated delivery failure');
  });

  console.table(results);
}
