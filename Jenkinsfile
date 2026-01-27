pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                echo 'Image building'
                sh 'docker build -t htm:${BUILD_NUMBER} .'
            }
        }

        stage('Container') {
            steps {
                echo 'container creation'
                sh '''
                  docker rm -f demo || true
                  docker run -d -p 1000:80 --name demo htm:${BUILD_NUMBER}
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
