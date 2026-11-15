import { Disclaimer } from '@/components/Disclaimer';
import { Body, Screen, Title } from '@/components/Screen';

export default function CareScreen() {
  return (
    <Screen>
      <Title>My Care</Title>
      <Body>
        Postpartum recovery sits beside the baby’s month, not behind it. The timeline from the website comes here next.
      </Body>
      <Disclaimer audience="mother" />
    </Screen>
  );
}
