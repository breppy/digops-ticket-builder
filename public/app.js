const BASES = {
  lo:   { baseId: 'appJCpsSpgD07hGLf', tableId: 'tblRxiCsdAEjz6oFc', attachmentFieldId: 'fldVbU5E2bNQjyKtD' },
  task: { baseId: 'appJCpsSpgD07hGLf', tableId: 'tblIOY0UzgZZq51ww', attachmentFieldId: 'fld5amAF4Nb1xzaSf' },
};

// Attachment limits. Raw blob is capped so the base64 payload (≈ +33%) stays
// under the edge function's ~4 MB body limit. Larger images are auto-downscaled
// before this check, so most screenshots pass without manual resizing.
const MAX_ATTACH_BYTES = 2.5 * 1024 * 1024; // 2.5 MB
const MAX_IMAGE_DIMENSION = 2000;           // px — longest edge after downscale
let attachIdCounter = 0;

// Project Dashboard tables (same base as the ticket destinations).
const PROJECT_BASE = 'appJCpsSpgD07hGLf';
const PROJECTS_TABLE = 'tblwp9bKQbieVV58G';
const MILESTONES_TABLE = 'tblel2WDV5glyxrZe';
const TEAM_TABLE = 'tblPHYciSmiGv3Eo3';

// Project statuses treated as finished — these are hidden from the dropdown.
// Anything else (including projects with no status set) counts as active.
const CLOSED_PROJECT_STATUSES = ['Complete', 'Closed', 'Shipped'];

// projectId -> [{ id, name }]. Populated live from Airtable on page load.
let MILESTONES = {};

// Reads all records from a table via the /api/airtable list proxy, following
// pagination server-side. Returns an array of Airtable records.
async function airtableList(tableId, params) {
  const res = await fetch('/api/airtable', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ baseId: PROJECT_BASE, tableId, action: 'list', params })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || JSON.stringify(data.error) || 'List failed');
  return data.records || [];
}

// Loads active projects and their open milestones, then builds the project
// dropdown and the MILESTONES map. Runs once on page load.
async function loadProjectsAndMilestones() {
  const sel = document.getElementById('taskProject');
  const closedList = CLOSED_PROJECT_STATUSES.map(s => `{Project Status}="${s}"`).join(',');
  try {
    const [projects, milestones] = await Promise.all([
      airtableList(PROJECTS_TABLE, {
        fields: ['Project Name', 'Project Status'],
        filterByFormula: `NOT(OR(${closedList}))`,
      }),
      airtableList(MILESTONES_TABLE, {
        fields: ['Milestone / Deliverable', 'Projects', 'Start Date'],
        filterByFormula: 'NOT({Status}="Completed")',
      }),
    ]);

    // Build projectId -> milestones map, ordered by start date then name so
    // phases read in sequence.
    MILESTONES = {};
    milestones
      .slice()
      .sort((a, b) => {
        const sa = a.fields['Start Date'] || '9999-12-31';
        const sb = b.fields['Start Date'] || '9999-12-31';
        if (sa !== sb) return sa < sb ? -1 : 1;
        return (a.fields['Milestone / Deliverable'] || '').localeCompare(b.fields['Milestone / Deliverable'] || '');
      })
      .forEach(m => {
        const name = m.fields['Milestone / Deliverable'] || '(untitled milestone)';
        (m.fields['Projects'] || []).forEach(pid => {
          (MILESTONES[pid] = MILESTONES[pid] || []).push({ id: m.id, name });
        });
      });

    // Populate the project dropdown, alphabetically.
    projects.sort((a, b) => (a.fields['Project Name'] || '').localeCompare(b.fields['Project Name'] || ''));
    sel.innerHTML = '<option value="">— select a project —</option>';
    projects.forEach(p => {
      const o = document.createElement('option');
      o.value = p.id;
      o.textContent = p.fields['Project Name'] || '(untitled project)';
      sel.appendChild(o);
    });
    sel.disabled = false;
  } catch (err) {
    console.error('Failed to load projects/milestones:', err);
    sel.innerHTML = '<option value="">— couldn’t load projects, refresh to retry —</option>';
    sel.disabled = true;
  }
}

// recordId -> name. Populated live from the Team Members table on page load.
let TEAM_NAMES = {};

// Loads active team members into both assignee dropdowns and the TEAM_NAMES
// lookup (used to show the assignee name on the review screen).
async function loadAssignees() {
  const selects = [document.getElementById('loAssignee'), document.getElementById('taskAssignee')];
  try {
    const members = await airtableList(TEAM_TABLE, {
      fields: ['Name'],
      filterByFormula: '{Active}=1',
    });
    members.sort((a, b) => (a.fields.Name || '').localeCompare(b.fields.Name || ''));
    TEAM_NAMES = {};
    selects.forEach(sel => { if (sel) sel.innerHTML = '<option value="">— unassigned —</option>'; });
    members.forEach(m => {
      const name = m.fields.Name || '(unnamed)';
      TEAM_NAMES[m.id] = name;
      selects.forEach(sel => {
        if (!sel) return;
        const o = document.createElement('option');
        o.value = m.id;
        o.textContent = name;
        sel.appendChild(o);
      });
    });
  } catch (err) {
    // Non-fatal: leave the "unassigned" option so tickets can still be created.
    console.error('Failed to load assignees:', err);
  }
}

