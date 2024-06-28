import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  {
    text: "Wiki",
    icon: "carbon:wikis",
    link: "/wiki",
  },
  {
    text: "Algorithms",
    icon: "hugeicons:algorithm",
    link: "/dsa/",
  },
  {
    text: "Programming",
    icon: "mdi:code",
    link: "/programming/",
    children: [
      {
        text: "Java",
        icon: "devicon:java",
        link: "/programming/java/",
      },
      {
        text: "Golang",
        icon: "devicon:go",
        link: "/programming/golang/",
      },
      {
        text: "JavaScript",
        icon: "devicon:javascript",
        link: "/programming/js/",
      },
      {
        text: "TypeScript",
        icon: "devicon:typescript",
        link: "/programming/ts/",
      },
      {
        text: "Python",
        icon: "devicon:python",
        link: "/programming/python/",
      },
    ],
  },
  {
    text: "Database",
    icon: "mdi:database",
    link: "/database/",
    children: [
      {
        text: "SQL",
        link: "/database/sql/",
        icon: "mdi:sql-query",
      },
      {
        text: "MySQL",
        link: "/database/mysql/",
        icon: "devicon:mysql",
      },
      {
        text: "MongoDB",
        link: "/database/mongodb/",
        icon: "devicon:mongodb",
      },
      {
        text: "Redis",
        link: "/database/redis/",
        icon: "devicon:redis",
      },
      {
        text: "Elasticsearch",
        link: "/database/elasticsearch/",
        icon: "devicon:elasticsearch",
      },
      {
        text: "Elastic Stack",
        link: "/database/elastic/",
        icon: "cib:elastic-stack",
      },
    ],
  },
  {
    text: "Framework",
    icon: "simple-icons:framework",
    link: "/framework/",
    children: [
      {
        text: "Spring",
        icon: "devicon:spring",
        link: "/framework/spring/",
      },
      {
        text: "Spring Boot",
        icon: "devicon:spring",
        link: "/framework/spring-boot/",
      },
      {
        text: "NestJS",
        icon: "devicon:nestjs",
        link: "/framework/nestjs/",
      },
      {
        text: "Gin",
        icon: "logos:gin",
        link: "/framework/gin/",
      },
    ],
  },
  {
    text: "DevOps",
    icon: "devicon-plain:azuredevops",
    link: "/devops/",
    children: [
      {
        text: "Docker",
        icon: "devicon:docker",
        link: "/devops/docker/",
      },
      {
        text: "Kubernetes",
        icon: "devicon:kubernetes",
        link: "/devops/kubernetes/",
      },
      {
        text: "Jenkins",
        icon: "devicon:jenkins",
        link: "/devops/jenkins/",
      },
      {
        text: "Git",
        icon: "devicon:git",
        link: "/devops/git/",
      },
      {
        text: "Linux",
        icon: "devicon:linux",
        link: "/devops/linux/",
      },
    ],
  },
  {
    text: "Design",
    icon: "tdesign:system-sum",
    link: "/design/",
    children: [
      {
        text: "Design Pattern",
        icon: "tabler:grid-pattern",
        link: "/design/design-pattern/",
      },
      {
        text: "System Design",
        icon: "icon-park-outline:system",
        link: "/design/system-design/",
      },
    ],
  },
  {
    text: "Project",
    icon: "ant-design:project-outlined",
    link: "/project/",
  },
  {
    text: "About",
    icon: "mdi:about",
    children: [
      { text: "About me", icon: "cib:about-me", link: "/about-me" },
      { text: "About", icon: "mdi:about", link: "/about" },
    ],
  },
]);
