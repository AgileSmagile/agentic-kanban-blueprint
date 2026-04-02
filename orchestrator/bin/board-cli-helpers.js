#!/usr/bin/env node
// board-cli-helpers.js — Helper functions for the board CLI
//
// Usage:
//   node lib/board-cli-helpers.js <function-name> [args...]
//   echo '{"data":[...]}' | node lib/board-cli-helpers.js <function-name>
//
// Functions that take arguments read from process.argv.
// Functions that parse API responses read from stdin.
//
// This targets the Businessmap (Kanbanize) API v2 payload format.
// Adapt the payload shapes for your own board tool's API.

'use strict';

// Board ID — change to match your setup
const BOARD_ID = Number(process.env.BOARD_ID || 4);

// -- Payload construction (pure functions, return objects) --

/**
 * Build the JSON payload for creating a card.
 */
function buildCardPayload(workflowId, columnId, laneId, title) {
  return {
    board_id: BOARD_ID,
    workflow_id: Number(workflowId),
    column_id: Number(columnId),
    lane_id: Number(laneId),
    title: title,
  };
}

/**
 * Build the JSON payload for blocking a card.
 */
function buildBlockPayload(reason) {
  return {
    is_blocked: 1,
    block_reason: { comment: reason },
  };
}

/**
 * Build the JSON payload for a comment.
 */
function buildCommentPayload(text) {
  return { text: text };
}

/**
 * Build the JSON payload for updating a card field.
 */
function buildUpdatePayload(field, value) {
  const obj = {};
  obj[field] = value;
  return obj;
}

/**
 * Extract card_id from a Businessmap API create response.
 * Adapt the path for your board tool's response shape.
 */
function parseCardId(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return String(parsed.data?.[0]?.card_id || parsed.data?.card_id || '');
  } catch {
    return '';
  }
}

/**
 * Extract comment_id from a Businessmap API comment response.
 */
function parseCommentId(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return String(parsed.data?.[0]?.comment_id || parsed.data?.comment_id || '');
  } catch {
    return '';
  }
}

/**
 * Fetch individual card details and display WIP age for all in-flight items.
 *
 * The column IDs below are Businessmap-specific. Replace with your own
 * board's column IDs for "in progress" states.
 *
 * Initiatives: start = actual_start_time (Now entry), end = Done.
 * Cards: start = first_start_time (Doing entry), end = Shipped/Closed.
 */
