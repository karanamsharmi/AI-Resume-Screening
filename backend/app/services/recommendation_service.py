SKILL_RECOMMENDATIONS = {

    "python": [
        "Learn Advanced Python",
        "Practice Python coding on LeetCode",
        "Build Python automation projects"
    ],

    "java": [
        "Learn Core Java",
        "Practice OOP concepts",
        "Build Spring Boot projects"
    ],

    "sql": [
        "Practice SQL queries",
        "Learn Joins and Indexing",
        "Solve SQL interview questions"
    ],

    "mysql": [
        "Learn MySQL Database Design",
        "Practice CRUD Operations",
        "Build Database Projects"
    ],

    "html": [
        "Improve HTML5 knowledge",
        "Practice Semantic HTML"
    ],

    "css": [
        "Learn Flexbox",
        "Learn CSS Grid",
        "Build Responsive Websites"
    ],

    "javascript": [
        "Practice ES6 Features",
        "Learn DOM Manipulation",
        "Build JavaScript Projects"
    ],

    "react": [
        "Build React Projects",
        "Learn Hooks",
        "Practice React Router"
    ],

    "node": [
        "Learn Node.js",
        "Build REST APIs",
        "Practice Express.js"
    ],

    "fastapi": [
        "Build FastAPI REST APIs",
        "Learn Dependency Injection",
        "Practice Authentication"
    ],

    "docker": [
        "Learn Docker Basics",
        "Containerize Projects",
        "Practice Docker Compose"
    ],

    "kubernetes": [
        "Learn Kubernetes Architecture",
        "Practice Pods and Deployments",
        "Deploy Apps on Kubernetes"
    ],

    "jenkins": [
        "Build CI/CD Pipelines",
        "Learn Jenkins Freestyle Jobs",
        "Practice Declarative Pipelines"
    ],

    "git": [
        "Practice Git Commands",
        "Learn Branching Strategy",
        "Use Pull Requests"
    ],

    "github": [
        "Maintain Professional GitHub",
        "Learn GitHub Actions",
        "Write Better README Files"
    ],

    "linux": [
        "Practice Linux Commands",
        "Learn Shell Scripting",
        "Understand File Permissions"
    ],

    "aws": [
        "Learn EC2, S3 and IAM",
        "Practice Docker on AWS",
        "Deploy Projects on EC2"
    ],

    "azure": [
        "Learn Azure Fundamentals",
        "Practice Azure Portal"
    ],

    "terraform": [
        "Learn Infrastructure as Code",
        "Write Terraform Modules"
    ],

    "devops": [
        "Build End-to-End DevOps Projects",
        "Learn CI/CD",
        "Practice Cloud Deployment"
    ]
}


def get_recommendations(missing_skills):

    recommendations = []

    for skill in missing_skills:

        key = skill.lower().strip()

        if key in SKILL_RECOMMENDATIONS:

            recommendations.extend(
                SKILL_RECOMMENDATIONS[key]
            )

    if not recommendations:

        recommendations.append(
            "Great Resume! No major skill gaps found."
        )

    # Remove duplicates while preserving order
    recommendations = list(dict.fromkeys(recommendations))

    return recommendations