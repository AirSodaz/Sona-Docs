import { HomePage } from '@/components/home-page';
import { homePageContent } from '@/lib/homepage-content';
import { createHomePageMetadata } from '@/lib/site-metadata';

export const metadata = createHomePageMetadata('zh-CN');

export default function ChineseHomePage() {
  return <HomePage content={homePageContent['zh-CN']} />;
}
