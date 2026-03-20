/**
 * MAIN.JS — ScriptStore Products Landing Page
 * Aurora UI | Dark Mode | Interactive Product Showcase
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. NAVBAR: Scroll effect + Mobile hamburger ──────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ─── 2. SCROLL REVEAL ─────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.08 }
  );
  revealEls.forEach(el => revealObs.observe(el));

  /* ─── 3. ANIMATED COUNTER ──────────────────────────────────────── */
  const counterEl = document.getElementById('heroCounter');
  if (counterEl) {
    const TARGET   = 1204;
    const DURATION = 2200;
    let started    = false;

    const startCounter = () => {
      if (started) return;
      started = true;
      const t0 = performance.now();
      const tick = (now) => {
        const progress  = Math.min((now - t0) / DURATION, 1);
        const eased     = 1 - Math.pow(2, -10 * progress); // easeOutExpo
        const current   = Math.floor(eased * TARGET);
        counterEl.textContent = current.toLocaleString('vi-VN');
        if (progress < 1) requestAnimationFrame(tick);
        else counterEl.textContent = TARGET.toLocaleString('vi-VN') + '+';
      };
      requestAnimationFrame(tick);
    };

    // Start when hero enters viewport
    const counterObs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) startCounter(); },
      { threshold: 0.3 }
    );
    counterObs.observe(document.getElementById('hero'));
  }

  /* ─── 4. PRODUCT FILTER TABS ───────────────────────────────────── */
  const filterTabs   = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const type = tab.dataset.filter;

      productCards.forEach(card => {
        const matches = type === 'all' || card.dataset.category === type;
        if (matches) {
          card.style.display = 'flex';
          // Trigger reflow for re-animation
          void card.offsetWidth;
          card.style.animation = 'cardFadeIn 0.35s var(--ease) both';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ─── 5. PRODUCT SEARCH ────────────────────────────────────────── */
  const searchInput = document.getElementById('productSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();

      productCards.forEach(card => {
        const name = card.querySelector('.card-name')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
        const tags = card.querySelector('.card-tags')?.textContent.toLowerCase() || '';

        const visible = !q || name.includes(q) || desc.includes(q) || tags.includes(q);
        card.style.display = visible ? 'flex' : 'none';
      });
    });
  }

  /* ─── 6. PRODUCT DATA ──────────────────────────────────────────── */
  const productDB = {
    p1: {
      name: 'Báo Cáo Doanh Thu Pro',
      tags: '<span class="tag tag-sheets">Sheets</span><span class="tag tag-popular">Bán Chạy</span>',
      desc: 'Giải pháp toàn diện cho bộ phận kế toán và sale. Script tự động quét qua toàn bộ các Google Sheets chứa dữ liệu bán hàng hàng ngày, tổng hợp thành một báo cáo duy nhất, tạo biểu đồ, xuất PDF và tự động gửi email cho cấp quản lý lúc 8:00 tối mỗi ngày.',
      features: [
        'Gom dữ liệu tự động từ 10+ Google Sheets khác nhau',
        'Tạo PDF tự động có chứa biểu đồ và logo công ty',
        'Gửi báo cáo định kỳ qua Gmail hoặc Slack Webhook',
        'Lọc dữ liệu theo team, sản phẩm, khu vực',
        'Dashboard tổng hợp cập nhật theo ngày/tuần/tháng',
      ],
      price: '299.000đ',
      priceOld: '499.000đ',
      buyLink: 'mailto:support@scriptstore.vn?subject=Mua%20B%C3%A1o%20C%C3%A1o%20Doanh%20Thu%20Pro',
    },
    p2: {
      name: 'Mail Merge Nâng Cao',
      tags: '<span class="tag tag-gmail">Gmail</span><span class="tag tag-new">Mới</span>',
      desc: 'Hệ thống gửi email hàng loạt cá nhân hóa ở cấp độ pro. Không chỉ thay tên người nhận, script còn tự động đính kèm các tệp PDF/Docx khác nhau cho từng người dựa trên link trong Google Sheets. Hỗ trợ HTML template phức tạp và tracking open/click.',
      features: [
        'Gửi email cá nhân hóa không giới hạn (với G Workspace)',
        'Chèn file đính kèm động — hóa đơn riêng cho từng khách',
        'Hỗ trợ HTML template đa dạng (ảnh, button, màu sắc)',
        'Tính năng dừng/tiếp tục chiến dịch thông minh',
        'Log gửi email vào Sheets để theo dõi trạng thái',
      ],
      price: '350.000đ',
      priceOld: '',
      buyLink: 'mailto:support@scriptstore.vn?subject=Mua%20Mail%20Merge%20N%C3%A2ng%20Cao',
    },
    p3: {
      name: 'Drive Auto-Organizer',
      tags: '<span class="tag tag-drive">Drive</span>',
      desc: 'Bạn mệt mỏi vì Google Drive lộn xộn? Script này chạy ngầm mỗi đêm, tự động quét thư mục gốc, phân loại file theo đuôi tệp (PDF, Ảnh, Sheet...) và di chuyển chúng vào các thư mục tương ứng của tháng/năm hiện tại. Hỗ trợ nhiều thư mục và quy tắc phân loại linh hoạt.',
      features: [
        'Auto-routing: Di chuyển file theo quy tắc khai báo sẵn',
        'Đổi tên file hàng loạt dựa trên regex/tên thư mục',
        'Phân quyền tự động cho các thành viên trong team',
        'Tạo cấu trúc thư mục tháng/năm tự động',
        'Gửi report tổng kết mỗi tuần qua Gmail',
      ],
      price: '199.000đ',
      priceOld: '',
      buyLink: 'mailto:support@scriptstore.vn?subject=Mua%20Drive%20Auto-Organizer',
    },
    p4: {
      name: 'Calendar Sync Pro',
      tags: '<span class="tag tag-calendar">Calendar</span>',
      desc: 'Đồng bộ hai chiều giữa Google Sheets và Google Calendar. Nhập dữ liệu vào Sheets, script tự tạo sự kiện, mời thành viên và gửi nhắc nhở qua Gmail. Hỗ trợ nhiều calendar song song, màu sắc sự kiện tự động theo loại.',
      features: [
        'Sync hai chiều Sheets ↔ Calendar theo thời gian thực',
        'Tạo sự kiện, mời người tham gia tự động',
        'Email nhắc nhở thông minh N ngày trước deadline',
        'Quản lý nhiều Google Calendar song song',
        'Phân màu sự kiện theo loại (deadline, meeting, task...)',
      ],
      price: '249.000đ',
      priceOld: '',
      buyLink: 'mailto:support@scriptstore.vn?subject=Mua%20Calendar%20Sync%20Pro',
    },
    p5: {
      name: 'Doc Generator từ Sheets',
      tags: '<span class="tag tag-docs">Docs</span>',
      desc: 'Tạo hàng trăm Google Docs/hợp đồng có điền sẵn dữ liệu chỉ trong vài giây. Dùng Google Docs làm template với các placeholder {{field}}, script sẽ đọc từng hàng trong Sheets và tạo ra file riêng biệt cho mỗi khách hàng/nhân viên. Xuất PDF và lưu vào Drive tự động.',
      features: [
        'Render hàng trăm tài liệu Word/PDF cùng lúc',
        'Hỗ trợ placeholder phức tạp: {{field}}, {{date}}, {{table}}',
        'Tự động lưu vào Drive theo cấu trúc folder',
        'Xuất PDF và gửi email cho từng người nhận',
        'Template có thể chứa bảng biểu, hình ảnh, QR code',
      ],
      price: '280.000đ',
      priceOld: '',
      buyLink: 'mailto:support@scriptstore.vn?subject=Mua%20Doc%20Generator',
    },
    p6: {
      name: 'Inventory Tracker',
      tags: '<span class="tag tag-sheets">Sheets</span>',
      desc: 'Script quản lý kho hàng miễn phí hoàn toàn — tự động cập nhật tồn kho mỗi khi có nhập/xuất, hiển thị dashboard tổng quan và gửi cảnh báo qua Gmail khi tồn kho thấp hơn mức quy định.',
      features: [
        'Cảnh báo tồn kho thấp qua Gmail tự động',
        'Ghi log xuất/nhập kho theo real-time',
        'Dashboard tổng quan cập nhật tự động',
        'Tính toán giá trị tồn kho hiện tại',
        'Báo cáo tháng tự động gửi quản lý',
      ],
      price: 'Miễn phí',
      priceOld: '',
      buyLink: 'mailto:support@scriptstore.vn?subject=T%E1%BA%A3i%20Inventory%20Tracker',
    },
    p7: {
      name: 'Quản Lý Nhân Sự Web App',
      tags: '<span class="tag tag-webapp">Web App</span><span class="tag tag-new">Mới</span>',
      desc: 'Hệ thống Web App hoàn chỉnh chạy bằng Google Apps Script (HTML/JS/CSS) và dùng Google Sheets làm Database. Cho phép nhân viên tự động chấm công, xin nghỉ phép, xem bảng lương một cách trực quan trên điện thoại hoặc máy tính mà không cần cài thêm ứng dụng.',
      features: [
        'Giao diện trực quan, chuẩn UI/UX hiện đại cho Mobile/Desktop',
        'Phân quyền riêng biệt giữa Nhân Viên và Quản Lý',
        'Tự động tính toán ngày phép, nghỉ bù, lương theo tháng',
        'Dữ liệu lưu 100% trên Google Sheets của cấp quản lý',
        'Lịch sử Activity Logging rõ ràng, minh bạch'
      ],
      price: '499.000đ',
      priceOld: '',
      buyLink: 'mailto:support@scriptstore.vn?subject=Mua%20Quản%20Lý%20Nhân%20Sự%20Web%20App',
    },
    p8: {
      name: 'Portal Tra Cứu Thông Tin',
      tags: '<span class="tag tag-webapp">Web App</span>',
      desc: 'Tạo một trang web tra cứu nhanh gọn cho khách hàng hoặc học sinh (tra điểm thi, mã bảo hành, tình trạng đơn hàng). Người dùng chỉ cần nhập số điện thoại hoặc mã tra cứu, hệ thống sẽ trả đúng dữ liệu của người đó mà không lộ toàn bộ bảng Sheets gốc.',
      features: [
        'Truy xuất dữ liệu siêu tốc ngay trên giao diện web',
        'Xác thực an toàn bằng Số Điện Thoại, Mã PIN',
        'Có mã iframe để nhúng thẳng vào Website/WordPress của công ty',
        'Hỗ trợ form đăng ký/cập nhật thông tin ngược lại vào Sheets',
        'Giao diện cực kỳ thân thiện với Dark Mode/Light Mode'
      ],
      price: '350.000đ',
      priceOld: '',
      buyLink: 'mailto:support@scriptstore.vn?subject=Mua%20Portal%20Tra%20Cứu%20Thông%20Tin',
    },
  };

  /* ─── 7. MODAL SYSTEM ──────────────────────────────────────────── */
  const modalOverlay = document.getElementById('productModal');
  const closeBtn     = document.getElementById('closeModal');
  const mName     = document.getElementById('mName');
  const mTags     = document.getElementById('mTags');
  const mDesc     = document.getElementById('mDesc');
  const mFeatures = document.getElementById('mFeatures');
  const mPrice    = document.getElementById('mPrice');
  const mBuyBtn   = document.getElementById('mBuyBtn');

  const openModal = (id) => {
    const data = productDB[id];
    if (!data) return;

    mName.textContent = data.name;
    mTags.innerHTML   = data.tags;
    mDesc.textContent = data.desc;
    mPrice.innerHTML  = data.price +
      (data.priceOld ? ` <span class="modal-price-old">${data.priceOld}</span>` : '');
    mBuyBtn.href      = data.buyLink || '#';

    // Render feature list
    mFeatures.innerHTML = '';
    data.features.forEach(f => {
      const li = document.createElement('li');
      li.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        ${f}
      `;
      mFeatures.appendChild(li);
    });

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Bind product cards
  productCards.forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.id);
      }
    });
  });

  // Close triggers
  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ─── 8. INJECT ANIMATION KEYFRAMES ───────────────────────────── */
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes cardFadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleEl);

  /* ─── 9. SMOOTH ANCHOR SCROLL (offset for fixed navbar) ────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── 10. INTERACTIVE DEMO ─────────────────────────────────────── */
  const demoBtn = document.getElementById('demoBtn');
  const demoResult = document.getElementById('demoResult');
  const demoPhone = document.getElementById('demoPhone');
  if(demoBtn && demoResult) {
    demoBtn.addEventListener('click', () => {
      const phone = demoPhone.value.trim();
      demoResult.style.display = 'block';
      if(!phone) {
        demoResult.innerHTML = '<span style="color:#dc2626;font-weight:600">Vui lòng nhập số điện thoại (vd: 091...)</span>';
        return;
      }
      
      demoResult.innerHTML = '<em>Đang gọi API tới Google Sheets...</em>';
      demoResult.style.borderColor = '#e2e8f0';
      demoBtn.disabled = true;
      demoBtn.textContent = 'Đang lấy dữ liệu từ Backend...';
      
      // Giả lập độ trễ kết nối
      setTimeout(() => {
        demoBtn.disabled = false;
        demoBtn.textContent = 'Kiểm tra thông tin trên Sheets';
        demoResult.style.borderColor = '#10b981';
        
        // Tên khách hàng giả lập
        let customName = 'Khách viếng thăm';
        if(phone.length >= 8) customName = 'Anh/Chị Học Viên';
        if(phone === '090123') customName = 'Nguyễn Văn A';

        demoResult.innerHTML = `
          <div style="color:#059669;margin-bottom:8px;font-weight:700">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="vertical-align:middle;margin-right:2px;margin-top:-2px"><polyline points="20 6 9 17 4 12"/></svg> 
            Đã đồng bộ thành công Sheets
          </div>
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:6px">
            <span style="color:#64748b">Khách hàng:</span>
            <strong>${customName}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:6px">
            <span style="color:#64748b">Hạng / Trạng thái:</span>
            <span style="background:#f59e0b;color:#fff;padding:2px 8px;border-radius:100px;font-size:11px;font-weight:700">VIP</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span style="color:#64748b">Điểm bảo hành/tích lũy:</span>
            <strong style="color:#2563eb">1,540 điểm</strong>
          </div>
        `;
      }, 1500);
    });
    
    demoPhone.addEventListener('keydown', (e) => {
      if(e.key === 'Enter') demoBtn.click();
    });
  }

});
