// Custom Cursor Implementation
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', function(e) {
    const posX = e.clientX;
    const posY = e.clientY;
    
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    // outline follows with slight delay using CSS transitions/animate
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Add hover effect states for links and buttons
document.querySelectorAll('a, button, .testi-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Testimonial Carousel Logic
const track = document.getElementById('testiTrack');
const slides = document.querySelectorAll('.testi-slide');
const btnNext = document.getElementById('nextTesti');
const btnPrev = document.getElementById('prevTesti');
let currentSlide = 0;

function updateTestimonial() {
    // translate the track
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    // update opacity/classes
    slides.forEach((s, idx) => {
        if(idx === currentSlide) s.classList.add('active');
        else s.classList.remove('active');
    });
}

if(btnNext && btnPrev) {
    btnNext.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateTestimonial();
    });
    
    btnPrev.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateTestimonial();
    });
}

// Dark/Light Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        if(themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark');
        if(themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('theme', theme);
}

setTheme(currentTheme);

if(themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

// Navbar scroll effect & ScrollSpy
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    const scrollPos = window.scrollY || window.pageYOffset;
    
    if(nav) {
        if (scrollPos > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // ScrollSpy logic to activate current navigation segment
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Only engage Scroll Spy heavily if we have native structural sections (i.e. index.html)
    if (sections.length > 2) {
        let current = '';
        if (scrollPos < Number(window.innerHeight) / 2) {
            current = 'home';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollPos >= (sectionTop - sectionHeight / 3)) {
                    if(section.getAttribute('id')) {
                        current = section.getAttribute('id');
                    }
                }
            });
        }

        navLinks.forEach(a => {
            const href = a.getAttribute('href');
            // Only toggle active if the link is an internal anchor
            if (href && href.startsWith('#')) {
                a.classList.remove('active');
                if (href === '#' + current && current !== '') {
                    a.classList.add('active');
                }
            } else if (href && href.includes('#' + current)) {
                 // Fallback for index.html#home patterns on root
                 a.classList.remove('active');
                 if (current !== '') {
                     a.classList.add('active');
                 }
            }
        });
    }
});

// Loading animation
window.addEventListener('load', () => {
    setTimeout(() => {
        const tl = gsap.timeline();
        // Remove the CSS animation to smoothly fade it out with GSAP
        gsap.set('.loader-text', { animation: 'none' });
        
        tl.to('.loader-text', { opacity: 0, duration: 0.4, ease: "power2.in" })
          .to('#loader', { yPercent: -100, duration: 0.8, ease: "expo.inOut" })
          .from('nav', { y: -20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.5");
    }, 500); // Minimum time to ensure the breathing is seen
});

// Initialize AOS
AOS.init({ duration: 1000, once: true, offset: 50 });

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if(!href.startsWith('#')) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// GSAP ScrollTrigger Animations
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.gsap-edu').forEach((item, i) => {
    gsap.fromTo(item, { opacity: 0, x: -30 }, {
        scrollTrigger: { trigger: item, start: "top 85%" },
        duration: 0.8, opacity: 1, x: 0, ease: "power3.out"
    });
});

gsap.utils.toArray('.gsap-service').forEach((item, i) => {
    gsap.fromTo(item, { opacity: 0, x: -30 }, {
        scrollTrigger: { trigger: item, start: "top 85%" },
        duration: 0.8, opacity: 1, x: 0, ease: "power3.out"
    });
});

gsap.utils.toArray('.gsap-process').forEach((step) => {
    const delay = step.getAttribute('data-delay');
    gsap.fromTo(step, { opacity: 0, y: 40 }, {
        scrollTrigger: { trigger: ".process-grid", start: "top 80%" },
        duration: 0.8, opacity: 1, y: 0, delay: delay, ease: "back.out(1.2)"
    });
});

gsap.utils.toArray('.gsap-stat').forEach((stat, i) => {
    gsap.fromTo(stat, { opacity: 0, y: 20 }, {
        scrollTrigger: { trigger: '.stats', start: "top 90%" },
        duration: 0.6, delay: i * 0.15, opacity: 1, y: 0, ease: "power2.out"
    });
});

gsap.utils.toArray('.gsap-blog').forEach((item, i) => {
    gsap.fromTo(item, { opacity: 0, y: 30 }, {
        scrollTrigger: { trigger: item, start: "top 85%" },
        duration: 0.8, opacity: 1, y: 0, ease: "power3.out"
    });
});

