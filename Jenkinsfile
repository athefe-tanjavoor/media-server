pipeline {
    agent any

    environment {
        DOCKER_IMAGE   = "media-server"
        CONTAINER_NAME = "media-server-container"
        APP_PORT       = "4000"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-token',
                    url: 'https://github.com/athefe-tanjavoor/media-server.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install --production'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                echo "Stopping old container if exists..."
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                echo "Running new container..."
                docker run -d --name $CONTAINER_NAME \
                    --restart always \
                    -p $APP_PORT:$APP_PORT \
                    $DOCKER_IMAGE
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                echo "Checking if container is running..."
                retries=5
                until [ "$(docker inspect -f '{{.State.Running}}' $CONTAINER_NAME)" = "true" ] || [ $retries -le 0 ]; do
                    echo "Waiting for container to start..."
                    sleep 5
                    retries=$((retries-1))
                done

                if [ $retries -le 0 ]; then
                    echo "❌ Container failed to start!"
                    docker logs $CONTAINER_NAME
                    exit 1
                fi
                echo "✅ Container is running."
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Media-server deployed successfully at http://localhost:$APP_PORT/"
        }

        failure {
            echo "❌ Deployment failed!"
        }
    }
}
