pipeline{
    agent any
    environment{
        prev = "${env.BUILD_NUMBER.toInteger() - 1}"
    }
    stages{
        stage('Checkout'){
            steps{
                echo "Checking scm from git"
                checkout scm
            }
        }
        stage('Clean'){
            steps{
                echo "Cleaing older images and containers"
                sh '''
                    docker rm -f demo || true
                    docker rmi -f app:${prev} || true
                '''
                
            }
        }
        stage('Build'){
            steps{
                echo "Image building"
                sh "docker build -t app:${BUILD_NUMBER} ."
            }
        }
        stage('Launch'){
            steps{
                echo "App launching"
                sh "docker run -d -p 5000:5000 --name demo app:${BUILD_NUMBER}"
            }
        }
    }
}