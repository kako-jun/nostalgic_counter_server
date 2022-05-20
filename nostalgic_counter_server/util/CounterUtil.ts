import { datetime } from "https://deno.land/x/ptera/mod.ts";

import LogUtil from "./LogUtil.ts";
import StorageUtil, { CounterType } from "./StorageUtil.ts";

class CounterUtil {
  // class variables

  // class methods
  static async create(id: string) {
    const now = datetime();
    const yesterday = now.subtract({ day: 1 });
    const lastWeek = now.subtract({ day: 7 });
    const lastMonth = now.subtract({ month: 1 });
    const lastYear = now.subtract({ year: 1 });
    const defaultCounter: CounterType = {
      total: 0,
      today: 0,
      today_date: now.format("YYYY-MM-dd"),
      yesterday: 0,
      yesterday_date: yesterday.format("YYYY-MM-dd"),
      this_week: 0,
      this_week_date: now.format("YYYY-MM-dd"),
      last_week: 0,
      last_week_date: lastWeek.format("YYYY-MM-dd"),
      this_month: 0,
      this_month_date: now.format("YYYY-MM"),
      last_month: 0,
      last_month_date: lastMonth.format("YYYY-MM"),
      this_year: 0,
      this_year_date: now.format("YYYY"),
      last_year: 0,
      last_year_date: lastYear.format("YYYY"),
    };

    try {
      await StorageUtil.ids.updateOne({ id }, { $set: { counter: defaultCounter } }, { upsert: true });
      return true;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }

  static async load(id: string) {
    try {
      const idDoc = await StorageUtil.ids.findOne({ id });
      if (idDoc) {
        const counter = idDoc.counter;
        if (counter) {
          LogUtil.debug("counter", counter);
          return counter;
        }
      }
    } catch (e) {
      LogUtil.error(e.message);
    }

    return null;
  }

  static async increment(id: string) {
    try {
      const counter = await CounterUtil.load(id);
      if (counter) {
        const now = datetime();
        const yesterday = now.subtract({ day: 1 });
        const lastMonth = now.subtract({ month: 1 });
        const lastYear = now.subtract({ year: 1 });

        let todayCount = 0;
        const todayDate = now.format("YYYY-MM-dd");
        if (todayDate === counter.today_date) {
          todayCount = counter.today + 1;
        }

        let yesterdayCount = 0;
        const yesterdayDate = yesterday.format("YYYY-MM-dd");
        if (yesterdayDate === counter.yesterday_date) {
          yesterdayCount = counter.yesterday;
        } else if (yesterdayDate === counter.today_date) {
          yesterdayCount = counter.today;
        }

        let thisWeekCount = 0;
        const thisWeekDate = now.format("YYYY-MM-dd");
        if (thisWeekDate === counter.this_week_date) {
          thisWeekCount = counter.this_week + 1;
        }

        let lastWeekCount = 0;
        const lastWeekDate = lastMonth.format("YYYY-MM-dd");
        if (lastWeekDate === counter.last_week_date) {
          lastWeekCount = counter.last_week;
        } else if (lastWeekDate === counter.this_week_date) {
          lastWeekCount = counter.this_week;
        }

        let thisMonthCount = 0;
        const thisMonthDate = now.format("YYYY-MM");
        if (thisMonthDate === counter.this_month_date) {
          thisMonthCount = counter.this_month + 1;
        }

        let lastMonthCount = 0;
        const lastMonthDate = lastMonth.format("YYYY-MM");
        if (lastMonthDate === counter.last_month_date) {
          lastMonthCount = counter.last_month;
        } else if (lastMonthDate === counter.this_month_date) {
          lastMonthCount = counter.this_month;
        }

        let thisYearCount = 0;
        const thisYearDate = now.format("YYYY");
        if (thisYearDate === counter.this_year_date) {
          thisYearCount = counter.this_year + 1;
        }

        let lastYearCount = 0;
        const lastYearDate = lastYear.format("YYYY");
        if (lastYearDate === counter.last_year_date) {
          lastYearCount = counter.last_year;
        } else if (lastYearDate === counter.this_year_date) {
          lastYearCount = counter.this_year;
        }

        const newCounter: CounterType = {
          total: counter.total + 1,
          today: todayCount,
          today_date: todayDate,
          yesterday: yesterdayCount,
          yesterday_date: yesterdayDate,
          this_week: thisWeekCount,
          this_week_date: thisWeekDate,
          last_week: lastWeekCount,
          last_week_date: lastWeekDate,
          this_month: thisMonthCount,
          this_month_date: thisMonthDate,
          last_month: lastMonthCount,
          last_month_date: lastMonthDate,
          this_year: thisYearCount,
          this_year_date: thisYearDate,
          last_year: lastYearCount,
          last_year_date: lastYearDate,
        };

        await StorageUtil.ids.updateOne({ id }, { $set: { counter: newCounter } }, { upsert: true });
        return true;
      }
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }
}

export default CounterUtil;
