// ===== Loader =====
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 900);
});

// ===== Theme toggle (warm + dark) =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('hope-theme');
if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  html.setAttribute('data-theme', 'dark');
}
themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('hope-theme', next);
});

// ===== Mobile menu =====
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const navBackdrop = document.getElementById('navBackdrop');

function openMenu() {
  nav.classList.add('open');
  menuBtn.classList.add('active');
  navBackdrop.classList.add('visible');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  nav.classList.remove('open');
  menuBtn.classList.remove('active');
  navBackdrop.classList.remove('visible');
  document.body.style.overflow = '';
}
menuBtn.addEventListener('click', () => {
  nav.classList.contains('open') ? closeMenu() : openMenu();
});
navBackdrop.addEventListener('click', closeMenu);
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
});

// ===== Back to top =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Rotating welcome message =====
const welcomeMessages = [
  "Welcome. You are safe here.",
  "Take your time. There’s no rush.",
  "It’s okay to arrive exactly as you are.",
  "This space is for the quiet middle part.",
  "You don’t have to have it all figured out."
];
const welcomeEl = document.getElementById('welcomeMessage');
let welcomeIndex = 0;
setInterval(() => {
  welcomeIndex = (welcomeIndex + 1) % welcomeMessages.length;
  welcomeEl.style.opacity = '0';
  setTimeout(() => {
    welcomeEl.textContent = welcomeMessages[welcomeIndex];
    welcomeEl.style.opacity = '1';
  }, 400);
}, 5000);

// ===== Daily quote =====
const quotes = [
  "The dream doesn’t need you to be perfect. It just needs you to not put it down completely.",
  "Some days the only progress is not giving up. That still counts.",
  "You don’t have to feel hopeful to keep going. You just have to keep going.",
  "Rest is not the same as quitting. Protect your energy.",
  "The fact that you still care means the dream is still alive.",
  "Small steps taken on heavy days are the bravest ones.",
  "You are allowed to start again as many times as you need.",
  "Comparison steals the quiet joy of your own pace."
];
const quoteEl = document.getElementById('dailyQuote');
const today = new Date().toDateString();
const storedQuote = JSON.parse(localStorage.getItem('hope-daily-quote') || '{}');
if (storedQuote.date === today && storedQuote.quote) {
  quoteEl.textContent = `“${storedQuote.quote}”`;
} else {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  quoteEl.textContent = `“${q}”`;
  localStorage.setItem('hope-daily-quote', JSON.stringify({ date: today, quote: q }));
}

// ===== How are you feeling =====
const feelingMessages = {
  hopeful: "It’s beautiful that belief is returning. Protect that small flame. You don’t have to rush it — just keep it alive.",
  tired: "You don’t have to figure everything out today. Rest. You have permission to take a break. The dream can wait while you breathe.",
  confused: "Not knowing what comes next is part of the path. You don’t need the whole map. One honest next step is enough.",
  discouraged: "Struggling to believe in yourself doesn’t mean the dream is gone. It means you’re human. Be gentle with the part of you that is still trying."
};

document.querySelectorAll('.feel-card').forEach(card => {
  card.addEventListener('click', () => {
    const feeling = card.dataset.feeling;
    document.getElementById('feelGrid').style.display = 'none';
    const response = document.getElementById('feelResponse');
    document.getElementById('feelMessage').textContent = feelingMessages[feeling];
    response.hidden = false;
  });
});
document.getElementById('feelReset').addEventListener('click', () => {
  document.getElementById('feelResponse').hidden = true;
  document.getElementById('feelGrid').style.display = '';
});

// ===== Editable personal note =====
const editBtn = document.getElementById('editNoteBtn');
const personalNote = document.getElementById('personalNote');
const personalText = document.getElementById('personalText');
const authorName = document.getElementById('authorName');
const footerName = document.getElementById('footerName');
let isEditing = false;

