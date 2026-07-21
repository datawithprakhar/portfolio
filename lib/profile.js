// Single source of truth for all page copy, derived from the resume.

export const profile = {
  tagline: "Data Engineering · Banking & Financial Services",
  firstName: "Prakhar",
  lastName: "Mittal",
  role: "Data Solution Analyst at IDFC FIRST Bank",
  subtitle:
    "Seven years building ETL and Big Data platforms on Spark, Hadoop and AWS — designing pipelines that move enterprise banking data reliably, at scale, and on time.",
  location: "Mumbai, India",
  email: "prakharmittal1510@gmail.com",
  phone: "9823186723",
};

export const social = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/prakharmittal1510/", id: "linkedin" },
  { name: "GitHub", href: "https://github.com/datawithprakhar", id: "github" },
];

export const about = {
  eyebrow: "Experience",
  // Kept as one continuous statement; the first line is set as the display
  // heading and the remainder as body copy so it stays readable at size.
  lead: "Transforming data into intelligent business solutions.",
  body: "With over 7 years of experience in Data Engineering and Big Data, I design scalable cloud architectures, optimize enterprise ETL pipelines, and build high-performance analytics platforms using AWS, Apache Spark, Hadoop, PySpark, SQL, and Airflow. My work has helped global financial institutions improve processing efficiency, reduce infrastructure costs, and unlock the full potential of their data.",
};

export const resume = {
  href: "/resume/Prakhar-Mittal-Resume.pdf",
  filename: "Prakhar-Mittal-Resume.pdf",
  label: "Download resume",
  meta: "PDF · 108 KB · Updated July 2026",
};

// Radar: five pillars of the practice, 0–100 self-assessed.
export const radar = [
  { axis: "Big Data & Cloud", note: "Spark · Hadoop · AWS", value: 94 },
  { axis: "Data Engineering", note: "ETL · Migration · Tuning", value: 95 },
  { axis: "Databases", note: "Teradata · Oracle · SQL", value: 88 },
  { axis: "Programming", note: "Python · Scala · Shell", value: 86 },
  { axis: "Orchestration & Governance", note: "Airflow · Ranger · Atlas", value: 90 },
];

// Heatmap: most-used tools ranked by depth and daily usage.
export const heatmap = [
  { name: "Spark & PySpark", value: 95 },
  { name: "Hadoop Ecosystem", note: "HDFS · Hive · Tez", value: 92 },
  { name: "AWS", note: "EMR · S3", value: 88 },
  { name: "ETL Tools", note: "Informatica · Sqoop", value: 86 },
  { name: "Orchestration", note: "Apache Airflow", value: 90 },
];

// Interactive filter: tags select projects.
export const skillTags = [
  "PySpark",
  "Hadoop",
  "AWS EMR",
  "Airflow",
  "Teradata",
  "Informatica",
  "Scala",
  "Python",
];

export const projects = [
  {
    title: "Banking ETL Pipelines",
    description:
      "Scalable PySpark & AWS EMR pipelines, reducing latency by 30% for high-volume banking datasets.",
    tags: ["PySpark", "AWS EMR", "Airflow", "Python"],
    org: "IDFC FIRST Bank",
  },
  {
    title: "Legacy Data Rail Program",
    description:
      "Teradata to Hadoop migration across 12 countries, achieving 45% faster query processing.",
    tags: ["Hadoop", "Teradata", "PySpark", "Scala"],
    org: "ABSA · Barclays Africa",
  },
  {
    title: "Hybrid Cloud Migration",
    description:
      "On-prem Hadoop to Dell ECS (S3) object storage transition, reducing storage overhead by 45%.",
    tags: ["Hadoop", "AWS EMR", "Informatica", "Python"],
    org: "LTIMindtree",
  },
];

// Sandbox: pipeline & quality viewer.
export const dagNodes = [
  { id: "s3", label: "S3 Landing", tier: 0 },
  { id: "extract", label: "Extract", tier: 1 },
  { id: "validate", label: "Validate", tier: 2 },
  { id: "transform", label: "Transform", tier: 2 },
  { id: "reconcile", label: "Reconcile", tier: 3 },
  { id: "load", label: "Load · Hive", tier: 3 },
  { id: "publish", label: "Publish Mart", tier: 4 },
];

export const dagEdges = [
  ["s3", "extract"],
  ["extract", "validate"],
  ["extract", "transform"],
  ["validate", "reconcile"],
  ["transform", "load"],
  ["reconcile", "publish"],
  ["load", "publish"],
];

export const dqAudit = [
  { check: "Row-count reconciliation", scope: "PRES_BOUNCE vs Parquet", result: "Pass", value: "Δ 0.00%" },
  { check: "Composite-key uniqueness", scope: "AGREEMENTID + SCHEMEID", result: "Pass", value: "0 dupes" },
  { check: "Partition pruning", scope: "year / month filters", result: "Pass", value: "94% pruned" },
  { check: "Null-field scan", scope: "5 regmart source systems", result: "Pass", value: "0 critical" },
  { check: "SLA adherence", scope: "Production pipelines", result: "Live", value: "99.9%" },
];

