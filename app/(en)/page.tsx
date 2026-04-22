import { HomePage } from '@/components/home-page';
import { homePageContent } from '@/lib/homepage-content';
import { createHomePageMetadata } from '@/lib/site-metadata';

export const metadata = createHomePageMetadata('en');

export default function EnglishHomePage() {
  return <HomePage content={homePageContent.en} locale="en" />;
}