editBtn.addEventListener('click', () => {
  isEditing = !isEditing;
  if (isEditing) {
    personalText.contentEditable = 'true';
    authorName.contentEditable = 'true';
    personalNote.classList.add('editing');
    editBtn.textContent = 'Save';
    personalText.focus();
  } else {
    personalText.contentEditable = 'false';
    authorName.contentEditable = 'false';
    personalNote.classList.remove('editing');
    editBtn.textContent = 'Edit';
    footerName.textContent = authorName.textContent.trim() || '[Your Name]';
    localStorage.setItem('hope-personal-text', personalText.innerHTML);
    localStorage.setItem('hope-author-name', authorName.textContent.trim());
  }
});
const savedText = localStorage.getItem('hope-personal-text');
const savedName = localStorage.getItem('hope-author-name');
if (savedText) personalText.innerHTML = savedText;
if (savedName) {
  authorName.textContent = savedName;
  footerName.textContent = savedName;
}

// ===== Save & Copy reminders =====
const saveButtons = document.querySelectorAll('.save-btn');
const savedPanel = document.getElementById('savedPanel');
const savedList = document.getElementById('savedList');
let savedReminders = JSON.parse(localStorage.getItem('hope-saved-reminders') || '[]');



saveButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.reminder');
    const id = card.dataset.id;
    const title = card.querySelector('h3').textContent;
    const text = card.querySelector('p').textContent;
    const idx = savedReminders.findIndex(r => r.id === id);
    if (idx > -1) savedReminders.splice(idx, 1);
    else savedReminders.push({ id, title, text });
    localStorage.setItem('hope-saved-reminders', JSON.stringify(savedReminders));
    updateSavedUI();
  });
});
document.getElementById('clearSaved').addEventListener('click', () => {
  savedReminders = [];
  localStorage.removeItem('hope-saved-reminders');
  updateSavedUI();
});
updateSavedUI();

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const card = btn.closest('.reminder');
    const fullText = `${card.querySelector('h3').textContent}\n${card.querySelector('p').textContent}`;
    try {
      await navigator.clipboard.writeText(fullText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = fullText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    btn.classList.add('copied');
    btn.setAttribute('title', 'Copied!');
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.setAttribute('title', 'Copy this reminder');
    }, 1500);
  });
});

// ===== Letter to future self =====
const letterText = document.getElementById('letterText');
const letterDate = document.getElementById('letterDate');
const saveLetterBtn = document.getElementById('saveLetter');
const letterStatus = document.getElementById('letterStatus');
const savedLetterBox = document.getElementById('savedLetter');
const savedLetterPreview = document.getElementById('savedLetterPreview');
const savedLetterMeta = document.getElementById('savedLetterMeta');

// Set min date to tomorrow
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
letterDate.min = tomorrow.toISOString().split('T')[0];

function loadLetter() {
  const data = JSON.parse(localStorage.getItem('hope-future-letter') || 'null');
  if (!data) return;
  savedLetterBox.hidden = false;
  savedLetterPreview.textContent = data.text;
  savedLetterMeta.textContent = data.openDate
    ? `To be opened on ${data.openDate}`
    : 'No open date set';
  // Check if today is the open date
  if (data.openDate && data.openDate === new Date().toISOString().split('T')[0]) {
    letterStatus.hidden = false;
    letterStatus.textContent = 'Today is the day you chose to open this letter.';
  }
}
loadLetter();

saveLetterBtn.addEventListener('click', () => {
  const text = letterText.value.trim();
  if (!text) {
    letterStatus.hidden = false;
    letterStatus.textContent = 'Write something first.';
    letterStatus.style.color = '#c45c5c';
    return;
  }
  const data = {
    text,
    openDate: letterDate.value || null,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem('hope-future-letter', JSON.stringify(data));
  letterStatus.hidden = false;
  letterStatus.style.color = '';
  letterStatus.textContent = 'Letter saved. It will wait for you.';
  loadLetter();
  letterText.value = '';
  letterDate.value = '';
});

document.getElementById('deleteLetter').addEventListener('click', () => {
  localStorage.removeItem('hope-future-letter');
  savedLetterBox.hidden = true;
  letterStatus.hidden = true;
});

// ===== Community filters =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('#communityStories .story').forEach(story => {
      if (filter === 'all' || story.dataset.category === filter) {
        story.classList.remove('hidden');
      } else {
        story.classList.add('hidden');
      }
    });
  });
});

// ===== Share form validation =====
const storyName = document.getElementById('storyName');
const storyAge = document.getElementById('storyAge');

