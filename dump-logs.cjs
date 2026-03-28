const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', error => {
    errors.push('PAGE_ERROR: ' + error.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push('CONSOLE_ERROR: ' + msg.text());
    }
  });

  try {
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
    
    // Evaluate some clicks to get to the card design page
    await page.evaluate(() => {
       const btns = Array.from(document.querySelectorAll('button'));
       const createBtn = btns.find(b => b.textContent.includes('Create Your Card') || b.textContent.includes('Edit Card'));
       if (createBtn) createBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));

    // Try finding the 'Redesign' button
    await page.evaluate(() => {
       const btns = Array.from(document.querySelectorAll('button'));
       const designBtn = btns.find(b => b.textContent.includes('Redesign') || b.textContent.includes('Design'));
       if (designBtn) designBtn.click();
    });

    await new Promise(r => setTimeout(r, 2000));
    
    // In case there is no Redesign button because data is empty, insert data
    const hasData = await page.evaluate(() => {
       const inputs = Array.from(document.querySelectorAll('input'));
       if (inputs.length > 0) {
           inputs[0].value = 'Test Name';
           inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
           return true;
       }
       return false;
    });

    if (hasData) {
        await new Promise(r => setTimeout(r, 1000));
        await page.evaluate(() => {
             const btns = Array.from(document.querySelectorAll('button'));
             const designBtn = btns.find(b => b.textContent.includes('Redesign') || b.textContent.includes('Design') || b.textContent.includes('Card'));
             if (designBtn) designBtn.click();
        });
        await new Promise(r => setTimeout(r, 2000));
    }

  } catch(e) {
    errors.push('SCRIPT_ERROR: ' + e.message);
  }

  console.log(JSON.stringify(errors, null, 2));
  await browser.close();
})();
