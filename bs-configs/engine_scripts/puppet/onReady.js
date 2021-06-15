module.exports = async (page, scenario, vp) => {
  console.log('SCENARIO > ' + scenario.label);
  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
  await require('./clickAndHoverHelper')(page, scenario);

  // Disable all CSS animations.
  page.addStyleTag({content: '*, *::after, *::before { transition: none !important; animation: none !important; transform: none !important; }}'})

  // Remove iubenda cookie consent dialog.
  // iubdenda - Accept button type.
  try {
    let element = await page.waitForSelector('.iubenda-cs-accept-btn', { 'timeout': 2000, 'visible': true });
    await element.click();
    console.log('iubenda closed.')
  }
  catch {
    console.log('iubenda does not exists.')
  }

  // iubdenda - Close button type.
  try {
    let element = await page.waitForSelector('.iubenda-cs-close-btn', { 'timeout': 2000, 'visible': true });
    await element.click();
    console.log('iubenda closed.')
  }
  catch {
    console.log('iubenda does not exists.')
  }

  // Remove Hubspot chat prompt.
  try {
    let element = await page.waitForSelector('.initial-message-close-button', { 'timeout': 2000, 'visible': true });
    await element.click();
    console.log('Hubspot chat closed.')
  }
  catch {
    console.log('Hubspot chat does not exists.')
  }

  // Execute any custom script.
  if (scenario.script) {
    try {
      new AsyncFunction("page", scenario.script)(page)
      console.log('Custom script has been executed.')
    }
    catch {
      console.log('Unable to execute the custom script.')
    }
  }

  // add more ready handlers here...
};
