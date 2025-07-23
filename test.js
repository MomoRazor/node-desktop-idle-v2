import { desktopIdle } from 'node-desktop-idle-v2';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

try {
  console.log('Starting desktop idle monitoring test...');
  
  // Test startMonitoring
  desktopIdle.startMonitoring();
  console.log('✓ startMonitoring() called successfully');

  let measurements = 0;
  let validMeasurements = 0;

  const interval = setInterval(() => {
    try {
      const idle = desktopIdle.getIdleTime();
      measurements++;
      
      if (typeof idle === 'number' && idle >= 0) {
        validMeasurements++;
        console.log(`✓ Test idle: ${idle} seconds (measurement ${measurements})`);
      } else {
        console.error(`✗ Invalid idle time: ${idle} (expected non-negative number)`);
      }
    } catch (error) {
      console.error(`✗ Error getting idle time: ${error.message}`);
    }
  }, 1000);

  await sleep(10000);
  clearInterval(interval);

  // Test stopMonitoring
  desktopIdle.stopMonitoring();
  console.log('✓ stopMonitoring() called successfully');

  // Validate results
  if (measurements === 0) {
    throw new Error('No measurements were taken');
  }
  
  if (validMeasurements === 0) {
    throw new Error('No valid measurements were recorded');
  }

  const successRate = (validMeasurements / measurements) * 100;
  console.log(`\n✓ Test completed successfully!`);
  console.log(`  - Total measurements: ${measurements}`);
  console.log(`  - Valid measurements: ${validMeasurements}`);
  console.log(`  - Success rate: ${successRate.toFixed(1)}%`);

  process.exit(0);

} catch (error) {
  console.error(`\n✗ Test failed: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
} 