import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the dev server to be ready
    console.log('⏳ Waiting for dev server...');
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
    
    // Try to connect to the server with retries
    let retries = 30;
    while (retries > 0) {
      try {
        const response = await page.goto(baseURL, { timeout: 5000 });
        if (response && response.ok()) {
          console.log('✅ Dev server is ready');
          break;
        }
      } catch (error) {
        console.log(`⏳ Waiting for server... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        retries--;
      }
    }
    
    if (retries === 0) {
      throw new Error('Dev server failed to start');
    }
    
    // Pre-warm the application
    console.log('🔥 Pre-warming application...');
    await page.goto(`${baseURL}/pokemon`);
    await page.waitForLoadState('networkidle');
    
    // Wait for initial Pokemon data to load
    await page.waitForSelector('[data-testid="pokemon-card"]', { timeout: 10000 });
    console.log('✅ Application pre-warmed');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('✅ Global setup completed');
}

export default globalSetup;