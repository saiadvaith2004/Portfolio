// JavaScript Logic for Nagulapally Sai Advaith - Interactive Portfolio

document.addEventListener('DOMContentLoaded', () => {
  
  /* ========================================================================= */
  /* 1. Mobile Navigation Menu Toggle                                          */
  /* ========================================================================= */
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });
  }

  // Smooth scroll and auto-close mobile menu
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = mobileMenuBtn?.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });

  // Track active section and update nav highlight
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`nav a[href*=${sectionId}]`);
      
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('nav a').forEach(el => el.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  });

  /* ========================================================================= */
  /* 2. Typewriter Effect for Hero Subtitle                                    */
  /* ========================================================================= */
  const typewriterText = document.getElementById('typewriter-text');
  const phrases = [
    'Full Stack Software Developer',
    'Spring Boot & Java Enthusiast',
    'Competitive Programmer',
    'AI/ML Solution Architect'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentPhrase = phrases[phraseIdx];
    
    if (isDeleting) {
      typewriterText.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50; // Deleting is faster
    } else {
      typewriterText.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 100; // Normal typing speed
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      // Pause at full phrase
      isDeleting = true;
      typingSpeed = 1500;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 500; // Pause before typing next phrase
    }

    setTimeout(typeEffect, typingSpeed);
  }

  if (typewriterText) {
    typeEffect();
  }

  /* ========================================================================= */
  /* 3. Project Showroom Tab Switcher                                          */
  /* ========================================================================= */
  const tabButtons = document.querySelectorAll('.showroom-tab-btn');
  const tabPanes = document.querySelectorAll('.showroom-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const targetPane = document.getElementById(`pane-${tabId}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // Short cut buttons inside project list that redirect to the simulators
  document.querySelectorAll('.showroom-shortcut').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetTab = link.getAttribute('data-target-tab');
      const matchingBtn = document.querySelector(`.showroom-tab-btn[data-tab="${targetTab}"]`);
      if (matchingBtn) {
        matchingBtn.click();
      }
    });
  });

  /* ========================================================================= */
  /* 4. Simulator 1: AI Mock Interviewer                                      */
  /* ========================================================================= */
  const setupView = document.getElementById('setup-view');
  const chatView = document.getElementById('chat-view');
  const chatBox = document.getElementById('chat-box');
  const chatChoices = document.getElementById('chat-choices');
  
  const interviewQuestions = {
    java: [
      {
        question: "Let's test JVM internals. What is the fundamental difference between standard garbage collection in G1 GC versus older parallel GC implementations?",
        choices: [
          { text: "Parallel GC executes GC in parallel threads, whereas G1 only uses a single execution thread.", score: 2, feedback: "Incorrect. Both run parallel threads. Parallel GC scans the entire heap, while G1 segments memory." },
          { text: "G1 segments the heap into independent regions, cleaning garbage-dense regions first to minimize stop-the-world pauses.", score: 10, feedback: "Excellent! G1 uses region-based incremental cleaning to hit pause-time goals." },
          { text: "G1 GC relies exclusively on the stack space to clean reference pointers.", score: 1, feedback: "Incorrect. GC works with the heap, not local thread stacks." }
        ]
      },
      {
        question: "Nice work. Next, in Spring Boot, why is using field-level injection (@Autowired on a field) generally discouraged, and what is the preferred alternative?",
        choices: [
          { text: "Field injection is slow. The preferred alternative is setting properties in application.properties.", score: 2, feedback: "Incorrect. Field injection performance isn't the issue; code testability is." },
          { text: "Field injection hides dependencies. Constructor injection is preferred because it enforces immutability and aids testing.", score: 10, feedback: "Spot on! Constructor injection permits final fields and facilitates Mockito injection." },
          { text: "Field injection triggers thread-safety issues. Setter injection must be used instead.", score: 4, feedback: "Partial credit. Setter injection works but doesn't guarantee dependency immutability like constructor injection." }
        ]
      },
      {
        question: "Final question. How does Hibernate's First-Level cache handle object states within a transaction?",
        choices: [
          { text: "It is bound to the Session. Querying the same object twice in a transaction returns the cached instance without hitting the DB.", score: 10, feedback: "Perfect! The Session cache guarantees repeatable reads at the entity level." },
          { text: "It caches objects in Redis across all sessions globally for up to 30 minutes.", score: 3, feedback: "Incorrect. Global caching is Second-Level caching. First-level cache is session-scoped." },
          { text: "It writes database records directly to system files on the host computer.", score: 1, feedback: "Incorrect. Hibernate does not handle local filesystem file writing for caches." }
        ]
      }
    ],
    sql: [
      {
        question: "Let's look at databases. Explain why a query scanning a column with a non-clustered index might still perform a full Table Scan.",
        choices: [
          { text: "Because the table has no primary key, making indexes completely useless.", score: 2, feedback: "Incorrect. Table scan triggers are based on column selectivity and index lookup costs." },
          { text: "The index is corrupted, so the engine automatically falls back to full table reads.", score: 1, feedback: "Incorrect. SQL database engines don't assume index corruption by default." },
          { text: "If the filters return a large percentage of rows, the database optimizer decides table scanning is faster than index key lookups.", score: 10, feedback: "Excellent! Known as the 'Index Tip Point'. Avoiding bookmark lookups speeds up execution." }
        ]
      },
      {
        question: "Indeed. Now, which database isolation level prevents Phantom Reads, and how does it accomplish this?",
        choices: [
          { text: "Read Committed, using shared read locks that expire instantly after a column read.", score: 3, feedback: "Incorrect. Read Committed still allows phantom reads when new rows are inserted." },
          { text: "Serializable isolation level, utilizing range locks to freeze matching rows from being inserted or updated.", score: 10, feedback: "Correct! Serializable uses index-range locks to block phantom insertions." },
          { text: "Repeatable Read, by hashing rows to memory to prevent modifications.", score: 5, feedback: "Close, but Repeatable Read only locks existing rows. New inserts (phantoms) can still sneak in." }
        ]
      },
      {
        question: "Correct. What is the key difference between a clustered and a non-clustered index?",
        choices: [
          { text: "A clustered index defines physical row storage ordering; a non-clustered index maintains a separate pointer structure.", score: 10, feedback: "Superb! A table can only have one clustered index (physically sorted) but many non-clustered ones." },
          { text: "Clustered indexes are stored in RAM; non-clustered indexes are stored on disk.", score: 2, feedback: "Incorrect. Both reside on disk. The distinction is how the leaf nodes are linked." },
          { text: "Clustered indexes only work on strings, while non-clustered indexes work on numbers.", score: 1, feedback: "Incorrect. Indexes support both numeric and text types." }
        ]
      }
    ],
    system: [
      {
        question: "Let's review system architecture. In a Cache-Aside pattern, what happens when a database write occurs, and how do we prevent stale cache data?",
        choices: [
          { text: "On write, invalidate the cache key. Next read query pulls fresh data from the DB and repopulates the cache.", score: 10, feedback: "Outstanding! Evicting the key prevents race conditions that occur with cache updates." },
          { text: "On write, update both cache and database simultaneously within a global 2PC transaction.", score: 5, feedback: "This is Write-Through cache. It keeps data synced but introduces database transaction latency." },
          { text: "Let the cache handle writes; the DB is updated via a background cron job once daily.", score: 2, feedback: "This runs high risks of data loss and serves extremely stale data." }
        ]
      },
      {
        question: "Good. How does a database sharding strategy differ from standard database replication?",
        choices: [
          { text: "Replication splits tables by rows; sharding copies the database to other network locations.", score: 3, feedback: "Incorrect. Replication copies the whole database; sharding partitions the data rows." },
          { text: "Sharding partitions data horizontally across different nodes; replication duplicates the same dataset to multiple read replicas.", score: 10, feedback: "Correct! Sharding scales writes by distributing rows; replication scales reads and adds redundancy." },
          { text: "Sharding is for SQL databases, replication is strictly for NoSQL databases.", score: 2, feedback: "Incorrect. Both methods apply to SQL and NoSQL engines." }
        ]
      },
      {
        question: "Correct. How does a reverse proxy like Nginx help protect a Spring Boot backend in production?",
        choices: [
          { text: "It compiles Java bytecode to native code during incoming client web requests.", score: 1, feedback: "Incorrect. Nginx handles network routing, not JVM compilation." },
          { text: "It acts as a shield, managing TLS termination, load balancing, and rate limiting before requests reach the app.", score: 10, feedback: "Exactly! Offloads encryption overhead and hides the internal microservice network topology." },
          { text: "It replicates the DB automatically to make sure requests never query the server.", score: 2, feedback: "Incorrect. Nginx does not communicate directly with database replication engines." }
        ]
      }
    ]
  };

  let currentTrack = '';
  let currentQuestionIdx = 0;
  let totalScore = 0;

  document.querySelectorAll('.setup-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTrack = btn.getAttribute('data-topic');
      startInterview();
    });
  });

  function startInterview() {
    setupView.style.display = 'none';
    chatView.style.display = 'flex';
    chatBox.innerHTML = '';
    currentQuestionIdx = 0;
    totalScore = 0;
    
    appendBotMsg("Welcome! I've loaded your track. I'll evaluate your response and check details. Let's begin.");
    setTimeout(showNextQuestion, 1200);
  }

  function appendBotMsg(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot';
    bubble.innerHTML = text;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function appendUserMsg(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.textContent = text;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function showNextQuestion() {
    const trackQs = interviewQuestions[currentTrack];
    
    if (currentQuestionIdx >= trackQs.length) {
      finishInterview();
      return;
    }
    
    const qObj = trackQs[currentQuestionIdx];
    appendBotMsg(qObj.question);
    
    // Clear choices
    chatChoices.innerHTML = '';
    
    // Add new choices
    qObj.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'chat-option-btn';
      btn.textContent = choice.text;
      btn.addEventListener('click', () => handleChoiceSelection(choice));
      chatChoices.appendChild(btn);
    });
  }

  function handleChoiceSelection(choice) {
    appendUserMsg(choice.text);
    chatChoices.innerHTML = ''; // Lock choice input
    
    totalScore += choice.score;
    
    setTimeout(() => {
      appendBotMsg(choice.feedback);
      currentQuestionIdx++;
      
      setTimeout(showNextQuestion, 2000);
    }, 1000);
  }

  function finishInterview() {
    chatChoices.innerHTML = '';
    
    let evaluation = '';
    const maxScore = 30;
    if (totalScore >= 25) {
      evaluation = "Exceptional performance! You displayed deep engineering insights and architectural foundations.";
    } else if (totalScore >= 18) {
      evaluation = "Solid framework understanding. Ready for full stack role integration.";
    } else {
      evaluation = "Good attempt. Re-studying JVM/SQL transaction principles will strengthen your skills.";
    }
    
    const scorecardHtml = `
      <div style="border-top: 1px solid var(--glass-border); padding-top: 15px; margin-top: 10px;">
        <h4 style="color: var(--color-cyan); font-family: var(--font-heading); margin-bottom: 8px;">
          <i class="fa-solid fa-square-poll-vertical"></i> Interview Scorecard
        </h4>
        <p><strong>Track:</strong> ${currentTrack.toUpperCase()}</p>
        <p><strong>Score:</strong> ${totalScore} / ${maxScore}</p>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 5px;">${evaluation}</p>
        <button id="restart-interview-btn" class="btn btn-secondary" style="margin-top: 12px; padding: 6px 16px; font-size: 0.8rem;">
          Try Another Track
        </button>
      </div>
    `;
    
    appendBotMsg(scorecardHtml);
    
    // Listen for restart
    setTimeout(() => {
      const restartBtn = document.getElementById('restart-interview-btn');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          chatView.style.display = 'none';
          setupView.style.display = 'flex';
        });
      }
    }, 100);
  }

  /* ========================================================================= */
  /* 5. Simulator 2: ML Car Price Predictor                                   */
  /* ========================================================================= */
  const mlYearSlider = document.getElementById('ml-year');
  const mlYearVal = document.getElementById('ml-year-val');
  const mlMileageSlider = document.getElementById('ml-mileage');
  const mlMileageVal = document.getElementById('ml-mileage-val');
  const mlFuelSelect = document.getElementById('ml-fuel');
  const mlCountrySelect = document.getElementById('ml-country');
  
  const gaugeFill = document.getElementById('gauge-fill');
  const gaugePriceText = document.getElementById('gauge-price');
  const mlFormulaOutput = document.getElementById('ml-formula-output');

  function calculatePrice() {
    if (!mlYearSlider) return;

    const year = parseInt(mlYearSlider.value);
    const mileage = parseInt(mlMileageSlider.value);
    const fuel = mlFuelSelect.value;
    const country = mlCountrySelect.value;
    
    // Update value indicators
    mlYearVal.textContent = year;
    mlMileageVal.textContent = mileage >= 1000 ? `${(mileage / 1000).toFixed(0)}K km` : `${mileage} km`;

    // Regression Logic
    let basePrice = 20000;
    
    // Year effect (linear + polynomial factor if > 2020)
    let yearFactor = (year - 2010) * 1200;
    if (year > 2020) {
      yearFactor += Math.pow((year - 2020), 1.8) * 400; // Polynomial expansion representation
    }
    
    // Mileage degradation (-0.08 per km)
    const mileagePenalty = mileage * 0.08;
    
    // Fuel offset
    let fuelBonus = 0;
    if (fuel === 'diesel') fuelBonus = 2500;
    else if (fuel === 'ev') fuelBonus = 8000;

    let finalPriceUSD = basePrice + yearFactor - mileagePenalty + fuelBonus;
    
    // Math validation (no negative pricing)
    if (finalPriceUSD < 2000) finalPriceUSD = 2000;

    // Country currency factor
    let symbol = '$';
    let localPrice = finalPriceUSD;
    if (country === 'eu') {
      symbol = '€';
      localPrice = finalPriceUSD * 0.92; // EUR rate
    } else if (country === 'in') {
      symbol = '₹';
      localPrice = finalPriceUSD * 83.0; // INR rate
    }

    // Format output
    let priceFormatted = '';
    if (country === 'in') {
      priceFormatted = symbol + Math.round(localPrice).toLocaleString('en-IN');
    } else {
      priceFormatted = symbol + Math.round(localPrice).toLocaleString('en-US');
    }
    
    gaugePriceText.textContent = priceFormatted;

    // Set gauge fill rotation (-45deg is min/0%, 135deg is max/100%)
    const maxVal = 50000;
    const minVal = 2000;
    const percent = Math.min(Math.max((finalPriceUSD - minVal) / (maxVal - minVal), 0), 1);
    const rotationAngle = -45 + (percent * 180);
    gaugeFill.style.transform = `rotate(${rotationAngle}deg)`;

    // Update Formula readout
    const formulaString = `Price = [Base: $20,000] 
  + (Year_Coeff: ${year - 2010} * $1,200)${year > 2020 ? ` + (Poly_Expansion: $${Math.round(Math.pow((year - 2020), 1.8) * 400)})` : ''} 
  - (Mileage_Coeff: ${mileage} * 0.08) 
  + (Fuel_Coeff: ${fuelBonus > 0 ? `+$${fuelBonus}` : '$0'})
  = $${Math.round(finalPriceUSD).toLocaleString()} USD 
Converted: ${priceFormatted} (${country.toUpperCase()})`;

    mlFormulaOutput.textContent = formulaString;
  }

  // Bind Listeners
  [mlYearSlider, mlMileageSlider, mlFuelSelect, mlCountrySelect].forEach(item => {
    if (item) {
      item.addEventListener('input', calculatePrice);
      item.addEventListener('change', calculatePrice);
    }
  });

  // Init Simulator 2
  calculatePrice();

  /* ========================================================================= */
  /* 6. Simulator 3: Event Conflict Solver                                    */
  /* ========================================================================= */
  const sliderAStart = document.getElementById('slider-a-start');
  const sliderBStart = document.getElementById('slider-b-start');
  const valATime = document.getElementById('val-a-time');
  const valBTime = document.getElementById('val-b-time');
  const blockA = document.getElementById('block-a');
  const blockB = document.getElementById('block-b');
  const conflictStatus = document.getElementById('conflict-status');

  function checkEventCollision() {
    if (!sliderAStart) return;

    const startA = parseInt(sliderAStart.value);
    const durationA = 4; // Coding Contest duration
    const endA = startA + durationA;

    const startB = parseInt(sliderBStart.value);
    const durationB = 4.5; // Hackathon duration
    const endB = startB + durationB;

    // Formatting time display (e.g. 9 -> 09:00, 13.5 -> 13:30)
    function formatTime(val) {
      const hours = Math.floor(val);
      const minutes = (val % 1) === 0.5 ? '30' : '00';
      const padHours = hours < 10 ? `0${hours}` : hours;
      return `${padHours}:${minutes}`;
    }

    valATime.textContent = `${formatTime(startA)} - ${formatTime(endA)}`;
    valBTime.textContent = `${formatTime(startB)} - ${formatTime(endB)}`;

    // Position Blocks
    // Timeline is 8:00 to 20:00 (12 hours range)
    const timelineStart = 8;
    const timelineDuration = 12;

    const leftA = ((startA - timelineStart) / timelineDuration) * 100;
    const widthA = (durationA / timelineDuration) * 100;
    blockA.style.left = `${leftA}%`;
    blockA.style.width = `${widthA}%`;

    const leftB = ((startB - timelineStart) / timelineDuration) * 100;
    const widthB = (durationB / timelineDuration) * 100;
    blockB.style.left = `${leftB}%`;
    blockB.style.width = `${widthB}%`;

    // Collision Detection (Overlap)
    // Overlap if: (startA < endB) AND (startB < endA)
    const isOverlapping = (startA < endB) && (startB < endA);

    if (isOverlapping) {
      // Find overlap bounds
      const overlapStart = Math.max(startA, startB);
      const overlapEnd = Math.min(endA, endB);
      
      conflictStatus.className = 'conflict-status-banner conflict';
      conflictStatus.innerHTML = `
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>Conflict: Double-booked [${formatTime(overlapStart)} - ${formatTime(overlapEnd)}]. JPQL query will reject transaction.</span>
      `;
    } else {
      conflictStatus.className = 'conflict-status-banner no-conflict';
      conflictStatus.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>JPA Check Secure: No scheduling conflicts. Entity persisted successfully.</span>
      `;
    }
  }

  // Bind Listeners
  [sliderAStart, sliderBStart].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', checkEventCollision);
    }
  });

  // Init Simulator 3
  checkEventCollision();

  /* ========================================================================= */
  /* 7. Skills Highlight Linker Matrix                                         */
  /* ========================================================================= */
  const filterBtns = document.querySelectorAll('.skills-filter-btn');
  const skillNodes = document.querySelectorAll('.skill-node');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const projectCards = document.querySelectorAll('.project-card');

  // Skill category filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      skillNodes.forEach(node => {
        const cat = node.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          node.style.display = 'flex';
        } else {
          node.style.display = 'none';
        }
      });
    });
  });

  // Click on a skill to highlight projects & jobs that use it
  skillNodes.forEach(node => {
    node.addEventListener('click', () => {
      const skillName = node.getAttribute('data-skill');
      
      // If already highlighted, remove all highlights
      if (node.classList.contains('highlighted')) {
        node.classList.remove('highlighted');
        timelineItems.forEach(item => item.style.opacity = '1');
        projectCards.forEach(card => card.style.opacity = '1');
        return;
      }

      // Remove highlighed class from other nodes
      skillNodes.forEach(n => n.classList.remove('highlighted'));
      node.classList.add('highlighted');

      // Filter Timeline Items
      timelineItems.forEach(item => {
        const itemSkills = item.getAttribute('data-skills');
        if (itemSkills && itemSkills.split(',').includes(skillName)) {
          item.style.opacity = '1';
          item.querySelector('.timeline-card')?.style.setProperty('border-color', 'var(--color-cyan)');
        } else {
          item.style.opacity = '0.35';
          item.querySelector('.timeline-card')?.style.removeProperty('border-color');
        }
      });

      // Filter Project Cards
      projectCards.forEach(card => {
        const cardSkills = card.getAttribute('data-skills');
        if (cardSkills && cardSkills.split(',').includes(skillName)) {
          card.style.opacity = '1';
          card.style.borderColor = 'var(--color-cyan)';
          card.style.boxShadow = 'var(--shadow-glow)';
        } else {
          card.style.opacity = '0.35';
          card.style.removeProperty('border-color');
          card.style.removeProperty('box-shadow');
        }
      });
    });
  });

  /* ========================================================================= */
  /* 8. Achievements Carousel                                                  */
  /* ========================================================================= */
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const dotsContainer = document.getElementById('carousel-dots');
  
  if (track && prevBtn && nextBtn) {
    const slides = Array.from(track.children);
    let currentSlideIdx = 0;
    
    // Create navigation dots
    // Each dot represents sliding by 1 index. In desktop we show 2 slides, in mobile 1 slide.
    // We adjust max index accordingly.
    function getSlidesPerPage() {
      return window.innerWidth > 992 ? 2 : 1;
    }
    
    function getMaxIndex() {
      return slides.length - getSlidesPerPage();
    }
    
    function createDots() {
      dotsContainer.innerHTML = '';
      const numDots = slides.length - getSlidesPerPage() + 1;
      
      for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${i === currentSlideIdx ? 'active' : ''}`;
        dot.addEventListener('click', () => {
          currentSlideIdx = i;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    }
    
    function updateCarousel() {
      // Clamp index
      const maxIdx = getMaxIndex();
      if (currentSlideIdx > maxIdx) currentSlideIdx = maxIdx;
      if (currentSlideIdx < 0) currentSlideIdx = 0;
      
      // Calculate translate percentage
      const slideWidthPercent = 100 / getSlidesPerPage();
      const amountToMove = currentSlideIdx * (slideWidthPercent + (15 / window.innerWidth * 100)); // offset calculation
      
      track.style.transform = `translateX(-${currentSlideIdx * (100 / getSlidesPerPage() + 2.5)}%)`;
      
      // Update dots
      const dots = Array.from(dotsContainer.children);
      dots.forEach((dot, idx) => {
        if (idx === currentSlideIdx) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }
    
    prevBtn.addEventListener('click', () => {
      currentSlideIdx--;
      if (currentSlideIdx < 0) currentSlideIdx = getMaxIndex();
      updateCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
      currentSlideIdx++;
      if (currentSlideIdx > getMaxIndex()) currentSlideIdx = 0;
      updateCarousel();
    });
    
    // Re-calculate page layouts on resize
    window.addEventListener('resize', () => {
      createDots();
      updateCarousel();
    });
    
    // Init
    createDots();
    updateCarousel();
  }

  /* ========================================================================= */
  /* 9. Scroll Reveal Animations (Intersection Observer)                        */
  /* ========================================================================= */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, {
      threshold: 0.15
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ========================================================================= */
  /* 10. Contact Form Handler with Overlay Feedback                           */
  /* ========================================================================= */
  const contactForm = document.getElementById('portfolio-contact-form');
  const successOverlay = document.getElementById('form-success');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const successMsgDetails = document.getElementById('success-msg-details');

  if (contactForm && successOverlay) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('frm-name').value;
      const email = document.getElementById('frm-email').value;
      const subject = document.getElementById('frm-subject').value;
      const message = document.getElementById('frm-message').value;
      
      // Save locally to simulate database logging
      const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
      submissions.push({ name, email, subject, message, timestamp: new Date().toISOString() });
      localStorage.setItem('contact_submissions', JSON.stringify(submissions));

      // Show success
      successMsgDetails.innerHTML = `Hi <strong>${name}</strong>, your message has been simulated and logged to LocalStorage. I'll review it and reach out to you at <strong>${email}</strong>.`;
      successOverlay.classList.add('active');
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        contactForm.reset();
        successOverlay.classList.remove('active');
      });
    }
  }
  
});
