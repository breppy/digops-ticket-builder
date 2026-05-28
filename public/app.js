const BASES = {
  lo:   { baseId: 'appJCpsSpgD07hGLf', tableId: 'tblRxiCsdAEjz6oFc' },
  task: { baseId: 'appJCpsSpgD07hGLf', tableId: 'tblIOY0UzgZZq51ww' },
};

const MILESTONES = {
  'rec8yRUa9H72G5kNc': [
    { id: 'recXWCPAmw2qjMgh4', name: 'Survey Design Finalization & Approval' },
    { id: 'recPCvcgNVWB3oUDc', name: 'Segment Message Variants Finalized' },
    { id: 'rec9Qp5KAq8UyDxNe', name: 'Survey Deployment Complete' },
    { id: 'recpB0z1bQOWMIYMt', name: 'Insights Analysis & Synthesis Complete' },
    { id: 'rec0bViAJMDggFde5', name: 'Findings Brief Delivered' },
  ],
  'recZpRRs2uJRHOf96': [
    { id: 'recCmCVKHgibXItxk', name: 'M1: CFS Parameter Definition & Stakeholder Alignment' },
    { id: 'recMFohKZfujhHkIY', name: 'M2: Engineering Configuration & Integration' },
    { id: 'recHGXt4k2JsbHPBF', name: 'M3: QA Testing & Acceptance' },
    { id: 'recQRoA8gQDdQnGw2', name: 'M4: Launch & Initial Monitoring' },
  ],
  'recWhOZAtXp6ZUFZU': [
    { id: 'recQh21I8Ut6HRio3', name: 'M1: Requirements & Technical Scoping' },
    { id: 'rec8jeQw9Hcck9dSb', name: 'M2: Engineering Build' },
    { id: 'recKNTVhh1jdTruFD', name: 'M3: QA Testing & Acceptance' },
    { id: 'recSKYoQoxRfC3uGk', name: 'M4: Launch & Phase 1 Monitoring' },
    { id: 'recZ94jACdZu4wABG', name: 'Discovery & Requirements Finalization' },
    { id: 'recHrWZe3GyolhmzO', name: 'Design & UX Mockups' },
    { id: 'rec9QmkUSQIpMnlhr', name: 'Development & Implementation' },
  ],
  'recnZewNDr6PxAKXw': [
    { id: 'recuigzpzEEW3HZc7', name: 'Phase 0 — Distribute KPI intake to stakeholders' },
    { id: 'recuwzdD0ngvtUlDL', name: 'Phase 0 — Confirm M+R vendor tag status' },
    { id: 'recQfGheSijJpN8yD', name: 'Phase 0 — Confirm LO variable availability' },
    { id: 'recoxAn4O7M0peynE', name: 'Phase 0 — Align with Wide Eye on GA4 architecture' },
    { id: 'recFoD0F4e4IfVxLi', name: 'Phase 1 — GA4 property consolidation and stream setup' },
    { id: 'recBuCiqa1ozLLGuc', name: 'Phase 1 — Standardize Luminate dataLayer pushes' },
    { id: 'reckmgurkXSRvkku6', name: 'Phase 1 — Update SSL domain references in GTM' },
    { id: 'recRVhdIIJzddXJM3', name: 'Phase 1 — GTM consolidation under Giving container' },
    { id: 'recSqZ0VaFXqgnkLu', name: 'Phase 1 — Configure GA4 ecommerce schema' },
    { id: 'recQmBOera0rjovcB', name: 'Phase 2 — QA sign-off across all events' },
    { id: 'rec2dyvrvxC8dOYv9', name: 'Phase 2 — 4-week baseline monitoring hold' },
    { id: 'recPxA9yOpgXmCNn7', name: 'Phase 2 — Build Looker Studio Executive Summary' },
    { id: 'recojx2XZaj8Z3zpk', name: 'Phase 2 — Build CFS funnel deep dive dashboard' },
    { id: 'rect0st9fu2qnAs5R', name: 'Phase 3 — Expand dashboard to all program KPIs' },
    { id: 'rec53yYonUppAGOid', name: 'Phase 3 — Add What Needs Attention layer' },
    { id: 'recn239MTz0DQHTTe', name: "Phase 3 — Expand Fred's Team and Giving instrumentation" },
    { id: 'rectPMYKRLAh9rbBX', name: 'Phase 3 — Begin first CFS registration flow pilot' },
    { id: 'recVp08PCd9d4ASA3', name: 'Phase 4 — Establish recurring performance review' },
    { id: 'reck3do5inLjKUEmz', name: 'Phase 4 — Establish GTM governance process' },
  ],
  'recfAzlI7JomtkxFp': [],
  'recSK8fZgtLupqMPl': [],
  'recz8QJHJUffBctmK': [],
  'recyQIfAbntRkQ19A': [
    { id: 'recJNFA22ABecz0BT', name: 'QA Testing & Validation (Complete Cover vs Donor Cover)' },
    { id: 'recOFDXvdEY2KEg1m', name: 'CRM & Reporting Validation' },
    { id: 'rec2rN6afStuNM8aY', name: 'Test Form Build & Dynamic Yield Setup' },
    { id: 'recWdJdd6DbOLCw4l', name: 'Pilot Launch & Monitoring' },
    { id: 'recYFMSrI2X6iKE0z', name: 'Results Analysis & Rollout Decision' },
  ],
  'recPUryoYZEkZyLOP': [],
  'recR3wzpfrxJGR4g1': [
    { id: 'recH6lcNiWTPB5d3X', name: 'Discovery & Requirements Gathering' },
    { id: 'recKFLryWcVA5DMW2', name: 'UX Design & Prototyping' },
    { id: 'recJEVEWuHpDeu0Qc', name: 'Technical Architecture & CRM Integration Planning' },
    { id: 'recSKtAmVKyw75FNV', name: 'Development - Phase 1 (Core UX)' },
    { id: 'recW5XwfrZGHk1fZC', name: 'Development - Phase 2 (Custom Fields & Add-ons)' },
    { id: 'rec1B8nQBtVhsw4Ql', name: 'QA, Testing & Pilot Preparation' },
    { id: 'rec29SpLZdtT6sokz', name: 'Pilot Launch & Performance Monitoring' },
  ],
  'recLvtgE1gRqfpMNL': [],
  'recSx7fjCpqCKx8RE': [],
};