async function wipAge(args) {
  const [boardDataJson, apiBase, apiKey] = args;
  const boardData = JSON.parse(boardDataJson);
  const cards = boardData.data?.data || [];
  const now = new Date();

  // In-flight columns — adapt these to your board
  const INIT_NOW = Number(process.env.INIT_NOW_COL || 84);
  const INIT_FOLLOWUP = Number(process.env.INIT_FOLLOWUP_COL || 91);
  const CARD_DOING = Number(process.env.DOING_COL || 150);
  const CARD_DONE = Number(process.env.DONE_COL || 151);
  const CARD_VR = Number(process.env.VR_COL || 31);

  // Workflow IDs — adapt to your board
  const INIT_WF = Number(process.env.INIT_WF || 10);
  const CARD_WF = Number(process.env.CARD_WF || 6);

  const targets = cards.filter(c =>
    (c.workflow_id === INIT_WF && (c.column_id === INIT_NOW || c.column_id === INIT_FOLLOWUP)) ||
    (c.workflow_id === CARD_WF && (c.column_id === CARD_DOING || c.column_id === CARD_DONE || c.column_id === CARD_VR))
  );

  if (targets.length === 0) {
    console.log('No in-flight items.');
    return;
  }

  const https = require('https');
  const fetch = (id) => new Promise((resolve, reject) => {
    const url = `${apiBase}/cards/${id}`;
    const req = https.get(url, { headers: { 'apikey': apiKey } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data).data); } catch { resolve(null); }
      });
    });
    req.on('error', reject);
  });

  const details = await Promise.all(targets.map(t => fetch(t.card_id)));

  function formatAge(days) {
    if (days < 1) return days.toFixed(1) + 'd';
    return Math.round(days) + 'd';
  }

  function getAge(card) {
    const start = card.initiative_details
      ? card.initiative_details.actual_start_time
      : card.first_start_time;
    if (!start) return null;
    return (now - new Date(start)) / 86400000;
  }

  const sections = [
    { title: 'INITIATIVES IN NOW', col: INIT_NOW, wf: INIT_WF, limit: 3 },
    { title: 'INITIATIVES IN NEEDS FOLLOW-UP', col: INIT_FOLLOWUP, wf: INIT_WF, limit: null },
    { title: 'CARDS DOING', col: CARD_DOING, wf: CARD_WF, limit: 4 },
    { title: 'CARDS DONE (awaiting review)', col: CARD_DONE, wf: CARD_WF, limit: 2 },
    { title: 'CARDS IN VALIDATION / REWORK', col: CARD_VR, wf: CARD_WF, limit: 3 },
  ];

  for (const section of sections) {
    const items = details
      .filter(d => d && d.workflow_id === section.wf && d.column_id === section.col)
      .map(d => ({ id: d.card_id, title: d.title, age: getAge(d), blocked: d.is_blocked }))
      .sort((a, b) => (b.age || 0) - (a.age || 0)); // oldest first

    const wipStr = section.limit ? ` (${items.length}/${section.limit})` : ` (${items.length})`;
    console.log(`\n${section.title}${wipStr}`);

    if (items.length === 0) {
      console.log('  (empty)');
      continue;
    }

    for (const item of items) {
      const ageStr = item.age !== null ? formatAge(item.age) : 'no start';
      const blocked = item.blocked ? ' [BLOCKED]' : '';
      console.log(`  #${item.id} | ${ageStr} | ${item.title}${blocked}`);
    }
  }
}

// -- CLI wrappers --

function makeCardPayload(args) {
  const [workflowId, columnId, laneId, ...titleParts] = args;
  console.log(JSON.stringify(buildCardPayload(workflowId, columnId, laneId, titleParts.join(' '))));
}

function makeBlockPayload(args) {
  console.log(JSON.stringify(buildBlockPayload(args.join(' '))));
}

function makeCommentPayload(args) {
  console.log(JSON.stringify(buildCommentPayload(args.join(' '))));
}

function makeUpdatePayload(args) {
  const [field, ...valueParts] = args;
  console.log(JSON.stringify(buildUpdatePayload(field, valueParts.join(' '))));
}

function extractCardId() {
  let data = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => { data += chunk; });
  process.stdin.on('end', () => {
    const id = parseCardId(data);
    if (!id) process.stderr.write('board-cli-helpers: failed to parse card response\n');
    console.log(id);
  });
}

function extractCommentId() {
  let data = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => { data += chunk; });
  process.stdin.on('end', () => {
    const id = parseCommentId(data);
    if (!id) process.stderr.write('board-cli-helpers: failed to parse comment response\n');
    console.log(id);
  });
}

// -- Exports for testing --

if (typeof module !== 'undefined') {
  module.exports = {
    buildCardPayload,
    buildBlockPayload,
    buildCommentPayload,
    buildUpdatePayload,
    parseCardId,
    parseCommentId,
  };
}

// -- Dispatch --

if (require.main === module) {
  const fn = process.argv[2];
  const args = process.argv.slice(3);

  const dispatch = {
    makeCardPayload,
    makeBlockPayload,
    makeCommentPayload,
    makeUpdatePayload,
    extractCardId,
    extractCommentId,
    wipAge,
  };

  if (!fn || !dispatch[fn]) {
    const available = Object.keys(dispatch).join(', ');
    process.stderr.write('board-cli-helpers: unknown function "' + (fn || '') + '"\n');
    process.stderr.write('Available: ' + available + '\n');
    process.exit(1);
  }

  dispatch[fn](args);
}
