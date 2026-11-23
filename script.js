/**
 * THE WEDDING OF YOSUA & AGNES
 * script.js — https://besokakad.id/yosuaagnes/
 */

// ============================================================
//  1. NAMA TAMU dari URL param ?to=
// ============================================================
(function setGuestName() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('to') || params.get('name') || '';
  const el = document.getElementById('guest-name');
  if (el) el.textContent = name ? decodeURIComponent(name).trim() : 'Tamu Undangan';
})();

// ============================================================
//  2. COVER — Buka Undangan
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  const coverSection = document.getElementById('cover-section');
  const mainContent  = document.getElementById('main-content');
  const openBtnLink  = document.getElementById('open-btn-link');
  const audioBtn     = document.getElementById('audioBtn');

  function openInvitation(e) {
    if (e) e.preventDefault();

    // Sembunyikan cover dengan fade
    if (coverSection) {
      coverSection.classList.add('hidden');
    }

    // Tampilkan main content setelah transisi
    setTimeout(function () {
      if (coverSection) coverSection.style.display = 'none';
      if (mainContent) {
        mainContent.style.display = 'block';
        // trigger reflow
        mainContent.offsetHeight;
        mainContent.classList.add('visible');
      }

      // Scroll ke atas
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Tampilkan audio player
      if (audioBtn) audioBtn.classList.add('visible');

      // Init AOS
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }

      // Animasi Section 2 Inner Card (zoom-in-up seperti cover card)
      var section2Card = document.getElementById('section2-card');
      if (section2Card) {
        setTimeout(function () {
          section2Card.classList.add('card-animate');
        }, 300);
      }

      // Init countdown
      initCountdown();

      // Init gallery (set bg images dari data-thumbnail)
      initGallery();

      // Video section — set src & play
      initVideoSection();

      // Animasi zoomIn pada section video
      triggerVideoTextAnims();

      // Auto-play audio
      setTimeout(function () {
        startAudio();
      }, 1200);

    }, 800);
  }

  if (openBtnLink) {
    openBtnLink.addEventListener('click', openInvitation);
  }

  // ============================================================
  //  3. VIDEO BACKGROUND SECTION
  // ============================================================
  function initVideoSection() {
    var video = document.getElementById('bg-video');
    if (!video) return;
    video.src = 'https://besokakad.id/wp-content/uploads/2026/09/motion-batak-3D-v2-_-besokakad.id_7.mp4';
    video.load();
    video.play().catch(function () {});
    // Saat video selesai: tampilkan gambar 1.png dengan fade in
    video.addEventListener('ended', function () {
      video.pause();
      var endImg = document.getElementById('video-end-img');
      if (endImg) {
        endImg.style.opacity = '1';
      }
    });
  }

  // ============================================================
  //  4. TEXT ANIMATIONS SECTION VIDEO — muncul saat video detik 14
  // ============================================================
  function triggerVideoTextAnims() {
    var video  = document.getElementById('bg-video');
    var elems  = document.querySelectorAll('.section1-text');
    var triggered = false;

    function doAnimate() {
      if (triggered) return;
      triggered = true;
      elems.forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add('section1-visible');
        }, i * 220);
      });
    }

    if (video) {
      // Trigger utama: saat video mencapai detik 14
      video.addEventListener('timeupdate', function () {
        if (!triggered && video.currentTime >= 14) {
          doAnimate();
        }
      });
      // Fallback: jika video lambat load, animasi tetap jalan setelah 15 detik
      setTimeout(doAnimate, 15000);
    } else {
      // Tidak ada video, langsung animasi
      setTimeout(doAnimate, 500);
    }
  }

  // ============================================================
  //  5. AUDIO PLAYER
  // ============================================================
  var song    = document.getElementById('song');
  var wrapper = document.querySelector('.wdp-audio-wrapper');
  var ringEl  = document.querySelector('.wdp-audio-progress-ring');
  var isPlaying = false;
  var ringInterval = null;

  function startAudio() {
    if (!song) return;
    song.play().then(function () {
      isPlaying = true;
      if (wrapper) wrapper.classList.add('playing');
      startRingAnim();
    }).catch(function () {});
  }

  function toggleAudio() {
    if (!song) return;
    if (isPlaying) {
      song.pause();
      isPlaying = false;
      if (wrapper) wrapper.classList.remove('playing');
      stopRingAnim();
    } else {
      song.play().then(function () {
        isPlaying = true;
        if (wrapper) wrapper.classList.add('playing');
        startRingAnim();
      }).catch(function () {});
    }
  }

  function startRingAnim() {
    if (!ringEl) return;
    ringInterval = setInterval(function () {
      if (!song || song.duration === 0) return;
      var progress = song.currentTime / song.duration;
      var circumference = 283;
      var offset = circumference - (progress * circumference);
      ringEl.style.strokeDashoffset = offset;
    }, 500);
  }

  function stopRingAnim() {
    if (ringInterval) clearInterval(ringInterval);
  }

  if (wrapper) {
    wrapper.addEventListener('click', toggleAudio);
  }

  // ============================================================
  //  6. COUNTDOWN
  // ============================================================
  function initCountdown() {
    var target = 1794978000; // Unix timestamp acara (18 Nov 2026 10:00 WIB)
    var daysEl    = document.querySelector('.elementor-countdown-days');
    var hoursEl   = document.querySelector('.elementor-countdown-hours');
    var minutesEl = document.querySelector('.elementor-countdown-minutes');
    var secondsEl = document.querySelector('.elementor-countdown-seconds');

    if (!daysEl) return;

    function updateCountdown() {
      var now  = Math.floor(Date.now() / 1000);
      var diff = target - now;

      if (diff <= 0) {
        // Acara sudah berlangsung
        daysEl.textContent    = '00';
        hoursEl.textContent   = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      var d = Math.floor(diff / 86400);
      var h = Math.floor((diff % 86400) / 3600);
      var m = Math.floor((diff % 3600) / 60);
      var s = Math.floor(diff % 60);

      daysEl.textContent    = String(d).padStart(2, '0');
      hoursEl.textContent   = String(h).padStart(2, '0');
      minutesEl.textContent = String(m).padStart(2, '0');
      secondsEl.textContent = String(s).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ============================================================
  //  7. GALLERY — set background dari data-thumbnail
  // ============================================================
  function initGallery() {
    var items = document.querySelectorAll('.e-gallery-image');
    items.forEach(function (el) {
      var thumb = el.getAttribute('data-thumbnail');
      var w = parseInt(el.getAttribute('data-width'))  || 1;
      var h = parseInt(el.getAttribute('data-height')) || 1;
      if (thumb) {
        el.style.backgroundImage = "url('" + thumb + "')";
        el.style.paddingBottom   = ((h / w) * 100).toFixed(1) + '%';
        el.style.backgroundSize  = 'cover';
        el.style.backgroundPosition = 'center';
        el.style.display         = 'block';
      }
    });

    // Lightbox
    initLightbox();
  }

  // ============================================================
  //  8. LIGHTBOX
  // ============================================================
  function initLightbox() {
    var overlay    = document.getElementById('lightbox-overlay');
    var imgEl      = document.getElementById('lightbox-img');
    var closeBtn   = document.getElementById('lightbox-close');
    var prevBtn    = document.getElementById('lightbox-prev');
    var nextBtn    = document.getElementById('lightbox-next');
    var galleryLinks = [];
    var currentIdx = 0;

    if (!overlay) return;

    // Kumpulkan semua gallery links
    document.querySelectorAll('.e-gallery-item[data-lightbox="gallery"]').forEach(function (a) {
      galleryLinks.push(a.getAttribute('href'));
    });

    function openLightbox(idx) {
      currentIdx = idx;
      imgEl.src  = galleryLinks[idx];
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      overlay.classList.remove('open');
      imgEl.src = '';
      document.body.style.overflow = '';
    }
    function prevImage() {
      currentIdx = (currentIdx - 1 + galleryLinks.length) % galleryLinks.length;
      imgEl.src = galleryLinks[currentIdx];
    }
    function nextImage() {
      currentIdx = (currentIdx + 1) % galleryLinks.length;
      imgEl.src = galleryLinks[currentIdx];
    }

    document.querySelectorAll('.e-gallery-item[data-lightbox="gallery"]').forEach(function (a, idx) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        openLightbox(idx);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn)  prevBtn.addEventListener('click', prevImage);
    if (nextBtn)  nextBtn.addEventListener('click', nextImage);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (overlay.classList.contains('open')) {
        if (e.key === 'Escape')      closeLightbox();
        else if (e.key === 'ArrowLeft')  prevImage();
        else if (e.key === 'ArrowRight') nextImage();
      }
    });
  }

  // ============================================================
  //  9. COPY TO CLIPBOARD
  // ============================================================
  function showToast(msg) {
    var toast = document.getElementById('copy-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'copy-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg || '✅ Tersalin!';
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2500);
  }

  document.querySelectorAll('.wdp-copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var text = btn.getAttribute('data-clipboard-text');
      var msg  = btn.getAttribute('data-message') || 'Tersalin!';
      if (!text) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () {
          showToast('✅ ' + msg);
        }).catch(function () {
          fallbackCopy(text, msg);
        });
      } else {
        fallbackCopy(text, msg);
      }
    });
  });

  function fallbackCopy(text, msg) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showToast('✅ ' + (msg || 'Tersalin!'));
    } catch (e) {}
    document.body.removeChild(ta);
  }

  // ============================================================
  //  10. RSVP FORM (localStorage)
  // ============================================================
  var rsvpForm  = document.getElementById('rsvp-form');
  var rsvpList  = document.getElementById('rsvp-list');
  var RSVP_KEY  = 'yosua_agnes_rsvp';

  function loadRSVP() {
    if (!rsvpList) return;
    try {
      var saved = JSON.parse(localStorage.getItem(RSVP_KEY) || '[]');
      saved.forEach(function (item) {
        prependRSVP(item.name, item.ucapan, item.kehadiran, item.time, false);
      });
    } catch (e) {}
  }

  function saveRSVP(name, ucapan, kehadiran) {
    try {
      var saved = JSON.parse(localStorage.getItem(RSVP_KEY) || '[]');
      saved.unshift({ name: name, ucapan: ucapan, kehadiran: kehadiran, time: Date.now() });
      localStorage.setItem(RSVP_KEY, JSON.stringify(saved.slice(0, 50)));
    } catch (e) {}
  }

  var kehadiranColors = {
    hadir:       '#3D9A62',
    tidak_hadir: '#d90a11',
    masih_ragu:  '#d7a916'
  };
  var kehadiranLabels = {
    hadir: 'Hadir',
    tidak_hadir: 'Tidak Hadir',
    masih_ragu: 'Masih Ragu'
  };

  function prependRSVP(name, ucapan, kehadiran, time, prepend) {
    if (!rsvpList) return;
    var color = kehadiranColors[kehadiran] || '#888';
    var label = kehadiranLabels[kehadiran] || kehadiran;
    var div = document.createElement('div');
    div.className = 'rsvp-item';
    div.style.cssText = 'background:rgba(232,232,232,0.6);border-radius:12px;padding:14px;border-left:3px solid #721717;';
    div.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">' +
        '<strong style="font-family:Poppins,sans-serif;font-size:12px;color:#4A3E2D;">' + escHtml(name) + '</strong>' +
        '<span style="font-family:Poppins,sans-serif;font-size:10px;color:' + color + ';background:rgba(0,0,0,0.06);padding:2px 8px;border-radius:10px;">' + label + '</span>' +
      '</div>' +
      '<p style="font-family:Poppins,sans-serif;font-size:11px;color:#666;margin:0;line-height:1.6;">' + escHtml(ucapan) + '</p>';

    if (prepend) {
      rsvpList.insertBefore(div, rsvpList.firstChild);
    } else {
      rsvpList.appendChild(div);
    }
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name      = document.getElementById('rsvp-name').value.trim();
      var ucapan    = document.getElementById('rsvp-ucapan').value.trim();
      var kehadiran = document.getElementById('rsvp-kehadiran').value;

      if (!name || !ucapan || !kehadiran) {
        alert('Mohon isi semua field.');
        return;
      }

      saveRSVP(name, ucapan, kehadiran);
      prependRSVP(name, ucapan, kehadiran, Date.now(), true);

      rsvpForm.reset();
      showToast('✅ Ucapan terkirim!');
    });

    // Load saved
    loadRSVP();
  }

  // ============================================================
  //  11. AOS INIT
  // ============================================================
  if (typeof AOS !== 'undefined') {
    AOS.init({ once: true, duration: 800, offset: 60 });
  }

}); // end DOMContentLoaded
