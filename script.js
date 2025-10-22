/* script.js
   Nav toggle, reveal-on-scroll, quiz logic, year insertion
*/

(() => {
  // Insert year in all year spans
  const years = ['year-home','year-topics','year-quiz'];
  const y = new Date().getFullYear();
  years.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = y;
  });

  // Accessible nav toggle
  const navToggle = document.querySelectorAll('.nav-toggle');
  navToggle.forEach(btn => {
    btn.addEventListener('click', () => {
      const header = btn.closest('.site-header');
      if (!header) return;
      const nav = header.querySelector('.nav');
      if (!nav) return;
      const isOpen = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // Reveal on scroll using IntersectionObserver
  const toReveal = document.querySelectorAll('.reveal, .animate-up, .animate-zoom');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('revealed');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    toReveal.forEach(el => io.observe(el));
  } else {
    // fallback
    toReveal.forEach(el => el.classList.add('revealed'));
  }

  // QUIZ logic
  function initQuiz() {
    const quizCards = Array.from(document.querySelectorAll('.quiz-card'));
    let answeredCount = 0;
    let correctCount = 0;

    function updateScore() {
      const scorePanel = document.getElementById('quiz-score');
      if (!scorePanel) return;
      scorePanel.textContent = `Score: ${correctCount} / ${quizCards.length}`;
    }

    quizCards.forEach(card => {
      const choices = Array.from(card.querySelectorAll('.choice'));
      const feedback = card.querySelector('.feedback');

      choices.forEach(btn => {
        btn.addEventListener('click', () => {
          // ignore if already answered
          if (card.dataset.answered === 'true') return;
          card.dataset.answered = 'true';
          const isCorrect = btn.getAttribute('data-correct') === 'true';

          // disable and mark correct/wrong
          choices.forEach(c => {
            c.disabled = true;
            if (c.getAttribute('data-correct') === 'true') c.classList.add('correct');
          });
          if (!isCorrect) btn.classList.add('wrong');

          answeredCount++;
          if (isCorrect) correctCount++;

          feedback.textContent = isCorrect ? 'Nice — that’s correct!' : 'Not quite — review the topics and try again.';
          updateScore();
        });
      });
    });

    // Reset quiz
    const resetBtn = document.getElementById('resetQuiz');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        quizCards.forEach(card => {
          card.dataset.answered = 'false';
          const choices = Array.from(card.querySelectorAll('.choice'));
          const feedback = card.querySelector('.feedback');
          feedback.textContent = '';
          choices.forEach(c => {
            c.disabled = false;
            c.classList.remove('correct','wrong');
          });
        });
        answeredCount = 0;
        correctCount = 0;
        updateScore();
      });
    }

    // initial score
    updateScore();
  }

  initQuiz();

  // Smooth scrolling for in-page links if supported
  try {
    document.documentElement.style.scrollBehavior = 'smooth';
  } catch(e) {}
})();
