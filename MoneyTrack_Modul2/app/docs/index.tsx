import { router } from 'expo-router';
import { AppText, Card, Screen } from '@/components/UI';
import PageButton from '@/components/PageButton';
import { guides } from '@/constants/guides';
import { pageStyles } from '@/styles';

// CODELAB 2: index page + reusable external component + @ alias + barrel styles.
export default function DocumentationPage() {
  return <Screen><AppText style={pageStyles.title}>Biar makin paham.</AppText>
    <AppText muted>Panduan singkat memakai Money Track dan menjaga uang saku.</AppText>
    <Card>{Object.entries(guides).map(([slug, item]) => <PageButton key={slug} title={item.title} secondary onPress={() =>
      router.push({ pathname: '/docs/[...slug]', params: { slug: slug.split('/') } })
    } />)}</Card>
  </Screen>;
}
