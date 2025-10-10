pipeline {
    agent any

    environment {
        DOCKER_IMAGE   = "media-server"
        CONTAINER_NAME = "media-server-container"
        APP_PORT       = "4000"
        UPLOAD_PATH    = "/home/skalelit/uploads/media-server/uploads"
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
                # Run container with host uploads path mounted
                docker run -d \
                    --name $CONTAINER_NAME \
                    --restart always \
                    -p $APP_PORT:$APP_PORT \
                    -v $UPLOAD_PATH:/app/uploads \
                    --user $(id -u):$(id -g) \
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

        stage('Verify Uploads Folder') {
            steps {
                sh '''
                echo "Verifying uploads folder on host..."
                if [ -d "$UPLOAD_PATH" ]; then
                    echo "✅ Uploads folder exists at $UPLOAD_PATH"
                else
                    echo "❌ Uploads folder does NOT exist! Please create it manually with correct permissions."
                    exit 1
                fi

                # Check if folder is writable
                testfile="$UPLOAD_PATH/test_write_$(date +%s).tmp"
                touch "$testfile" && rm "$testfile"
                if [ $? -eq 0 ]; then
                    echo "✅ Uploads folder is writable"
                else
                    echo "❌ Uploads folder is NOT writable! Adjust permissions manually."
                    exit 1
                fi
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
            sh 'docker logs $CONTAINER_NAME || true'
        }
    }
}