const TEAM_NAMES = {
  'rec1zJZdWbOfKUr8B': 'Brandy Reppy',
  'recZPk5UCg0aZof4r': 'Christopher Hunt',
  'recPNbEnssFMGRHQx': 'Dan Krumm',
  'recPDfXyw7Ewvwktd': 'Erik Haunold',
  'recGJfQXlp8KCl82S': 'Hooria Tariq',
  'recWpA1fDeHRb4nTf': 'Shannon Kenney',
  'recmMouUvoEbbDi4y': 'Nicole Thurgood',
};

let state = {
  route: null,
  loType: null, loPriority: null, loDate: '', loAssignee: '',
  taskProject: '', taskProjectName: '', taskMilestone: '', taskMilestoneName: '',
  taskType: null, taskPriority: null, taskEffort: '', taskAssignee: '', taskStart: '', taskDue: '',
  description: '', claudeDraft: null, refinementNotes: [],
};

function updateProgress(step) {
  for (let i = 1; i <= 4; i++) {
    const d = document.getElementById('dot' + i);
    d.className = 'progress-dot' + (i < step ? ' done' : i === step ? ' active' : '');
  }
}

function showStep(n) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const el = n === 'success' ? document.getElementById('stepSuccess') : document.getElementById('step' + n);
  if (el) el.classList.add('active');
  if (typeof n === 'number') updateProgress(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToStep1() { showStep(1); }

function goToStep2() {
  if (!state.route) return;
  document.getElementById('loFields').classList.toggle('hidden', state.route !== 'lo');
  document.getElementById('taskFields').classList.toggle('hidden', state.route !== 'task');
  if (state.route === 'lo') {
    document.getElementById('step2Title').textContent = 'LO Work Item details';
    document.getElementById('step2Sub').textContent = 'Pick a type and priority, then describe the work.';
  } else {
    document.getElementById('step2Title').textContent = 'Project Task details';
    document.getElementById('step2Sub').textContent = 'Select the project, milestone, and task type.';
  }
  showStep(2);
}

function goToStep3() {
  showStep(3);
  if (state.claudeDraft) {
    document.getElementById('claudeOutput').textContent = '✓ Draft complete — reviewing with you next.';
    document.getElementById('claudeDot').className = 'claude-dot done';
    document.getElementById('claudeStatus').textContent = 'claude-sonnet-4-6 · done';
    document.getElementById('step3BtnRow').style.display = 'flex';
  }
}

function goToStep3fresh() {
  const desc = document.getElementById('workDescription').value.trim();
  if (!desc) { alert('Please add a description.'); return; }
  if (state.route === 'lo') {
    if (!state.loType) { alert('Please select a type.'); return; }
    if (!state.loPriority) { alert('Please select a priority.'); return; }
    state.loDate = document.getElementById('loDate').value;
    state.loAssignee = document.getElementById('loAssignee').value;
    if (state.loAssignee && !state.loDate) { alert('Due date is required when an assignee is selected.'); return; }
  } else {
    if (!document.getElementById('taskProject').value) { alert('Please select a project.'); return; }
    if (!document.getElementById('taskMilestone').value) { alert('Please select a milestone.'); return; }
    if (!state.taskType) { alert('Please select a task type.'); return; }
    if (!state.taskPriority) { alert('Please select a priority.'); return; }
    state.taskProject = document.getElementById('taskProject').value;
    state.taskProjectName = document.getElementById('taskProject').options[document.getElementById('taskProject').selectedIndex].text;
    state.taskMilestone = document.getElementById('taskMilestone').value;
    state.taskMilestoneName = document.getElementById('taskMilestone').options[document.getElementById('taskMilestone').selectedIndex].text;
    state.taskEffort = document.getElementById('taskEffort').value;
    state.taskAssignee = document.getElementById('taskAssignee').value;
    state.taskStart = document.getElementById('taskStart').value;
    state.taskDue = document.getElementById('taskDue').value;
    if (state.taskAssignee && !state.taskDue) { alert('Due date is required when an assignee is selected.'); return; }
  }
  state.description = desc;
  showStep(3);
  runClaude();
}

function goToStep4() {
  if (!state.claudeDraft) return;
  buildReviewUI();
  showStep(4);
}

function selectRoute(r) {
  state.route = r;
  document.getElementById('routeLO').className = 'route-card' + (r === 'lo' ? ' sel-lo' : '');
  document.getElementById('routeTask').className = 'route-card' + (r === 'task' ? ' sel-task' : '');
  document.getElementById('step1Next').disabled = false;
  const btn = document.getElementById('step1Next');
  btn.className = 'btn-primary' + (r === 'lo' ? ' btn-lo' : r === 'task' ? ' btn-task' : '');
}

function selectType(t, route) {
  state[route === 'lo' ? 'loType' : 'taskType'] = t;
  const cls = 'selected-' + route;
  document.querySelectorAll('.type-chip').forEach(c => {
    c.classList.remove('selected-lo', 'selected-task');
    if (c.querySelector('.type-chip-label').textContent.trim() === t) c.classList.add(cls);
  });
}

function selectPriority(p, route) {
  state[route === 'lo' ? 'loPriority' : 'taskPriority'] = p;
  const rowId = route === 'lo' ? 'loPriorityRow' : 'taskPriorityRow';
  document.querySelectorAll('#' + rowId + ' .priority-chip').forEach(c => {
    c.className = 'priority-chip';
    const label = c.textContent.replace(/[🚨🔴🟡🔵]/g,'').trim();
    if (label === p) c.className = 'priority-chip sel-' + p.toLowerCase();
  });
}

function onAssigneeChange(route) {
  const hasAssignee = document.getElementById(route === 'lo' ? 'loAssignee' : 'taskAssignee').value !== '';
  const optId = route === 'lo' ? 'loDateOpt' : 'taskDueOpt';
  const reqId = route === 'lo' ? 'loDateReq' : 'taskDueReq';
  const hintId = route === 'lo' ? 'loDateHint' : 'taskDueHint';
  document.getElementById(optId).classList.toggle('hidden', hasAssignee);
  document.getElementById(reqId).classList.toggle('hidden', !hasAssignee);
  document.getElementById(hintId).classList.toggle('hidden', !hasAssignee);
}

function onProjectChange() {
  const projectId = document.getElementById('taskProject').value;
  const ms = document.getElementById('taskMilestone');
  ms.innerHTML = '';
  if (!projectId) { ms.innerHTML = '<option value="">— select a project first —</option>'; ms.disabled = true; return; }
  const milestones = MILESTONES[projectId] || [];
  if (milestones.length === 0) { ms.innerHTML = '<option value="">— no milestones found —</option>'; ms.disabled = true; }
  else {
    ms.innerHTML = '<option value="">— select a milestone —</option>';
    milestones.forEach(m => { const o = document.createElement('option'); o.value = m.id; o.textContent = m.name; ms.appendChild(o); });
    ms.disabled = false;
  }
}

async function runClaude() {
  const dot = document.getElementById('claudeDot');
  const output = document.getElementById('claudeOutput');
  const statusEl = document.getElementById('claudeStatus');
  const btnRow = document.getElementById('step3BtnRow');
  dot.className = 'claude-dot'; btnRow.style.display = 'none'; output.textContent = 'Analyzing your input...';

  const routeContext = state.route === 'lo'
    ? `Ticket type: ${state.loType}. Priority: ${state.loPriority}. Due: ${state.loDate || 'not specified'}.`
    : `Project task under "${state.taskProjectName}", milestone "${state.taskMilestoneName}". Task Type: ${state.taskType}. Priority: ${state.taskPriority}. Effort: ${state.taskEffort || 'not specified'}.`;

  const systemPrompt = `You are a ticket-writing assistant for the DevISO digital operations team at Memorial Sloan Kettering Cancer Center.

CRITICAL RULES:
1. Never ask clarifying questions. Draft the best possible ticket from the input. Fill gaps with reasonable defaults.
2. Return ONLY valid JSON — no markdown fences, no explanation, no preamble.
3. The "description" field must use markdown formatting — it renders in Airtable's richText field.

Team context:
- LO = Luminate Online by Blackbaud (peer-to-peer fundraising, email, event ticketing)
- Programs: Cycle for Survival (CFS), Fred's Team, Comedy vs. Cancer
- Task Tracker tasks are discrete units of work within a project milestone

${routeContext}

DESCRIPTION FORMAT — match the structure to the ticket type exactly:

Bug:
**Context**
What triggered this / where it was found.

**Steps to reproduce**
1. Step one
2. Step two

**Expected behavior**
What should happen.

**Actual behavior**
What is happening instead.

**Acceptance criteria**
- [ ] Specific, verifiable fix condition
- [ ] Regression passes

---
Enhancement | Config Change | Campaign Setup | Content Update | Work Ticket:
**Context**
Why this work is needed.

**What needs to happen**
Specific changes or deliverables required.

**Acceptance criteria**
- [ ] Checkable completion condition
(Include ONLY if you can infer real, specific criteria from the input. Omit entire section and add a flag if input is too thin.)

---
Spike | Audit | Spike/Audit:
**Context**
What question or uncertainty this spike is resolving.

**Scope**
What is in scope. What is explicitly out of scope.

**Expected output**
The specific deliverable when done — a decision, document, recommendation, or proof of concept.

(NEVER include acceptance criteria for spikes. NEVER flag missing ACs for spikes.)

---
Other:
**Context**
Background and reason for the work.

**What needs to happen**
What needs to be done.

**Acceptance criteria**
- [ ] Include if inferrable. Omit and flag if not.

FLAGS: Genuine concerns only, max 3. Always flag if AC is required but missing (not for spikes). Never flag inferrable info. Empty array if nothing to flag.

NOTES FOR REFINEMENT: Surface open questions or unresolved assumptions that a refiner would need to address before the ticket can be worked. Only include items that genuinely cannot be inferred from the input — scope boundaries that are ambiguous, missing stakeholder decisions, unclear acceptance conditions, or dependencies that need confirmation. Do not include items just because more detail would be nice. Empty array if input is sufficient to work from.

Return exactly:
{
  "name": "concise title, max 60 chars",
  "description": "formatted markdown per above",
  "flags": [],
  "notes_for_refinement": []
}`;

  try {
    statusEl.textContent = 'claude-sonnet-4-6 · drafting';
    const res = await fetch('/api/claude', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, system: systemPrompt, messages: [{ role: 'user', content: state.description }] })
    });
    const data = await res.json();
    let text = '';
    for (const block of data.content) { if (block.type === 'text') text += block.text; }
    text = text.replace(/```json|```/g, '').trim();
    state.claudeDraft = JSON.parse(text);
    state.refinementNotes = state.claudeDraft.notes_for_refinement || [];
    output.textContent = '✓ Draft complete — reviewing with you next.';
    dot.className = 'claude-dot done';
    statusEl.textContent = 'claude-sonnet-4-6 · done';
    btnRow.style.display = 'flex';
  } catch (err) {
    output.textContent = 'Error: ' + err.message + '\n\nCheck your network or try again.';
    dot.className = 'claude-dot'; statusEl.textContent = 'claude-sonnet-4-6 · error'; btnRow.style.display = 'flex';
  }
}