// Mobile Menu Logic
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if(hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// --- GLOBAL SEARCH LOGIC ---
const searchToggle = document.getElementById('searchToggle');
const closeSearch = document.getElementById('closeSearch');
const searchOverlay = document.getElementById('search-overlay');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

if (searchToggle && searchOverlay && closeSearch) {
    searchToggle.addEventListener('click', () => {
        searchOverlay.style.display = 'flex';
        setTimeout(() => searchInput.focus(), 100);
        document.body.style.overflow = 'hidden'; 
    });

    closeSearch.addEventListener('click', () => {
        searchOverlay.style.display = 'none';
        document.body.style.overflow = '';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.style.display === 'flex') {
            searchOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    if (searchInput && typeof blogPosts !== 'undefined') {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            searchResults.innerHTML = '';
            
            if (query.length === 0) return;
            
            const results = blogPosts.filter(post => 
                post.title.toLowerCase().includes(query) || 
                post.tag.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query)
            );

            if (results.length === 0) {
                searchResults.innerHTML = '<p style="color: var(--text-muted); font-size: 1.2rem;">No insights found holding your terms.</p>';
                return;
            }

            results.forEach(res => {
                const a = document.createElement('a');
                a.href = `blog_detail.html?id=${res.id}`;
                a.className = "glass"; 
                a.style.padding = "1.5rem";
                a.style.display = "block";
                a.style.textDecoration = "none";
                a.style.color = "var(--text-primary)";
                a.style.borderRadius = "12px";
                a.style.transition = "transform 0.3s, border-color 0.3s";
                a.style.cursor = "none";
                
                a.innerHTML = `
                    <div style="font-size: 0.8rem; color: var(--gradient-end); text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 1px; font-weight: 500;">${res.tag}</div>
                    <h4 style="font-size: 1.4rem; margin-bottom: 0.5rem;">${res.title}</h4>
                    <p style="color: var(--text-muted); margin: 0; font-size: 1rem;">${res.excerpt}</p>
                `;
                a.onmouseenter = () => {
                    a.style.transform = "translateY(-3px)";
                    a.style.borderColor = "var(--gradient-mid)";
                    document.body.classList.add('cursor-hover');
                };
                a.onmouseleave = () => {
                    a.style.transform = "none";
                    a.style.borderColor = "var(--border-light)";
                    document.body.classList.remove('cursor-hover');
                };
                searchResults.appendChild(a);
            });
        });
    }
}

// 1. Global X icon fix logic
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.fa-x-twitter').forEach(icon => {
        icon.classList.remove('fa-brands', 'fa-x-twitter');
        icon.classList.add('fab', 'fa-twitter');
    });

    // 2. Build Contact Modal HTML Global Instance
    if(!document.getElementById('contact-modal')) {
        const contactModalHtml = `
            <div id="contact-modal" class="glass" style="display: none; position: fixed; inset: 0; z-index: 100000; align-items: center; justify-content: center; opacity: 0; cursor: auto;">
                <div id="contact-modal-bg" style="position: absolute; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"></div>
                
                <div class="contact-modal-content" style="position: relative; z-index: 100001; background: rgba(var(--bg-primary-rgb), 0.95); border: 1px solid var(--border-light); padding: clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 3rem); width: 90%; max-width: 500px; text-align: center; border-radius: 0; box-shadow: 0 40px 100px rgba(0,0,0,0.5);">
                    <button id="closeContactModal" style="position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; transition: color 0.3s;"><i class="fas fa-times"></i></button>
                    
                    <h3 style="font-size: 2.2rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end)); -webkit-background-clip: text; background-clip: text; color: transparent;">Let's Talk</h3>
                    <p style="color: var(--text-muted); margin-bottom: 2.5rem; font-size: 1.1rem;">Choose your preferred communication line:</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem;">
                        <a href="mailto:nikodimosenyew@gmail.com" class="contact-option" style="padding: 2rem 1rem; border: 1px solid var(--border-light); color: var(--text-primary); text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 1rem; transition: all 0.3s; background: rgba(var(--bg-secondary-rgb), 0.3);">
                            <i class="fas fa-envelope" style="font-size: 2.5rem; color: var(--text-primary);"></i>
                            <span style="font-weight: 500; letter-spacing: 1px;">Email</span>
                        </a>
                        <a href="https://t.me/nikodimos" target="_blank" class="contact-option" style="padding: 2rem 1rem; border: 1px solid var(--border-light); color: var(--text-primary); text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 1rem; transition: all 0.3s; background: rgba(var(--bg-secondary-rgb), 0.3);">
                            <i class="fab fa-telegram-plane" style="font-size: 2.5rem; color: var(--text-primary);"></i>
                            <span style="font-weight: 500; letter-spacing: 1px;">Telegram</span>
                        </a>
                        <a href="https://wa.me/251912746544" target="_blank" class="contact-option" style="padding: 2rem 1rem; border: 1px solid var(--border-light); color: var(--text-primary); text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 1rem; transition: all 0.3s; background: rgba(var(--bg-secondary-rgb), 0.3);">
                            <i class="fab fa-whatsapp" style="font-size: 2.5rem; color: var(--text-primary);"></i>
                            <span style="font-weight: 500; letter-spacing: 1px;">WhatsApp</span>
                        </a>
                        <a href="tel:+251912746544" class="contact-option" style="padding: 2rem 1rem; border: 1px solid var(--border-light); color: var(--text-primary); text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 1rem; transition: all 0.3s; background: rgba(var(--bg-secondary-rgb), 0.3);">
                            <i class="fas fa-phone-alt" style="font-size: 2.5rem; color: var(--text-primary);"></i>
                            <span style="font-weight: 500; letter-spacing: 1px;">Phone</span>
                        </a>
                    </div>
                `;
        document.body.insertAdjacentHTML('beforeend', contactModalHtml);
    }

    const cModal = document.getElementById('contact-modal');
    function openContactModal(e) {
        e.preventDefault();
        cModal.style.display = 'flex';
        gsap.to(cModal, { opacity: 1, duration: 0.3, ease: "power2.out" });
    }
    function closeContactModal() {
        gsap.to(cModal, { opacity: 0, duration: 0.3, onComplete: () => cModal.style.display = 'none' });
    }

    document.getElementById('closeContactModal').addEventListener('click', closeContactModal);
    document.getElementById('contact-modal-bg').addEventListener('click', closeContactModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cModal.style.display === 'flex') closeContactModal();
    });

    // 3. Intercept global strategy call buttons perfectly avoiding any footer links if needed
    document.querySelectorAll('a[href="mailto:nikodimosenyew@gmail.com"]').forEach(btn => {
        if(btn.classList.contains('btn') || btn.classList.contains('btn-primary')) {
            btn.addEventListener('click', openContactModal);
        }
    });

});
