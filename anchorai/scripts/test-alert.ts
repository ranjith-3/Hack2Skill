// ============================================================
// AnchorAI — Test Script for Email Delivery & AI Alert Generation
// Run with: npx tsx scripts/test-alert.ts
// ============================================================

import 'dotenv/config'; // Load .env.local variables
import { sendEmail } from '../src/lib/email';

const mockAiMessage = `Hi Mom, just a gentle heads-up that Ranjith used their support tool today. No action required — they are safe and actively using their recovery tools. Just keeping you in the loop with care.`;

async function runTest() {
  console.log('🚀 Starting AnchorAI Email Validation Test...\n');

  try {
    console.log('1️⃣  Simulating AI Alert Generation...');
    console.log(`    Message: "${mockAiMessage}"\n`);

    console.log('2️⃣  Initializing Nodemailer Email Delivery...');
    
    // We pass a dummy email. If no SMTP is set in .env.local, 
    // Nodemailer will auto-generate an Ethereal test account.
    const result = await sendEmail({
      to: 'caregiver@example.com',
      subject: 'AnchorAI Alert: Support needed for Ranjith',
      text: mockAiMessage,
    });

    console.log('\n✅ TEST SUCCESSFUL!');
    console.log(`   Message ID: ${result.messageId}`);
    
    if (result.previewUrl) {
      console.log(`   \n🔗 CLICK HERE TO VIEW THE TEST EMAIL IN YOUR BROWSER:`);
      console.log(`   ${result.previewUrl}`);
    } else {
      console.log('   (Email sent using real SMTP credentials)');
    }

  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error(error);
  }
}

runTest();
