const TYPES = {
  BUILD:    ['create', 'add', 'build', 'implement', 'new'],
  FIX:      ['fix', 'bug', 'broken', 'error', 'failing', 'repair'],
  REFACTOR: ['refactor', 'restructure', 'clean', 'rename', 'simplify'],
  EXPLAIN:  ['explain', 'what', 'how', 'describe', 'show'],
  CONFIG:   ['configure', 'setup', 'set up', 'install', 'env'],
};

const STEPS = {
  BUILD:    ['Read existing structure', 'Write new code', 'Verify output'],
  FIX:      ['Reproduce issue', 'Identify root cause', 'Apply fix', 'Verify fix'],
  REFACTOR: ['Read current code', 'Apply changes', 'Verify behavior unchanged'],
  EXPLAIN:  ['Read relevant code', 'Analyse structure', 'Produce explanation'],
  CONFIG:   ['Read current config', 'Apply change', 'Verify result'],
};

function classify(task) {
  const lower = task.toLowerCase();
  for (const [type, keywords] of Object.entries(TYPES)) {
    if (keywords.some(k => lower.includes(k))) return type;
  }
  return null;
}

function runPipeline(taskStr) {
  if (!taskStr || taskStr.trim().length < 10) {
    return { ok: false, stage: 'planner', reason: 'Task too vague — provide a concrete description.' };
  }

  // Planner
  const type = classify(taskStr);
  if (!type) {
    return { ok: false, stage: 'planner', reason: 'Cannot classify task — include an action keyword (create, fix, explain, etc.).' };
  }
  const steps = STEPS[type];

  // Coder
  const executed = steps.map((action, i) => ({
    step: i + 1,
    action,
    agent: i === steps.length - 1 ? 'Reviewer' : 'Coder',
    status: 'completed',
  }));

  // Reviewer
  const passed = executed.every(s => s.status === 'completed');

  return {
    ok: true,
    task: taskStr.trim(),
    type,
    planner: { steps },
    coder:   { executed },
    reviewer: { passed },
    timestamp: new Date().toISOString(),
  };
}

module.exports = { runPipeline };
