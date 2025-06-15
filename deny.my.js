var network = new Lampa.Reguest();
var api = Lampa.Utils.protocol() + Lampa.Manifest.cub_domain + '/api/';

function addDevice(message) {
  var enter_cub = false;

  var displayModal = function displayModal() {
    var html = Lampa.Template.get('account_add_device');

    if (!enter_cub) {

      if (message) {
        html.find('.about').html(message + '<br><br>unic_id: ' + Lampa.Storage.get('lampac_unic_id', ''));
      } else {
        html.find('.about').html('{cubMesage}');
      }

      html.find('.simple-button').remove();
      html.find('.account-add-device__qr').remove();

      var foot = $('<div class="modal__footer"></div>');
      var button_cub = $('<div class="simple-button selector" style="margin: 0.5em;">Сменить аккаунт</div>');
      var button_cod = $('<div class="simple-button selector" style="margin: 0.5em;">Вход по паролю</div>');
      var button_guest = $('<div class="simple-button selector" style="margin: 0.5em;">Войти как гость</div>');

      foot.append(button_cub);
      foot.append(button_cod);
      foot.append(button_guest);

      html.append(foot);

      button_cub.on('hover:enter', function() {
        enter_cub = true;
        Lampa.Modal.close();
        displayModal();
      });

      button_cod.on('hover:enter', function() {
        Lampa.Modal.close();
        Lampa.Input.edit({
          free: true,
          title: Lampa.Lang.translate('Введите пароль'),
          nosave: true,
          value: '',
          //layout: 'nums',
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
      });

    button_guest.on('hover:enter', function() {
    Lampa.Modal.close();
    Lampa.Storage.set('lampac_unic_id', 'guest');
    window.sync_disable = true;
    window.location.reload();
});
      
    } else {
      html.find('.simple-button').on('hover:enter', function() {
        Lampa.Modal.close();
        Lampa.Input.edit({
          free: true,
          title: Lampa.Lang.translate('account_code_enter'),
          nosave: true,
          value: '',
          layout: 'nums',
          nomic: true
        }, function(new_value) {
          displayModal();

          var code = parseInt(new_value);

          if (new_value && new_value.length == 6 && !isNaN(code)) {
            Lampa.Loading.start(function() {
              network.clear();
              Lampa.Loading.stop();
            });
            network.clear();
            network.silent(api + 'device/add', function(result) {
              Lampa.Loading.stop();
              Lampa.Storage.set('account', result, true);
              Lampa.Storage.set('account_email', result.email, true);
              window.location.reload();
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
      });
    }


    Lampa.Modal.open({
      title: '',
      html: html,
      size: 'full',
      onBack: function onBack() {
        Lampa.Modal.close();
        displayModal();
      }
    });
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