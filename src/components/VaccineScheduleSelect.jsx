import Select from './Select';
import { VACCINE_SCHEDULE_OPTIONS } from '../data/vaccines';

function VaccineScheduleSelect({ value, onChange }) {
  return (
    <Select
      id="vaccination-schedule"
      label="Schedule"
      value={value}
      onChange={onChange}
      options={VACCINE_SCHEDULE_OPTIONS}
      className="vaccination-schedule-select"
    />
  );
}

export default VaccineScheduleSelect;
