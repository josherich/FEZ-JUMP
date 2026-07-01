var STORAGE_KEY = 'fezJump_settings';

var defaults = {
  dashEnabled: true,
  doubleJumpEnabled: true
};

function loadSettings() {
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return Object.assign({}, defaults, JSON.parse(stored));
    }
  } catch (e) {}
  return Object.assign({}, defaults);
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      dashEnabled: settings.dashEnabled,
      doubleJumpEnabled: settings.doubleJumpEnabled
    }));
  } catch (e) {}
}

var current = loadSettings();

window.fez.settings = {
  get dashEnabled() {
    return current.dashEnabled;
  },
  get doubleJumpEnabled() {
    return current.doubleJumpEnabled;
  },
  set(key, value) {
    if (key in defaults) {
      current[key] = !!value;
      saveSettings(current);
      syncUI();
    }
  }
};

function syncUI() {
  var dashToggle = document.getElementById('setting-dash');
  var doubleJumpToggle = document.getElementById('setting-double-jump');
  if (dashToggle) dashToggle.checked = current.dashEnabled;
  if (doubleJumpToggle) doubleJumpToggle.checked = current.doubleJumpEnabled;
}

function openModal() {
  var modal = document.getElementById('settings-modal');
  if (modal) {
    syncUI();
    modal.classList.remove('hidden');
  }
}

function closeModal() {
  var modal = document.getElementById('settings-modal');
  if (modal) modal.classList.add('hidden');
}

function initSettingsUI() {
  var openBtn = document.getElementById('settings-btn');
  var closeBtn = document.getElementById('settings-close');
  var backdrop = document.getElementById('settings-backdrop');
  var dashToggle = document.getElementById('setting-dash');
  var doubleJumpToggle = document.getElementById('setting-double-jump');

  if (openBtn) {
    openBtn.addEventListener('click', openModal);
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }
  if (dashToggle) {
    dashToggle.addEventListener('change', function() {
      window.fez.settings.set('dashEnabled', dashToggle.checked);
    });
  }
  if (doubleJumpToggle) {
    doubleJumpToggle.addEventListener('change', function() {
      window.fez.settings.set('doubleJumpEnabled', doubleJumpToggle.checked);
    });
  }

  syncUI();
}

initSettingsUI();
