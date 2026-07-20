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
      "Orchestrates dependencies through Apache Airflow DAGs, reducing manual intervention by ~70%.",
      "Runs reconciliation, data quality and monitoring across pipelines, holding ~99.9% SLA adherence in production.",
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
      "Converted Teradata marts for 12 African countries into Hadoop marts, 50% faster ingestion and 30% infrastructure savings.",
    ],
  },
  {
    period: "2019 — 2026",
    company: "LTIMindtree",
    place: "Pune, Maharashtra",
    title: "Specialist — Data Engineering",
    lines: [
      "Supported 100+ enterprise-scale ETL applications across the African continent on Hadoop, Teradata, Informatica, TWS Tivoli, CA WADE and Airflow.",
      "Led the Informatica 10.1 → 10.4 migration, tuning mappings, sessions and pushdown queries for a 40% gain in processing speed.",
      "Drove the move of on-prem Hadoop data marts to Dell ECS object storage via HDFS–S3A DistCp, tiering and JCEKS-encrypted credentials — 45% less on-prem storage overhead.",
      "Onboarded 10+ business units onto the Big Data platform with ingestion frameworks and Ranger/Atlas access governance.",
    ],
  },
];

export const education = [
  {
    period: "2026",
    title: "Executive MBA, Business Administration & Management",
    detail: "Symbiosis International University (SCMHRD), Pune",
  },
  {
    period: "2019",
    title: "B.Tech in Information Technology",
    detail: "SRM Institute of Science and Technology, Chennai",
  },
  {
    period: "2026",
    title: "Event Study of the Effect of U.S. 2025–26 Tariffs on the Indian Stock Market",
    detail:
      "MBA dissertation — hand-collected dataset, event-study methodology on Indian equity prices.",
  },
];
