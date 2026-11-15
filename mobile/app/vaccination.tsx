import { Disclaimer } from '@/components/Disclaimer';
import { Body, Screen, Title } from '@/components/Screen';

export default function VaccinationScreen() {
  return (
    <Screen>
      <Title>Vaccination tracker</Title>
      <Body>
        A schedule and a log. The app will tell you a window is opening. It will not tell you which dose to give.
      </Body>
      <Disclaimer audience="baby" />
    </Screen>
  );
}
