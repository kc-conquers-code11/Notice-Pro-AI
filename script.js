// === NOTICE FLOW AI –  /* PROPERLY FORMATTED, COMMENTED AND STRUCTURED BY THE CREATORS OF EDUSYNC */


// --- 1. CONFIGURATION DATA ---
const SIGNATORY_ROLES = {
  'Principal': 'Principal, VPPCOE and VA',
  'HOD': 'Dr. Rais A. Mulla, HOD, Computer Engineering Dept.',
  'Academic_Coordinator': 'Prof. Atul Shintre, Academic Coordinator',
  'Exam_Coordinator': 'Exam Coordinator, VPPCOE'
};
const SIGNATORIES_KEY = "notice_signatories_ai";

// --- 2. ELEMENT REFERENCES ---
const toggle = document.getElementById('templateToggle');
const label = document.getElementById('templateLabel');
const generateBtn = document.querySelector(".generate-btn");
const outputSection = document.getElementById("output-section");
const noticeTitle = document.getElementById("notice-title");
const noticeSubjectHeader = document.getElementById("notice-subject-header");
const noticeText = document.getElementById("notice-text");
const noticeRefNum = document.getElementById("notice-ref-num");
const noticeDate = document.getElementById("notice-date");
const signaturesArea = document.getElementById("signatures-area");

// === GLOBAL STATE ===
let allSignatoriesList = [];
let selectedSignatoryNames = [];

// --- 3. TOGGLES & THEME ---
toggle.addEventListener('change', () => {
  label.textContent = toggle.checked ? 'Circular' : 'Notice';
});
document.getElementById('theme-switch').addEventListener('change', function () {
  document.body.setAttribute('data-theme', this.checked ? 'dark' : 'light');
});

// --- 4. SIGNATORY DATA HELPERS ---
function loadSignatories() {
  const data = localStorage.getItem(SIGNATORIES_KEY);
  if (!data) {
    // Provide default signatories
    return [
      { name: "Principal", img: null },
      { name: "HOD", img: null },
      { name: "Exam_Coordinator", img: null },
      { name: "Academic_Coordinator", img: null }
    ];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}
function saveSignatories(list) {
  localStorage.setItem(SIGNATORIES_KEY, JSON.stringify(list));
}

// --- 5. SIGNATORY SELECT/DROPDOWN & TABLE ---
function renderSignatorySelect(list, selectedArr) {
  const select = document.getElementById('signatories');
  if (!select) return;
  select.innerHTML = "";
  list.forEach((s) => {
    const opt = document.createElement('option');
    opt.value = s.name;
    opt.textContent = SIGNATORY_ROLES[s.name] || s.name;
    opt.selected = selectedArr.includes(s.name);
    select.appendChild(opt);
  });
}
function renderSignatoryTable(list, selectedArr) {
  const table = document.getElementById('signatory-table');
  if (!table) return;
  table.innerHTML = '';
  selectedArr.forEach((name, idx) => {
    const found = list.find(x => x.name === name);
    const imgSrc = found ? found.img : null;

    const row = document.createElement('div');
    row.classList.add('signatory-row');

    // Name
    const n = document.createElement('span');
    n.className = 'signatory-name';
    n.textContent = SIGNATORY_ROLES[name] || name;

    // Upload
    const label = document.createElement('label');
    label.className = 'sign-upload-label';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.className = 'sign-upload-input';
    fileInput.onchange = async () => {
      let file = fileInput.files[0];
      if (file) {
        let reader = new FileReader();
        reader.onload = ev => {
          found.img = ev.target.result;
          saveSignatories(list);
          render();
        };
        reader.readAsDataURL(file);
      }
    };
    const btnSpan = document.createElement('span');
    btnSpan.className = 'sign-upload-btn';
    btnSpan.textContent = imgSrc ? 'Change Signature' : 'Upload Signature';
    label.appendChild(fileInput);
    label.appendChild(btnSpan);

    // Preview
    const img = document.createElement('img');
    img.className = 'signatory-preview-img';
    img.src = imgSrc || '';
    img.alt = name + " Signature";
    img.style.display = imgSrc ? 'inline-block' : 'none';

    // Delete
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-signatory-btn';
    delBtn.innerHTML = '×';
    delBtn.title = "Delete signatory";
    delBtn.onclick = () => {
      selectedArr.splice(idx, 1);
      render();
    };

    row.append(n, label, img, delBtn);
    table.appendChild(row);
  });
}

// --- 6. ADD/DELETE SIGNATORY HANDLER ---
document.getElementById("add-signatory-btn")?.addEventListener("click", async () => {
  const nameInput = document.getElementById("new-signatory-name");
  const name = nameInput.value.trim();
  if (!name) return alert("Enter signatory name");

  const fileInput = document.getElementById("new-signature-upload");
  let img = null;
  if (fileInput.files && fileInput.files.length > 0) {
    img = await toDataUrl(fileInput.files[0]);
  } else {
    // fallback: from drawing canvas
    const canvas = document.getElementById("signature-canvas");
    if (canvas) {
      const blank = document.createElement("canvas");
      blank.width = canvas.width;
      blank.height = canvas.height;
      if (canvas.toDataURL() !== blank.toDataURL()) img = canvas.toDataURL();
    }
  }
  // Check if signatory already exists
  const existing = allSignatoriesList.find(x => x.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.img = img;
  } else {
    allSignatoriesList.push({ name, img });
  }
  saveSignatories(allSignatoriesList);
  selectedSignatoryNames.push(name);
  render();
  nameInput.value = "";
  fileInput.value = "";
  const ctx = document.getElementById("signature-canvas")?.getContext("2d");
  if (ctx) ctx.clearRect(0, 0, 300, 100);
});

// --- 7. SIGNATURE CANVAS LOGIC ---
const canvas = document.getElementById("signature-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let drawing = false;

  canvas.addEventListener("mousedown", e => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });
  canvas.addEventListener("mouseup", () => (drawing = false));
  canvas.addEventListener("mouseleave", () => (drawing = false));
  canvas.addEventListener("mousemove", e => {
    if (!drawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#222";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });

  document.getElementById("clear-signature")?.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}

// --- 8. SIGNATORY SELECTION CHANGES ---
document.getElementById('signatories').addEventListener('change', function () {
  selectedSignatoryNames = Array.from(this.selectedOptions).map(opt => opt.value);
  render();
});

// --- 9. NOTICE GENERATION ---
async function generateNotice() {
  const title = document.getElementById("title").value.trim();
  const summary = document.getElementById("summary").value.trim();
  const ref_number_input = document.getElementById("ref_number").value.trim();
  if (!title || !summary || selectedSignatoryNames.length === 0) {
    alert("Please enter Title, Summary, and select at least one Signatory!");
    return;
  }
  generateBtn.textContent = "🧠 Generating...";
  generateBtn.disabled = true;
  outputSection.classList.add("hidden");

  try {
    const response = await fetch('http://localhost:3000/generate-notice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        summary,
        sign: selectedSignatoryNames.join(', '),
        type: toggle.checked ? "Circular" : "Notice"
      })
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    const generatedText = data.text || summary;
    const today = new Date().toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric"
    });
    const refNum =
      ref_number_input === "VPP/Trust-Office/2025-26/AUTO"
        ? generateRefNumber()
        : ref_number_input;

    noticeSubjectHeader.textContent = (toggle.checked ? "CIRCULAR" : "NOTICE");
    noticeTitle.textContent = title;
    noticeRefNum.textContent = refNum;
    noticeDate.textContent = today;
    noticeText.innerHTML = generatedText.replace(/\n/g, "<br>");
    renderSignatures();
    outputSection.classList.remove("hidden");
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  } catch (err) {
    alert("Error generating notice: " + err.message);
    console.error(err);
  } finally {
    generateBtn.textContent = "Generate Notice";
    generateBtn.disabled = false;
  }
}