let state = {
  route: null,
  loType: null, loPriority: null, loDate: '', loAssignee: '',
  taskProject: '', taskProjectName: '', taskMilestone: '', taskMilestoneName: '',
  taskType: null, taskPriority: null, taskEffort: '', taskAssignee: '', taskStart: '', taskDue: '',
  description: '', claudeDraft: null, refinementNotes: [], attachments: [],
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
    if (state.loAssignee) fields['Assignee'] = [state.loAssignee];
  } else {
    fields = { 'Task Name': draft.name || 'Untitled', 'Description': finalDescription || '', 'Task Type': state.taskType || 'Work Ticket', 'Priority': state.taskPriority || 'Medium', 'Status': 'Not Started', 'Related Milestone': [state.taskMilestone] };
    if (state.taskEffort) fields['Effort Size'] = state.taskEffort;
    if (state.taskAssignee) fields['Assignee'] = [state.taskAssignee];
    if (state.taskStart) fields['Start date'] = state.taskStart;
    if (state.taskDue) fields['Due Date'] = state.taskDue;
  }
  try {
    const res = await fetch('/api/airtable', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baseId: dest.baseId, tableId: dest.tableId, fields }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || JSON.stringify(data.error) || 'Airtable error');

    let attachFailures = 0;
    if (state.attachments.length > 0) {
      btn.textContent = 'Uploading attachments...';
      attachFailures = await uploadAttachments(dest, data.id);
    }

    const base = isLO ? 'Added to LO Work Items in Project Dashboard.' : `Added to Task Tracker under "${state.taskMilestoneName}".`;
    document.getElementById('successSub').textContent = base + attachmentSummary(attachFailures);
    document.getElementById('successId').textContent = 'Record ID: ' + data.id;
    document.getElementById('successLink').href = `https://airtable.com/${dest.baseId}/${dest.tableId}/${data.id}`;
    showStep('success');
  } catch (err) {
    btn.disabled = false; btn.textContent = 'Create Ticket ✓';
    alert('Submission failed: ' + err.message);
  }
}

// Uploads each attachment to the new record sequentially (Airtable's
// uploadAttachment endpoint appends, so parallel calls can race). Returns the
// number of failures — the ticket itself is already created either way.
async function uploadAttachments(dest, recordId) {
  let failures = 0;
  for (const a of state.attachments) {
    try {
      const file = await blobToBase64(a.blob);
      const up = await fetch('/api/upload', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseId: dest.baseId, recordId, fieldId: dest.attachmentFieldId, filename: a.name, contentType: a.type, file })
      });
      if (!up.ok) failures++;
    } catch (_) { failures++; }
  }
  return failures;
}

function attachmentSummary(failures) {
  const total = state.attachments.length;
  if (total === 0) return '';
  const ok = total - failures;
  return failures === 0
    ? ` ${ok} attachment${ok !== 1 ? 's' : ''} uploaded.`
    : ` ${ok} of ${total} attachments uploaded — ${failures} failed.`;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ---- Attachment picker (Step 2) ----

function setupUploads() {
  const dz = document.getElementById('dropZone');
  const input = document.getElementById('fileInput');
  if (!dz || !input) return;
  dz.addEventListener('click', () => input.click());
  input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });
  ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('dragover'); }));
  ['dragleave', 'dragend'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('dragover'); }));
  dz.addEventListener('drop', e => {
    e.preventDefault();
    dz.classList.remove('dragover');
    if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
  });
}

async function addFiles(fileList) {
  for (const file of Array.from(fileList)) {
    if (!file.type.startsWith('image/')) { alert(`"${file.name}" isn't an image — skipped.`); continue; }
    let chosen = file;
    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      try {
        const smaller = await downscaleImage(file);
        if (smaller && smaller.size < file.size) chosen = smaller;
      } catch (_) { /* keep original on any failure */ }
    }
    if (chosen.size > MAX_ATTACH_BYTES) {
      alert(`"${file.name}" is ${(chosen.size / 1048576).toFixed(1)} MB, over the 2.5 MB limit even after resizing. Please shrink it and try again.`);
      continue;
    }
    state.attachments.push({ id: ++attachIdCounter, blob: chosen, name: file.name, type: chosen.type || file.type, url: URL.createObjectURL(chosen) });
  }
  renderAttachments();
}

// Draws the image onto a canvas scaled so its longest edge is MAX_IMAGE_DIMENSION.
// Returns null when no downscale is needed (image already small enough).
function downscaleImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
      if (scale === 1) { resolve(null); return; }
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(b => resolve(b), 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(objUrl); reject(new Error('image load failed')); };
    img.src = objUrl;
  });
}

function renderAttachments() {
  const list = document.getElementById('attachmentList');
  if (!list) return;
  list.innerHTML = '';
  state.attachments.forEach(a => {
    const div = document.createElement('div');
    div.className = 'attachment-item';
    div.innerHTML = `<img class="attachment-thumb" src="${a.url}" alt=""><div class="attachment-name">${escHtml(a.name)}</div><button class="attachment-remove" title="Remove" type="button">✕</button>`;
    div.querySelector('.attachment-remove').addEventListener('click', () => removeAttachment(a.id));
    list.appendChild(div);
  });
}

function removeAttachment(id) {
  const idx = state.attachments.findIndex(a => a.id === id);
  if (idx >= 0) {
    URL.revokeObjectURL(state.attachments[idx].url);
    state.attachments.splice(idx, 1);
    renderAttachments();
  }
}

function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function startOver() {
  state.attachments.forEach(a => URL.revokeObjectURL(a.url));
  state = { route: null, loType: null, loPriority: null, loDate: '', loAssignee: '', taskProject: '', taskProjectName: '', taskMilestone: '', taskMilestoneName: '', taskType: null, taskPriority: null, taskEffort: '', taskAssignee: '', taskStart: '', taskDue: '', description: '', claudeDraft: null, refinementNotes: [], attachments: [] };
  renderAttachments();
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
setupUploads();
loadProjectsAndMilestones();
loadAssignees();
