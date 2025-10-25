
// Basic PayPiMart frontend logic (no backend).
// Note: Full Pi SDK features work only inside Pi Browser.
(function(){
  // Try to avoid errors if Pi SDK not present
  const PiPresent = typeof Pi !== 'undefined' && Pi && Pi.init;
  if (PiPresent) {
    try { Pi.init({ version: "2.0" }); } catch(e){ console.warn("Pi.init failed", e); }
  }

  const loginBtn = document.getElementById('login');
  const userArea = document.getElementById('userArea');
  const usernameSpan = document.getElementById('username');
  const statusDiv = document.getElementById('status');

  function showStatus(msg, isError){
    statusDiv.textContent = msg;
    statusDiv.style.color = isError ? '#c0392b' : '#333';
  }

  async function performLogin(){
    if (!PiPresent){
      showStatus("Pi SDK tidak terdeteksi. Fitur login bekerja sempurna di Pi Browser.", true);
      // fallback: ask for display name
      const fallback = prompt("Masukkan nama panggilan untuk demo:");
      if (fallback){
        onLoginSuccess({ user: { username: fallback } });
      }
      return;
    }

    try {
      const user = await Pi.authenticate(["username"], (payment) => {
        console.log("Payment callback", payment);
      });
      onLoginSuccess(user);
    } catch (err){
      console.error("Login error:", err);
      showStatus("Login gagal: " + (err.message || err), true);
    }
  }

  function onLoginSuccess(user){
    const uname = (user && user.user && user.user.username) ? user.user.username : (user || "Pioneer");
    usernameSpan.textContent = uname;
    document.getElementById('login').style.display = 'none';
    userArea.classList.remove('hidden');
    showStatus("Login berhasil. Pilih metode pembayaran.", false);
  }

  // Button actions (frontend only). Replace with server calls when ready.
  document.getElementById('pay_qris').addEventListener('click', function(){
    // In a real flow: call backend -> OnRamp -> generate QRIS image/URL
    showStatus("Membuat invoice QRIS via OnRamp Money... (demo).");
    alert("Demo: QRIS invoice akan ditampilkan. Implementasikan backend untuk memanggil OnRamp Money API.");
  });

  document.getElementById('pay_wallet').addEventListener('click', function(){
    showStatus("Menyiapkan pembayaran Dompet Digital via OnRamp Money... (demo).");
    alert("Demo: Redirect ke halaman pembayaran eWallet. Hubungkan backend ke OnRamp API untuk produksi.");
  });

  document.getElementById('pay_wa').addEventListener('click', function(){
    const nomor = prompt("Masukkan nomor WhatsApp penerima (contoh: 6281234567890):");
    if (!nomor) { showStatus("Pembayaran WhatsApp dibatalkan."); return; }
    const nominalPi = prompt("Masukkan jumlah pembayaran (dalam Pi):", "1");
    if (!nominalPi) { showStatus("Pembayaran WhatsApp dibatalkan."); return; }

    showStatus("Membuat permintaan pembayaran via WhatsApp (OnRamp Money)... (demo).");
    // In production: POST to backend -> OnRamp -> get wa.deep link or bot conversa
    // For demo we open wa.me chat with a prefilled message
    const text = encodeURIComponent(`Saya ingin menerima pembayaran ${nominalPi} Pi via PayPiMart. Mohon proses konversi melalui OnRamp Money.`);
    const waUrl = `https://wa.me/${nomor}?text=${text}`;
    window.open(waUrl, '_blank');
  });

  loginBtn.addEventListener('click', performLogin);

  // If Pi SDK already authenticated (some flows), show nothing until user interacts.
})();
    