function buildReviewUI() {
  const draft = state.claudeDraft;
  const isLO = state.route === 'lo';
  const chip = document.getElementById('destinationChip');
  chip.className = 'destination-chip ' + (isLO ? 'lo' : 'task');
  chip.innerHTML = isLO ? '⚙️ &nbsp;LO Work Items → Project Dashboard' : '📋 &nbsp;Task Tracker → Project Dashboard';

  const flagsBox = document.getElementById('flagsBox');
  const flagsList = document.getElementById('flagsList');
  if (draft.flags && draft.flags.length > 0) {
    flagsList.innerHTML = draft.flags.map(f => `<li>${escHtml(f)}</li>`).join('');
    flagsBox.classList.remove('hidden');
  } else { flagsBox.classList.add('hidden'); }

  const container = document.getElementById('reviewFields');
  container.innerHTML = '';

  function addField(label, key, value, editable, multiline) {
    const div = document.createElement('div');
    div.className = 'review-field';
    div.innerHTML = `<div class="review-field-label">${label}</div>`;
    if (editable) {
      if (multiline) {
        const ta = document.createElement('textarea');
        ta.style.cssText = 'display:block;width:100%;min-height:110px;background:var(--surface2);border:1.5px solid var(--border);border-radius:var(--radius);padding:10px 13px;color:var(--text);font-family:Arial,sans-serif;font-size:1rem;line-height:1.6;resize:vertical;outline:none;';
        ta.value = value || '';
        ta.oninput = () => { state.claudeDraft[key] = ta.value; };
        ta.onfocus = () => { ta.style.borderColor = 'var(--navy)'; ta.style.boxShadow = '0 0 0 3px rgba(0,37,105,0.1)'; };
        ta.onblur = () => { ta.style.borderColor = 'var(--border)'; ta.style.boxShadow = 'none'; };
        div.appendChild(ta);
      } else {
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.style.cssText = 'display:block;width:100%;background:var(--surface2);border:1.5px solid var(--border);border-radius:var(--radius);padding:10px 13px;color:var(--text);font-family:Arial,sans-serif;font-size:1rem;outline:none;';
        inp.value = value || '';
        inp.oninput = () => { state.claudeDraft[key] = inp.value; };
        inp.onfocus = () => { inp.style.borderColor = 'var(--navy)'; inp.style.boxShadow = '0 0 0 3px rgba(0,37,105,0.1)'; };
        inp.onblur = () => { inp.style.borderColor = 'var(--border)'; inp.style.boxShadow = 'none'; };
        div.appendChild(inp);
      }
    } else {
      const vdiv = document.createElement('div');
      vdiv.className = 'review-field-value';
      vdiv.textContent = value || '—';
      div.appendChild(vdiv);
    }
    container.appendChild(div);
    if (container.children.length < container.childElementCount) {
      const hr = document.createElement('hr');
      hr.className = 'section-divider';
      container.appendChild(hr);
    }
  }

  addField('Title', 'name', draft.name, true, false);
  const hr1 = document.createElement('hr'); hr1.className = 'section-divider'; container.appendChild(hr1);
  addField('Description', 'description', draft.description, true, true);

  if (state.refinementNotes.length > 0) {
    const rfBox = document.createElement('div');
    rfBox.className = 'refinement-box';
    rfBox.style.marginTop = '12px';
    const rfLabel = document.createElement('div');
    rfLabel.className = 'refinement-box-label';
    rfLabel.textContent = '📋 Notes for Refinement';
    rfBox.appendChild(rfLabel);
    const rfTa = document.createElement('textarea');
    rfTa.value = state.refinementNotes.map(n => '- ' + n).join('\n');
    rfTa.oninput = () => {
      state.refinementNotes = rfTa.value.split('\n').map(l => l.replace(/^-\s*/, '').trim()).filter(Boolean);
    };
    rfBox.appendChild(rfTa);
    const rfHint = document.createElement('div');
    rfHint.className = 'refinement-hint';
    rfHint.textContent = 'These open questions will be appended to the ticket description for refinement.';
    rfBox.appendChild(rfHint);
    container.appendChild(rfBox);
  }

  const hr2 = document.createElement('hr'); hr2.className = 'section-divider'; container.appendChild(hr2);

  if (isLO) {
    addField('Type', 'type', state.loType, false);
    addField('Priority', 'priority', state.loPriority, false);
    if (state.loAssignee) addField('Assignee', '_', TEAM_NAMES[state.loAssignee], false);
    if (state.loDate) addField('Due Date', '_', state.loDate, false);
  } else {
    addField('Project', '_', state.taskProjectName, false);
    addField('Milestone', '_', state.taskMilestoneName, false);
    addField('Task Type', '_', state.taskType, false);
    addField('Priority', '_', state.taskPriority, false);
    if (state.taskEffort) addField('Effort', '_', state.taskEffort, false);
    if (state.taskAssignee) addField('Assignee', '_', TEAM_NAMES[state.taskAssignee], false);
    if (state.taskStart) addField('Start Date', '_', state.taskStart, false);
    if (state.taskDue) addField('Due Date', '_', state.taskDue, false);
  }

  document.getElementById('submitBtn').className = 'btn-primary' + (isLO ? ' btn-lo' : ' btn-task');
}

