var network = new Lampa.Reguest();
var api = Lampa.Utils.protocol() + Lampa.Manifest.cub_domain + '/api/';

function addDevice(message) {
  var enter_cub = false;

  var displayModal = function displayModal() {
    // Создаем HTML с вашим дизайном
    var htmlContent = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999;">
        <div class="left-section">
          <div class="background-slider" id="backgroundSlider"></div>
          <div class="left-overlay"></div>
          <div class="bg-indicators" id="bgIndicators"></div>
        </div>

        <div class="right-section">
          <div class="login-header">
            <span class="line">KINOPLUS</span>
            <span class="line">Войдите</span>
            <span class="line">с помощью</span>
            <span class="line">полученного логина</span>
          </div>
          <div class="main-slider-container">
            <div class="main-slider" id="mainSlider"></div>
            <div class="main-indicators" id="mainIndicators"></div>
          </div>
          <div class="simple-button selector" id="passwordLoginBtn" style="margin: 0.5em;">Вход по паролю</div>
          <span class="info" style="display: flex; align-items: center;">
            <div style="width: 2px; height: 20px; background-color: red; margin-right: 10px;"></div>
            ${message ? message + '<br><br>unic_id: ' + Lampa.Storage.get('lampac_unic_id', '') : 'Чтобы получить логин, обратитесь к администратору.'}
          </span>
        </div>
      </div>
    `;

    // Добавляем стили
    var styles = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap&subset=cyrillic');

        .lampa-custom-login * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .lampa-custom-login {
          font-family: 'Inter', sans-serif;
          height: 100vh;
          overflow: hidden;
          position: relative;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .lampa-custom-login img {
          pointer-events: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .lampa-custom-login .left-section {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .lampa-custom-login .background-slider {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .lampa-custom-login .bg-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1.5s ease-in-out;
        }

        .lampa-custom-login .bg-slide.active {
          opacity: 1;
        }

        .lampa-custom-login .bg-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lampa-custom-login .bg-indicators {
          position: absolute;
          bottom: 40px;
          left: 40px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          z-index: 3;
          backdrop-filter: blur(5px);
          background: rgba(0, 0, 0, 0.2);
          padding: 15px;
          border-radius: 99px;
        }

        .lampa-custom-login .bg-indicator {
          width: 3px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          position: relative;
        }

        .lampa-custom-login .bg-indicator:not(.active) {
          height: 25px;
        }

        .lampa-custom-login .bg-indicator.active {
          height: 40px;
          background: rgba(255, 255, 255, 0.5);
        }

        .lampa-custom-login .bg-indicator-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.9);
          height: 0%;
          transition: height 0.1s linear;
        }

        .lampa-custom-login .bg-indicator.active .bg-indicator-progress {
          animation: bgFillProgress 4s linear infinite;
        }

        @keyframes bgFillProgress {
          0% { height: 0%; }
          100% { height: 100%; }
        }

        .lampa-custom-login .left-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .lampa-custom-login .right-section {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background: rgba(9, 9, 9, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 60px;
          color: white;
          z-index: 4;
          font-family: 'Dela Gothic One', sans-serif;
        }

        .lampa-custom-login .login-header {
          font-size: 36px;
          font-weight: 300;
          line-height: 1.2;
          margin-bottom: 60px;
          color: #ffffff;
        }

        .lampa-custom-login .login-header .line {
          display: block;
          opacity: 1;
          transform: translateY(0);
        }

        .lampa-custom-login .main-slider-container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto 40px;
        }

        .lampa-custom-login .main-slider {
          position: relative;
          width: 100%;
          height: 300px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .lampa-custom-login .main-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          transform: translateY(50px) scale(0.95);
          transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .lampa-custom-login .main-slide.active {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .lampa-custom-login .main-slide.exit {
          opacity: 0;
          transform: translateY(-30px) scale(0.9);
          transition: all 0.8s ease-in;
        }

        .lampa-custom-login .main-slide img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .lampa-custom-login .main-indicators {
          display: none;
          gap: 8px;
          margin-bottom: 40px;
          justify-content: center;
        }

        .lampa-custom-login .simple-button {
          background: #fff;
          border: none;
          color: rgb(0, 0, 0);
          padding: 0.3em 2em;
          font-size: 1.3em;
          height: 2.8em;
          border-radius: 1em;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'SegoeUI', sans-serif;
          align-items: center;
          display: inline-block;
          text-align: center;
          line-height: 2.2em;
        }

        .lampa-custom-login .info {
          color: rgb(99, 99, 99);
          font-size: 1em;
          margin-top: 20px;
        }

        .lampa-custom-login .simple-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
        }

        .lampa-custom-login .simple-button:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .lampa-custom-login .right-section {
            width: 100%;
            padding: 30px;
          }

          .lampa-custom-login .bg-indicators {
            left: 20px;
            bottom: 20px;
          }

          .lampa-custom-login .login-header {
            font-size: 28px;
            margin-bottom: 30px;
          }

          .lampa-custom-login .main-slider {
            height: 200px;
          }
        }
      </style>
    `;

    // Добавляем стили в head
    if (!document.getElementById('lampa-custom-login-styles')) {
      var styleElement = document.createElement('div');
      styleElement.id = 'lampa-custom-login-styles';
      styleElement.innerHTML = styles;
      document.head.appendChild(styleElement);
    }

    // Создаем контейнер
    var container = document.createElement('div');
    container.className = 'lampa-custom-login';
    container.innerHTML = htmlContent;
    
    // Добавляем в body
    document.body.appendChild(container);

    // Инициализируем слайдеры
    setTimeout(function() {
      initSliders();
    }, 100);

    // Обработчик кнопки входа по паролю с hover:enter из старого плагина
    container.querySelector('#passwordLoginBtn').addEventListener('click', function() {
      handlePasswordLogin();
    });

    // Поддержка hover:enter для совместимости с Lampa
    var passwordBtn = container.querySelector('#passwordLoginBtn');
    if (passwordBtn) {
      passwordBtn.addEventListener('hover:enter', handlePasswordLogin);
    }

    function handlePasswordLogin() {
      document.body.removeChild(container);
      
      Lampa.Input.edit({
        free: true,
        title: Lampa.Lang.translate('Введите пароль'),
        nosave: true,
        value: '',
        nomic: true
      }, function(new_value) {
        displayModal();

        var code = new_value;

        if (new_value) {
          Lampa.Loading.start(function() {
            network.clear();
            Lampa.Loading.stop();
          });
          network.clear();

          var u = '{localhost}/testaccsdb';
          u = Lampa.Utils.addUrlComponent(u, 'account_email=' + encodeURIComponent(code));

          network.silent(u, function(result) {
            Lampa.Loading.stop();
            if (!result.accsdb) {
              window.sync_disable = true;
              Lampa.Storage.set('lampac_unic_id', code);
              window.location.reload();
            } else {
              Lampa.Noty.show(Lampa.Lang.translate('Неправильный пароль'));
            }
          }, function() {
            Lampa.Loading.stop();
            Lampa.Noty.show(Lampa.Lang.translate('account_code_error'));
          }, {
            code: code
          });
        } else {
          Lampa.Noty.show(Lampa.Lang.translate('account_code_wrong'));
        }
      });
    }

    // Функция инициализации слайдеров
    function initSliders() {
      // Фоновый слайдер
      let bgCurrentSlide = 0;
      let bgIsAnimating = false;
      const bgTotalSlides = 10;
      const bgSlides = [];
      const bgIndicators = [];
      let bgSlideInterval;

      // Основной слайдер
      let mainCurrentSlide = 0;
      let mainIsAnimating = false;
      const mainTotalSlides = 7;
      const mainSlides = [];
      const mainIndicators = [];
      let mainSlideInterval;

      // Создание фонового слайдера
      function createBgSlider() {
        const containerEl = container.querySelector('#backgroundSlider');
        const indicatorsContainer = container.querySelector('#bgIndicators');
        
        for (let i = 1; i <= bgTotalSlides; i++) {
          // Создаем слайд
          const slide = document.createElement('div');
          slide.className = 'bg-slide';
          if (i === 1) slide.classList.add('active');
          
          const img = document.createElement('img');
          img.src = `ico/bac/${i}.png`;
          img.alt = `Фон ${i}`;
          img.onerror = function() {
            this.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='%23667eea'/><text x='50%' y='50%' font-family='Arial' font-size='24' fill='%23fff' text-anchor='middle' dy='0.3em'>Фон ${i}</text></svg>`;
          };
          
          slide.appendChild(img);
          containerEl.appendChild(slide);
          bgSlides.push(slide);

          // Создаем индикатор
          const indicator = document.createElement('div');
          indicator.className = 'bg-indicator';
          if (i === 1) indicator.classList.add('active');
          
          const progress = document.createElement('div');
          progress.className = 'bg-indicator-progress';
          indicator.appendChild(progress);
          
          indicator.addEventListener('click', () => goToBgSlide(i - 1));
          
          indicatorsContainer.appendChild(indicator);
          bgIndicators.push(indicator);
        }
      }

      // Создание основного слайдера
      function createMainSlider() {
        const containerEl = container.querySelector('#mainSlider');
        const indicatorsContainer = container.querySelector('#mainIndicators');
        
        for (let i = 1; i <= mainTotalSlides; i++) {
          // Создаем слайд
          const slide = document.createElement('div');
          slide.className = 'main-slide';
          if (i === 1) slide.classList.add('active');
          
          const img = document.createElement('img');
          img.src = `ico/${i}.webp`;
          img.alt = `Фото ${i}`;
          img.onerror = function() {
            this.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23333'/><text x='50%' y='50%' font-family='Arial' font-size='18' fill='%23fff' text-anchor='middle' dy='0.3em'>Фото ${i}</text></svg>`;
          };
          
          slide.appendChild(img);
          containerEl.appendChild(slide);
          mainSlides.push(slide);

          // Создаем индикатор
          const indicator = document.createElement('div');
          indicator.className = 'main-indicator';
          if (i === 1) indicator.classList.add('active');
          
          const progress = document.createElement('div');
          progress.className = 'main-indicator-progress';
          indicator.appendChild(progress);
          
          indicator.addEventListener('click', () => goToMainSlide(i - 1));
          
          indicatorsContainer.appendChild(indicator);
          mainIndicators.push(indicator);
        }
      }

      // Переход к фоновому слайду
      function goToBgSlide(slideIndex) {
        if (bgIsAnimating || slideIndex === bgCurrentSlide) return;
        
        bgSlides[bgCurrentSlide].classList.remove('active');
        bgIndicators[bgCurrentSlide].classList.remove('active');
        
        bgCurrentSlide = slideIndex;
        bgSlides[bgCurrentSlide].classList.add('active');
        bgIndicators[bgCurrentSlide].classList.add('active');
      }

      // Переход к основному слайду
      function goToMainSlide(slideIndex) {
        if (mainIsAnimating || slideIndex === mainCurrentSlide) return;
        
        mainIsAnimating = true;
        
        mainSlides[mainCurrentSlide].classList.remove('active');
        mainSlides[mainCurrentSlide].classList.add('exit');
        mainIndicators[mainCurrentSlide].classList.remove('active');
        
        setTimeout(() => {
          mainSlides[mainCurrentSlide].classList.remove('exit');
          
          mainCurrentSlide = slideIndex;
          mainSlides[mainCurrentSlide].classList.add('active');
          mainIndicators[mainCurrentSlide].classList.add('active');
          
          if (mainSlideInterval) {
            clearInterval(mainSlideInterval);
            startMainSlideshow();
          }
          
          setTimeout(() => {
            mainIsAnimating = false;
          }, 600);
        }, 400);
      }

      // Следующий слайд для фона
      function nextBgSlide() {
        const nextIndex = (bgCurrentSlide + 1) % bgTotalSlides;
        goToBgSlide(nextIndex);
      }

      // Следующий слайд для основного
      function nextMainSlide() {
        const nextIndex = (mainCurrentSlide + 1) % mainTotalSlides;
        goToMainSlide(nextIndex);
      }

      // Запуск слайдшоу
      function startBgSlideshow() {
        bgSlideInterval = setInterval(nextBgSlide, 4000);
      }

      function startMainSlideshow() {
        mainSlideInterval = setInterval(nextMainSlide, 3000);
      }

      // Инициализация
      createBgSlider();
      createMainSlider();
      startBgSlideshow();
      startMainSlideshow();
    }
  };
  
  displayModal();
}

function checkAutch() {
  var url = '{localhost}/testaccsdb';

  var email = Lampa.Storage.get('account_email');
  if (email) url = Lampa.Utils.addUrlComponent(url, 'account_email=' + encodeURIComponent(email));

  var uid = Lampa.Storage.get('lampac_unic_id', '');
  if (uid) url = Lampa.Utils.addUrlComponent(url, 'uid=' + encodeURIComponent(uid));

  var token = '{token}';
  if (token) url = Lampa.Utils.addUrlComponent(url, 'token={token}');

  network.silent(url, function(res) {
    if (res.accsdb) {
      document.getElementById("app").style.display = "none";
      var pwait = document.createElement("div");
      pwait.style.fontSize = "xxx-large";
      pwait.style.textAlign = "center";
      pwait.style.marginTop = "2em";
      pwait.textContent = "please wait";
      document.body.appendChild(pwait);
    
      setTimeout(function() {
        addDevice(res.msg);
      }, 5000);
    } else {
      network.clear();
      network = null;
    }
  }, function() {
    //setTimeout(checkAutch, 1000 * 3);
  });
}

checkAutch();