// Runtime, minutes: legacy Teradata vs tuned Spark/Tez, same six workloads.
export const perfSeries = {
  labels: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"],
  legacy: [42, 58, 35, 71, 49, 63],
  optimized: [23, 30, 19, 38, 26, 33],
};

// Headline numbers for the dashboard's stat strip.
export const stats = [
  { value: 7, suffix: "+", label: "Years in data engineering" },
  { value: 100, suffix: "+", label: "Enterprise ETL applications supported" },
  { value: 12, suffix: "", label: "African markets migrated to Hadoop" },
  { value: 99.9, suffix: "%", label: "Production SLA adherence", decimals: 1 },
];

export const marquee = [
  "PySpark",
  "Spark SQL",
  "Hadoop · Hive",
  "AWS EMR / S3",
  "Apache Airflow",
  "Informatica",
  "Teradata",
  "Linux Shell",
  "Data Modeling",
];

export const timeline = [
  {
    period: "2026 — Present",
    company: "IDFC FIRST Bank",
    place: "Mumbai, India",
    title: "Data Solution Analyst",
    lines: [
      "Leads end-to-end development of scalable ETL pipelines on AWS EMR, PySpark and Jupyter, processing high-volume banking datasets with ~30% better processing efficiency.",
      "Spearheaded the migration of enterprise workloads from AWS S3/EMR to on-prem HDFS, cutting cloud infrastructure cost by ~25% while tightening governance.",
      "Orchestrates dependencies through Apache Airflow DAGs, reducing manual intervention by ~70% and improving scheduling reliability.",
      "Optimized PySpark transformations — partitioning, caching, join tuning — for a ~35% cut in job runtime and better cluster utilization.",
      "Built interactive validation frameworks in Jupyter that reduced data-validation effort by ~40%.",
      "Implemented reconciliation logic, data quality checks and monitoring that lifted data accuracy and consistency by ~85%.",
      "Partners with business stakeholders on scalable data solutions, accelerating delivery timelines ~20% for critical reporting.",
      "Holds ~99.9% SLA adherence across production data pipelines through proactive monitoring and issue resolution.",
    ],
  },
  {
    period: "2023 — 2023",
    company: "ABSA · Barclays Africa Group",
    place: "Johannesburg, South Africa",
    title: "Senior Data Engineer — on-site with LTIMindtree",
    lines: [
      "Initiated and led the Data Rail Program, moving legacy Teradata warehouses onto a Hadoop architecture and translating SQL to Spark SQL — 45% faster query processing.",
      "Managed 12 Big Data engineers across on-site and offshore teams at >98% delivery compliance.",
      "Converted Teradata marts and extracts for 12 African countries into Hadoop marts with Hive, Spark and Teradata utilities — 50% faster ingestion, 30% savings on infrastructure and licensing.",
      "Built multi-source business and financial analytics pipelines that doubled ABSA's data-driven revenue potential through better decision-making.",
    ],
  },
  {
    period: "2019 — 2026",
    company: "LTIMindtree",
    place: "Pune, Maharashtra",
    title: "Specialist — Data Engineering",
    lines: [
      "Supported 100+ enterprise-scale ETL applications across the African continent on Hadoop, Teradata, Informatica, TWS Tivoli, CA WADE and Airflow at 99.9% SLA.",
      "Led the Informatica 10.1 → 10.4 Virtual Server migration, tuning mappings, sessions and pushdown queries for a 40% gain in processing speed on high-volume banking data.",
      "Designed ETL pipelines with data quality rules, partition pruning and join optimizations, improving accuracy 80–85% across reporting and compliance systems.",
      "Deployed Python, Spark, Sqoop and Shell scripts integrating structured and semi-structured data into Hadoop for near-real-time fraud detection and customer insight.",
      "Refactored legacy models with partitioning, bucketing, clustered tables and a Spark→Tez engine switch — 35% faster queries, 25% better cluster utilization.",
      "Drove the move of on-prem Hadoop data marts to Dell ECS object storage via HDFS–S3A DistCp, tiering, lifecycle policies and JCEKS-encrypted credentials — 45% less on-prem storage overhead, eleven-nines durability with geo-replication.",
      "Onboarded 10+ business units with ingestion frameworks and Ranger/Atlas governance, lifting enterprise Hadoop/ECS adoption 50%.",
    ],
  },
];

export const education = [
  {
    period: "2026",
    title: "Executive MBA, Business Administration & Management",
    detail: "Symbiosis International University (SCMHRD), Pune",
    cgpa: "8.25",
    cgpaOutOf: "10",
    honors: ["Highest CGPA in the batch", "Student of the Year"],
  },
  {
    period: "2019",
    title: "B.Tech in Information Technology",
    detail: "SRM Institute of Science and Technology, Chennai",
    cgpa: "7.11",
    cgpaOutOf: "10",
  },
  {
    period: "2026",
    title: "Event Study of the Effect of U.S. 2025–26 Tariffs on the Indian Stock Market",
    detail:
      "MBA dissertation — hand-collected dataset, event-study methodology on Indian equity prices.",
  },
];