// --- 10. SIGNATURES RENDERING FOR FINAL OUTPUT ---
function renderSignatures() {
  signaturesArea.innerHTML = "";
  if (!selectedSignatoryNames.length) return;
  // Principal always last for policy
  const ordered = [...selectedSignatoryNames].sort((a, b) => {
    if (a === 'Principal') return 1;
    if (b === 'Principal') return -1;
    return 0;
  });
  if (ordered.length === 1)
    signaturesArea.classList.add('single-signature');
  else
    signaturesArea.classList.remove('single-signature');

  ordered.forEach(name => {
    const s = allSignatoriesList.find(x => x.name === name);
    const fullRole = SIGNATORY_ROLES[name] || name;
    const [namePart, ...rest] = fullRole.split(',');
    const div = document.createElement("div");
    div.className = "signature-block";
    div.innerHTML = `
      ${s && s.img ? `<img src="${s.img}" class="signature-image" alt="${namePart.trim()} Signature">` : ""}
      <p class="signature-name">${namePart.trim()}</p>
      <p class="signature-role">${rest.join(', ').trim()}</p>
    `;
    signaturesArea.appendChild(div);
  });
}

// --- 11. REF NUMBER GENERATOR ---
function generateRefNumber() {
  let counter = parseInt(localStorage.getItem('noticeCounter')) || 207;
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const yearString = `${currentYear % 100}-${nextYear % 100}`;
  const newRef = `VPP/Trust-Office/${yearString}/${counter}`;
  localStorage.setItem('noticeCounter', counter + 1);
  return newRef;
}

// --- 12. HELPER FOR IMAGE DATA URL ---
function toDataUrl(file) {
  return new Promise(res => {
    const reader = new FileReader();
    reader.onload = e => res(e.target.result);
    reader.readAsDataURL(file);
  });
}

