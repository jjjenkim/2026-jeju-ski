import axios from 'axios';

const API_URL = 'http://localhost:3001/api/scrape-all';

console.log('🚀 Starting FIS data scraping...\n');
console.log('⚠️  Make sure the server is running (npm run server)');
console.log('   Or run: npm run dev:full\n');

try {
  const response = await axios.get(API_URL);

  if (response.data.success) {
    console.log('✅ Scraping completed successfully!\n');
    console.log(`📊 Results:`);
    console.log(`   - Total athletes: ${response.data.athletes}`);
    console.log(`   - Total results: ${response.data.totalResults}`);
    console.log(`\n💾 Data saved to: public/athletes-with-competitions.csv`);
    console.log(`\n🔄 Refresh your browser to see the updated data!`);
  } else {
    console.error('❌ Scraping failed:', response.data.error);
  }
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    console.error('\n❌ Error: Cannot connect to the server.');
    console.error('   Please run the server first:');
    console.error('   npm run server');
    console.error('   \n   Or run both together:');
    console.error('   npm run dev:full');
  } else {
    console.error('\n❌ Error:', error.message);
  }
  process.exit(1);
}
