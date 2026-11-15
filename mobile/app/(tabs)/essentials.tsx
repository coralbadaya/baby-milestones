import { JobLink } from '@/components/JobLink';
import { Body, Screen, Title } from '@/components/Screen';

export default function EssentialsScreen() {
  return (
    <Screen>
      <Title>Essentials</Title>
      <Body>Shopping and travel for this stage. The lists stay practical and short.</Body>
      <JobLink href="/shopping" label="Shopping" detail="The checklist for this stage" />
      <JobLink href="/travel" label="Travel" detail="Flights, road trips, and long haul" />
    </Screen>
  );
}
