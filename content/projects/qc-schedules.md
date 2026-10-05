## QC Schedules → Course Explorer

QC Schedules is a course explorer for Queens College students. It brings course schedules, enrollment information, and historical instructor grade distributions into one searchable interface.

The frontend uses Next.js, React, TypeScript, and Tailwind CSS. Python scripts collect and prepare the data, which is stored in a Supabase PostgreSQL database.

## How it works

Python scripts retrieve course schedules from Queens College's course search website using browser automation. The collected records are cleaned and organized before being synchronized with the database.

The frontend combines schedule records with instructor information and historical course statistics. Students can search by course, instructor, room, or class code, then view meeting times and enrollment details.

## Historical grade distributions

The grade pipeline standardizes records across worksheets, removes invalid entries, and calculates summaries for each instructor and course. These include average GPA, withdrawal rates, and the percentage of students earning a C or better.

Grade distributions are displayed as charts, giving students a way to explore past outcomes alongside course listings.

## Keeping data updated

GitHub Actions schedules course imports every four hours and grade imports weekly. Schedule collection checks current and upcoming years, skipping terms that have not been published.

Before saving an import, the database pipeline validates its records and rejects empty datasets. Updates run within a transaction, helping prevent a failed import from leaving partially updated data.

## Source

- [Open QC Schedules](https://qcs.danncd.com)
- [View QC Schedules on GitHub](https://github.com/danncd/qc-schedules)

---

QC Schedules is an independent project, unaffiliated with Queens College or CUNY.
