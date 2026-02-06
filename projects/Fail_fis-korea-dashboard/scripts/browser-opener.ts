import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Open URL in default browser
 */
export async function openInBrowser(url: string): Promise<void> {
      const scriptPath = path.join(process.cwd(), 'scripts', 'open-browser.sh');

      try {
            await execAsync(`chmod +x "${scriptPath}"`);
            await execAsync(`"${scriptPath}" "${url}"`);
            console.log(`\n🌐 브라우저에서 열었습니다: ${url}\n`);
      } catch (error) {
            console.error('브라우저 열기 실패:', error);
            console.log(`\n수동으로 열어주세요: ${url}\n`);
      }
}
