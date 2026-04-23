/**
 * 后台认证守卫
 * 所有后台页面在 <head> 末尾引入此文件
 * 未登录则立即跳转到登录页，防止直接访问后台 URL
 */
(function () {
  const SESSION_KEY = 'hjh_admin_token';
  const token = sessionStorage.getItem(SESSION_KEY);

  if (!token) {
    // 记录原本想访问的页面，登录后跳回
    sessionStorage.setItem('hjh_redirect', location.href);
    location.replace('login.html');
    // 停止后续脚本执行
    throw new Error('AUTH_REQUIRED');
  }

  // 解析用户信息，注入到页面（顶栏显示用户名）
  window.HJH_ADMIN = {};
  try {
    const raw = sessionStorage.getItem('hjh_admin_user');
    if (raw) window.HJH_ADMIN = JSON.parse(raw);
  } catch(e) {}

  // 提供退出登录函数
  window.adminLogout = function () {
    if (!confirm('确定要退出登录吗？')) return;
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('hjh_admin_user');
    location.replace('login.html');
  };

  // DOM 加载后，更新顶栏用户信息和退出按钮
  document.addEventListener('DOMContentLoaded', function () {
    const avatarEl = document.querySelector('.admin-avatar');
    if (avatarEl && window.HJH_ADMIN.username) {
      avatarEl.title = window.HJH_ADMIN.username + ' (' + (window.HJH_ADMIN.role || '管理员') + ')';
    }

    // 给退出按钮绑事件（如果页面有的话）
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', window.adminLogout);
  });
})();
