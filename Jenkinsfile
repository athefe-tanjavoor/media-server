pipeline {
    agent any

    environment {
        DOCKER_IMAGE          = "media-server"
        CONTAINER_NAME        = "media-server-container"
        APP_PORT              = "4000"
        HOST_UPLOAD_PATH      = "/home/skalelit/uploads/media-server/uploads" // Host path
        CONTAINER_UPLOAD_PATH = "/app/uploads" // Mounted inside container
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "Checking out code..."
                git branch: 'main',
                    credentialsId: 'github-token',
                    url: 'https://github.com/athefe-tanjavoor/media-server.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing npm dependencies..."
                sh 'npm install --production'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Stop Old Container') {
            steps {
                echo "Stopping old container if exists..."
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Ensure Host Upload Folder') {
            steps {
                echo "Ensuring uploads folder exists on host..."
                sh """
                mkdir -p $HOST_UPLOAD_PATH
                chown 1000:1000 $HOST_UPLOAD_PATH
                chmod 775 $HOST_UPLOAD_PATH
                """
            }
        }

        stage('Run Container') {
            steps {
                echo "Running new container..."
                sh """
                docker run -d \
                    --name $CONTAINER_NAME \
                    --restart always \
                    -p $APP_PORT:$APP_PORT \
                    -v $HOST_UPLOAD_PATH:$CONTAINER_UPLOAD_PATH \
                    --user 1000:1000 \
                    $DOCKER_IMAGE
                """
            }
        }

        stage('Health Check') {
            steps {
                echo "Checking if container is running..."
                sh """
                retries=5
                until [ "\$(docker inspect -f '{{.State.Running}}' $CONTAINER_NAME)" = "true" ] || [ \$retries -le 0 ]; do
                    echo "Waiting for container to start..."
                    sleep 5
                    retries=\$((retries-1))
                done

                if [ \$retries -le 0 ]; then
                    echo "❌ Container failed to start!"
                    docker logs $CONTAINER_NAME
                    exit 1
                fi
                echo "✅ Container is running."
                """
            }
        }

        stage('Verify Upload Folder') {
            steps {
                echo "Verifying uploads folder on host..."
                sh """
                if [ -d "$HOST_UPLOAD_PATH" ]; then
                    echo "✅ Uploads folder exists."
                else
                    echo "❌ Uploads folder does NOT exist!"
                    exit 1
                fi
                """
            }
        }
    }

    post {
        success {
            echo "✅ Media-server deployed successfully at http://localhost:$APP_PORT/"
        }
        failure {
            echo "❌ Deployment failed!"
            sh 'docker logs $CONTAINER_NAME || true'
        }
    }
}
