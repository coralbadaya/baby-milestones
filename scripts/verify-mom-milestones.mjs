import { momMilestonePeriods, getAllMomMilestoneItemIds } from '../src/data/momMilestones.js';
import { MOM_CARE_CATEGORIES } from '../src/data/momCareTips.js';
import { validateMomMilestoneData } from '../src/utils/momMilestones.js';

let failed = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed += 1;
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

const validationErrors = validateMomMilestoneData();
if (validationErrors.length) {
  validationErrors.forEach((e) => fail(e));
} else {
  ok('Mom milestone schema validation');
}

if (momMilestonePeriods.length < 6) {
  fail(`Expected at least 6 periods, got ${momMilestonePeriods.length}`);
} else {
  ok(`${momMilestonePeriods.length} mom milestone periods`);
}

const ids = getAllMomMilestoneItemIds();
if (ids.length < 30) {
  fail(`Expected at least 30 checkable items, got ${ids.length}`);
} else {
  ok(`${ids.length} unique mom milestone item ids`);
}

for (const period of momMilestonePeriods) {
  if (period.relatedTopic && !MOM_CARE_CATEGORIES.includes(period.relatedTopic)) {
    fail(`Period ${period.id}: relatedTopic not in MOM_CARE_CATEGORIES`);
  }
  if (!period.watchFor?.length) {
    fail(`Period ${period.id}: missing watchFor`);
  }
}

if (failed > 0) {
  process.exit(1);
}

ok('Mom milestones verification complete');
