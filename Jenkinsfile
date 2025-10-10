pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/athefe-tanjavoor/media-server.git',
                    credentialsId: 'github-token'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t media-server .'
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                sh 'docker rm -f media-server || true'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh 'docker run -d --name media-server --restart always -p 4000:4000 media-server'
            }
        }
    }
}
