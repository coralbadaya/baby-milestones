import { INDIA_IAP_VACCINES } from './indiaIap';
import { CDC_US_VACCINES } from './cdcUs';

export const VACCINE_SCHEDULES = {
  india: {
    id: 'india',
    label: 'India IAP / UIP',
    notes: 'IAP/UIP style schedule (0–36 months)',
    items: INDIA_IAP_VACCINES,
  },
  cdc: {
    id: 'cdc',
    label: 'CDC (US)',
    notes: 'CDC childhood schedule (birth to toddler)',
    items: CDC_US_VACCINES,
  },
  custom: {
    id: 'custom',
    label: 'Custom',
    notes: 'Your own editable schedule',
    items: [],
  },
};

export const VACCINE_SCHEDULE_OPTIONS = Object.values(VACCINE_SCHEDULES).map((s) => ({
  value: s.id,
  label: s.label,
}));

export const DEFAULT_CUSTOM_VACCINES = [
  {
    id: 'custom-template-6m',
    name: 'Example vaccine',
    dueMonth: 6,
    doseNumber: 1,
    totalDoses: 1,
    notes: 'Edit or remove this template item',
    optional: true,
  },
];
