pipeline {
    agent any

    stages {

        stage('Checkout Source') {
            steps {
                git branch: 'main',
                url: 'https://github.com/nithin05060423/AI-Resume-Screening.git'
            }
        }

        stage('Show Workspace') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Check Docker') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t ai-resume-screening-backend .'
                }
            }
        }

        stage('Run Backend Container') {
            steps {
                sh '''
                docker rm -f resume-api || true
                docker run -d --name resume-api -p 8000:8000 ai-resume-screening-backend
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed.'
        }
    }
}