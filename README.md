#  Notice Flow AI v2  
**Smart Institutional Notice & Circular Generator**

---

##  Overview  
**Notice Flow AI v2** is an intelligent web-based system that enables colleges and organizations to **create, customize, and export official notices or circulars** within minutes.  

The tool automates document formatting, integrates signatory management (with digital signatures), and supports one-click **PDF/DOCX exports** — providing a professional and consistent output aligned with institutional standards.

---

##  Core Features  

###  **1. AI-Driven Notice Generation**  
- Auto-generates formatted notice text via a **local AI server (`generate-notice` endpoint)**.  
- Supports both *Notice* and *Circular* templates.  
- Dynamically fills **Reference Number**, **Date**, and **Subject** fields.  

###  **2. Advanced Signatory Manager**  
- Add, upload, or delete signatories with live table updates.  
- Upload signature images directly or draw using a signature canvas.  
- Signatories persist in **localStorage**, eliminating re-entry on reload.  
- Integrated **delete button** beside dropdown for quick removal.  

###  **3. Modern Interface & Dual Themes**  
- Elegant **Playfair Display + Roboto** typography.  
- Clean, card-based layout with smooth transitions.  
- Supports **Dark/Light Mode toggle** for accessibility.  

###  **4. Export Options**  
- **PDF Export:** Clean, print-ready official format via `html2pdf.js`.  
- **Word (.docx) Export:** Preserves layout for institutional editing.  
- Auto-formats header banners and signatures in both outputs.  

###  **5. Persistent Local Storage**  
- All signatories, roles, and signatures stored in the browser.  
- Safe reloads: data remains intact across sessions.  

---

##  Project Structure  
Notice Flow AI v2/
│
├── index.html # Main UI layout and structure
├── newstyle.css # Theme, layout, and responsive design
├── perplexcity.js # Core application logic (AI + UI)
├── server.js # Local backend for AI text generation (Node.js with Gemini API)
├── README.md # Project documentation
└── /assets/
└── headerBanner.jpg # Official institutional header



---

##  Setup Instructions  

### Prerequisites  
- **Node.js** (v16+ recommended)  
- **VS Code / Browser** (Chrome, Edge, or Brave)  

### Local AI Backend Setup  
1. Open the folder in VS Code.  
2. Navigate to the server folder:  
   ```bash
   cd server
   npm install
3.Start the server:

      npm start


4.You should see:

> > smartnotice-pro-server@1.0.0 start
> node server.js
SmartNotice Backend running on http://localhost:3000


## Frontend Usage

Open index.html directly in your browser.

Fill in all notice fields.

Select signatories and upload their signatures.

Click Generate Notice to preview.

Export as PDF or DOCX with one click.


## Developer Guide
 Built With
Component	Technology
Frontend UI	HTML5, CSS3 (Flexbox + Transitions)
Logic / State	Vanilla JavaScript (Event-driven)
Backend AI	Node.js (Express server)
Exports	html2pdf.js & Custom HTML-to-Word engine
Storage	Browser LocalStorage
Fonts	Playfair Display, Roboto

##Screenshot 

Screenshots to be added later

Interface	Description
 Dashboard	Notice creation and input form
 Signatory Table	Role selection, signature upload, and delete button
 Dark Mode	Enhanced readability in low-light environments
 Generated Notice	Final formatted output ready for export

## Developer Notes

All signatory edits auto-sync with dropdown & table.

Exports are optimized for print fidelity and document standards.

Uses data URLs for signature image embedding in exports.

Modular code for future integration with institutional APIs or cloud storage.

## Contributors & Credits

Project Lead: —KC
Development: Frontend + Backend integration using Vanilla JS & Node.js
Design: Modern institutional document aesthetic, dark/light adaptive theme
Special Thanks: VPPCOE Faculty & Dept. of Computer Engineering