import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');
  
  // Clean up any global resources if needed
  // For example, stop test databases, clean up files, etc.
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;