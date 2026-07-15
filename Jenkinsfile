pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/karanamsharmi/AI-Resume-Screening.git'
            }
        }

        stage('Show Workspace') {
            steps {
                sh 'pwd && ls -la'
            }
        }

        stage('Verify Docker') {
            steps {
                sh 'docker --version || true'
                sh 'docker compose version || docker-compose --version || true'
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker compose build --parallel'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                # stop and remove previous containers, recreate with new images
                docker compose down || true
                docker compose up -d --remove-orphans --build
                '''
            }
        }

        stage('Smoke Test') {
            steps {
                sh 'sleep 3'
                sh 'curl -f http://localhost:8000/ || true'
            }
        }
    }

    post {
        success { echo 'Pipeline completed successfully.' }
        failure { echo 'Pipeline failed.' }
    }
}