// Single source of truth for all page copy, derived from the resume.

export const profile = {
  tagline: "Data Engineering Leadership · PMP® Certified · Banking & Financial Services",
  firstName: "Prakhar",
  lastName: "Mittal",
  role: "Data Solution Analyst & PMP® Certified Leader",
  subtitle:
    "8+ years directing enterprise-scale ETL pipelines, Big Data transformations, and cross-functional technology initiatives — combining deep technical acumen with rigorous project management methodologies.",
  location: "Mumbai, India",
  email: "prakharmittal1510@gmail.com",
  phone: "9823186723",
};

export const social = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/prakharmittal1510/", id: "linkedin" },
  { name: "GitHub", href: "https://github.com/datawithprakhar", id: "github" },
];

export const about = {
  eyebrow: "Experience & Leadership",
  // Kept as one continuous statement; the first line is set as the display
  // heading and the remainder as body copy so it stays readable at size.
  lead: "Bridging complex big data engineering with strategic project management.",
  body: "As an accomplished Data Engineering Leader and Project Management Professional (PMP®), I design scalable cloud architectures, direct cross-functional technology initiatives, and build high-performance analytics platforms using AWS, Apache Spark, Hadoop, PySpark, SQL, and Airflow. By combining deep technical expertise with rigorous project management methodologies—such as Agile/Scrum, risk mitigation, and resource allocation—I help global financial institutions align complex engineering roadmaps with strategic business objectives.",
};

export const resume = {
  href: "/resume/Prakhar-Mittal-Resume.pdf",
  filename: "Prakhar-Mittal-Resume.pdf",
  label: "Download resume",
  meta: "PDF · 108 KB · Updated October 2026",
};

// Radar: five pillars of the practice, 0–100 self-assessed.
export const radar = [
  { axis: "Big Data & Cloud", note: "Spark · Hadoop · AWS", value: 94 },
  { axis: "Project Management", note: "PMP · Agile · Risk & Delivery", value: 96 },
  { axis: "Data Engineering", note: "ETL · Migration · Tuning", value: 95 },
  { axis: "Databases & SQL", note: "Teradata · Oracle · SQL", value: 88 },
  { axis: "Programming & Governance", note: "Python · Scala · Airflow", value: 90 },
];

// Heatmap: most-used tools ranked by depth and daily usage.
export const heatmap = [
  { name: "Project Management & PMP", value: 96 },
  { name: "Spark & PySpark", value: 95 },
  { name: "Hadoop Ecosystem", note: "HDFS · Hive · Tez", value: 92 },
  { name: "AWS", note: "EMR · S3", value: 88 },
  { name: "ETL & Orchestration", note: "Informatica · Airflow", value: 90 },
];

// Interactive filter: tags select projects.
export const skillTags = [
  "Project Management (PMP)",
  "PySpark",
  "Hadoop",
  "AWS EMR",
  "Airflow",
  "Teradata",
  "Agile/Scrum",
  "Stakeholder Management",
];