// --- 13. PDF EXPORT ---
function downloadPDF() {
  const notice = document.getElementById("notice-template");
  if (!notice) return alert("Notice template not found.");

  const title = document.getElementById("title").value.trim() || "College_Notice";
  const cleanName = title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).replace(/\s/g, "");
  const fileName = `${cleanName}_${today}.pdf`;

  // Force light mode
  const previousTheme = document.body.getAttribute("data-theme");
  document.body.setAttribute("data-theme", "light");
  document.body.style.background = "#ffffff";

  // Hide interface elements
  const controls = notice.querySelectorAll('.delete-btn, .drag-btn, .sign-upload-input, .sign-upload-btn, .signatory-checkbox');
  controls.forEach(ctrl => (ctrl.style.display = "none"));

  // Remove outlines/borders for export
  const editableElements = notice.querySelectorAll('[contenteditable="true"]');
  const prevStyles = Array.from(editableElements).map(el => ({
    el,
    border: el.style.border,
    bg: el.style.backgroundColor,
    color: el.style.color,
    outline: el.style.outline
  }));
  editableElements.forEach(el => {
    el.style.border = "none";
    el.style.backgroundColor = "transparent";
    el.style.color = "#000"; // ensure black text
    el.style.outline = "none";
  });

  // PDF Export Options
  const opt = {
    margin: 0.4,
    filename: fileName,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().set(opt).from(notice).save().then(() => {
    controls.forEach(ctrl => (ctrl.style.display = ""));
    prevStyles.forEach(({ el, border, bg, color, outline }) => {
      el.style.border = border;
      el.style.backgroundColor = bg;
      el.style.color = color;
      el.style.outline = outline;
    });

    // Restore previous theme
    if (previousTheme) document.body.setAttribute("data-theme", previousTheme);
  }).catch(err => {
    alert("Error while saving PDF: " + err.message);
    if (previousTheme) document.body.setAttribute("data-theme", previousTheme);
  });
}

// --- 14. DOCX EXPORT ---
function downloadDOCX() {
  const notice = document.getElementById("notice-template");
  if (!notice) return alert("Notice not found.");
  const title = document.getElementById("title").value.trim() || "College_Notice";
  const cleanName = title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).replace(/\s/g, "");
  const fileName = `${cleanName}_${today}.docx`;

  // Clone notice for DOCX export
  const clonedNotice = notice.cloneNode(true);
  // Make sure header image is included
  const headerImg = clonedNotice.querySelector('.official-header img');
  if (headerImg) {
    headerImg.setAttribute('crossorigin', 'anonymous');
    headerImg.src = headerImg.src; // ensure same origin
  }
  // Inline minimal Word styling
  const htmlContent = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8">
    <title>${cleanName}</title>
    <style>
      body { font-family: 'Times New Roman', serif; margin: 1in; }
      .notice { border: none; box-shadow: none; }
      h3, p { margin: 0 0 8px 0; }
      .signature-name { font-weight: bold; margin-top: 10px; border-top: 1px solid #000; display:inline-block; }
      .signature-role { font-size: 0.9em; color: #333; }
      .official-header img { width:100%; height:auto; display:block; margin-bottom:10px; }
      ol { padding-left:20px; }
    </style>
  </head>
  <body>${clonedNotice.innerHTML}</body>
  </html>`;

  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --- 15. EDIT MODE ---
function editNotice() {
  outputSection.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// --- 16. MAIN RENDER FUNCTION ---
function render() {
  renderSignatorySelect(allSignatoriesList, selectedSignatoryNames);
  renderSignatoryTable(allSignatoriesList, selectedSignatoryNames);
}

// --- 17. WINDOW EXPORTS ---
window.generateNotice = generateNotice;
window.downloadPDF = downloadPDF;
window.downloadDOCX = downloadDOCX;
window.editNotice = editNotice;

// --- 18. INIT ON DOM CONTENT LOADED ---
window.addEventListener("DOMContentLoaded", () => {
  allSignatoriesList = loadSignatories();
  // Set default selected as all signatory names if not present
  if (!selectedSignatoryNames.length) {
    selectedSignatoryNames = allSignatoriesList.map(x => x.name);
  }
  render();
});


// --- DELETE SIGNATORY FROM DROPDOWN BUTTON HANDLER ---
// Assuming you have a button with id 'delete-signatory-btn' for this action
document.getElementById('delete-signatory-btn')?.addEventListener('click', () => {
  const select = document.getElementById('signatories');
  if (!select) return;
  const selectedOptions = Array.from(select.selectedOptions);

  if (selectedOptions.length === 0) {
    alert("Please select at least one signatory to delete.");
    return;
  }

  if (!confirm(`Delete ${selectedOptions.length} selected signatory(s)?`)) return;

  // Load current saved signatories
  let list = loadSignatories();

  // Remove selected signatories from data list and update state
  selectedOptions.forEach(opt => {
    // Remove from signatories list
    const idx = list.findIndex(s => s.name === opt.value);
    if (idx > -1) list.splice(idx, 1);

    // Remove from currently selected names
    selectedSignatoryNames = selectedSignatoryNames.filter(name => name !== opt.value);
  });

  // Save updated list
  saveSignatories(list);
  allSignatoriesList = list; // Also update global list

  // Re-render selects and tables with updated data
  renderSignatorySelect(allSignatoriesList, selectedSignatoryNames);
  renderSignatoryTable(allSignatoriesList, selectedSignatoryNames);
});