// Name: letters, spaces, accents, apostrophes, hyphens, periods only
storyName.addEventListener('input', () => {
  const cleaned = storyName.value.replace(/[^A-Za-zÀ-ÿ\s.'-]/g, '');
  if (storyName.value !== cleaned) {
    storyName.value = cleaned;
    storyName.classList.add('invalid');
    setTimeout(() => storyName.classList.remove('invalid'), 600);
  }
});

// Age: numbers only
storyAge.addEventListener('input', () => {
  const cleaned = storyAge.value.replace(/[^0-9]/g, '');
  if (storyAge.value !== cleaned) {
    storyAge.value = cleaned;
    storyAge.classList.add('invalid');
    setTimeout(() => storyAge.classList.remove('invalid'), 600);
  }
});

document.getElementById('shareForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  success.hidden = false;
  e.target.reset();
  setTimeout(() => { success.hidden = true; }, 4000);
});

// ===== Scroll animations =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

document.querySelectorAll(
  '.reminder, .story, .action-card, .why-card, .personal-note, .share-form, .how-to-box, .feel-card, .hard-step, .path-card, .letter-box'
).forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});


// ===== Scroll progress bar =====
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = progress + '%';
}, { passive: true });

// ===== Onboarding tooltip (first visit) =====

// ===== Onboarding tooltip (first visit) =====
const onboardingTip = document.getElementById('onboardingTip');
const dismissTip = document.getElementById('dismissTip');

let onboardingTimer;

if (onboardingTip && dismissTip) {
  const hasSeenTip = localStorage.getItem('hope-onboarding-seen');

  if (hasSeenTip) {
    onboardingTip.hidden = true;
  } else {
    onboardingTimer = setTimeout(() => {
      onboardingTip.hidden = false;
    }, 1800);
  }

  dismissTip.addEventListener('click', () => {
    clearTimeout(onboardingTimer);
    onboardingTip.hidden = true;
    localStorage.setItem('hope-onboarding-seen', '1');
  });
}


// ===== Improved saved reminders empty state =====
function updateSavedUI() {
  const saveButtons = document.querySelectorAll('.save-btn');
  const savedPanel = document.getElementById('savedPanel');
  const savedList = document.getElementById('savedList');

  saveButtons.forEach(btn => {
    const id = btn.closest('.reminder').dataset.id;
    btn.classList.toggle('saved', savedReminders.some(r => r.id === id));
  });

  if (!savedPanel) return;

  if (savedReminders.length === 0) {
    savedPanel.classList.remove('has-items');
    if (savedList) savedList.innerHTML = '';
  } else {
    savedPanel.classList.add('has-items');
    savedList.innerHTML = savedReminders.map(r =>
      `<div class="saved-item"><strong>${r.title}</strong> — ${r.text}</div>`
    ).join('');
  }
}

// ===== Print saved reminders =====
const printBtn = document.getElementById('printReminders');
if (printBtn) {
  printBtn.addEventListener('click', () => {
    if (savedReminders.length === 0) return;
    const printArea = document.getElementById('printArea');
    printArea.innerHTML = `
      <h1>HOPE — Saved Reminders</h1>
      <p style="margin-bottom:1.5rem;color:#555;">A few truths worth keeping.</p>
      ${savedReminders.map(r => `
        <div class="print-item">
          <h3>${r.title}</h3>
          <p>${r.text}</p>
        </div>
      `).join('')}
      <p style="margin-top:2rem;font-size:0.85rem;color:#888;">From the HOPE website</p>
    `;
    printArea.hidden = false;
    window.print();
    setTimeout(() => { printArea.hidden = true; printArea.innerHTML = ''; }, 500);
  });
}

// ===== Download future letter as .txt =====
const downloadLetterBtn = document.getElementById('downloadLetter');
if (downloadLetterBtn) {
  downloadLetterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem('hope-future-letter') || 'null');
    if (!data || !data.text) {
      alert('Save a letter first, then you can download it.');
      return;
    }
    const openLine = data.openDate ? `Open on: ${data.openDate}\n\n` : '';
    const fileContent = `Letter to my future self\n${'='.repeat(28)}\n\n${openLine}${data.text}\n\n— Written from HOPE`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'letter-to-future-me.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