export const projects = [
  {
    title: "Banking ETL Pipelines & Governance",
    description:
      "Scalable PySpark & AWS EMR pipelines with automated Apache Airflow orchestration, reducing manual intervention by 70%.",
    tags: ["PySpark", "AWS EMR", "Airflow", "Project Management (PMP)"],
    org: "IDFC First Bank",
  },
  {
    title: "Legacy Data Rail Program",
    description:
      "Led cross-functional delivery across 12 African countries, migrating Teradata to Hadoop at 98%+ delivery compliance.",
    tags: ["Hadoop", "Teradata", "PySpark", "Project Management (PMP)"],
    org: "ABSA · Barclays Africa",
  },
  {
    title: "Hybrid Cloud Migration & Cost Optimization",
    description:
      "On-prem Hadoop to Dell ECS (S3) object storage transition, reducing storage overhead by 45% and cloud costs by 25%.",
    tags: ["Hadoop", "AWS EMR", "Informatica", "Agile/Scrum"],
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
  { value: 8, suffix: "+", label: "Years in data engineering & leadership" },
  { value: 100, suffix: "+", label: "Enterprise ETL applications supported" },
  { value: 12, suffix: "", label: "African markets managed on-site" },
  { value: 99.9, suffix: "%", label: "Production SLA adherence", decimals: 1 },
];

export const marquee = [
  "Project Management (PMP®)",
  "Agile & Scrum Methodologies",
  "Stakeholder Management",
  "PySpark & Spark SQL",
  "Hadoop · Hive · Tez",
  "AWS EMR / S3",
  "Apache Airflow",
  "Teradata",
  "Delivery Governance",
];

export const timeline = [
  {
    period: "2026 — Present",
    company: "IDFC First Bank",
    place: "Mumbai, India",
    country: "IN",
    logo: { slug: "idfc-first", initials: "IF" },
    title: "Data Solution Analyst",
    lines: [
      "Leading end-to-end development of scalable ETL pipelines using Amazon Web Services EMR, PySpark, and Jupyter Notebooks, processing high-volume banking datasets with ~30% improvement in data processing efficiency.",
      "Spearheaded migration of enterprise data workloads from AWS (S3/EMR) to on-prem HDFS, ensuring a seamless transition and enhancing governance while achieving ~25% reduction in cloud infrastructure costs.",
      "Engineered automated data orchestration using Apache Airflow, designing DAGs for complex dependencies; reduced manual intervention by ~70% and improved pipeline reliability.",
      "Optimized PySpark transformations and execution strategies (partitioning, caching, join tuning), achieving ~35% reduction in job runtime and improved cluster resource utilization.",
      "Developed interactive data analysis and validation frameworks using AWS Jupyter Notebooks, enabling faster debugging and reducing data validation effort by ~40%.",
      "Implemented data quality checks, reconciliation logic, and monitoring mechanisms across pipelines, improving data accuracy and consistency by ~85%.",
      "Collaborated with business stakeholders and analytics teams to design scalable data solutions, accelerating delivery timelines by ~20% for critical reporting use cases.",
      "Managed production data pipelines with proactive risk monitoring and issue resolution, maintaining ~99.9% SLA adherence for enterprise data platforms.",
    ],
  },
  {
    period: "2019 — 2026",
    company: "LTIMindtree",
    place: "Pune, Maharashtra",
    country: "IN",
    logo: { slug: "ltimindtree", initials: "LTI" },
    title: "Specialist — Data Engineering",
    lines: [
      "Directed Informatica migration from v10.1 to v10.4 Virtual Server Component, optimizing mappings, sessions, and pushdown queries for a 40% improvement in data processing speed.",
      "Designed and optimized ETL pipelines with data quality rules and partition pruning, improving data accuracy and consistency by 80–85% across downstream compliance systems.",
      "Managed and supported 100+ enterprise-scale ETL applications across the African continent using Hadoop, Teradata, Informatica, Unix/Linux, TWS Tivoli, CA WADE, and Airflow, ensuring 99.9% SLA adherence.",
      "Developed and deployed scalable ETL scripts (Python, Spark, Sqoop, Shell) for integrating structured and semi-structured data into Hadoop, enabling near real-time analytics.",
      "Refactored legacy data models by introducing partitioning, bucketing, and clustered tables, and switching Spark execution to the Tez engine, reducing query runtime by 35%.",
      "Drove migration of legacy on-prem Hadoop data marts to Dell ECS hybrid cloud object storage using HDFS-S3A DistCP, reducing on-prem storage overhead by 45% with 11-nines durability.",
      "Onboarded 10+ business units onto Big Data platforms, providing ingestion frameworks, access governance (Ranger/Atlas), and scheduling automation, increasing enterprise adoption by 50%.",
    ],
  },
  {
    period: "2023 — 2023",
    company: "ABSA · Barclays Africa Group",
    place: "Johannesburg, South Africa",
    country: "ZA",
    logo: { slug: "absa", initials: "A" },
    title: "Senior Data Engineer — On-site with LTIMindtree",
    lines: [
      "Initiated and led the Data Rail Program, transforming legacy Teradata warehouses into a scalable Hadoop-based architecture and enabling SQL-to-Spark SQL translation with a 45% reduction in query processing time.",
      "Managed an on-site and offshore team of 12 Big Data Engineers, ensuring cross-functional coordination and maintaining over 98% delivery compliance.",
      "Converted Teradata marts and extracts for 12 African countries into Hadoop marts using Hive, Spark, and Teradata utilities, achieving 50% faster ingestion and 30% savings in infrastructure and licensing.",
      "Built complex business and financial analytics pipelines by integrating multi-source data, doubling data-driven revenue potential for ABSA through enhanced decision-making capabilities.",
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
    honors: ["Ranked as a Top scorer in the Executive MBA program, specializing in Finance and Business Analytics"],
  },
  {
    period: "2019",
    title: "Bachelor of Science in Information Technology",
    detail: "SRM Institute of Science and Technology, Chennai",
    cgpa: "7.11",
    cgpaOutOf: "10",
  },
  {
    period: "2026",
    title: "Event Study of the Effect of U.S. 2025–26 Tariffs on the Indian Stock Market",
    detail:
      "MBA dissertation research paper — hand-collected dataset, event-study methodology analyzing the measurable effect of U.S. tariff-policy announcements on Indian equity prices.",
  },
];
