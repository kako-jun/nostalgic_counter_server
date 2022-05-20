import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";
import { datetime } from "https://deno.land/x/ptera/mod.ts";
import * as Hjson from "https://deno.land/x/hjson_deno/mod.ts";

import LogUtil from "./LogUtil.ts";

type CounterType = {
  total: number;
  today: number;
  today_date: string;
  yesterday: number;
  yesterday_date: string;
  this_week: number;
  this_week_date: string;
  last_week: number;
  last_week_date: string;
  this_month: number;
  this_month_date: string;
  last_month: number;
  last_month_date: string;
  this_year: number;
  this_year_date: string;
  last_year: number;
  last_year_date: string;
};

class CounterUtil {
  // class variables
  static rootPath = "";

  // class methods
  static setup() {
    let home = Deno.env.get("HOME") || `${Deno.env.get("HOMEDRIVE")}${Deno.env.get("HOMEPATH")}`;
    if (home) {
      home = home.replaceAll("\\", "/");
    }

    CounterUtil.rootPath = `${home}/.nostalgic_counter_server`;
    LogUtil.debug("rootPath", CounterUtil.rootPath);
  }

  static create(id: string) {
    const idDirPath = `${CounterUtil.rootPath}/ids/${id}`;
    ensureDirSync(idDirPath);

    const counterPath = `${CounterUtil.rootPath}/ids/${id}/counter.hjson`;
    LogUtil.debug("counterPath", counterPath);

    const now = datetime();
    const yesterday = now.subtract({ day: 1 });
    const lastWeek = now.subtract({ day: 7 });
    const lastMonth = now.subtract({ month: 1 });
    const lastYear = now.subtract({ year: 1 });
    const DefaultCounter: CounterType = {
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

    const newCounterText = Hjson.stringify(DefaultCounter);

    try {
      Deno.writeTextFileSync(counterPath, newCounterText);

      return true;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }

  static load(id: string) {
    const counterPath = `${CounterUtil.rootPath}/ids/${id}/counter.hjson`;
    LogUtil.debug("counterPath", counterPath);

    try {
      const counterText = Deno.readTextFileSync(counterPath);
      const counter: CounterType = Hjson.parse(counterText);
      LogUtil.debug("counter", counter);

      return counter;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return null;
  }

  static increment(id: string) {
    const counter = CounterUtil.load(id);
    if (counter) {
      const counterPath = `${CounterUtil.rootPath}/ids/${id}/counter.hjson`;
      LogUtil.debug("counterPath", counterPath);

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

      const newCounterText = Hjson.stringify(newCounter);

      try {
        Deno.writeTextFileSync(counterPath, newCounterText);

        return true;
      } catch (e) {
        LogUtil.error(e.message);
      }
    }

    return false;
  }
}

export default CounterUtil;
