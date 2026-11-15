import { Disclaimer } from '@/components/Disclaimer';
import { Body, Screen, Title } from '@/components/Screen';

export default function BabyScreen() {
  return (
    <Screen>
      <Title>My Baby</Title>
      <Body>
        Milestones for the month Today already named. Checking them off stays free, and it will use the same list as the website.
      </Body>
      <Disclaimer audience="baby" />
    </Screen>
  );
}
