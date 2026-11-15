import { JobLink } from '@/components/JobLink';
import { Body, Screen, Title } from '@/components/Screen';

export default function CommunityScreen() {
  return (
    <Screen>
      <Title>Community</Title>
      <Body>Reading stays free. This is not a place to hire someone or to pay a stranger.</Body>
      <JobLink href="/mom-feed" label="Mom Feed" detail="Memories other mothers have shared" />
      <JobLink href="/recipes" label="Baby Recipes" detail="Purees, khichdi, and finger foods" />
      <JobLink href="/tips" label="Parenting Tips" detail="Teething, sleep, and feeding" />
    </Screen>
  );
}