async function submitTicket() {
  const btn = document.getElementById('submitBtn');
  btn.disabled = true; btn.textContent = 'Creating...';
  const draft = state.claudeDraft;
  const isLO = state.route === 'lo';
  const dest = BASES[state.route];
  const finalDescription = state.refinementNotes.length > 0
    ? draft.description + '\n\n---\n**Notes for Refinement**\n' + state.refinementNotes.map(n => '- [ ] ' + n).join('\n')
    : draft.description;
  let fields;
  if (isLO) {
    fields = { 'Name': draft.name || 'Untitled', 'Description': finalDescription || '', 'Type': state.loType || 'Other', 'Priority': state.loPriority || 'Medium', 'Status': state.loAssignee ? 'In Progress' : 'Backlog' };
    if (state.loDate) fields['Due Date'] = state.loDate;
    if (state.loAssignee) fields['Assignee'] = [{ id: state.loAssignee }];
  } else {
    fields = { 'Task Name': draft.name || 'Untitled', 'Description': finalDescription || '', 'Task Type': state.taskType || 'Work Ticket', 'Priority': state.taskPriority || 'Medium', 'Status': 'Not Started', 'Related Milestone': [{ id: state.taskMilestone }] };
    if (state.taskEffort) fields['Effort Size'] = state.taskEffort;
    if (state.taskAssignee) fields['Assignee'] = [{ id: state.taskAssignee }];
    if (state.taskStart) fields['Start date'] = state.taskStart;
    if (state.taskDue) fields['Due Date'] = state.taskDue;
  }
  try {
    const res = await fetch('/api/airtable', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baseId: dest.baseId, tableId: dest.tableId, fields }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || JSON.stringify(data.error) || 'Airtable error');
    document.getElementById('successSub').textContent = isLO ? 'Added to LO Work Items in Project Dashboard.' : `Added to Task Tracker under "${state.taskMilestoneName}".`;
    document.getElementById('successId').textContent = 'Record ID: ' + data.id;
    showStep('success');
  } catch (err) {
    btn.disabled = false; btn.textContent = 'Create Ticket ✓';
    alert('Submission failed: ' + err.message);
  }
}

function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function startOver() {
  state = { route: null, loType: null, loPriority: null, loDate: '', loAssignee: '', taskProject: '', taskProjectName: '', taskMilestone: '', taskMilestoneName: '', taskType: null, taskPriority: null, taskEffort: '', taskAssignee: '', taskStart: '', taskDue: '', description: '', claudeDraft: null, refinementNotes: [] };
  document.getElementById('routeLO').className = 'route-card';
  document.getElementById('routeTask').className = 'route-card';
  document.getElementById('step1Next').disabled = true;
  document.getElementById('workDescription').value = '';
  document.querySelectorAll('.type-chip').forEach(c => c.classList.remove('selected-lo','selected-task'));
  document.querySelectorAll('.priority-chip').forEach(c => c.className = 'priority-chip');
  ['loAssignee','loDate','taskProject','taskEffort','taskAssignee','taskStart','taskDue'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('taskMilestone').innerHTML = '<option value="">— select a project first —</option>';
  document.getElementById('taskMilestone').disabled = true;
  showStep(1);
}

updateProgress(1);
