pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                echo 'Image building'
                sh 'docker build -t py:${BUILD_NUMBER} .'
            }
        }

        stage('Container') {
            steps {
                echo 'container creation'
                sh '''
                  docker rm -f demo || true
                  docker run -d -p 5000:50 --name demo py:${BUILD_NUMBER}
                '''
            }
        }

        stage('Run') {
            steps {
                echo 'App running...'
            }
        }
    }
}
